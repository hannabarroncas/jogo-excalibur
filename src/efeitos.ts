import { Actor, CollisionType, Engine, Vector, vec } from "excalibur";
import { ALTURA, graficoAnel, graficoArena, LARGURA } from "./graficos";
import type { Lado } from "./graficos";

// Fundo do jogo: UMA imagem em cache, sem colisão
export class Arena extends Actor {
  constructor() {
    super({
      name: "Arena",
      pos: vec(LARGURA / 2, ALTURA / 2),
      width: LARGURA,
      height: ALTURA,
      z: -10,
      collisionType: CollisionType.PreventCollision,
    });
  }

  override onInitialize() {
    this.graphics.add(graficoArena());
  }
}

// Anel que cresce e some em ~0,3s. Reusa o mesmo desenho, então custa quase nada.
export class Explosao extends Actor {
  private tempo = 0;
  private readonly lado: Lado;
  private readonly duracaoMs: number;
  private readonly escalaFinal: number;

  constructor(posicao: Vector, lado: Lado) {
    super({
      name: "Explosao",
      pos: posicao,
      z: 1,
      collisionType: CollisionType.PreventCollision,
    });
    this.lado = lado;
    this.duracaoMs = lado === "robo" ? 280 : 600;
    this.escalaFinal = lado === "robo" ? 1.8 : 4;
  }

  override onInitialize() {
    this.graphics.add(graficoAnel(this.lado));
  }

  override onPreUpdate(_engine: Engine, elapsedMs: number): void {
    this.tempo += elapsedMs;
    const progresso = Math.min(1, this.tempo / this.duracaoMs);
    const escala = 0.4 + (this.escalaFinal - 0.4) * progresso;
    this.scale.setTo(escala, escala);
    this.graphics.opacity = 1 - progresso;

    if (progresso >= 1) {
      this.kill();
    }
  }
}
