import { Actor, CollisionType, Color, Font, FontUnit, Label, ScreenElement, TextAlign, vec } from "excalibur";
import { ALTURA, FONTE, LARGURA } from "./graficos";

function criarRotulo(x: number, y: number, tamanho: number, cor: Color, centralizado = false, negrito = false, familia = FONTE) {
  const rotulo = new Label({
    text: "",
    pos: vec(x, y),
    color: cor,
    font: new Font({
      family: familia,
      size: tamanho,
      unit: FontUnit.Px,
      bold: negrito,
      textAlign: centralizado ? TextAlign.Center : TextAlign.Left,
    }),
  });
  rotulo.z = 2;
  return rotulo;
}

// Só mexe no texto se ele mudou: redesenhar texto é a parte mais cara do HUD
function definir(rotulo: Label, texto: string) {
  if (rotulo.text !== texto) {
    rotulo.text = texto;
  }
}

export class Hud extends ScreenElement {
  private readonly placar = criarRotulo(16, 14, 22, Color.White, false, true);
  private readonly info = criarRotulo(16, 42, 15, Color.fromHex("#9aa5b8"));
  // Corações em fonte sem serifa, que existe em qualquer aparelho
  private readonly vidas = criarRotulo(650, 12, 24, Color.fromHex("#e74c3c"), false, false, "sans-serif");
  private readonly titulo = criarRotulo(LARGURA / 2, 240, 44, Color.fromHex("#d4af37"), true, true);
  private readonly detalhe = criarRotulo(LARGURA / 2, 305, 26, Color.White, true);
  private readonly dica = criarRotulo(LARGURA / 2, 355, 18, Color.fromHex("#9aa5b8"), true);

  constructor() {
    super({
      pos: vec(0, 0),
    });
  }

  override onInitialize() {
    this.addChild(this.placar);
    this.addChild(this.info);
    this.addChild(this.vidas);
    this.addChild(this.titulo);
    this.addChild(this.detalhe);
    this.addChild(this.dica);
  }

  atualizar(pontos: number, vida: number, dificuldade: string, recorde: number) {
    definir(this.placar, `Pontos: ${pontos}`);
    definir(this.info, `${dificuldade}   Recorde: ${recorde}`);
    definir(this.vidas, "♥ ".repeat(Math.max(0, vida)).trim());
  }

  mostrarFim(pontos: number, novoRecorde: boolean, dica: string) {
    // Escurece o fundo para o texto ficar legível
    const fundo = new Actor({
      pos: vec(LARGURA / 2, ALTURA / 2),
      width: LARGURA,
      height: ALTURA,
      color: Color.fromRGB(0, 0, 0, 0.65),
      z: 1,
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(fundo);

    definir(this.titulo, "Fim de jogo");
    definir(this.detalhe, novoRecorde ? `Novo recorde: ${pontos} pontos!` : `Você fez ${pontos} pontos`);
    definir(this.dica, dica);
  }
}
