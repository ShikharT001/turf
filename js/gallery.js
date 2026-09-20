/* ═════════════════════════════════════════
   gallery.js — Canvas-based gallery scenes
═════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.gallery-canvas').forEach(canvas => {
    const scene = canvas.dataset.scene;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (scene === 'pitch') {
        // Main turf pitch — aerial view
        // Base green
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#15803d');
        grd.addColorStop(1, '#166534');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        // Stripes
        const stripeW = W / 8;
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';
          ctx.fillRect(i * stripeW, 0, stripeW, H);
        }

        // Field lines
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 2;
        // Boundary
        ctx.strokeRect(W * 0.05, H * 0.08, W * 0.9, H * 0.84);
        // Center line
        ctx.beginPath();
        ctx.moveTo(W / 2, H * 0.08);
        ctx.lineTo(W / 2, H * 0.92);
        ctx.stroke();
        // Center circle
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, Math.min(W, H) * 0.12, 0, Math.PI * 2);
        ctx.stroke();
        // Goals
        ctx.strokeRect(W * 0.05, H * 0.38, W * 0.06, H * 0.24);
        ctx.strokeRect(W * 0.89, H * 0.38, W * 0.06, H * 0.24);
        // Penalty boxes
        ctx.strokeRect(W * 0.05, H * 0.28, W * 0.16, H * 0.44);
        ctx.strokeRect(W * 0.79, H * 0.28, W * 0.16, H * 0.44);

        // Animated ball
        const bx = W / 2 + Math.sin(t * 0.8) * W * 0.25;
        const by = H / 2 + Math.cos(t * 0.6) * H * 0.2;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fill();

        // Text overlay
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('COURT A — 11-a-side', W / 2, H - 20);

      } else if (scene === 'night') {
        // Night game with floodlights
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#0c1a2e');
        sky.addColorStop(0.6, '#1a3a5c');
        sky.addColorStop(1, '#1e4d2b');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Stars
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        for (let i = 0; i < 40; i++) {
          const sx = (Math.sin(i * 137.5) * 0.5 + 0.5) * W;
          const sy = (Math.cos(i * 97.3) * 0.5 + 0.5) * H * 0.4;
          const sr = Math.sin(t + i) * 0.5 + 1;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Floodlight beams
        const lights = [[W * 0.1, H * 0.15], [W * 0.9, H * 0.15]];
        lights.forEach(([lx, ly]) => {
          const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, W * 0.6);
          grad.addColorStop(0, 'rgba(255,255,200,0.35)');
          grad.addColorStop(0.3, 'rgba(255,255,200,0.08)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);

          // Light fixture
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(lx, ly, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,200,0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(lx, ly, 12, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Ground
        const ground = ctx.createLinearGradient(0, H * 0.6, 0, H);
        ground.addColorStop(0, '#166534');
        ground.addColorStop(1, '#14532d');
        ctx.fillStyle = ground;
        ctx.fillRect(0, H * 0.6, W, H);

        // Field lines (glowing)
        ctx.shadowColor = 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 4;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(W * 0.1, H * 0.65, W * 0.8, H * 0.3);
        ctx.beginPath();
        ctx.moveTo(W / 2, H * 0.65);
        ctx.lineTo(W / 2, H * 0.95);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Running players (silhouettes)
        [0.25, 0.5, 0.75].forEach((px, i) => {
          const x = W * px + Math.sin(t + i * 2) * 20;
          const y = H * 0.78;
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.beginPath();
          ctx.ellipse(x, y, 8, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ Floodlit Arena — Play Any Hour', W / 2, 24);

      } else if (scene === 'training') {
        // Training session
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#dcfce7');
        bg.addColorStop(1, '#bbf7d0');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Turf base
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, H * 0.55, W, H);

        // Cones
        const cones = [[0.2, 0.6], [0.4, 0.7], [0.6, 0.6], [0.8, 0.65]];
        cones.forEach(([cx, cy]) => {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(W * cx, H * cy - 18);
          ctx.lineTo(W * cx - 8, H * cy);
          ctx.lineTo(W * cx + 8, H * cy);
          ctx.closePath();
          ctx.fill();
        });

        // Ball bouncing
        const ballY = H * 0.45 - Math.abs(Math.sin(t * 2)) * 60;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(W * 0.5, ballY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#14532d';
        ctx.font = 'bold 15px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Professional Coaching Sessions', W / 2, 28);

      } else if (scene === 'locker') {
        // Changing rooms
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#f8fafc');
        bg.addColorStop(1, '#e5e7eb');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Lockers
        const cols = 4, rows = 3;
        const lw = (W - 40) / cols;
        const lh = (H - 60) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = 20 + c * lw, y = 30 + r * lh;
            ctx.fillStyle = '#e5e7eb';
            ctx.fillRect(x + 2, y + 2, lw - 8, lh - 8);
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(x + 4, y + 4, lw - 12, lh - 12);
            // Handle
            ctx.fillStyle = '#9ca3af';
            ctx.beginPath();
            ctx.arc(x + lw * 0.7, y + lh * 0.5, 4, 0, Math.PI * 2);
            ctx.fill();
            // Number
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Outfit, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${r * cols + c + 1}`, x + 10, y + 20);
          }
        }
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Modern Changing Rooms', W / 2, H - 8);

      } else if (scene === 'cafe') {
        // Cafeteria
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#fef9c3');
        bg.addColorStop(1, '#fef3c7');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Counter
        ctx.fillStyle = '#92400e';
        ctx.fillRect(W * 0.1, H * 0.55, W * 0.8, H * 0.1);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(W * 0.1, H * 0.5, W * 0.8, H * 0.06);

        // Drinks
        const drinks = [
          { x: 0.25, color: '#22c55e', label: 'Fresh Juice' },
          { x: 0.5, color: '#f97316', label: 'Energy' },
          { x: 0.75, color: '#06b6d4', label: 'Water' }
        ];
        drinks.forEach(({ x, color, label }) => {
          // Cup
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(W * x - 15, H * 0.35);
          ctx.lineTo(W * x + 15, H * 0.35);
          ctx.lineTo(W * x + 10, H * 0.5);
          ctx.lineTo(W * x - 10, H * 0.5);
          ctx.closePath();
          ctx.fill();
          // Straw
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(W * x + 5, H * 0.28);
          ctx.lineTo(W * x + 5, H * 0.5);
          ctx.stroke();
          // Steam
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(W * x, H * 0.25);
          ctx.quadraticCurveTo(W * x - 8, H * 0.18, W * x, H * 0.12 + Math.sin(t * 2 + x) * 5);
          ctx.stroke();
        });

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 13px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Healthy Cafeteria & Refreshments', W / 2, H - 10);
      }

      t += 0.02;
      requestAnimationFrame(draw);
    }
    draw();
  });
});
