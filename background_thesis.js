<canvas id="background"></canvas>

<script>
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let mouse = { x: 0, y: 0 };
let time = 0;

const PARTICLE_COUNT = 350;
const FIELD_SCALE = 0.002;
const MAX_SPEED = 1.5;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);

  initParticles();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.life = 200 + Math.random() * 200;
  }

  update() {

    // Flow field
    const angle =
      Math.sin(this.x * FIELD_SCALE) +
      Math.cos(this.y * FIELD_SCALE);

    this.vx += Math.cos(angle) * 0.2;
    this.vy += Math.sin(angle) * 0.2;

    // VORTEX mouse effect
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 200) {
      const a = Math.atan2(dy, dx);
      this.vx += Math.cos(a + Math.PI / 2) * 0.4;
      this.vy += Math.sin(a + Math.PI / 2) * 0.4;
    }

    // Speed limit
    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > MAX_SPEED) {
      this.vx *= 0.92;
      this.vy *= 0.92;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.life--;

    if (
      this.x < 0 ||
      this.x > width ||
      this.y < 0 ||
      this.y > height ||
      this.life < 0
    ) {
      this.reset();
    }
  }

  draw() {
    const hue = (this.x * 0.2 + this.y * 0.2 + time * 50) % 360;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 5, this.y - this.vy * 5);

    ctx.strokeStyle = `hsla(${hue}, 90%, 70%, 0.8)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function initParticles() {
  particles = [];

  const count = width < 600 ? 200 : PARTICLE_COUNT;

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    height
  );

  gradient.addColorStop(0, "#0a0f1a");
  gradient.addColorStop(1, "#000000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function animate() {
  time += 0.01;

  // trail fade
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, width, height);

  ctx.shadowColor = "rgba(0,200,255,0.8)";
  ctx.shadowBlur = 15;

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

resizeCanvas();
drawBackground();
animate();
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
  background: black;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
