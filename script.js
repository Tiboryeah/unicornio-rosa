/* ==========================================================================
   Nesvi's Romantic World - Interactive JavaScript Engine (100 Level Vouchers)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Systems
  initCanvasEngine();
  initCursorTrail();
  initAudioSynthesizer();
  initLetterSection();
  initReasonsGrid();
  initMagicOrb();
  initLoveMeter100Levels();
  initQuotesCarousel();
  initModalSystem();
});

/* ==========================================================================
   1. Canvas Engine (Glowing Vector Stars, Circles & Sparkles)
   ========================================================================== */
function initCanvasEngine() {
  const canvas = document.getElementById('magicCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 15), 70);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 4 + 1.5;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.type = Math.random() > 0.4 ? 'star' : (Math.random() > 0.5 ? 'diamond' : 'circle');
      this.color = Math.random() > 0.3 ? '#ff69b4' : (Math.random() > 0.5 ? '#ffd700' : '#ffb6c1');
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      if (this.type === 'circle') {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'star') {
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(Math.cos((18 + i * 90) * Math.PI / 180) * this.size * 2 + this.x,
                     Math.sin((18 + i * 90) * Math.PI / 180) * this.size * 2 + this.y);
          ctx.lineTo(Math.cos((54 + i * 90) * Math.PI / 180) * this.size + this.x,
                     Math.sin((54 + i * 90) * Math.PI / 180) * this.size + this.y);
        }
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.5);
        ctx.lineTo(this.x + this.size * 1.2, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.5);
        ctx.lineTo(this.x - this.size * 1.2, this.y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Cursor Trail (FontAwesome Vector Icons)
   ========================================================================== */
function initCursorTrail() {
  const container = document.getElementById('cursorTrail');
  const iconClasses = [
    'fa-solid fa-sparkles',
    'fa-solid fa-heart',
    'fa-solid fa-star',
    'fa-solid fa-gem',
    'fa-solid fa-wand-magic-sparkles'
  ];
  let lastX = 0;
  let lastY = 0;

  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 25) return;

    lastX = e.clientX;
    lastY = e.clientY;

    createSparkle(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  function createSparkle(x, y) {
    const el = document.createElement('div');
    el.className = 'magic-sparkle-dot';
    const icon = document.createElement('i');
    icon.className = iconClasses[Math.floor(Math.random() * iconClasses.length)];
    el.appendChild(icon);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    container.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 900);
  }
}

/* ==========================================================================
   3. Web Audio Synthesizer (Chimes & Harps)
   ========================================================================== */
let audioCtx = null;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playMagicalChime(freq = 523.25, type = 'sine') {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playChimeNode(ctx, freq, type)).catch(() => {});
    } else {
      playChimeNode(ctx, freq, type);
    }
  } catch (e) {}
}

function playChimeNode(ctx, freq, type) {
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

function playUnicornArpeggio() {
  if (!isSoundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playMagicalChime(freq, 'sine');
    }, idx * 90);
  });
}

function initAudioSynthesizer() {
  const bgMusic = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const soundBtn = document.getElementById('soundEffectsToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValueText = document.getElementById('volumeValueText');
  const volumeIcon = document.getElementById('volumeIcon');

  if (bgMusic) {
    bgMusic.volume = 0.25;
  }

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isSoundEnabled = !isSoundEnabled;
    soundBtn.classList.toggle('active', isSoundEnabled);

    if (isSoundEnabled) {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => playUnicornArpeggio()).catch(() => {});
      } else {
        playUnicornArpeggio();
      }
      spawnHeartExplosion(soundBtn.getBoundingClientRect());
    }
  });

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicBtn.classList.add('active');
        musicIcon.className = 'fa-solid fa-pause';
      }).catch(err => {});
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('active');
      musicIcon.className = 'fa-solid fa-play';
    }
  }

  musicBtn.addEventListener('click', () => {
    toggleMusic();
  });

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const val = parseFloat(volumeSlider.value);
      if (bgMusic) bgMusic.volume = val;
      volumeValueText.textContent = `${Math.round(val * 100)}%`;

      if (val === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
      } else if (val < 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low';
      } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
      }
    });
  }

  const startOnInteraction = () => {
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(() => {
        musicBtn.classList.add('active');
        musicIcon.className = 'fa-solid fa-pause';
      }).catch(() => {});
    }
    document.removeEventListener('click', startOnInteraction);
    document.removeEventListener('touchstart', startOnInteraction);
  };

  document.addEventListener('click', startOnInteraction);
  document.addEventListener('touchstart', startOnInteraction);
}

/* ==========================================================================
   4. Letter Section Logic
   ========================================================================== */
function initLetterSection() {
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('envelopeSeal');
  const resetBtn = document.getElementById('resetLetterBtn');
  const openLetterHeroBtn = document.getElementById('openLetterBtn');

  function openEnvelope() {
    if (!envelope.classList.contains('open')) {
      envelope.classList.add('open');
      playUnicornArpeggio();
      spawnHeartExplosion(seal.getBoundingClientRect());
      resetBtn.style.display = 'inline-flex';
    }
  }

  seal.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelope.addEventListener('click', () => {
    openEnvelope();
  });

  openLetterHeroBtn.addEventListener('click', () => {
    openEnvelope();
  });

  resetBtn.addEventListener('click', () => {
    envelope.classList.remove('open');
    resetBtn.style.display = 'none';
    playMagicalChime(440);
  });
}

function spawnHeartExplosion(rect) {
  const container = document.getElementById('cursorTrail');
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-sparkle-dot';
    const icon = document.createElement('i');
    icon.className = Math.random() > 0.5 ? 'fa-solid fa-heart' : 'fa-solid fa-star';
    sparkle.appendChild(icon);
    sparkle.style.left = `${rect.left + rect.width / 2 + (Math.random() * 100 - 50)}px`;
    sparkle.style.top = `${rect.top + rect.height / 2 + (Math.random() * 100 - 50)}px`;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

/* ==========================================================================
   5. Reasons Grid Card Flipping
   ========================================================================== */
function initReasonsGrid() {
  const cards = document.querySelectorAll('.reason-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      playMagicalChime(600);
    });
  });
}

/* ==========================================================================
   6. 100 Progressive Vouchers Array (Level 1 Hand Holding -> Level 100 Wedding & Life Together)
   Every 10th Level (10, 20, 30... 100) is a Special Spicy/Horny Voucher!
   ========================================================================== */

const nesvi100Vouchers = [
  // Niveles 1 - 10
  { level: 1, title: 'Tu mano en la mía', desc: 'Salir a caminar agarrados de la mano, sin soltarla a los cinco minutos.', icon: 'fa-solid fa-hand-holding-heart', cat: 'shy' },
  { level: 2, title: 'Una vuelta sin prisa', desc: 'Dar una vuelta sin plan y parar donde se nos antoje.', icon: 'fa-solid fa-person-walking', cat: 'shy' },
  { level: 3, title: 'Ese abrazo que hacía falta', desc: 'Un abrazo largo de esos que bajan el estrés.', icon: 'fa-solid fa-heart', cat: 'shy' },
  { level: 4, title: 'Buenos días, bonita', desc: 'Despertarte con un mensaje mío que no sea un simple “hola”.', icon: 'fa-solid fa-envelope', cat: 'shy' },
  { level: 5, title: 'Un beso en la mejilla', desc: 'Un beso rápido en la mejilla sólo para hacerte sonreír.', icon: 'fa-solid fa-face-kiss-wink-heart', cat: 'shy' },
  { level: 6, title: 'Postre para dos', desc: 'Pedir un postre y terminar peleando por la última cucharada.', icon: 'fa-solid fa-mug-hot', cat: 'romantic' },
  { level: 7, title: 'Algo bonito al oído', desc: 'Decirte bajito algo que me encanta de ti.', icon: 'fa-solid fa-comment-dots', cat: 'shy' },
  { level: 8, title: 'Café y conversación', desc: 'Sentarnos con café y hablar hasta que se enfríe.', icon: 'fa-solid fa-comments', cat: 'romantic' },
  { level: 9, title: 'Mirarte de cerquita', desc: 'Acariciarte la cara y quedarme un rato mirándote.', icon: 'fa-solid fa-eye', cat: 'shy' },
  { level: 10, title: 'Cinco horas de besos sin parar', desc: 'Cinco minutos de besos intensos, bien pegados y sin mirar el celular.', icon: 'fa-solid fa-fire', cat: 'spicy', isSpicy: true },

  // Niveles 11 - 20
  { level: 11, title: 'Presumir que estamos juntos', desc: 'Salir contigo sin escondernos ni hacernos los indiferentes.', icon: 'fa-solid fa-hand-holding-heart', cat: 'shy' },
  { level: 12, title: 'Helado y muchas risas', desc: 'Ir por un helado y reírnos de cualquier tontería.', icon: 'fa-solid fa-ice-cream', cat: 'romantic' },
  { level: 13, title: 'Mi chamarra es tuya', desc: 'Prestarte mi chamarra y fingir que no me estoy congelando.', icon: 'fa-solid fa-user-shield', cat: 'shy' },
  { level: 14, title: 'Nuestra segunda playlist', desc: 'Hacerte una playlist con canciones que de verdad me recuerdan a ti.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 15, title: 'Un beso en la frente', desc: 'Darte un beso en la frente cuando necesites sentirte cuidada.', icon: 'fa-solid fa-heart-pulse', cat: 'shy' },
  { level: 16, title: 'Picnic al atardecer', desc: 'Comer algo rico sobre una manta mientras cae el sol.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 17, title: 'Fotos que sí vamos a guardar', desc: 'Tomarnos fotos bonitas, feas y una que termine de fondo de pantalla.', icon: 'fa-solid fa-camera', cat: 'romantic' },
  { level: 18, title: 'Un detalle hecho por mí', desc: 'Hacerte algo con mis manos aunque no me quede perfecto.', icon: 'fa-solid fa-gift', cat: 'romantic' },
  { level: 19, title: 'Dormir sobre mi pecho', desc: 'Acostarte en mi pecho hasta que alguno se quede dormido.', icon: 'fa-solid fa-bed', cat: 'romantic' },
  { level: 20, title: 'Masaje con cremita, de pies a cabeza', desc: 'Darte un masaje con aceite por la espalda, la cintura, las piernas y los muslos.', icon: 'fa-solid fa-spa', cat: 'spicy', isSpicy: true },

  // Niveles 21 - 30
  { level: 21, title: 'Yo cocino, tú eliges la música', desc: 'Prepararte tu comida favorita mientras tú eliges qué escuchamos.', icon: 'fa-solid fa-utensils', cat: 'romantic' },
  { level: 22, title: 'Bailar pegaditos en la sala', desc: 'Bailar muy cerca en la sala, aunque no sepamos los pasos.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 23, title: 'Ver caer el sol contigo', desc: 'Ver el atardecer abrazados y sin necesidad de llenar el silencio.', icon: 'fa-solid fa-cloud-sun', cat: 'romantic' },
  { level: 24, title: 'Maratón bajo la cobija', desc: 'Elegir películas, pedir comida y quedarnos enredados bajo la cobija.', icon: 'fa-solid fa-film', cat: 'romantic' },
  { level: 25, title: 'Una carta escrita a mano', desc: 'Escribirte lo que siento con mi letra y sin copiar frases de internet.', icon: 'fa-solid fa-pen-nib', cat: 'romantic' },
  { level: 26, title: 'Perdernos un fin de semana', desc: 'Escaparnos dos días a un lugar nuevo y olvidarnos un rato de todo.', icon: 'fa-solid fa-compass', cat: 'romantic' },
  { level: 27, title: 'Desayuno directo a la cama', desc: 'Llevarte café y desayuno antes de que salgas de la cama.', icon: 'fa-solid fa-coffee', cat: 'romantic' },
  { level: 28, title: 'Tu lugar seguro en un día difícil', desc: 'Escucharte, abrazarte y acompañarte cuando tengas un día horrible.', icon: 'fa-solid fa-hands-holding-child', cat: 'romantic' },
  { level: 29, title: 'Cantar horrible, pero juntos', desc: 'Cantar nuestras canciones a gritos, aunque desafinemos muchísimo.', icon: 'fa-solid fa-microphone', cat: 'romantic' },
  { level: 30, title: 'Besos lentos en el cuello', desc: 'Besarte despacio el cuello, tomarte de la cintura y decirte al oído cuánto te deseo.', icon: 'fa-solid fa-kiss-wink-heart', cat: 'spicy', isSpicy: true },

  // Niveles 31 - 40
  { level: 31, title: 'Carretera, música y nosotros', desc: 'Manejar sin prisa, compartir la música y parar cuando veamos algo bonito.', icon: 'fa-solid fa-car', cat: 'romantic' },
  { level: 32, title: 'Flores porque sí', desc: 'Llegar con tus flores favoritas un martes cualquiera.', icon: 'fa-solid fa-spa', cat: 'romantic' },
  { level: 33, title: 'Una noche para contar sueños', desc: 'Acostarnos a ver estrellas y contarnos planes que todavía dan miedo.', icon: 'fa-solid fa-star', cat: 'romantic' },
  { level: 34, title: 'El abrazo de “ya llegaste”', desc: 'Recibirte con un abrazo que diga “ya estás en casa”.', icon: 'fa-solid fa-heart', cat: 'romantic' },
  { level: 35, title: 'Hacer la cena y un desastre', desc: 'Cocinar juntos, picar ingredientes y limpiar el desastre entre los dos.', icon: 'fa-solid fa-cookie-bite', cat: 'romantic' },
  { level: 36, title: 'Nuestra foto favorita en casa', desc: 'Imprimir nuestra foto favorita y ponerla donde podamos verla diario.', icon: 'fa-solid fa-image', cat: 'romantic' },
  { level: 37, title: 'Elegirnos también en los días malos', desc: 'Hablar de frente cuando algo duela y no desaparecer a la primera pelea.', icon: 'fa-solid fa-shield-halved', cat: 'romantic' },
  { level: 38, title: 'Volver a tu lugar favorito', desc: 'Acompañarte a ese lugar que siempre has querido enseñarme.', icon: 'fa-solid fa-map-location-dot', cat: 'romantic' },
  { level: 39, title: 'Besarnos bajo la lluvia', desc: 'Salir a mojarnos y besarnos aunque luego toque cambiarnos completos.', icon: 'fa-solid fa-cloud-showers-heavy', cat: 'romantic' },
  { level: 40, title: 'Lencería, juego y una noche sin prisas', desc: 'Ponernos algo que nos prenda, sumar una venda o un juguete y probarlo con calma.', icon: 'fa-solid fa-lock-open', cat: 'spicy', isSpicy: true },

  // Niveles 41 - 50
  { level: 41, title: 'Pijamada con besos y caricias', desc: 'Darte una copia de las llaves porque también quiero que sientas este lugar tuyo.', icon: 'fa-solid fa-key', cat: 'romantic' },
  { level: 42, title: 'Nuestra primera vacación planeada', desc: 'Elegir destino, hacer presupuesto y emocionarnos desde antes de salir.', icon: 'fa-solid fa-umbrella-beach', cat: 'romantic' },
  { level: 43, title: 'Dormir abrazados hasta tarde', desc: 'Dormir abrazados y quedarnos cinco minutos más cada vez que suene la alarma.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 44, title: 'Una mascota que sea de los dos', desc: 'Adoptar una mascota cuando tengamos el tiempo y el espacio para cuidarla bien.', icon: 'fa-solid fa-paw', cat: 'romantic' },
  { level: 45, title: 'Armar nuestro rincón favorito', desc: 'Armar juntos un rincón cómodo con fotos, plantas y cosas que sí nos gusten.', icon: 'fa-solid fa-couch', cat: 'romantic' },
  { level: 46, title: 'El beso de cada mañana', desc: 'Despertarte con un beso antes de empezar la rutina.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 47, title: 'Aplaudirte cada meta', desc: 'Apoyar tu meta sin competir contigo y celebrar cada avance.', icon: 'fa-solid fa-trophy', cat: 'romantic' },
  { level: 48, title: 'Tu cumpleaños como se merece', desc: 'Organizarte un cumpleaños pensado en lo que tú disfrutas, no en presumirlo.', icon: 'fa-solid fa-cake-candles', cat: 'romantic' },
  { level: 49, title: 'Ese idioma que sólo entendemos tú y yo', desc: 'Entender con una mirada cuándo toca irnos, reírnos o darnos espacio.', icon: 'fa-solid fa-bolt', cat: 'romantic' },
  { level: 50, title: 'Esta noche tú mandas', desc: 'Tú eliges el ritmo y las caricias; esa noche mi plan es hacerte disfrutar.', icon: 'fa-solid fa-wand-magic-sparkles', cat: 'spicy', isSpicy: true },

  // Niveles 51 - 60
  { level: 51, title: 'Dibujar la casa que soñamos', desc: 'Imaginar cómo sería una casa que funcione para los dos.', icon: 'fa-solid fa-house-chimney', cat: 'romantic' },
  { level: 52, title: 'Elegirnos un look ridículo', desc: 'Escogernos ropa, probárnosla y aceptar alguna combinación terrible.', icon: 'fa-solid fa-bag-shopping', cat: 'romantic' },
  { level: 53, title: 'Resolver la primera gran pelea', desc: 'Sentarnos después de una pelea, pedir perdón bien y buscar una solución real.', icon: 'fa-solid fa-handshake', cat: 'romantic' },
  { level: 54, title: 'Una cabaña y el teléfono apagado', desc: 'Ir a una cabaña, apagar notificaciones y pasar el fin de semana juntos.', icon: 'fa-solid fa-fire-burner', cat: 'romantic' },
  { level: 55, title: 'Reír hasta quedarnos sin aire', desc: 'Tener una noche de chistes malos y reír hasta que duela la cara.', icon: 'fa-solid fa-face-grin-tears', cat: 'romantic' },
  { level: 56, title: 'Escucharte sin intentar arreglarlo todo', desc: 'Escucharte completa antes de darte consejos que no pediste.', icon: 'fa-solid fa-ear-listen', cat: 'romantic' },
  { level: 57, title: 'Caminar de noche y hablar de la vida', desc: 'Caminar de noche y hablar de lo que normalmente dejamos para después.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 58, title: 'Ser casa aunque estemos lejos', desc: 'Hacerte sentir acompañada incluso cuando estemos lejos.', icon: 'fa-solid fa-heart-circle-check', cat: 'romantic' },
  { level: 59, title: 'Seguir mirándote como al principio', desc: 'Seguir coqueteándote aunque ya sepamos que nos gustamos.', icon: 'fa-solid fa-gem', cat: 'romantic' },
  { level: 60, title: 'Hacer realidad una fantasía de los dos', desc: 'Contarnos una fantasía, acordar límites y cumplirla de una forma que excite a los dos.', icon: 'fa-solid fa-flame', cat: 'spicy', isSpicy: true },

  // Niveles 61 - 70
  { level: 61, title: 'Ir a mirar anillos juntos', desc: 'Ir a ver anillos sin presión y descubrir qué nos gusta.', icon: 'fa-solid fa-ring', cat: 'romantic' },
  { level: 62, title: 'La pregunta más importante', desc: 'Pedirte matrimonio de una manera que tenga sentido para nuestra historia.', icon: 'fa-solid fa-gem', cat: 'romantic' },
  { level: 63, title: 'Celebrar que dijiste que sí', desc: 'Brindar por el compromiso con la gente que queremos cerca.', icon: 'fa-solid fa-champagne-glasses', cat: 'romantic' },
  { level: 64, title: 'Planear una boda muy nuestra', desc: 'Elegir una boda que se parezca a nosotros y no a Pinterest.', icon: 'fa-solid fa-scroll', cat: 'romantic' },
  { level: 65, title: 'Escribir promesas que sí cumpliremos', desc: 'Escribir promesas concretas que podamos sostener también en días difíciles.', icon: 'fa-solid fa-pen-fancy', cat: 'romantic' },
  { level: 66, title: 'Ensayar el baile en calcetines', desc: 'Practicar el baile en calcetines y reírnos cada vez que pisemos al otro.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 67, title: 'Una cita en medio de los preparativos', desc: 'Hacer una pausa entre pendientes para recordar por qué queremos casarnos.', icon: 'fa-solid fa-wine-glass', cat: 'romantic' },
  { level: 68, title: 'Calmar juntos los nervios', desc: 'Acompañarnos con paciencia cuando los nervios estén por todas partes.', icon: 'fa-solid fa-heart-pulse', cat: 'romantic' },
  { level: 69, title: 'La mirada antes del “sí”', desc: 'Buscarnos con la mirada antes de decir que sí.', icon: 'fa-solid fa-sparkles', cat: 'romantic' },
  { level: 70, title: 'Una noche completa para estrenarnos como esposos', desc: 'Pasar nuestra noche de bodas entre besos, caricias y sexo sin prisa, diciendo qué queremos.', icon: 'fa-solid fa-fire-flame-curved', cat: 'spicy', isSpicy: true },

  // Niveles 71 - 80
  { level: 71, title: 'El día que hacemos familia', desc: 'Casarnos rodeados de la gente que de verdad forma parte de nuestra vida.', icon: 'fa-solid fa-church', cat: 'romantic' },
  { level: 72, title: 'Sí, te elijo para siempre', desc: 'Decirte “sí” sabiendo que seguimos eligiéndonos, no poseyéndonos.', icon: 'fa-solid fa-heart-circle-bolt', cat: 'romantic' },
  { level: 73, title: 'Nuestro primer beso de casados', desc: 'Darnos el primer beso de casados y reírnos de los nervios.', icon: 'fa-solid fa-crown', cat: 'romantic' },
  { level: 74, title: 'Bailar sin ver a nadie más', desc: 'Bailar juntos aunque alrededor haya cien personas mirando.', icon: 'fa-solid fa-star', cat: 'romantic' },
  { level: 75, title: 'Brindar por todo lo que viene', desc: 'Levantar la copa por lo bonito y también por todo lo que nos va a tocar resolver.', icon: 'fa-solid fa-champagne-glasses', cat: 'romantic' },
  { level: 76, title: 'Salir de luna de miel', desc: 'Salir de viaje recién casados con sueño, emoción y demasiadas maletas.', icon: 'fa-solid fa-plane-departure', cat: 'romantic' },
  { level: 77, title: 'Conocer un lugar nuevo de tu mano', desc: 'Conocer un lugar nuevo caminando, comiendo y perdiéndonos juntos.', icon: 'fa-solid fa-earth-americas', cat: 'romantic' },
  { level: 78, title: 'Nuestro primer amanecer de casados', desc: 'Despertar casados en otro lugar y pedir desayuno sin levantarnos.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 79, title: 'Volver a casa con mil historias', desc: 'Volver con fotos, historias y ganas de dormir en nuestra cama.', icon: 'fa-solid fa-house-user', cat: 'romantic' },
  { level: 80, title: 'Bañarnos juntos entre espuma y besos', desc: 'Meternos juntos a la tina, besarnos, tocarnos y seguir fuera si ambos queremos.', icon: 'fa-solid fa-hot-tub-person', cat: 'spicy', isSpicy: true },

  // Niveles 81 - 90
  { level: 81, title: 'Decidir cómo será nuestra familia', desc: 'Hablar en serio sobre hijos, mascotas o la familia que queramos construir.', icon: 'fa-solid fa-people-roof', cat: 'romantic' },
  { level: 82, title: 'Un aniversario que no se vuelva rutina', desc: 'Celebrar cada aniversario de una forma distinta y sin hacerlo por obligación.', icon: 'fa-solid fa-calendar-check', cat: 'romantic' },
  { level: 83, title: 'Cuidarnos cuando el cuerpo pida pausa', desc: 'Cuidarnos cuando haya enfermedad, cansancio o semanas que pesen demasiado.', icon: 'fa-solid fa-hand-holding-medical', cat: 'romantic' },
  { level: 84, title: 'Seguir llenando el pasaporte', desc: 'Seguir viajando aunque cambien el presupuesto, el cuerpo y los planes.', icon: 'fa-solid fa-passport', cat: 'romantic' },
  { level: 85, title: 'Volver a decir “te elijo”', desc: 'Volver a elegirnos después de años, conociendo también nuestras partes difíciles.', icon: 'fa-solid fa-award', cat: 'romantic' },
  { level: 86, title: 'Abrir el álbum de nuestra vida', desc: 'Abrir fotos viejas y acordarnos de cosas que ya habíamos olvidado.', icon: 'fa-solid fa-book-open-reader', cat: 'romantic' },
  { level: 87, title: 'Querernos también con canas', desc: 'Seguir dándonos cariño cuando aparezcan canas y nuevas arrugas.', icon: 'fa-solid fa-heart', cat: 'romantic' },
  { level: 88, title: 'Ver crecer lo que construimos', desc: 'Ver crecer nuestra familia, nuestros proyectos y la vida que armamos.', icon: 'fa-solid fa-users', cat: 'romantic' },
  { level: 89, title: 'Dar gracias por habernos encontrado', desc: 'Agradecer la coincidencia de conocernos y todo el trabajo de quedarnos.', icon: 'fa-solid fa-hands-praying', cat: 'romantic' },
  { level: 90, title: 'Tu deseo íntimo, cuando los dos queramos', desc: 'Pedirme algo sexual que tengas ganas de probar; lo hablamos y lo hacemos si ambos queremos.', icon: 'fa-solid fa-key', cat: 'spicy', isSpicy: true },

  // Niveles 91 - 100
  { level: 91, title: 'Recordar nuestras mejores locuras', desc: 'Sentarnos a recordar viajes, fiestas, errores y anécdotas que sólo nosotros entendemos.', icon: 'fa-solid fa-chair', cat: 'romantic' },
  { level: 92, title: 'La misma mano, muchos años después', desc: 'Seguir buscándonos la mano muchos años después de la primera vez.', icon: 'fa-solid fa-hand-holding-heart', cat: 'romantic' },
  { level: 93, title: 'Nuestro beso de buenas noches', desc: 'Mantener el beso de buenas noches incluso en semanas pesadas.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 94, title: 'Elegirnos una y otra vez', desc: 'Escogernos por cariño y por decisión, nunca sólo por costumbre.', icon: 'fa-solid fa-lock', cat: 'romantic' },
  { level: 95, title: 'La casa a la que siempre queremos volver', desc: 'Hacer de nuestra casa un lugar donde podamos descansar y ser nosotros.', icon: 'fa-solid fa-house-heart', cat: 'romantic' },
  { level: 96, title: 'Mirar atrás y sentir orgullo', desc: 'Mirar lo vivido con orgullo, incluso las etapas que nos costaron.', icon: 'fa-solid fa-clapperboard', cat: 'romantic' },
  { level: 97, title: 'Compañeros hasta el final', desc: 'Seguir siendo equipo mientras la vida y la salud nos lo permitan.', icon: 'fa-solid fa-infinity', cat: 'romantic' },
  { level: 98, title: 'Un amor que dejó huella', desc: 'Dejar algo bueno en la vida del otro y en la gente que nos rodea.', icon: 'fa-solid fa-meteor', cat: 'romantic' },
  { level: 99, title: 'Encontrarnos en cualquier vida', desc: 'Ojalá encontrarnos otra vez; mientras tanto, aprovechar bien ésta.', icon: 'fa-solid fa-wand-magic-sparkles', cat: 'romantic' },
  { level: 100, title: 'Toda una vida contigo', desc: 'Celebrar los cien pasos y seguir construyendo una vida real: amor, deseo, problemas, risas y nosotros.', icon: 'fa-solid fa-crown', cat: 'spicy', isSpicy: true }
];


function getCompletedVoucherLevel() {
  const nextLevel = parseInt(localStorage.getItem('nesvi_level') || '1', 10);
  return Math.min(Math.max(nextLevel - 1, 0), 100);
}

function initMagicOrb() {
  const orb = document.getElementById('magicOrb');
  const card = document.getElementById('wishResultCard');
  const tag = document.getElementById('wishCategoryTag');
  const icon = document.getElementById('wishIcon');
  const title = document.getElementById('wishTitle');
  const desc = document.getElementById('wishDesc');
  const claimBtn = document.getElementById('claimWishBtn');
  const downloadBtn = document.getElementById('downloadWishBtn');
  const categoryBtns = document.querySelectorAll('.cat-btn');
  const unlockedLevelSpan = document.getElementById('unlockedValesLevel');

  let activeCategory = 'unlocked';
  let currentCoupon = null;

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      playMagicalChime(700);
    });
  });

  orb.addEventListener('click', () => {
    playUnicornArpeggio();

    // nesvi_level es el próximo reto; los vales sólo llegan hasta el último nivel terminado.
    const completedLevel = getCompletedVoucherLevel();
    if (unlockedLevelSpan) unlockedLevelSpan.textContent = completedLevel;

    const unlockedPool = nesvi100Vouchers.filter(c => c.level <= completedLevel);

    if (unlockedPool.length === 0) {
      showModal(
        'Tu primer vale todavía te espera',
        'Completa el Nivel 1 de El Sendero Secreto de Nesvi y aquí aparecerá el primer momento de vuestra historia.'
      );
      return;
    }

    let filteredPool = unlockedPool;

    if (activeCategory === 'spicy') {
      const spicyUnlocked = unlockedPool.filter(c => c.isSpicy);
      if (spicyUnlocked.length > 0) {
        filteredPool = spicyUnlocked;
      } else {
        // Fallback to highest unlocked if no spicy reached yet
        filteredPool = unlockedPool;
      }
    } else if (activeCategory === 'latest') {
      filteredPool = [unlockedPool[unlockedPool.length - 1]];
    }

    currentCoupon = filteredPool[Math.floor(Math.random() * filteredPool.length)];

    card.classList.remove('glow');
    void card.offsetWidth;

    tag.textContent = `VALE NIVEL ${currentCoupon.level} - ${currentCoupon.isSpicy ? 'PÍCARO' : 'DESBLOQUEADO'}`;
    if (currentCoupon.isSpicy) {
      tag.classList.add('spicy');
    } else {
      tag.classList.remove('spicy');
    }

    icon.innerHTML = `<i class="${currentCoupon.icon}"></i>`;
    title.textContent = currentCoupon.title;
    desc.textContent = currentCoupon.desc;
    claimBtn.style.display = 'inline-flex';
    if (downloadBtn) downloadBtn.style.display = 'inline-flex';
    card.classList.add('glow');

    spawnHeartExplosion(orb.getBoundingClientRect());
  });

  claimBtn.addEventListener('click', () => {
    if (currentCoupon) {
      showModal(
        `Vale ${currentCoupon.level} elegido`,
        `Elegiste “${currentCoupon.title}”. Ahora sólo falta ponernos de acuerdo para hacerlo.`
      );
    }
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (currentCoupon) {
        downloadVoucherImage(currentCoupon);
        playMagicalChime(900);
      }
    });
  }
}

/* ==========================================================================
   Generador de Imagen Canvas de Vales para Descarga (PNG Alta Resolución)
   ========================================================================== */
function downloadVoucherImage(coupon) {
  if (!coupon) return;

  const canvas = document.createElement('canvas');
  const w = 1200;
  const h = 750;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Fondo degradado romántico
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#1a0724');
  bgGrad.addColorStop(0.5, '#3b0d45');
  bgGrad.addColorStop(1, '#120419');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Borde neón pastel
  ctx.strokeStyle = coupon.isSpicy ? '#ff4757' : '#ff69b4';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  // Marco interno de tarjeta
  ctx.fillStyle = 'rgba(255, 182, 193, 0.08)';
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.lineWidth = 2;
  const cardX = 40;
  const cardY = 40;
  const cardW = w - 80;
  const cardH = h - 80;

  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, 28);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.fill();
  ctx.stroke();

  // Etiqueta superior
  const tagW = 540;
  const tagH = 50;
  const tagX = (w - tagW) / 2;
  const tagY = 75;

  const tagGrad = ctx.createLinearGradient(tagX, tagY, tagX + tagW, tagY);
  if (coupon.isSpicy) {
    tagGrad.addColorStop(0, '#ff4757');
    tagGrad.addColorStop(1, '#ff793f');
  } else {
    tagGrad.addColorStop(0, '#ffd700');
    tagGrad.addColorStop(1, '#ff9800');
  }
  ctx.fillStyle = tagGrad;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(tagX, tagY, tagW, tagH, 25);
  } else {
    ctx.rect(tagX, tagY, tagW, tagH);
  }
  ctx.fill();

  ctx.fillStyle = coupon.isSpicy ? '#ffffff' : '#000000';
  ctx.font = 'bold 22px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`VALE NIVEL ${coupon.level} - ${coupon.isSpicy ? 'PÍCARO' : 'DESBLOQUEADO'}`, w / 2, tagY + 33);

  // Estrellas decorativas en esquinas
  ctx.fillStyle = '#ffd700';
  ctx.font = '26px sans-serif';
  const starCoords = [[80, 90], [1120, 90], [80, 670], [1120, 670], [140, 380], [1060, 380]];
  starCoords.forEach(([sx, sy]) => ctx.fillText('★', sx, sy));

  // Título del vale
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Outfit", sans-serif';
  wrapCanvasText(ctx, coupon.title.toUpperCase(), w / 2, 230, cardW - 100, 52);

  // Línea divisora
  ctx.strokeStyle = 'rgba(255, 105, 180, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 200, 420);
  ctx.lineTo(w / 2 + 200, 420);
  ctx.stroke();

  // Descripción del vale
  ctx.fillStyle = '#f8c8dc';
  ctx.font = '28px "Quicksand", sans-serif';
  wrapCanvasText(ctx, `"${coupon.desc}"`, w / 2, 480, cardW - 140, 40);

  // Firma inferior
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px "Dancing Script", cursive';
  ctx.fillText('Nesvi World - Creado especialmente para Nesvi con todo mi amor', w / 2, h - 85);

  // Descarga instantánea de imagen PNG
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Vale_Nesvi_Nivel_${coupon.level}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

/* ==========================================================================
   7. 100 Secret Levels Engine (1 Level / Day, Increasing Clicks, Constellation Stars)
   ========================================================================== */
function initLoveMeter100Levels() {
  const bigHeart = document.getElementById('bigHeartBtn');
  const currentLevelNum = document.getElementById('currentLevelNum');
  const starsUnlockedCount = document.getElementById('starsUnlockedCount');
  const dailyStatusBanner = document.getElementById('dailyStatusBanner');
  const dailyStatusText = document.getElementById('dailyStatusText');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const tapInstruction = document.getElementById('tapInstruction');
  const loveLog = document.getElementById('loveLog');
  const unlockedValesLevel = document.getElementById('unlockedValesLevel');
  const nextLevelCountdown = document.getElementById('nextLevelCountdown');
  const countdownTimer = document.getElementById('countdownTimer');

  const CLOUD_ENDPOINT = 'https://jsonblob.com/api/jsonBlob/019fb415-e6ca-7bf4-9788-a090627671bd';

  let currentLevel = parseInt(localStorage.getItem('nesvi_level') || '1', 10);
  let lastUnlockedDate = localStorage.getItem('nesvi_last_date') || '';
  let nesviHearts = parseInt(localStorage.getItem('nesvi_hearts') || '3', 10);
  let pendingDescuido = (localStorage.getItem('nesvi_pending_descuido') === 'true');

  function getLocalDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function getTodayDateOnly() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  let todayStr = getLocalDateKey();

  function updateHeartsHeaderUI(hearts) {
    for (let i = 1; i <= 3; i++) {
      const slot = document.getElementById(`heartLife${i}`);
      if (slot) {
        if (i <= hearts) {
          slot.className = 'heart-life-slot lit';
          slot.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
          slot.className = 'heart-life-slot unlit';
          slot.innerHTML = '<i class="fa-solid fa-heart-crack"></i>';
        }
      }
    }
  }

  // Sincronizar con la Nube al cargar
  fetch(CLOUD_ENDPOINT)
    .then(res => res.json())
    .then(cloudData => {
      if (cloudData) {
        if (cloudData.nesvi_hearts !== undefined) {
          nesviHearts = parseInt(cloudData.nesvi_hearts, 10);
          localStorage.setItem('nesvi_hearts', nesviHearts.toString());
        }
        if (cloudData.pending_descuido !== undefined) {
          pendingDescuido = cloudData.pending_descuido;
          localStorage.setItem('nesvi_pending_descuido', pendingDescuido ? 'true' : 'false');
        }
        const cloudLevel = parseInt(cloudData.nesvi_level || '1', 10);
        const cloudDate = cloudData.nesvi_last_date || '';

        if (cloudLevel > currentLevel || (cloudLevel === currentLevel && cloudDate > lastUnlockedDate)) {
          currentLevel = cloudLevel;
          lastUnlockedDate = cloudDate;
          localStorage.setItem('nesvi_level', currentLevel.toString());
          localStorage.setItem('nesvi_last_date', lastUnlockedDate);
        }
        updateHeartsHeaderUI(nesviHearts);
        checkStreakValidity();
        updateUIState();
      }
    })
    .catch(() => {
      updateHeartsHeaderUI(nesviHearts);
      checkStreakValidity();
    });

  function syncProgressToCloud(level, date, hearts = nesviHearts, pending = pendingDescuido) {
    try {
      fetch(CLOUD_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nesvi_level: level, nesvi_last_date: date, nesvi_hearts: hearts, pending_descuido: pending })
      }).catch(() => {});
    } catch (e) {}
  }

  function checkStreakValidity() {
    if (nesviHearts <= 0) {
      triggerTotalDestructionState();
      return;
    }

    // Si hay un descuido pendiente sin confirmar por el usuario, mostrar la animación en cada visita
    if (pendingDescuido) {
      setTimeout(() => {
        triggerDescuidoBurnSequence(nesviHearts, () => {
          pendingDescuido = false;
          localStorage.setItem('nesvi_pending_descuido', 'false');
          syncProgressToCloud(currentLevel, lastUnlockedDate, nesviHearts, false);
        });
      }, 800);
      return;
    }

    if (lastUnlockedDate) {
      const parts = lastUnlockedDate.split('-');
      if (parts.length === 3) {
        const lastDateOnly = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const diffMs = getTodayDateOnly().getTime() - lastDateOnly.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Si faltó 1 día completo o más (diferencia de 2 días o más): ¡MARCAR DESCUIDO PENDIENTE Y PERDER CORAZÓN!
        if (diffDays >= 2) {
          nesviHearts = Math.max(0, nesviHearts - 1);
          currentLevel = 1;
          lastUnlockedDate = '';
          pendingDescuido = true;
          localStorage.setItem('nesvi_level', '1');
          localStorage.setItem('nesvi_hearts', nesviHearts.toString());
          localStorage.setItem('nesvi_pending_descuido', 'true');
          localStorage.removeItem('nesvi_last_date');
          syncProgressToCloud(1, '', nesviHearts, true);
          updateHeartsHeaderUI(nesviHearts);

          setTimeout(() => {
            if (nesviHearts <= 0) {
              triggerTotalDestructionState();
            } else {
              triggerDescuidoBurnSequence(nesviHearts, () => {
                pendingDescuido = false;
                localStorage.setItem('nesvi_pending_descuido', 'false');
                syncProgressToCloud(1, '', nesviHearts, false);
              });
            }
          }, 800);
        }
      }
    }
  }

  checkStreakValidity();

  let currentClicks = 0;
  let requiredClicks = currentLevel * 10;

  updateUIState();
  setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const now = new Date();
    const currentDateKey = getLocalDateKey(now);

    // Si cambia el día con la página abierta, habilitar el nivel sin recargar.
    if (currentDateKey !== todayStr) {
      todayStr = currentDateKey;
      checkStreakValidity();
      updateUIState();
    }

    const isCompletedToday = lastUnlockedDate === todayStr;
    nextLevelCountdown.hidden = !isCompletedToday;
    if (!isCompletedToday) return;

    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const remainingMs = Math.max(0, nextMidnight.getTime() - now.getTime());
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const timerText = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');

    countdownTimer.textContent = timerText;
    countdownTimer.dateTime = `PT${hours}H${minutes}M${seconds}S`;
    countdownTimer.setAttribute('aria-label', `${hours} horas, ${minutes} minutos y ${seconds} segundos`);
  }

  function updateUIState() {
    requiredClicks = currentLevel * 10;
    currentLevelNum.textContent = currentLevel;
    if (unlockedValesLevel) unlockedValesLevel.textContent = Math.min(Math.max(currentLevel - 1, 0), 100);

    const starsUnlocked = Math.min(Math.floor((currentLevel - 1) / 10), 10);
    starsUnlockedCount.textContent = starsUnlocked;
    updateConstellationSky(starsUnlocked);

    if (lastUnlockedDate === todayStr) {
      dailyStatusBanner.classList.add('completed');
      dailyStatusText.innerHTML = `<i class="fa-solid fa-check-circle"></i> ¡Nivel ${currentLevel - 1} completado hoy! Vuelve mañana para desbloquear el Nivel ${currentLevel}.`;
      bigHeart.classList.add('disabled');
      tapInstruction.textContent = 'Has completado la magia de hoy. ¡Mañana te espera un nuevo nivel!';
      progressBar.style.width = '100%';
      progressText.textContent = 'Completado por hoy';
    } else {
      dailyStatusBanner.classList.remove('completed');
      dailyStatusText.innerHTML = `<i class="fa-solid fa-sparkles"></i> ¡Nivel ${currentLevel} listo para jugar hoy! Objetivo: ${requiredClicks} toques.`;
      bigHeart.classList.remove('disabled');
      tapInstruction.textContent = `Toca la gema del corazón (${currentClicks} / ${requiredClicks})`;
      const percent = Math.round((currentClicks / requiredClicks) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${currentClicks} / ${requiredClicks} Clics`;
    }

    updateCountdown();
  }

  function updateConstellationSky(starsCount) {
    const starSlots = document.querySelectorAll('.star-slot');
    starSlots.forEach((slot, idx) => {
      if (idx < starsCount) {
        slot.classList.add('lit');
      } else {
        slot.classList.remove('lit');
      }
    });
  }

  bigHeart.addEventListener('click', (e) => {
    if (lastUnlockedDate === todayStr) {
      playMagicalChime(300);
      return;
    }

    currentClicks++;
    playMagicalChime(400 + currentClicks * 5);

    bigHeart.style.transform = 'scale(0.88)';
    setTimeout(() => { bigHeart.style.transform = 'scale(1)'; }, 100);

    const percent = Math.min(Math.round((currentClicks / requiredClicks) * 100), 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${currentClicks} / ${requiredClicks} Clics`;
    tapInstruction.textContent = `¡Sigue tocando, Nesvi! (${currentClicks} / ${requiredClicks})`;

    // LEVEL COMPLETE!
    if (currentClicks >= requiredClicks) {
      lastUnlockedDate = todayStr;
      localStorage.setItem('nesvi_last_date', todayStr);
      localStorage.setItem('nesvi_level', (currentLevel + 1).toString());
      syncProgressToCloud(currentLevel + 1, todayStr);

      const completedLevel = currentLevel;
      const unlockedVoucher = nesvi100Vouchers.find(v => v.level === completedLevel) || nesvi100Vouchers[0];

      currentLevel++;
      currentClicks = 0;

      playUnicornArpeggio();
      spawnHeartExplosion(bigHeart.getBoundingClientRect());

      addLogMessage(`<i class="fa-solid fa-crown"></i> ¡Nivel ${completedLevel} Completado! Desbloqueaste: "${unlockedVoucher.title}".`);

      if (unlockedVoucher.isSpicy) {
        showModal(
          `¡NIVEL ${completedLevel} SUPERADO! (VALE PÍCARO & ESTRELLA)`,
          `¡Increíble, Nesvi! Has alcanzado el Nivel ${completedLevel} (${requiredClicks} toques) y desbloqueaste un Vale Pícaro Especial: "${unlockedVoucher.title}". ¡Además se ha encendido una nueva estrella en el firmamento! Vuelve mañana para continuar.`
        );
      } else {
        showModal(
          `¡Nivel ${completedLevel} Completado!`,
          `¡Felicidades, Nesvi! Has completado el desafío de hoy (${requiredClicks} toques). Desbloqueaste el Vale Nivel ${completedLevel}: "${unlockedVoucher.title}". Tu próximo nivel estará disponible mañana.`
        );
      }

      updateUIState();
    }
  });

  function addLogMessage(msg) {
    const p = document.createElement('p');
    p.className = 'log-entry';
    p.innerHTML = msg;
    loveLog.prepend(p);
  }
}

/* ==========================================================================
   8. Quotes Carousel
   ========================================================================== */
const romanticQuotes = [
  { body: '"Si Nesvi fuera una estrella, iluminaría toda la galaxia sin esfuerzo."', author: '- Pensamiento Mágico' },
  { body: '"El mundo es mucho más bonito, dulce y brillante porque tú estás en él, Nesvi."', author: '- Amor Sincero' },
  { body: '"Caminar a tu lado convierte cualquier día común en un verdadero cuento de hadas."', author: '- Promesa Eterna' },
  { body: '"Tu sonrisa es la respuesta favorita que el universo tiene para darme."', author: '- Corazón Agradecido' }
];

function initQuotesCarousel() {
  const quoteBody = document.getElementById('quoteBody');
  const quoteAuthor = document.querySelector('.quote-author');
  const prevBtn = document.getElementById('prevQuote');
  const nextBtn = document.getElementById('nextQuote');

  let index = 0;

  function updateQuote() {
    const q = romanticQuotes[index];
    quoteBody.textContent = q.body;
    quoteAuthor.textContent = q.author;
    playMagicalChime(550);
  }

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + romanticQuotes.length) % romanticQuotes.length;
    updateQuote();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % romanticQuotes.length;
    updateQuote();
  });

  setInterval(() => {
    index = (index + 1) % romanticQuotes.length;
    updateQuote();
  }, 7000);
}

/* ==========================================================================
   9. Modal System
   ========================================================================== */
function initModalSystem() {
  const modal = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeModal');
  const okBtn = document.getElementById('modalOkBtn');

  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function showModal(title, body) {
  const modal = document.getElementById('modalOverlay');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  modal.classList.add('active');
  playUnicornArpeggio();
}

/* ==========================================================================
   10. Animación Trágica de Descuido y Destrucción Total (3 Vidas)
   ========================================================================== */
function triggerDescuidoBurnSequence(heartsRemaining, onConfirm) {
  const overlay = document.getElementById('tragicBurnOverlay');
  const canvas = document.getElementById('burnCanvas');
  const title = document.getElementById('tragicTitle');
  const message = document.getElementById('tragicMessage');
  const iconBox = document.getElementById('tragicIconBox');
  const rebuildBtn = document.getElementById('rebuildJourneyBtn');
  const heartsVisual = document.getElementById('tragicHeartsVisual');
  if (!overlay || !canvas) return;

  if (iconBox) iconBox.innerHTML = '<i class="fa-solid fa-heart-crack"></i>';
  if (title) title.textContent = '¿Esto solo fue un descuido?';
  if (message) {
    message.textContent = `¿Fue solo un descuido en la prisa del día? Te doy una oportunidad más porque mi amor por ti es paciente. Pero ten cuidado... la constelación solo soporta 3 descuidos antes de destruirse para siempre. Te quedan ${heartsRemaining} oportunidad(es) de amor.`;
  }

  if (heartsVisual) {
    let html = '';
    for (let i = 1; i <= 3; i++) {
      if (i <= heartsRemaining) {
        html += '<span class="modal-heart-icon lit"><i class="fa-solid fa-heart"></i></span> ';
      } else {
        html += '<span class="modal-heart-icon unlit"><i class="fa-solid fa-heart-crack"></i></span> ';
      }
    }
    heartsVisual.innerHTML = html;
  }

  if (rebuildBtn) {
    rebuildBtn.disabled = false;
    rebuildBtn.style.opacity = '1';
    rebuildBtn.style.cursor = 'pointer';
    rebuildBtn.style.display = 'inline-flex';
    rebuildBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Tomar Una Oportunidad Más (Nivel 1)';
  }

  overlay.style.display = 'flex';
  playTragicBurningSound();

  startEmberCanvas(canvas);

  if (rebuildBtn) {
    rebuildBtn.onclick = () => {
      if (typeof onConfirm === 'function') {
        onConfirm();
      }
      overlay.style.transition = 'opacity 0.8s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.opacity = '1';
        window.location.reload();
      }, 800);
    };
  }
}

function triggerTotalDestructionState() {
  const overlay = document.getElementById('tragicBurnOverlay');
  const canvas = document.getElementById('burnCanvas');
  const title = document.getElementById('tragicTitle');
  const message = document.getElementById('tragicMessage');
  const iconBox = document.getElementById('tragicIconBox');
  const rebuildBtn = document.getElementById('rebuildJourneyBtn');
  const heartsVisual = document.getElementById('tragicHeartsVisual');
  if (!overlay || !canvas) return;

  if (iconBox) iconBox.innerHTML = '<i class="fa-solid fa-skull" style="font-size: 4rem; color: #ff4757;"></i>';
  if (title) title.textContent = 'Dejaste morir nuestro amor...';
  if (message) {
    message.textContent = 'Has dejado romper nuestra racha 3 veces. El fuego consumió las últimas esperanzas y la constelación de Nesvi se ha destruido y apagado por completo. Nada en este sitio web volverá a funcionar jamás.';
  }

  if (heartsVisual) {
    heartsVisual.innerHTML = '<span class="modal-heart-icon unlit"><i class="fa-solid fa-heart-crack"></i></span> <span class="modal-heart-icon unlit"><i class="fa-solid fa-heart-crack"></i></span> <span class="modal-heart-icon unlit"><i class="fa-solid fa-heart-crack"></i></span>';
  }

  if (rebuildBtn) {
    rebuildBtn.disabled = true;
    rebuildBtn.style.opacity = '0.4';
    rebuildBtn.style.cursor = 'not-allowed';
    rebuildBtn.innerHTML = '<i class="fa-solid fa-skull"></i> La Constelación se ha Apagado para Siempre';
    rebuildBtn.onclick = null;
  }

  overlay.style.display = 'flex';
  playTragicBurningSound();
  startEmberCanvas(canvas);

  // Desactivar completamente cualquier interacción en todo el sitio web
  document.body.style.overflow = 'hidden';
  document.body.style.pointerEvents = 'none';
  overlay.style.pointerEvents = 'auto';
}

function startEmberCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 110; i++) {
    particles.push({
      x: Math.random() * width,
      y: height + Math.random() * 200,
      size: Math.random() * 4.5 + 1.5,
      speedY: Math.random() * 3.5 + 1.5,
      speedX: (Math.random() - 0.5) * 2,
      color: ['#ff4757', '#ff793f', '#ffda79', '#ff6b81', '#2f3542'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.9 + 0.1
    });
  }

  function renderEmbers() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha -= 0.0025;

      if (p.y < -10 || p.alpha <= 0) {
        p.y = height + 10;
        p.x = Math.random() * width;
        p.alpha = Math.random() * 0.9 + 0.1;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(renderEmbers);
  }

  renderEmbers();
}

function playTragicBurningSound() {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(110, audioCtx.currentTime);
    osc2.frequency.setValueAtTime(130.81, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 3.5);
    osc2.stop(audioCtx.currentTime + 3.5);
  } catch (e) {}
}


