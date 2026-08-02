"use client";

import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 32;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const HEIGHT = 48;

export function AudioWaveform({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!stream) return;

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.7;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function draw() {
      const canvas = canvasRef.current;
      if (!canvas || !analyserRef.current) return;
      const c = canvas.getContext("2d");
      if (!c) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      c.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = c.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#0077B6");
      gradient.addColorStop(0.5, "#00A859");
      gradient.addColorStop(1, "#FF5733");

      for (let i = 0; i < BAR_COUNT; i++) {
        const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(4, value * HEIGHT * 0.85);

        const x = i * (BAR_WIDTH + BAR_GAP);
        const y = (HEIGHT - barHeight) / 2;

        c.fillStyle = gradient;
        c.beginPath();
        c.roundRect(x, y, BAR_WIDTH, barHeight, 1.5);
        c.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      source.disconnect();
      ctx.close();
    };
  }, [stream]);

  const totalWidth = BAR_COUNT * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

  return (
    <canvas
      ref={canvasRef}
      width={totalWidth}
      height={HEIGHT}
      className="mx-auto"
      style={{ width: `${totalWidth}px`, height: `${HEIGHT}px` }}
    />
  );
}
