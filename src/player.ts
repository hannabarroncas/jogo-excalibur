import { Actor, CollisionType, Color, Engine, Keys, vec } from "excalibur";
import { Bala } from "./bala";
import { Grupos } from "./grupos";
import { Resources } from "./resources";

export class Player extends Actor {
  private direcao = vec(1, 0);
  vida: number;
  private readonly aoMorrer: () => void;

  constructor(vida: number, aoMorrer: () => void) {
    super({
      name: "Player",
      pos: vec(400, 300),
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
      this.vel = vec(0, 0);
      return;
    }

    const velocidade = 200;
    let x = 0;
    let y = 0;

    if (engine.input.keyboard.isHeld(Keys.W)) {
      y = -velocidade;
    }
    if (engine.input.keyboard.isHeld(Keys.S)) {
      y = velocidade;
    }
    if (engine.input.keyboard.isHeld(Keys.A)) {
      x = -velocidade;
    }
    if (engine.input.keyboard.isHeld(Keys.D)) {
      x = velocidade;
    }

    this.vel = vec(x, y);

    if (x !== 0 || y !== 0) {
      this.direcao = vec(x, y).normalize();
    }

    if (engine.input.keyboard.wasPressed(Keys.Space)) {
      engine.add(new Bala(this.pos.clone(), this.direcao, "jogador"));
    }
  }

  private levarDano() {
    this.vida -= 1;
    this.actions.flash(Color.Red, 80);
    if (this.vida <= 0) {
      this.aoMorrer();
      this.kill();
    }
  }
}
