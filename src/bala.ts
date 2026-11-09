import { Actor, Color, Vector } from "excalibur";

// A bala é um Actor pequeno que anda em linha reta
export class Bala extends Actor {
  // Recebe onde a bala nasce e para qual direção ela vai
  constructor(posicao: Vector, direcao: Vector) {
    super({
      name: "Bala",        // nome da bala (ajuda a encontrar erros)
      pos: posicao,        // nasce na posição recebida (a do jogador)
      width: 10,           // largura, em pixels
      height: 10,          // altura, em pixels
      color: Color.Yellow, // desenha um quadradinho amarelo
    });

    // Velocidade da bala: a direção multiplicada por 500 pixels por segundo
    this.vel = direcao.scale(500);
  }

  // Roda uma vez, antes de a bala começar a ser usada
  override onInitialize() {
    // Quando a bala sai da tela, ela é removida do jogo,
    // para o jogo não ficar pesado com balas invisíveis
    this.on("exitviewport", () => this.kill());
  }
}