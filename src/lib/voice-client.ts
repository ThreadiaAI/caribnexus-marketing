/**
 * Voice client — handles browser mic → Deepgram WebSocket for live transcription.
 */

export class VoiceClient {
  private socket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private onTranscript: (text: string, isFinal: boolean) => void;
  private fullTranscript = "";

  constructor(onTranscript: (text: string, isFinal: boolean) => void) {
    this.onTranscript = onTranscript;
  }

  async start() {
    // Get temporary Deepgram key from our server
    const tokenRes = await fetch("/api/voice/token");
    const { key } = await tokenRes.json();

    // Get mic access
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Connect to Deepgram WebSocket
    this.socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true&punctuate=true&interim_results=true&utterances=true&endpointing=800`,
      ["token", key]
    );

    this.socket.onopen = () => {
      // Start sending audio — larger chunks for better accuracy
      this.mediaRecorder = new MediaRecorder(this.stream!, { mimeType: "audio/webm" });
      this.mediaRecorder.ondataavailable = (e) => {
        if (this.socket?.readyState === WebSocket.OPEN && e.data.size > 0) {
          this.socket.send(e.data);
        }
      };
      this.mediaRecorder.start(250); // send chunks every 250ms
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (!transcript) return;

      const isFinal = data.is_final;
      if (isFinal) {
        this.fullTranscript += (this.fullTranscript ? " " : "") + transcript;
        this.onTranscript(this.fullTranscript, false);
      } else {
        // Interim: show full so far + current interim
        this.onTranscript(this.fullTranscript + (this.fullTranscript ? " " : "") + transcript, false);
      }
    };

    this.socket.onerror = (e) => {
      console.error("Deepgram WebSocket error:", e);
    };

    this.fullTranscript = "";
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  stop(): string {
    // Stop recording
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    // Close WebSocket
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    // Stop mic
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    const final = this.fullTranscript;
    this.fullTranscript = "";
    return final;
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
