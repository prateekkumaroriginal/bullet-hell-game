import { rm, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIRECTORY = "assets/audio/button-focus";
const SAMPLE_RATE = 44100;
const CHANNEL_COUNT = 1;
const BITS_PER_SAMPLE = 16;
const INT16_MAX = 32767;
const WAV_HEADER_BYTE_LENGTH = 44;
const TWO_PI = Math.PI * 2;
const MASTER_GAIN = 0.76;

const designs = [
  {
    fileName: "button-focus-07-null-beacon-high.wav",
    durationSeconds: 0.26,
    render: (time, progress) => {
      const pulseA = burst(progress, 0.04, 0.12);
      const pulseB = burst(progress, 0.36, 0.14);
      const halo = envelope(progress, 0.02, 0.5);

      return (
        pulseA * sine(780, time) * 0.28 +
        pulseB * sine(1460, time) * 0.24 +
        halo * sine(2320 + progress * 320, time) * 0.1
      );
    }
  }
];

await rm(OUTPUT_DIRECTORY, { recursive: true, force: true });
await mkdir(OUTPUT_DIRECTORY, { recursive: true });

for (const design of designs) {
  const frameCount = Math.ceil(design.durationSeconds * SAMPLE_RATE);
  const dataByteLength = frameCount * CHANNEL_COUNT * (BITS_PER_SAMPLE / 8);
  const buffer = Buffer.alloc(WAV_HEADER_BYTE_LENGTH + dataByteLength);

  writeWavHeader(buffer, dataByteLength);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const time = frameIndex / SAMPLE_RATE;
    const progress = frameIndex / Math.max(1, frameCount - 1);
    const sample = clamp(design.render(time, progress) * MASTER_GAIN, -1, 1);

    buffer.writeInt16LE(Math.round(sample * INT16_MAX), WAV_HEADER_BYTE_LENGTH + frameIndex * 2);
  }

  await writeFile(join(OUTPUT_DIRECTORY, design.fileName), buffer);
}

function writeWavHeader(buffer, dataByteLength) {
  const byteRate = SAMPLE_RATE * CHANNEL_COUNT * (BITS_PER_SAMPLE / 8);
  const blockAlign = CHANNEL_COUNT * (BITS_PER_SAMPLE / 8);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(CHANNEL_COUNT, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataByteLength, 40);
}

function envelope(progress, attack, release) {
  const attackGain = Math.min(1, progress / attack);
  const releaseGain = Math.pow(1 - progress, release * 5);

  return attackGain * releaseGain;
}

function burst(progress, center, width) {
  const distance = Math.abs(progress - center);

  return Math.max(0, 1 - distance / width);
}

function sine(frequency, time) {
  return Math.sin(TWO_PI * frequency * time);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
