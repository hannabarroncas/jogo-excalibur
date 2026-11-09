import { Actor, Canvas, CollisionType, Color, vec } from "excalibur";
import { Grupos } from "./grupos";

const LARGURA = 800;
const ALTURA = 600;
const ESPESSURA = 24;

/** Desenha o piso e cria limites fixos para manter o combate dentro da sala. */
export class Arena extends Actor {
  constructor() {
    super({ name: "Arena", pos: vec(LARGURA / 2, ALTURA / 2), width: LARGURA, height: ALTURA });
    this.graphics.add(new Canvas({
      width: LARGURA,
      height: ALTURA,
      cache: true,
      draw: (ctx) => {
        ctx.fillStyle = "#17202a";
        ctx.fillRect(0, 0, LARGURA, ALTURA);
        ctx.strokeStyle = "#1f2d3a";
        ctx.lineWidth = 1;
        for (let x = 0; x <= LARGURA; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ALTURA); ctx.stroke();
        }
        for (let y = 0; y <= ALTURA; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(LARGURA, y); ctx.stroke();
        }
        ctx.strokeStyle = "#4da3ff";
        ctx.lineWidth = 3;
        ctx.strokeRect(ESPESSURA / 2, ESPESSURA / 2, LARGURA - ESPESSURA, ALTURA - ESPESSURA);
      },
    }));
    this.addTag("cenario");
  }
}

export class Parede extends Actor {
  constructor(x: number, y: number, largura: number, altura: number) {
    super({
      name: "Parede",
      pos: vec(x, y),
      width: largura,
      height: altura,
      color: Color.fromHex("#34495e"),
      collisionType: CollisionType.Fixed,
      collisionGroup: Grupos.parede,
    });
    this.addTag("parede");
  }
}

export function criarParedes(): Parede[] {
  const t = ESPESSURA;
  return [
    new Parede(LARGURA / 2, t / 2, LARGURA, t),
    new Parede(LARGURA / 2, ALTURA - t / 2, LARGURA, t),
    new Parede(t / 2, ALTURA / 2, t, ALTURA),
    new Parede(LARGURA - t / 2, ALTURA / 2, t, ALTURA),
  ];
}
