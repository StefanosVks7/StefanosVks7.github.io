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

function isLightMode() {
  return document.body.classList.contains("light-mode");
}

function drawBackground() {
  const light = isLightMode();
  const gradient = ctx.createRadialGradient(
    W/2, H/2, 0,
    W/2, H/2, H
  );

  if (light) {
    // Soft radial light gradient
    gradient.addColorStop(0, "#fdfefe");
    gradient.addColorStop(1, "#f4f6f9");
  } else {
    // Original deep dark neural gradient
    gradient.addColorStop(0, "#0b0f1a");
    gradient.addColorStop(1, "#000000");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,W,H);
}

function drawParticles() {
  const light = isLightMode();
  
  // Choose high-contrast accent colors based on theme configuration
  ctx.shadowColor = light ? "rgba(60,100,200,0.3)" : "rgba(120,200,255,0.7)";
  ctx.shadowBlur = light ? 4 : 10;

  for (let p of particles) {
    ctx.fillStyle = light ? "rgba(60,100,200,0.7)" : "rgba(180,200,255,0.9)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

function drawConnections() {
  const light = isLightMode();

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < maxDistance) {
        const alpha = 1 - dist / maxDistance;

        // Connections dynamically shift from bright cyan-blue to sleek deep network links
        ctx.strokeStyle = light 
          ? `rgba(60,100,200,${alpha * 0.18})` 
          : `rgba(150,180,255,${alpha * 0.3})`;
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
