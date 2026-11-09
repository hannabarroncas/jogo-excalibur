import "./style.css";
import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { ALTURA, LARGURA } from "./graficos";
import { MyLevel } from "./level";
import { MenuDificuldade } from "./menu";
import { loader } from "./resources";

// Garante que o celular não abre a página "em tamanho de desktop"
function garantirViewport() {
  if (document.querySelector('meta[name="viewport"]')) {
    return;
  }
  const meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no";
  document.head.appendChild(meta);
}

garantirViewport();

const game = new Engine({
  width: LARGURA,
  height: ALTURA,
  // Mundo sempre 800x600, ajustado à tela com faixas nas laterais (letterbox).
  // Todo mundo joga na mesma arena e o HUD fica sempre no lugar certo.
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  // 60 FPS bastam e poupam bateria em telas de 90/120 Hz
  maxFps: 60,
  // Telas 3x/4x têm muitos pixels; limitar a 2x deixa o jogo bem mais leve
  pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  backgroundColor: Color.fromHex("#16162b"),
  scenes: {
    menu: MenuDificuldade,
    jogo: MyLevel,
  },
});

game.start("menu", {
  loader,
  inTransition: new FadeInOut({
    duration: 600,
    direction: "in",
    color: Color.Black,
  }),
});
