import { Engine, Keys, Scene, SceneActivationContext, vec, Vector } from "excalibur";
import { Controles } from "./controles";
import { ConfigDificuldade, DIFICULDADES, NomeDificuldade } from "./dificuldade";
import { Arena } from "./efeitos";
import { ALTURA, LARGURA } from "./graficos";
import { Hud } from "./hud";
import { Player } from "./player";
import { Robo } from "./robo";

// O recorde fica salvo no próprio aparelho (um número por dificuldade)
function chaveRecorde(nome: NomeDificuldade) {
  return `excalibur:recorde:${nome}`;
}

function lerRecorde(nome: NomeDificuldade): number {
  try {
    return Number(localStorage.getItem(chaveRecorde(nome))) || 0;
  } catch {
    return 0;
  }
}

function salvarRecorde(nome: NomeDificuldade, pontos: number) {
  try {
    localStorage.setItem(chaveRecorde(nome), String(pontos));
  } catch {
    // modo privado ou armazenamento bloqueado: o jogo segue normal
  }
}

function sortearBorda(): Vector {
  const lado = Math.floor(Math.random() * 4);

  if (lado === 0) {
    return vec(40, 40 + Math.random() * (ALTURA - 80));
  }
  if (lado === 1) {
    return vec(LARGURA - 40, 40 + Math.random() * (ALTURA - 80));
  }
  if (lado === 2) {
    return vec(40 + Math.random() * (LARGURA - 80), 40);
  }
  return vec(40 + Math.random() * (LARGURA - 80), ALTURA - 40);
}

export class MyLevel extends Scene<NomeDificuldade> {
  private jogador!: Player;
  private hud!: Hud;
  private config!: ConfigDificuldade;
  private pontos = 0;
  private recorde = 0;
  private tempoSpawn = 0;
  // Contador simples: evita varrer todos os atores a cada frame
  private robosVivos = 0;
  private acabou = false;
  private fimEm = 0;
  private tocou = false;
  private saindo = false;

  // No fim do jogo: toque/clique volta ao menu (depois de meio segundo, para não pular o placar sem querer)
  private readonly aoPressionar = () => {
    if (this.acabou && performance.now() - this.fimEm > 500) {
      this.tocou = true;
    }
  };

  private readonly aoSoltar = () => {
    if (this.acabou && this.tocou) {
      this.tocou = false;
      this.voltarAoMenu();
    }
  };

  override onActivate(context: SceneActivationContext<NomeDificuldade>): void {
    this.clear();
    this.pontos = 0;
    this.tempoSpawn = 0;
    this.robosVivos = 0;
    this.acabou = false;
    this.tocou = false;
    this.saindo = false;
    this.config = DIFICULDADES[context.data ?? "medio"];
    this.recorde = lerRecorde(this.config.nome);

    this.add(new Arena());

    this.jogador = new Player(this.config.vidaJogador, () => this.fimDeJogo());
    this.add(this.jogador);

    this.hud = new Hud();
    this.add(this.hud);
    this.atualizarHud();

    this.engine.input.pointers.on("down", this.aoPressionar);
    this.engine.input.pointers.on("up", this.aoSoltar);
    Controles.mostrar();

    this.nascerRobo();
  }

  override onDeactivate(): void {
    this.engine.input.pointers.off("down", this.aoPressionar);
    this.engine.input.pointers.off("up", this.aoSoltar);
    Controles.esconder();
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.acabou) {
      if (engine.input.keyboard.wasPressed(Keys.Enter) || engine.input.keyboard.wasPressed(Keys.Escape)) {
        this.voltarAoMenu();
      }
      return;
    }

    this.tempoSpawn += elapsedMs;
    if (this.tempoSpawn >= this.config.spawnMs && this.robosVivos < this.config.maxRobos) {
      this.tempoSpawn = 0;
      this.nascerRobo();
    }
  }

  private voltarAoMenu() {
    if (this.saindo) {
      return;
    }
    this.saindo = true;
    void this.engine.goToScene("menu");
  }

  private nascerRobo() {
    const robo = new Robo(this.jogador, this.config, () => {
      this.robosVivos -= 1;
      this.ganharPontos();
    });
    robo.pos = this.posicaoNascedouro();
    this.robosVivos += 1;
    this.add(robo);
  }

  // Sorteia uma borda, mas evita nascer em cima do jogador
  private posicaoNascedouro(): Vector {
    let posicao = sortearBorda();
    for (let tentativa = 0; tentativa < 6; tentativa++) {
      if (posicao.distance(this.jogador.pos) > 220) {
        break;
      }
      posicao = sortearBorda();
    }
    return posicao;
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
    this.fimEm = performance.now();

    const novoRecorde = this.pontos > this.recorde;
    if (novoRecorde) {
      this.recorde = this.pontos;
      salvarRecorde(this.config.nome, this.pontos);
    }

    Controles.esconder();
    this.atualizarHud();
    this.hud.mostrarFim(this.pontos, novoRecorde, Controles.ativo ? "Toque na tela para voltar ao menu" : "Enter volta ao menu");
  }

  private atualizarHud() {
    this.hud.atualizar(this.pontos, this.jogador.vida, this.config.rotulo, this.recorde);
  }
}
