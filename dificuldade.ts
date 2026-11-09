export type NomeDificuldade = "facil" | "medio" | "dificil";

export type ConfigDificuldade = {
  nome: NomeDificuldade;
  rotulo: string;
  // Quão rápido o robô corre atrás do jogador
  velocidadeRobo: number;
  // Tempo entre um tiro e o próximo do robô
  cadenciaTiroMs: number;
  // Velocidade das balas disparadas pelo robô
  velocidadeBalaRobo: number;
  // Quantos robôs podem existir ao mesmo tempo
  maxRobos: number;
  // Tempo para nascer um robô novo
  spawnMs: number;
  // Pontos ganhos ao matar um robô
  pontosPorRobo: number;
  // Quantos tiros o jogador aguenta
  vidaJogador: number;
};

export const DIFICULDADES: Record<NomeDificuldade, ConfigDificuldade> = {
  facil: {
    nome: "facil",
    rotulo: "Fácil",
    velocidadeRobo: 70,
    cadenciaTiroMs: 1800,
    velocidadeBalaRobo: 220,
    maxRobos: 2,
    spawnMs: 4000,
    pontosPorRobo: 10,
    vidaJogador: 5,
  },
  medio: {
    nome: "medio",
    rotulo: "Médio",
    velocidadeRobo: 120,
    cadenciaTiroMs: 1100,
    velocidadeBalaRobo: 320,
    maxRobos: 4,
    spawnMs: 2500,
    pontosPorRobo: 20,
    vidaJogador: 3,
  },
  dificil: {
    nome: "dificil",
    rotulo: "Difícil",
    velocidadeRobo: 180,
    cadenciaTiroMs: 650,
    velocidadeBalaRobo: 420,
    maxRobos: 6,
    spawnMs: 1400,
    pontosPorRobo: 30,
    vidaJogador: 1,
  },
};
