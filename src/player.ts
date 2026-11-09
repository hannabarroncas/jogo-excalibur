import { Actor, CollisionType, Color, Engine, Keys, vec } from "excalibur";
import { Bala } from "./bala";
import { Controles } from "./controles";
import { Explosao } from "./efeitos";
import { ALTURA, LARGURA } from "./graficos";
import { Grupos } from "./grupos";
import { Resources } from "./resources";

const VELOCIDADE = 200;
// Tempo mínimo entre um tiro e outro (segurar o botão continua atirando)
const INTERVALO_TIRO_MS = 200;
const ZONA_MORTA = 0.25;
// Distância mínima das bordas da arena
const MARGEM = 50;

export class Player extends Actor {
  private readonly direcao = vec(1, 0);
  private recarga = 0;
  vida: number;
  private readonly aoMorrer: () => void;

  constructor(vida: number, aoMorrer: () => void) {
    super({
      name: "Player",
      pos: vec(LARGURA / 2, ALTURA / 2),
      width: 100,
      height: 100,
      collisionType: CollisionType.Passive,
      collisionGroup: Grupos.jogador,
    });
    this.vida = vida;
    this.aoMorrer = aoMorrer;
  }

  override onInitialize() {
    this.graphics.add(Resources.Sword.toSprite());

    // Se uma bala do robô encosta no jogador, ele perde vida
    this.on("collisionstart", (evento) => {
      const outro = evento.other.owner;
      if (outro instanceof Bala && outro.origem === "robo") {
        outro.kill();
        this.levarDano();
      }
    });
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.isKilled()) {
      this.vel.setTo(0, 0);
      return;
    }

    const teclado = engine.input.keyboard;
    let x = 0;
    let y = 0;

    // WASD ou setas
    if (teclado.isHeld(Keys.W) || teclado.isHeld(Keys.ArrowUp)) {
      y -= 1;
    }
    if (teclado.isHeld(Keys.S) || teclado.isHeld(Keys.ArrowDown)) {
      y += 1;
    }
    if (teclado.isHeld(Keys.A) || teclado.isHeld(Keys.ArrowLeft)) {
      x -= 1;
    }
    if (teclado.isHeld(Keys.D) || teclado.isHeld(Keys.ArrowRight)) {
      x += 1;
    }

    // Joystick de toque
    if (Controles.ativo && Math.hypot(Controles.x, Controles.y) > ZONA_MORTA) {
      x += Controles.x;
      y += Controles.y;
    }

    const modulo = Math.hypot(x, y);
    if (modulo > 0) {
      // Na diagonal o jogador não anda mais rápido que na reta
      const escala = modulo > 1 ? 1 / modulo : 1;
      this.vel.setTo(x * escala * VELOCIDADE, y * escala * VELOCIDADE);
      this.direcao.setTo(x / modulo, y / modulo);
    } else {
      this.vel.setTo(0, 0);
    }

    this.recarga -= elapsedMs;
    const querAtirar = teclado.isHeld(Keys.Space) || Controles.atirando;
    if (querAtirar && this.recarga <= 0) {
      this.recarga = INTERVALO_TIRO_MS;
      engine.add(new Bala(this.pos.clone(), this.direcao, "jogador"));
    }
  }

  // Mantém o jogador dentro da arena
  override onPostUpdate(): void {
    const x = Math.min(LARGURA - MARGEM, Math.max(MARGEM, this.pos.x));
    const y = Math.min(ALTURA - MARGEM, Math.max(MARGEM, this.pos.y));
    if (x !== this.pos.x || y !== this.pos.y) {
      this.pos = vec(x, y);
    }
  }

  private levarDano() {
    this.vida -= 1;
    this.actions.flash(Color.Red, 80);
    this.scene?.camera.shake(6, 6, 180);

    if (this.vida <= 0) {
      this.scene?.add(new Explosao(this.pos.clone(), "jogador"));
      this.aoMorrer();
      this.kill();
    }
  }
}
