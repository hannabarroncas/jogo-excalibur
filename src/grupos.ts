import { CollisionGroupManager } from "excalibur";

// Cada grupo ganha um bit automático, nesta ordem:
// jogador = 0b0001, robo = 0b0010, balaJogador = 0b0100, balaRobo = 0b1000
// A máscara diz com quem o grupo PODE colidir.
export const Grupos = {
  // O jogador só é atingido pelas balas do robô
  jogador: CollisionGroupManager.create("jogador", 0b1000),
  // O robô só é atingido pelas balas do jogador
  robo: CollisionGroupManager.create("robo", 0b0100),
  // A bala do jogador só acerta o robô
  balaJogador: CollisionGroupManager.create("balaJogador", 0b0010),
  // A bala do robô só acerta o jogador
  balaRobo: CollisionGroupManager.create("balaRobo", 0b0001),
};
