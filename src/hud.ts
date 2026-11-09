import { Color, Font, FontUnit, Label, ScreenElement, TextAlign, vec } from "excalibur";

export class Hud extends ScreenElement {
  private readonly placar: Label;
  private readonly aviso: Label;

  constructor() {
    super({
      pos: vec(0, 0),
    });

    this.placar = new Label({
      text: "",
      pos: vec(16, 16),
      color: Color.White,
      font: new Font({
        family: "sans-serif",
        size: 20,
        unit: FontUnit.Px,
      }),
    });

    this.aviso = new Label({
      text: "",
      pos: vec(400, 280),
      color: Color.White,
      font: new Font({
        family: "sans-serif",
        size: 28,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center,
        bold: true,
      }),
    });
  }

  override onInitialize() {
    this.addChild(this.placar);
    this.addChild(this.aviso);
  }

  atualizar(pontos: number, vida: number, dificuldade: string) {
    this.placar.text = `Pontos: ${pontos}   Vida: ${Math.max(0, vida)}   ${dificuldade}`;
  }

  mostrarAviso(texto: string) {
    this.aviso.text = texto;
  }
}
