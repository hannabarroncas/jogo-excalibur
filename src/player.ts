import { Actor, Engine, Keys, vec } from "excalibur";
import { Resources } from "./resources";

export class Player extends Actor {
 
  constructor() {
    super({
      name: "Player",     
      pos: vec(150, 150), 
      width: 100,         
      height: 100,        
    });
  }

  override onInitialize() {
 
    this.graphics.add(Resources.Sword.toSprite());
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
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
  }
}