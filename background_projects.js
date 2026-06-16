const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
let mouse = { x: 0, y: 0 };

const PARTICLE_COUNT = 350;
const FIELD_SCALE = 0.002;
const MAX_SPEED = 1.2;

function isLightMode() {
  return document.body.classList.contains("light-mode");
}

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
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.vx = 0;
    this.vy = 0;

    this.life = Math.random() * 200;
  }

  update() {
    const angle =
      Math.sin(this.x * FIELD_SCALE) +
      Math.cos(this.y * FIELD_SCALE);

    this.vx += Math.cos(angle) * 0.15;
    this.vy += Math.sin(angle) * 0.15;

    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 150) {
      this.vx += dx * 0.0005;
      this.vy += dy * 0.0005;
    }

    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > MAX_SPEED) {
      this.vx *= 0.9;
      this.vy *= 0.9;
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

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.life = 200 + Math.random() * 200;
  }

  draw() {
    const light = isLightMode();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = light
      ? "rgba(60,90,180,0.7)"
      : "rgba(200,220,255,0.9)";
    ctx.fill();
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
  const light = isLightMode();

  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, height
  );

  if (light) {
    gradient.addColorStop(0, "#e8edf5");
    gradient.addColorStop(1, "#f4f6f9");
  } else {
    gradient.addColorStop(0, "#0a0f1a");
    gradient.addColorStop(1, "#000000");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function animate() {
  const light = isLightMode();

  // Use drawBackground for clean full repaint each frame
  drawBackground();

  // Subtle trail overlay
  ctx.fillStyle = light
    ? "rgba(244,246,249,0.25)"
    : "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, width, height);

  ctx.shadowColor = light
    ? "rgba(60,100,200,0.4)"
    : "rgba(120,200,255,0.7)";
  ctx.shadowBlur = 8;

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

resizeCanvas();
animate();
