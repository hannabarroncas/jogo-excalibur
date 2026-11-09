// Controles de toque para celular/tablet: joystick à esquerda e botão ATIRAR à direita.
// São elementos HTML simples (leves e com multitoque confiável). Só aparecem em telas de toque.

const RAIO = 50;

function aparelhoDeToque(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
}

class ControlesToque {
  // true quando o aparelho é de toque
  readonly ativo = aparelhoDeToque();

  // direção do joystick, de -1 a 1
  x = 0;
  y = 0;
  // botão de tiro pressionado
  atirando = false;

  private raiz: HTMLDivElement | null = null;
  private knob: HTMLDivElement | null = null;
  private fogo: HTMLButtonElement | null = null;
  private idJoystick: number | null = null;

  mostrar() {
    if (!this.ativo) {
      return;
    }
    if (!this.raiz) {
      this.criar();
    }
    if (this.raiz) {
      this.raiz.style.display = "block";
    }
  }

  esconder() {
    if (!this.raiz) {
      return;
    }
    this.raiz.style.display = "none";
    this.zerar();
  }

  private zerar() {
    this.x = 0;
    this.y = 0;
    this.atirando = false;
    this.idJoystick = null;
    if (this.knob) {
      this.knob.style.transform = "translate(0px, 0px)";
    }
    if (this.fogo) {
      this.fogo.classList.remove("ativo");
    }
  }

  private criar() {
    const raiz = document.createElement("div");
    raiz.className = "controles";

    const joystick = document.createElement("div");
    joystick.className = "joystick";
    const knob = document.createElement("div");
    knob.className = "joystick-knob";
    joystick.appendChild(knob);

    const fogo = document.createElement("button");
    fogo.type = "button";
    fogo.className = "botao-fogo";
    fogo.textContent = "ATIRAR";

    raiz.append(joystick, fogo);
    raiz.addEventListener("contextmenu", (e) => e.preventDefault());
    document.body.appendChild(raiz);

    this.raiz = raiz;
    this.knob = knob;
    this.fogo = fogo;

    let centroX = 0;
    let centroY = 0;

    const mover = (e: PointerEvent) => {
      const dx = e.clientX - centroX;
      const dy = e.clientY - centroY;
      const distancia = Math.hypot(dx, dy) || 1;
      const fator = Math.min(1, RAIO / distancia);
      const px = dx * fator;
      const py = dy * fator;
      knob.style.transform = `translate(${px}px, ${py}px)`;
      this.x = px / RAIO;
      this.y = py / RAIO;
    };

    joystick.addEventListener("pointerdown", (e) => {
      if (this.idJoystick !== null) {
        return;
      }
      this.idJoystick = e.pointerId;
      joystick.setPointerCapture(e.pointerId);
      const caixa = joystick.getBoundingClientRect();
      centroX = caixa.left + caixa.width / 2;
      centroY = caixa.top + caixa.height / 2;
      mover(e);
      e.preventDefault();
    });

    joystick.addEventListener("pointermove", (e) => {
      if (e.pointerId === this.idJoystick) {
        mover(e);
      }
    });

    const soltarJoystick = (e: PointerEvent) => {
      if (e.pointerId !== this.idJoystick) {
        return;
      }
      this.idJoystick = null;
      this.x = 0;
      this.y = 0;
      knob.style.transform = "translate(0px, 0px)";
    };
    joystick.addEventListener("pointerup", soltarJoystick);
    joystick.addEventListener("pointercancel", soltarJoystick);

    fogo.addEventListener("pointerdown", (e) => {
      fogo.setPointerCapture(e.pointerId);
      this.atirando = true;
      fogo.classList.add("ativo");
      e.preventDefault();
    });

    const soltarFogo = () => {
      this.atirando = false;
      fogo.classList.remove("ativo");
    };
    fogo.addEventListener("pointerup", soltarFogo);
    fogo.addEventListener("pointercancel", soltarFogo);
  }
}

export const Controles = new ControlesToque();
