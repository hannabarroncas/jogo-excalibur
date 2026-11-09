import { Actor, Color, Engine, Font, FontUnit, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { NomeDificuldade } from "./dificuldade";
import { tocarSom } from "./audio";

export class MenuDificuldade extends Scene {
  override onInitialize(engine: Engine): void {
    const titulo = new Label({
      text: "Escolha a dificuldade",
      pos: vec(400, 140),
      color: Color.White,
      font: new Font({
        family: "sans-serif",
        size: 36,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center,
        bold: true,
      }),
    });
    this.add(titulo);

    const dica = new Label({
      text: "WASD move  •  Espaço atira  •  1 / 2 / 3 escolhe",
      pos: vec(400, 190),
      color: Color.Gray,
      font: new Font({
        family: "sans-serif",
        size: 16,
        unit: FontUnit.Px,
        textAlign: TextAlign.Center,
      }),
    });
    this.add(dica);

    this.add(criarBotao("1  Fácil", vec(400, 280), Color.fromHex("#27ae60"), () => this.iniciar(engine, "facil")));
    this.add(criarBotao("2  Médio", vec(400, 360), Color.fromHex("#e67e22"), () => this.iniciar(engine, "medio")));
    this.add(criarBotao("3  Difícil", vec(400, 440), Color.fromHex("#c0392b"), () => this.iniciar(engine, "dificil")));
  }

  override onPreUpdate(engine: Engine): void {
    if (engine.input.keyboard.wasPressed(Keys.Digit1) || engine.input.keyboard.wasPressed(Keys.Num1)) {
      this.iniciar(engine, "facil");
    }
    if (engine.input.keyboard.wasPressed(Keys.Digit2) || engine.input.keyboard.wasPressed(Keys.Num2)) {
      this.iniciar(engine, "medio");
    }
    if (engine.input.keyboard.wasPressed(Keys.Digit3) || engine.input.keyboard.wasPressed(Keys.Num3)) {
      this.iniciar(engine, "dificil");
    }
  }

  private iniciar(engine: Engine, dificuldade: NomeDificuldade) {
    tocarSom("menu");
    void engine.goToScene("jogo", { sceneActivationData: dificuldade });
  }
}

function criarBotao(texto: string, posicao: ReturnType<typeof vec>, cor: Color, aoClicar: () => void) {
  const botao = new Actor({
    pos: posicao,
    width: 260,
    height: 56,
    color: cor,
  });

  const rotulo = new Label({
    text: texto,
    pos: vec(0, 0),
    color: Color.White,
    font: new Font({
      family: "sans-serif",
      size: 22,
      unit: FontUnit.Px,
      textAlign: TextAlign.Center,
    }),
  });
  rotulo.anchor = vec(0.5, 0.5);
  botao.addChild(rotulo);
  botao.on("pointerup", aoClicar);
  return botao;
}
