import { Engine, Keys, Scene, SceneActivationContext, vec } from "excalibur";
import { ConfigDificuldade, DIFICULDADES, NomeDificuldade } from "./dificuldade";
import { Hud } from "./hud";
import { Player } from "./player";
import { Robo } from "./robo";

export class MyLevel extends Scene<NomeDificuldade> {
  private jogador!: Player;
  private hud!: Hud;
  private config!: ConfigDificuldade;
  private pontos = 0;
  private tempoSpawn = 0;
  private acabou = false;

  override onActivate(context: SceneActivationContext<NomeDificuldade>): void {
    this.clear();
    this.pontos = 0;
    this.tempoSpawn = 0;
    this.acabou = false;
    this.config = DIFICULDADES[context.data ?? "medio"];

    this.jogador = new Player(this.config.vidaJogador, () => this.fimDeJogo());
    this.add(this.jogador);

    this.hud = new Hud();
    this.add(this.hud);
    this.atualizarHud();

    this.nascerRobo();
  }

  override onDeactivate(): void {
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.acabou) {
      if (engine.input.keyboard.wasPressed(Keys.Enter) || engine.input.keyboard.wasPressed(Keys.Escape)) {
        void engine.goToScene("menu");
      }
      return;
    }

    this.tempoSpawn += elapsedMs;
    if (this.tempoSpawn >= this.config.spawnMs && this.contarRobos() < this.config.maxRobos) {
      this.tempoSpawn = 0;
      this.nascerRobo();
    }
  }

  private contarRobos(): number {
    return this.actors.filter((ator) => ator.name === "Robo" && !ator.isKilled()).length;
  }

  private nascerRobo() {
    const robo = new Robo(this.jogador, this.config, () => this.ganharPontos());
    robo.pos = this.posicaoNascedouro();
    this.add(robo);
  }

  private posicaoNascedouro() {
    const largura = this.engine.drawWidth;
    const altura = this.engine.drawHeight;
    const lado = Math.floor(Math.random() * 4);

    if (lado === 0) {
      return vec(40, 40 + Math.random() * (altura - 80));
    }
    if (lado === 1) {
      return vec(largura - 40, 40 + Math.random() * (altura - 80));
    }
    if (lado === 2) {
      return vec(40 + Math.random() * (largura - 80), 40);
    }
    return vec(40 + Math.random() * (largura - 80), altura - 40);
  }

  private ganharPontos() {
    if (this.acabou) {
      return;
    }
    this.pontos += this.config.pontosPorRobo;
    this.atualizarHud();
  }

  private fimDeJogo() {
    this.acabou = true;
    this.atualizarHud();
    this.hud.mostrarAviso(`Fim de jogo  •  Pontos: ${this.pontos}  •  Enter volta ao menu`);
  }

  private atualizarHud() {
    this.hud.atualizar(this.pontos, this.jogador.vida, this.config.rotulo);
  }
}
