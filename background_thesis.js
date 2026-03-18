(function () {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  document.body.appendChild(canvas);

  let width, height;
  let particles = [];
  let mouse = { x: 0, y: 0 };
  let time = 0;

  const PARTICLE_COUNT = 300;
  const FIELD_SCALE = 0.002;
  const MAX_SPEED = 1.4;

  // style canvas
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";

  // initial mouse (IMPORTANT)
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

      const angle =
        Math.sin(this.x * FIELD_SCALE) +
        Math.cos(this.y * FIELD_SCALE);

      this.vx += Math.cos(angle) * 0.2;
      this.vy += Math.sin(angle) * 0.2;

      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      // vortex effect
      if (dist < 200) {
        const a = Math.atan2(dy, dx);
        this.vx += Math.cos(a + Math.PI / 2) * 0.3;
        this.vy += Math.sin(a + Math.PI / 2) * 0.3;
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > MAX_SPEED) {
        this.vx *= 0.92;
        this.vy *= 0.92;
      }

      this.x += this.vx;
      this.y += this.vy;

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
      const hue = (this.x * 0.2 + this.y * 0.2 + time * 40) % 360;

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.vx * 4, this.y - this.vy * 4);

      ctx.strokeStyle = `hsla(${hue}, 90%, 70%, 0.8)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function initParticles() {
    particles = [];

    const count = width < 600 ? 180 : PARTICLE_COUNT;

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    time += 0.01;

    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, width, height);

    ctx.shadowColor = "rgba(0,200,255,0.8)";
    ctx.shadowBlur = 12;

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
