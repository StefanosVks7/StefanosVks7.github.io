(function () {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";

  const img = new Image();
  img.src = "icon.png";

  let width, height;
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let time = 0;

  const PARTICLE_COUNT = 350;
  const FIELD_SCALE = 0.002;

  mouse.x = window.innerWidth / 2;
  mouse.y = window.innerHeight / 2;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    initParticles();
  }

  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor(layer) {
      this.layer = layer; // depth layer
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

      const angle =
        Math.sin(this.x * FIELD_SCALE) +
        Math.cos(this.y * FIELD_SCALE);

      const speedFactor = 0.15 + this.layer * 0.1;

      this.vx += Math.cos(angle) * speedFactor;
      this.vy += Math.sin(angle) * speedFactor;

      // subtle mouse influence
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < 180) {
        this.vx += dx * 0.0002 * this.layer;
        this.vy += dy * 0.0002 * this.layer;
      }

      this.x += this.vx;
      this.y += this.vy;

      this.vx *= 0.96;
      this.vy *= 0.96;

      this.life--;

      if (
        this.x < 0 || this.x > width ||
        this.y < 0 || this.y > height ||
        this.life < 0
      ) {
        this.reset();
      }
    }

    draw() {
      const alpha = 0.2 + this.layer * 0.3;

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 5, this.y - this.vy * 5);

      ctx.strokeStyle = `rgba(120,200,255,${alpha})`;
      ctx.lineWidth = this.layer * 1.2;
      ctx.stroke();
    }
  }

  function initParticles() {
    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const layer = Math.random(); // depth
      particles.push(new Particle(layer));
    }
  }

  // 🎬 CINEMATIC FACE
  function drawFace() {
    if (!img.complete) return;

    const baseSize = Math.min(width, height) * 0.35;

    // slow breathing scale
    const scale = 1 + Math.sin(time * 0.5) * 0.03;

    const size = baseSize * scale;

    // subtle floating motion
    const offsetX = Math.sin(time * 0.3) * 10;
    const offsetY = Math.cos(time * 0.25) * 10;

    ctx.save();

    // glow pulse
    ctx.shadowColor = "rgba(0,150,255,0.4)";
    ctx.shadowBlur = 40 + Math.sin(time) * 10;

    ctx.globalAlpha = 0.1;

    ctx.drawImage(
      img,
      width / 2 - size / 2 + offsetX,
      height / 2 - size / 2 + offsetY,
      size,
      size
    );

    ctx.restore();
  }

  function animate() {
    time += 0.01;

    // smoother trails (fog feel)
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, width, height);

    drawFace();

    ctx.shadowColor = "rgba(120,200,255,0.6)";
    ctx.shadowBlur = 10;

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();

})();
