import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";
import { MenuDificuldade } from "./menu";
import { GameOver } from "./gameover";

const game = new Engine({
  width: 800,
  height: 600,
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  backgroundColor: Color.fromHex("#1a1a2e"),
  scenes: {
    menu: MenuDificuldade,
    jogo: MyLevel,
    gameover: GameOver,
  },
});

game.start("menu", {
  loader,
  inTransition: new FadeInOut({
    duration: 1000,
    direction: "in",
    color: Color.ExcaliburBlue,
  }),
});
