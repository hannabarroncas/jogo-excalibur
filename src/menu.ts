import { Actor, Color, Engine, Font, FontUnit, Keys, Label, Scene, TextAlign, vec } from "excalibur";
import { Controles } from "./controles";
import type { NomeDificuldade } from "./dificuldade";
import { Arena } from "./efeitos";
import { FONTE, graficoBotao, LARGURA } from "./graficos";

function criarTexto(texto: string, y: number, tamanho: number, cor: Color, negrito = false) {
  return new Label({
    text: texto,
    pos: vec(LARGURA / 2, y),
    color: cor,
    font: new Font({
      family: FONTE,
      size: tamanho,
      unit: FontUnit.Px,
      textAlign: TextAlign.Center,
      bold: negrito,
    }),
  });
}

export class MenuDificuldade extends Scene {
  override onInitialize(engine: Engine): void {
    this.add(new Arena());

    this.add(criarTexto("EXCALIBUR", 110, 64, Color.fromHex("#d4af37"), true));
    this.add(criarTexto("Escolha a dificuldade", 172, 22, Color.fromHex("#cbd5e1")));

    this.add(criarBotao("1  Fácil", vec(LARGURA / 2, 270), "#27ae60", () => this.iniciar(engine, "facil")));
    this.add(criarBotao("2  Médio", vec(LARGURA / 2, 350), "#d35400", () => this.iniciar(engine, "medio")));
    this.add(criarBotao("3  Difícil", vec(LARGURA / 2, 430), "#a93226", () => this.iniciar(engine, "dificil")));

    const dica = Controles.ativo
      ? "Joystick move  •  Botão ATIRAR dispara  •  Toque para escolher"
      : "WASD ou setas movem  •  Espaço atira  •  1 / 2 / 3 escolhe";
    this.add(criarTexto(dica, 520, 16, Color.fromHex("#9aa5b8")));
  }

  override onActivate(): void {
    Controles.esconder();
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
    void engine.goToScene("jogo", { sceneActivationData: dificuldade });
  }
}

// Botão grande (300x64): confortável para o dedo no celular
function criarBotao(texto: string, posicao: ReturnType<typeof vec>, cor: string, aoClicar: () => void) {
  const botao = new Actor({
    pos: posicao,
    width: 300,
    height: 64,
  });

  botao.graphics.add(graficoBotao(texto, cor));
  botao.on("pointerup", aoClicar);
  // Realce ao passar o mouse
  botao.on("pointerenter", () => botao.scale.setTo(1.05, 1.05));
  botao.on("pointerleave", () => botao.scale.setTo(1, 1));
  return botao;
}
