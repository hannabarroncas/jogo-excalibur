import { Actor, CollisionType, Color, Vector } from "excalibur";
import { Grupos } from "./grupos";

// Diz quem atirou, para a bala não acertar o próprio dono
export type OrigemBala = "jogador" | "robo";

// A bala é um Actor pequeno que anda em linha reta
export class Bala extends Actor {
  readonly origem: OrigemBala;

  // Recebe onde a bala nasce, para onde vai, quem atirou e a velocidade
  constructor(posicao: Vector, direcao: Vector, origem: OrigemBala = "jogador", velocidade = 500) {
    const doJogador = origem === "jogador";

    super({
      name: "Bala",
      pos: posicao,
      width: 10,
      height: 10,
      color: doJogador ? Color.Yellow : Color.fromHex("#ff6b35"),
      collisionType: CollisionType.Active,
      collisionGroup: doJogador ? Grupos.balaJogador : Grupos.balaRobo,
    });

    this.origem = origem;
    this.vel = direcao.scale(velocidade);
  }

  override onInitialize() {
    // Quando a bala sai da tela, ela é removida do jogo
    this.on("exitviewport", () => this.kill());
    this.on("collisionstart", (evento) => {
      if (evento.other.owner.hasTag("parede")) this.kill();
    });
  }
}
