import { Actor, Canvas, CollisionType, Color, Engine, vec } from "excalibur";
import { Bala } from "./bala";
import { ConfigDificuldade } from "./dificuldade";
import { Grupos } from "./grupos";
import { Player } from "./player";
import { tocarSom } from "./audio";

export class Robo extends Actor {
  private tempoDesdeTiro = 0;
  private readonly config: ConfigDificuldade;
  private readonly jogador: Player;
  private readonly aoMorrer: () => void;

  constructor(jogador: Player, config: ConfigDificuldade, aoMorrer: () => void) {
    super({
      name: "Robo",
      width: 44,
      height: 52,
      collisionType: CollisionType.Active,
      collisionGroup: Grupos.robo,
    });

    this.jogador = jogador;
    this.config = config;
    this.aoMorrer = aoMorrer;
  }

  override onInitialize() {
    this.graphics.add(desenharRobo());

    // Se uma bala do jogador encosta no robô, o robô morre
    this.on("collisionstart", (evento) => {
      const outro = evento.other.owner;
      if (outro instanceof Bala && outro.origem === "jogador") {
        outro.kill();
        this.morrer();
      }
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.jogador.isKilled()) {
      this.vel = vec(0, 0);
      return;
    }

    // Vetor do robô até o jogador
    const paraJogador = this.jogador.pos.sub(this.pos);
    const distancia = paraJogador.distance();

    if (distancia > 1) {
      const direcao = paraJogador.normalize();
      // Persegue o jogador na velocidade da dificuldade
      this.vel = direcao.scale(this.config.velocidadeRobo);

      this.tempoDesdeTiro += elapsedMs;
      if (this.tempoDesdeTiro >= this.config.cadenciaTiroMs) {
        this.tempoDesdeTiro = 0;
        // Atira na direção do jogador
        engine.add(new Bala(this.pos.clone(), direcao, "robo", this.config.velocidadeBalaRobo));
      }
    } else {
      this.vel = vec(0, 0);
    }
  }

  private morrer() {
    if (this.isKilled()) {
      return;
    }
    tocarSom("ponto");
    this.aoMorrer();
    this.kill();
  }
}

function desenharRobo() {
  return new Canvas({
    width: 44,
    height: 52,
    cache: true,
    draw: (ctx) => {
      ctx.fillStyle = Color.fromHex("#7f8c8d").toString();
      ctx.fillRect(16, 2, 12, 10);

      ctx.fillStyle = Color.fromHex("#c0392b").toString();
      ctx.fillRect(8, 12, 28, 24);

      ctx.fillStyle = Color.fromHex("#2ecc71").toString();
      ctx.fillRect(14, 5, 5, 5);
      ctx.fillRect(25, 5, 5, 5);

      ctx.fillStyle = Color.fromHex("#bdc3c7").toString();
      ctx.fillRect(2, 16, 8, 16);
      ctx.fillRect(34, 16, 8, 16);

      ctx.fillStyle = Color.fromHex("#2c3e50").toString();
      ctx.fillRect(12, 36, 8, 14);
      ctx.fillRect(24, 36, 8, 14);
    },
  });
}
