import { Canvas } from "excalibur";

// Tamanho fixo do mundo do jogo (a tela se ajusta a isso com letterbox)
export const LARGURA = 800;
export const ALTURA = 600;

// Fonte do sistema: não baixa nada, abre na hora em qualquer aparelho
export const FONTE = "Georgia, 'Times New Roman', serif";

export type Lado = "jogador" | "robo";

type Desenho = (ctx: CanvasRenderingContext2D) => void;

// Todo desenho é feito UMA vez (cache: true) e reaproveitado por todos os atores.
// Isso poupa memória e processamento, principalmente em celular.
function criar(largura: number, altura: number, desenhar: Desenho): Canvas {
  return new Canvas({ width: largura, height: altura, cache: true, draw: desenhar });
}

const balas: Partial<Record<Lado, Canvas>> = {};

export function graficoBala(lado: Lado): Canvas {
  const pronto = balas[lado];
  if (pronto) {
    return pronto;
  }

  const miolo = lado === "jogador" ? "#fff7c2" : "#ffe3d1";
  const rgb = lado === "jogador" ? "255, 217, 61" : "255, 107, 53";

  const grafico = criar(16, 16, (ctx) => {
    const brilho = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    brilho.addColorStop(0, miolo);
    brilho.addColorStop(0.4, `rgba(${rgb}, 1)`);
    brilho.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = brilho;
    ctx.fillRect(0, 0, 16, 16);
  });

  balas[lado] = grafico;
  return grafico;
}

let robo: Canvas | undefined;

export function graficoRobo(): Canvas {
  if (robo) {
    return robo;
  }

  robo = criar(44, 52, (ctx) => {
    // sombra no chão
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(22, 50, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // pernas
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(12, 36, 8, 14);
    ctx.fillRect(24, 36, 8, 14);

    // braços
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(2, 16, 8, 16);
    ctx.fillRect(34, 16, 8, 16);

    // corpo + painel
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(8, 12, 28, 24);
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(12, 16, 20, 5);
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(20, 26, 4, 4);

    // cabeça + antena
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(16, 3, 12, 9);
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(21, 0, 2, 4);

    // olhos brilhando
    ctx.shadowColor = "#2ecc71";
    ctx.shadowBlur = 5;
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(18, 6, 3, 3);
    ctx.fillRect(24, 6, 3, 3);
    ctx.shadowBlur = 0;
  });

  return robo;
}

let arena: Canvas | undefined;

export function graficoArena(): Canvas {
  if (arena) {
    return arena;
  }

  arena = criar(LARGURA, ALTURA, (ctx) => {
    // chão de pedra
    ctx.fillStyle = "#16162b";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // ladrilhos (um único traçado = barato)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.045)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= LARGURA; x += 50) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, ALTURA);
    }
    for (let y = 0; y <= ALTURA; y += 50) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(LARGURA, y + 0.5);
    }
    ctx.stroke();

    // vinheta: escurece as bordas e chama o olhar pro centro
    const vinheta = ctx.createRadialGradient(LARGURA / 2, ALTURA / 2, 140, LARGURA / 2, ALTURA / 2, 520);
    vinheta.addColorStop(0, "rgba(0, 0, 0, 0)");
    vinheta.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    ctx.fillStyle = vinheta;
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // moldura dourada
    ctx.strokeStyle = "rgba(212, 175, 55, 0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, LARGURA - 4, ALTURA - 4);
  });

  return arena;
}

const aneis: Partial<Record<Lado, Canvas>> = {};

// Anel que cresce e some quando algo é atingido
export function graficoAnel(lado: Lado): Canvas {
  const pronto = aneis[lado];
  if (pronto) {
    return pronto;
  }

  const cor = lado === "robo" ? "#ffb347" : "#ff4d4d";
  const grafico = criar(64, 64, (ctx) => {
    ctx.strokeStyle = cor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(32, 32, 26, 0, Math.PI * 2);
    ctx.stroke();
  });

  aneis[lado] = grafico;
  return grafico;
}

function arredondar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Botão do menu desenhado em um único canvas (texto incluso): 1 ator em vez de 2
export function graficoBotao(texto: string, cor: string, largura = 300, altura = 64): Canvas {
  return criar(largura, altura, (ctx) => {
    arredondar(ctx, 2, 2, largura - 4, altura - 4, 10);
    ctx.fillStyle = cor;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold 24px ${FONTE}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, largura / 2, altura / 2 + 1);
  });
}
