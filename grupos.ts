import { CollisionGroupManager } from "excalibur";

// A ordem define os bits: jogador=1, robo=2, balaJogador=4,
// balaRobo=8 e parede=16. Cada máscara lista os grupos permitidos.
export const Grupos = {
  jogador: CollisionGroupManager.create("jogador", 0b11000),
  robo: CollisionGroupManager.create("robo", 0b10100),
  balaJogador: CollisionGroupManager.create("balaJogador", 0b10010),
  balaRobo: CollisionGroupManager.create("balaRobo", 0b10001),
  parede: CollisionGroupManager.create("parede", 0b01111),
};
