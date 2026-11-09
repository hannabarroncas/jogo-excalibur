import { Actor, Engine, Keys, vec } from "excalibur";
import { Resources } from "./resources";
import { Bala } from "./bala";

// O jogador é um Actor: algo que aparece na tela, se move e colide
export class Player extends Actor {
  // Última direção em que o jogador andou. Começa olhando para a direita.
  // É para essa direção que a bala vai.
  private direcao = vec(1, 0);

  // Roda uma vez, no momento em que o jogador é criado
  constructor() {
    super({
      name: "Player",     // nome do jogador (ajuda a encontrar erros)
      pos: vec(150, 150), // posição inicial: x (horizontal), y (vertical)
      width: 100,         // largura, em pixels
      height: 100,        // altura, em pixels
    });
  }

  // Roda uma vez, antes de o jogo começar a usar o jogador
  override onInitialize() {
    // Coloca a imagem da espada como aparência do jogador
    this.graphics.add(Resources.Sword.toSprite());
  }

  // Roda a cada quadro do jogo (muitas vezes por segundo)
  override onPreUpdate(engine: Engine, elapsedMs: number): void {
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

    // Aplica a direção como velocidade do jogador.
    // O Excalibur move o jogador sozinho de acordo com essa velocidade.
    this.vel = vec(x, y);

    // Se o jogador está andando, guarda essa direção para o tiro.
    // normalize() deixa a direção com tamanho 1,
    // para a bala ter a mesma velocidade em qualquer direção (até na diagonal).
    if (x !== 0 || y !== 0) {
      this.direcao = vec(x, y).normalize();
    }

    // Se a barra de espaço ACABOU de ser apertada, cria uma bala.
    // wasPressed só vale no quadro em que a tecla foi apertada,
    // então sai um tiro por aperto (e não uma rajada infinita).
    if (engine.input.keyboard.wasPressed(Keys.Space)) {
      // A bala nasce na posição do jogador e vai na direção guardada.
      // clone() faz uma cópia da posição, para a bala não ficar "presa" ao jogador.
      engine.add(new Bala(this.pos.clone(), this.direcao));
    }
  }
}