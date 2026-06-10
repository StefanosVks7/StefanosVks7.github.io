const canvas = document.getElementById("mlp-bg");
const ctx = canvas.getContext("2d");

let W, H;
let particles = [];
let mouse = { x: null, y: null };

const particleCount = 120;
const maxDistance = 120;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;

  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);

  initParticles();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

function initParticles() {
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1
    });
  }
}

function drawBackground() {
  const gradient = ctx.createRadialGradient(
    W/2, H/2, 0,
    W/2, H/2, H
  );

  gradient.addColorStop(0, "#0b0f1a");
  gradient.addColorStop(1, "#000000");

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,W,H);
}

function updateParticles() {

  for (let p of particles) {

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < 150) {
        p.vx += dx * 0.0003;
        p.vy += dy * 0.0003;
      }
    }
  }
}

function drawParticles() {

  ctx.shadowColor = "rgba(120,200,255,0.7)";
  ctx.shadowBlur = 10;

  for (let p of particles) {
    ctx.fillStyle = "rgba(180,200,255,0.9)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

function drawConnections() {

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {

      const a = particles[i];
      const b = particles[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < maxDistance) {

        const alpha = 1 - dist / maxDistance;

        ctx.strokeStyle = `rgba(150,180,255,${alpha * 0.3})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {

  drawBackground();
  updateParticles();
  drawConnections();
  drawParticles();

  requestAnimationFrame(animate);
}

resizeCanvas();
animate();
