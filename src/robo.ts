import { Actor, CollisionType, Engine, vec } from "excalibur";
import { Bala } from "./bala";
import type { ConfigDificuldade } from "./dificuldade";
import { Explosao } from "./efeitos";
import { graficoRobo } from "./graficos";
import { Grupos } from "./grupos";
import type { Player } from "./player";

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
      collisionType: CollisionType.Passive,
      collisionGroup: Grupos.robo,
    });

    this.jogador = jogador;
    this.config = config;
    this.aoMorrer = aoMorrer;
  }

  override onInitialize() {
    // Todos os robôs usam o MESMO desenho em cache
    this.graphics.add(graficoRobo());

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
      this.vel.setTo(0, 0);
      return;
    }

    // Vetor do robô até o jogador (conta feita à mão para não criar objetos a cada frame)
    const dx = this.jogador.pos.x - this.pos.x;
    const dy = this.jogador.pos.y - this.pos.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia > 1) {
      const nx = dx / distancia;
      const ny = dy / distancia;

      // Persegue o jogador na velocidade da dificuldade
      this.vel.setTo(nx * this.config.velocidadeRobo, ny * this.config.velocidadeRobo);

      this.tempoDesdeTiro += elapsedMs;
      if (this.tempoDesdeTiro >= this.config.cadenciaTiroMs) {
        this.tempoDesdeTiro = 0;
        // Atira na direção do jogador
        engine.add(new Bala(this.pos.clone(), vec(nx, ny), "robo", this.config.velocidadeBalaRobo));
      }
    } else {
      this.vel.setTo(0, 0);
    }
  }

  private morrer() {
    if (this.isKilled()) {
      return;
    }
    this.scene?.add(new Explosao(this.pos.clone(), "robo"));
    this.aoMorrer();
    this.kill();
  }
}
