import { Actor, Color, Engine, Font, FontUnit, Keys, Label, Scene, SceneActivationContext, TextAlign, vec } from "excalibur";
import { NomeDificuldade } from "./dificuldade";

type DadosFimDeJogo = { score: number; difficulty: NomeDificuldade };

export class GameOver extends Scene<DadosFimDeJogo> {
  private dados: DadosFimDeJogo = { score: 0, difficulty: "medio" };

  override onActivate(context: SceneActivationContext<DadosFimDeJogo>): void {
    this.clear();
    this.dados = context.data ?? { score: 0, difficulty: "medio" };
    this.add(new Label({
      text: "FIM DE JOGO", pos: vec(400, 170), color: Color.fromHex("#ff6b6b"),
      font: new Font({ family: "sans-serif", size: 52, unit: FontUnit.Px, textAlign: TextAlign.Center, bold: true }),
    }));
    this.add(new Label({
      text: `Pontuação: ${this.dados.score}`, pos: vec(400, 250), color: Color.White,
      font: new Font({ family: "sans-serif", size: 30, unit: FontUnit.Px, textAlign: TextAlign.Center }),
    }));
    this.add(this.botao("Jogar novamente", vec(400, 350), Color.fromHex("#27ae60"), () => this.reiniciar()));
    this.add(this.botao("Voltar ao menu", vec(400, 430), Color.fromHex("#34495e"), () => this.irAoMenu()));
  }

  override onPreUpdate(engine: Engine): void {
    if (engine.input.keyboard.wasPressed(Keys.Enter)) this.reiniciar();
    if (engine.input.keyboard.wasPressed(Keys.Escape)) this.irAoMenu();
  }

  private reiniciar() {
    void this.engine.goToScene("jogo", { sceneActivationData: this.dados.difficulty });
  }

  private irAoMenu() { void this.engine.goToScene("menu"); }

  private botao(texto: string, posicao: ReturnType<typeof vec>, cor: Color, acao: () => void) {
    const botao = new Actor({ pos: posicao, width: 280, height: 58, color: cor });
    const label = new Label({
      text: texto, pos: vec(0, 0), color: Color.White,
      font: new Font({ family: "sans-serif", size: 22, unit: FontUnit.Px, textAlign: TextAlign.Center }),
    });
    label.anchor = vec(0.5, 0.5);
    botao.addChild(label);
    botao.on("pointerup", acao);
    return botao;
  }
}
