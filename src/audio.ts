let contexto: AudioContext | undefined;

/** Efeitos curtos gerados no navegador, sem arquivos de áudio externos. */
export function tocarSom(tipo: "tiro" | "dano" | "ponto" | "menu" | "fim") {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  contexto ??= new AudioContext();
  if (contexto.state === "suspended") void contexto.resume();

  const frequencias: Record<typeof tipo, number> = { tiro: 520, dano: 140, ponto: 760, menu: 440, fim: 180 };
  const duracao = tipo === "fim" ? 0.32 : 0.09;
  const oscilador = contexto.createOscillator();
  const volume = contexto.createGain();
  const agora = contexto.currentTime;
  oscilador.type = tipo === "dano" || tipo === "fim" ? "sawtooth" : "square";
  oscilador.frequency.setValueAtTime(frequencias[tipo], agora);
  if (tipo === "fim") oscilador.frequency.exponentialRampToValueAtTime(75, agora + duracao);
  volume.gain.setValueAtTime(0.055, agora);
  volume.gain.exponentialRampToValueAtTime(0.001, agora + duracao);
  oscilador.connect(volume);
  volume.connect(contexto.destination);
  oscilador.start(agora);
  oscilador.stop(agora + duracao);
}
