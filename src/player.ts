import { Actor, Collider, CollisionContact, CollisionType, Engine, Keys, Side, vec } from "excalibur";
import { Resources } from "./resources";
import { Bala } from "./bala";

// O jogador é um Actor: algo que aparece na tela, se move e colide
export class Player extends Actor {
  // Última direção em que o jogador andou. Começa olhando para a direita.
  private direcao = vec(1, 0);

  // Quantidade de vidas do jogador
  public vidas = 3;

  // Tempo (em milissegundos) em que o jogador não pode levar dano.
  // Serve para ele não perder todas as vidas de uma vez ao encostar num robô.
  private tempoInvencivel = 0;

  // Roda uma vez, no momento em que o jogador é criado
  constructor() {
    super({
      name: "Player",                       // nome do jogador
      pos: vec(150, 150),                   // posição inicial: x, y
      width: 100,                           // largura, em pixels
      height: 100,                          // altura, em pixels
      collisionType: CollisionType.Active,  // participa de colisões
    });
  }

  // Roda uma vez, antes de o jogo começar a usar o jogador
  override onInitialize() {
    // Coloca a imagem da espada como aparência do jogador
    this.graphics.add(Resources.Sword.toSprite());
  }

  // Roda a cada quadro do jogo (muitas vezes por segundo)
  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Diminui o tempo de invencibilidade com o tempo que passou desde o último quadro
    if (this.tempoInvencivel > 0) {
      this.tempoInvencivel -= elapsedMs;
    }

    // Velocidade do jogador, em pixels por segundo
    const velocidade = 200;

    // Direção do movimento: começa parada a cada quadro
    let x = 0; // horizontal: negativo = esquerda, positivo = direita
    let y = 0; // vertical: negativo = cima, positivo = baixo

    // Se a tecla W estiver segurada, o jogador sobe
    if (engine.input.keyboard.isHeld(Keys.W)) {
      y = -velocidade;
    }

    // Se a tecla S estiver segurada, o jogador desce
    if (engine.input.keyboard.isHeld(Keys.S)) {
      y = velocidade;
    }

    // Se a tecla A estiver segurada, o jogador vai para a esquerda
    if (engine.input.keyboard.isHeld(Keys.A)) {
      x = -velocidade;
    }

    // Se a tecla D estiver segurada, o jogador vai para a direita
    if (engine.input.keyboard.isHeld(Keys.D)) {
      x = velocidade;
    }

    // Aplica a direção como velocidade do jogador
    this.vel = vec(x, y);

    // Se o jogador está andando, guarda essa direção para o tiro
    if (x !== 0 || y !== 0) {
      this.direcao = vec(x, y).normalize();
    }

    // Se a barra de espaço acabou de ser apertada, cria uma bala
    if (engine.input.keyboard.wasPressed(Keys.Space)) {
      engine.add(new Bala(this.pos.clone(), this.direcao));
    }
  }

  // Roda quando o jogador começa a encostar em outra coisa
  override onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    // other.owner é o ator em que o jogador encostou.
    // Se for um robô ou uma bala de robô, o jogador leva dano.
    const nome = other.owner.name;
    if (nome === "Robo" || nome === "BalaRobo") {
      this.levarDano();
    }
  }

  // Tira uma vida do jogador
  levarDano() {
    // Se ainda está invencível, não acontece nada
    if (this.tempoInvencivel > 0) {
      return;
    }

    // Perde uma vida
    this.vidas -= 1;

    // Fica invencível por 1 segundo (1000 milissegundos)
    this.tempoInvencivel = 1000;

    // Pisca 5 vezes, para mostrar que levou dano
    this.actions.blink(100, 100, 5);

    // Mostra as vidas no console do navegador (F12), para testar
    console.log("Vidas:", this.vidas);

    // Se acabaram as vidas, o jogador sai do jogo.
    // A tela de game over vai ser feita depois.
    if (this.vidas <= 0) {
      this.kill();
    }
  }
}