export function pcmToBase64(pcmData: Float32Array): string {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    const s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}

export function base64ToPcm(base64: string): Float32Array {
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new DataView(buffer);
  for (let i = 0; i < binary.length; i++) {
    view.setUint8(i, binary.charCodeAt(i));
  }
  const int16Array = new Int16Array(buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / (int16Array[i] >= 0 ? 32767 : 32768);
  }
  return float32Array;
}

let nextStartTime = 0;

export function playAudioChunk(audioCtx: AudioContext, base64Audio: string, analyser?: AnalyserNode) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const pcm = base64ToPcm(base64Audio);
  
  const buffer = audioCtx.createBuffer(1, pcm.length, 24000);
  buffer.getChannelData(0).set(pcm);

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  
  if (analyser) {
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  } else {
    source.connect(audioCtx.destination);
  }

  const currentTime = audioCtx.currentTime;
  if (nextStartTime < currentTime) {
    nextStartTime = currentTime;
  }
  source.start(nextStartTime);
  nextStartTime += buffer.duration;
}

export function resetAudioPlayback() {
  nextStartTime = 0;
}
