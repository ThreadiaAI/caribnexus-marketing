/**
 * Voice client — AudioWorklet captures raw PCM16 → streams to Deepgram.
 * WebSocket stays open across turns. Mic starts/stops per turn.
 */

export class VoiceClient {
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private onTranscript: (text: string, isFinal: boolean) => void;
  private fullTranscript = "";
  private latestText = "";
  private keepAliveInterval: ReturnType<typeof setInterval> | null = null;
  private socketReady = false;

  constructor(onTranscript: (text: string, isFinal: boolean) => void) {
    this.onTranscript = onTranscript;
  }

  /** Connect the WebSocket once. Call this when the widget opens. */
  async connect() {
    if (this.socket && this.socketReady) return;

    const tokenRes = await fetch("/api/voice/token");
    const { key } = await tokenRes.json();

    const wsUrl =
      `wss://api.deepgram.com/v1/listen?model=nova-3&encoding=linear16&sample_rate=16000&channels=1&smart_format=true&punctuate=true&interim_results=true&utterance_end_ms=1500&vad_events=true`;

    this.socket = new WebSocket(wsUrl, ["token", key]);

    await new Promise<void>((resolve, reject) => {
      this.socket!.onopen = () => {
        this.socketReady = true;
        resolve();
      };
      this.socket!.onerror = (e) => {
        console.error("Deepgram WebSocket error:", e);
        reject(e);
      };
    });

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "Results") {
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (!transcript) return;

        if (data.is_final) {
          this.fullTranscript += (this.fullTranscript ? " " : "") + transcript;
          this.latestText = this.fullTranscript;
          this.onTranscript(this.fullTranscript, false);
        } else {
          this.latestText = this.fullTranscript + (this.fullTranscript ? " " : "") + transcript;
          this.onTranscript(this.latestText, false);
        }
      }
    };

    this.socket.onclose = () => {
      this.socketReady = false;
    };

    // Keep socket alive between turns
    this.keepAliveInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "KeepAlive" }));
      }
    }, 8000);
  }

  /** Start mic + worklet. Call on each "Speak with me" tap. */
  async start() {
    if (!this.socketReady) {
      await this.connect();
    }

    this.fullTranscript = "";
    this.latestText = "";

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    await this.audioContext.audioWorklet.addModule("/pcm-worklet.js");

    this.source = this.audioContext.createMediaStreamSource(this.stream);
    this.workletNode = new AudioWorkletNode(this.audioContext, "pcm-processor");
    this.source.connect(this.workletNode);
    this.workletNode.connect(this.audioContext.destination);

    this.workletNode.port.onmessage = (e: MessageEvent) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(e.data as ArrayBuffer);
      }
    };
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  /** Stop mic, return transcript. Socket stays open for next turn. */
  stop(): string {
    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }

    // Send Finalize to flush any pending audio in Deepgram's buffer
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "Finalize" }));
    }

    const final = this.latestText || this.fullTranscript;
    this.fullTranscript = "";
    this.latestText = "";
    return final;
  }

  /** Close everything. Call when widget closes. */
  disconnect() {
    this.stop();
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "CloseStream" }));
      }
      this.socket.close();
      this.socket = null;
      this.socketReady = false;
    }
  }
}

/**
 * Send transcript to Luna and stream the response.
 */
export async function streamChat(
  messages: { role: string; content: string }[],
  onChunk: (text: string) => void,
  onDone: () => void
) {
  const res = await fetch("/api/voice/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok || !res.body) {
    onChunk("Sorry, something went wrong. Please try again.");
    onDone();
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
  onDone();
}
