class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(1280);
    this.offset = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const samples = input[0];

    for (let i = 0; i < samples.length; i++) {
      this.buffer[this.offset++] = samples[i];

      if (this.offset >= 1280) {
        const int16 = new Int16Array(1280);
        for (let j = 0; j < 1280; j++) {
          const s = Math.max(-1, Math.min(1, this.buffer[j]));
          int16[j] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        this.port.postMessage(int16.buffer, [int16.buffer]);
        this.offset = 0;
      }
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
