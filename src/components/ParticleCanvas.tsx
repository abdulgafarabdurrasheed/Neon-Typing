interface ExplosionParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string;
  radius: number;
  char?: string;
  gravity: number;
  friction: number;
}

class ParticleEmitter {
  private static instance: ParticleEmitter;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ExplosionParticle[] = [];
  private animId = 0;
  private running = false;

  private constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 500;
    `;
    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  static getInstance(): ParticleEmitter {
    if (!ParticleEmitter.instance) {
      ParticleEmitter.instance = new ParticleEmitter();
    }
    return ParticleEmitter.instance;
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  explode(x: number, y: number, word: string, isSuperSaiyan: boolean) {
    const colors = isSuperSaiyan
      ? ["#ff006e", "#bf00ff", "#f5f520", "#00f0ff"]
      : ["#39ff14", "#00f0ff", "#f5f520"];

    const count = isSuperSaiyan ? 40 : 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 1 + Math.random() * 3,
        gravity: 0.08,
        friction: 0.98,
      });
    }

    for (let i = 0; i < word.length; i++) {
      const angle = (Math.PI * 2 * i) / word.length;
      const speed = 1.5 + Math.random() * 2;
      this.particles.push({
        x: x + (i - word.length / 2) * 12,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5),
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 0.8 + Math.random() * 0.3,
        color: colors[i % colors.length],
        radius: 0,
        char: word[i],
        gravity: 0.06,
        friction: 0.97,
      });
    }

    if (!this.running) this.startLoop();
  }

  private startLoop() {
    this.running = true;
    const frame = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= 1 / 60 / p.maxLife;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) { this.particles.splice(i, 1); continue; }

        this.ctx.globalAlpha = p.life;

        if (p.char) {
          this.ctx.font = `bold ${14 + p.life * 4}px "Fira Code", monospace`;
          this.ctx.fillStyle = p.color;
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = 8;
          this.ctx.fillText(p.char, p.x, p.y);
          this.ctx.shadowBlur = 0;
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
        }
      }

      this.ctx.globalAlpha = 1;

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(frame);
      } else {
        this.running = false;
      }
    };
    frame();
  }
}

export default ParticleEmitter;   