/* ═════════════════════════════════════════
   hero3d.js — Three.js 3D scenes
═════════════════════════════════════════ */

// ── Hero background canvas (animated field lines) ──────
(function initHeroBg() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 8, 12);
  camera.lookAt(0, 0, 0);

  function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Animated grass blades as instanced meshes
  const bladeGeo = new THREE.BoxGeometry(0.04, 0.4, 0.04);
  const bladeMat = new THREE.MeshPhongMaterial({ color: 0x4ade80, transparent: true, opacity: 0.6 });
  const bladeCount = 600;
  const blades = new THREE.InstancedMesh(bladeGeo, bladeMat, bladeCount);
  const dummy = new THREE.Object3D();
  const offsets = [];
  for (let i = 0; i < bladeCount; i++) {
    const x = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 20;
    const scale = 0.5 + Math.random() * 1.2;
    offsets.push({ x, z, scale, phase: Math.random() * Math.PI * 2 });
    dummy.position.set(x, 0.2 * scale, z);
    dummy.scale.set(1, scale, 1);
    dummy.updateMatrix();
    blades.setMatrixAt(i, dummy.matrix);
  }
  blades.instanceMatrix.needsUpdate = true;
  scene.add(blades);

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(40, 30);
  const groundMat = new THREE.MeshPhongMaterial({ color: 0xbbf7d0 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  scene.add(ground);

  // Field lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x86efac, transparent: true, opacity: 0.5 });
  [-5, 0, 5].forEach(x => {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0.02, -10), new THREE.Vector3(x, 0.02, 10)
    ]);
    scene.add(new THREE.Line(lineGeo, lineMat));
  });

  // Circle at center
  const circlePoints = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    circlePoints.push(new THREE.Vector3(Math.cos(a) * 3, 0.02, Math.sin(a) * 3));
  }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePoints), lineMat));

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;
    offsets.forEach((o, i) => {
      const sway = Math.sin(t + o.phase) * 0.08;
      dummy.position.set(o.x, 0.2 * o.scale, o.z);
      dummy.scale.set(1, o.scale, 1);
      dummy.rotation.z = sway;
      dummy.updateMatrix();
      blades.setMatrixAt(i, dummy.matrix);
    });
    blades.instanceMatrix.needsUpdate = true;
    camera.position.x = Math.sin(t * 0.1) * 2;
    renderer.render(scene, camera);
  }
  animate();
})();

// ── Turf hero card canvas ──────────────────────────────
(function initTurfCard() {
  const canvas = document.getElementById('turf-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(380, 220);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 380 / 220, 0.1, 100);
  camera.position.set(0, 6, 8);
  camera.lookAt(0, 0, 0);

  // Turf field
  const fieldGeo = new THREE.PlaneGeometry(12, 8);
  const fieldMat = new THREE.MeshPhongMaterial({ color: 0x22c55e });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.rotation.x = -Math.PI / 2;
  scene.add(field);

  // Field stripes (alternating)
  for (let i = 0; i < 6; i++) {
    const stripGeo = new THREE.PlaneGeometry(1.8, 8);
    const stripMat = new THREE.MeshPhongMaterial({ color: i % 2 === 0 ? 0x16a34a : 0x22c55e });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(-4.5 + i * 1.8, 0.001, 0);
    scene.add(strip);
  }

  // White lines
  const wMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // Center line
  const clGeo = new THREE.PlaneGeometry(0.06, 8);
  const cl = new THREE.Mesh(clGeo, wMat);
  cl.rotation.x = -Math.PI / 2;
  cl.position.set(0, 0.003, 0);
  scene.add(cl);

  // Boundary
  [[0,-4,12,0.06],[0,4,12,0.06],[-6,0,0.06,8],[6,0,0.06,8]].forEach(([x,z,w,h]) => {
    const g = new THREE.PlaneGeometry(w, h);
    const m = new THREE.Mesh(g, wMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, 0.003, z);
    scene.add(m);
  });

  // Center circle
  const circlePts = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    circlePts.push(new THREE.Vector3(Math.cos(a) * 1.5, 0.003, Math.sin(a) * 1.5));
  }
  const circleGeo = new THREE.BufferGeometry().setFromPoints(circlePts);
  const circleL = new THREE.Line(circleGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));
  scene.add(circleL);

  // Goalposts
  [-5.8, 5.8].forEach(x => {
    const postMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    [-0.6, 0.6].forEach(z => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1), postMat);
      post.position.set(x, 0.5, z);
      scene.add(post);
    });
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), postMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.set(x, 1, 0);
    scene.add(crossbar);
  });

  // Football
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 })
  );
  ball.position.set(0, 0.25, 0);
  scene.add(ball);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const dLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dLight.position.set(3, 8, 5);
  scene.add(dLight);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.015;
    ball.position.x = Math.sin(t) * 2;
    ball.position.z = Math.cos(t * 0.7) * 1.5;
    ball.rotation.y += 0.05;
    camera.position.x = Math.sin(t * 0.3) * 1.5;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();

// ── About section 3D grass canvas ──────────────────────
(function initAboutCanvas() {
  const canvas = document.getElementById('about-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const w = canvas.parentElement.clientWidth;
  const h = 420;
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
  camera.position.set(0, 5, 8);
  camera.lookAt(0, 0, 0);

  // Create layered turf
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 16),
    new THREE.MeshPhongMaterial({ color: 0x16a34a })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Stripes
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 16),
      new THREE.MeshPhongMaterial({ color: i % 2 ? 0x22c55e : 0x15803d })
    );
    s.rotation.x = -Math.PI / 2;
    s.position.set(-8.4 + i * 2.4, 0.001, 0);
    scene.add(s);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const dl = new THREE.DirectionalLight(0xfdffd0, 0.8);
  dl.position.set(4, 10, 6);
  scene.add(dl);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.006;
    camera.position.x = Math.sin(t * 0.5) * 2;
    camera.position.y = 5 + Math.sin(t * 0.3) * 0.5;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();
})();

// ── Facilities background particles ────────────────────
(function initFacilitiesBg() {
  const canvas = document.querySelector('#facilities-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163, 230, 53, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(163,230,53,${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Sport Mini Canvases (2D) ────────────────────────────
(function initSportIcons() {
  document.querySelectorAll('.sport-mini-canvas').forEach(canvas => {
    const type = canvas.dataset.type;
    const ctx = canvas.getContext('2d');
    canvas.width = 64; canvas.height = 64;

    function draw(t) {
      ctx.clearRect(0, 0, 64, 64);
      const cx = 32, cy = 32;

      if (type === 'ball') {
        // Spinning football
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t);
        const grad = ctx.createRadialGradient(-6, -6, 2, 0, 0, 22);
        grad.addColorStop(0, '#4ade80');
        grad.addColorStop(1, '#16a34a');
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        // Pentagon-ish lines
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * 18, Math.sin(a) * 18);
          ctx.stroke();
        }
        ctx.restore();
      } else if (type === 'cricket') {
        // Cricket ball
        ctx.save();
        ctx.translate(cx, cy);
        const g = ctx.createRadialGradient(-5, -5, 2, 0, 0, 20);
        g.addColorStop(0, '#86efac');
        g.addColorStop(1, '#22c55e');
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 20, Math.PI - Math.PI / 4, Math.PI + Math.PI / 4);
        ctx.stroke();
        ctx.restore();
      } else if (type === 'multi') {
        // Multi-sport grid
        const colors = ['#22c55e', '#4ade80', '#84cc16', '#a3e635'];
        [[0,0],[1,0],[0,1],[1,1]].forEach(([col, row], i) => {
          ctx.fillStyle = colors[i];
          ctx.beginPath();
          ctx.roundRect(8 + col * 26, 8 + row * 26, 22, 22, 4);
          ctx.fill();
        });
      } else if (type === 'training') {
        // Dumbbell icon
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * 2) * 0.2);
        ctx.fillStyle = '#22c55e';
        // Handle
        ctx.fillRect(-16, -3, 32, 6);
        // Weights
        [[-16, -10], [10, -10]].forEach(([x, y]) => {
          ctx.beginPath();
          ctx.roundRect(x, y, 6, 20, 3);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    let t = 0;
    function loop() {
      t += 0.03;
      draw(t);
      requestAnimationFrame(loop);
    }
    loop();
  });
})();
