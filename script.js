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
  // Level 1 - 10
  { level: 1, title: 'Vale por tomarse de las manos por primera vez', desc: 'Sentir la calidez y el temblor dulce de nuestros dedos entrelazados.', icon: 'fa-solid fa-hand-holding-heart', cat: 'shy' },
  { level: 2, title: 'Vale por una caminata suave sintiendo tu mano en la mía', desc: 'Caminar a tu paso disfrutando del viento y de tu cercanía.', icon: 'fa-solid fa-person-walking', cat: 'shy' },
  { level: 3, title: 'Vale por un abrazo sorpresa por la espalda', desc: 'Envolverte en mis brazos durante un minuto entero para que te sientas cuidada.', icon: 'fa-solid fa-heart', cat: 'shy' },
  { level: 4, title: 'Vale por un mensaje dulce de buenos días', desc: 'Un texto tierno para recordarte lo hermosa que eres al despertar.', icon: 'fa-solid fa-envelope', cat: 'shy' },
  { level: 5, title: 'Vale por un beso suave en la mejilla', desc: 'Un beso tierno que te haga sonreír y sonrojar ligeramente.', icon: 'fa-solid fa-face-kiss-wink-heart', cat: 'shy' },
  { level: 6, title: 'Vale por compartir un postre dulce con la misma cuchara', desc: 'Probar tus saboreados preferidos entre miradas complicitarias.', icon: 'fa-solid fa-mug-hot', cat: 'romantic' },
  { level: 7, title: 'Vale por un susurro al oído diciéndote lo especial que eres', desc: 'Decirte bajito algo hermoso al oído que acelere tus latidos.', icon: 'fa-solid fa-comment-dots', cat: 'shy' },
  { level: 8, title: 'Vale por una taza de café y una charla profunda', desc: 'Platicar de la vida sin tiempo ni prisas sintiendo tu calma.', icon: 'fa-solid fa-comments', cat: 'romantic' },
  { level: 9, title: 'Vale por una caricia en el rostro contemplando tus ojos', desc: 'Acariciar tu mejilla mientras me pierdo en el brillo de tu mirada.', icon: 'fa-solid fa-eye', cat: 'shy' },
  { level: 10, title: 'Vale por 5 minutos de besos apasionados e intensos', desc: '¡VALE PÍCARO! Besos profundos e ininterrumpidos que te quiten el aliento.', icon: 'fa-solid fa-fire', cat: 'spicy', isSpicy: true },

  // Level 11 - 20
  { level: 11, title: 'Vale por una tomada de mano firme frente a todos', desc: 'Caminar orgulloso presumiéndote al mundo entero.', icon: 'fa-solid fa-hand-holding-heart', cat: 'shy' },
  { level: 12, title: 'Vale por una tarde de helado y risas compartidas', desc: 'Disfrutar de tu risa contagiosa que ilumina cualquier lugar.', icon: 'fa-solid fa-ice-cream', cat: 'romantic' },
  { level: 13, title: 'Vale por darte mi abrigo cuando sientas frío', desc: 'Arroparte con ternura para que jamás sientas frío.', icon: 'fa-solid fa-user-shield', cat: 'shy' },
  { level: 14, title: 'Vale por una lista de canciones dedicadas especialmente para ti', desc: 'Melodías seleccionadas con letras que describen lo que siento.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 15, title: 'Vale por un beso dulce en la frente', desc: 'Un beso lleno de protección, respeto y devoción pura.', icon: 'fa-solid fa-heart-pulse', cat: 'shy' },
  { level: 16, title: 'Vale por un picnic al atardecer sobre la hierba', desc: 'Disfrutar de frutas, bocadillos y la brisa recostados juntos.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 17, title: 'Vale por una tarde de fotos tiernas y divertidas', desc: 'Capturar tus gestos hermosos en imágenes para el recuerdo.', icon: 'fa-solid fa-camera', cat: 'romantic' },
  { level: 18, title: 'Vale por un detalle hecho a mano por sorpresa', desc: 'Un pequeño regalo preparado con dedicación solo para sacarte una sonrisa.', icon: 'fa-solid fa-gift', cat: 'romantic' },
  { level: 19, title: 'Vale por recostar tu cabeza en mi pecho', desc: 'Sentir tus respiraciones mientras escuchas mis latidos que palpitan por ti.', icon: 'fa-solid fa-bed', cat: 'romantic' },
  { level: 20, title: 'Vale por un masaje relajante con aceites aromáticos', desc: '¡VALE PÍCARO! Un masaje completo por espalda y cuerpo a la luz de las velas.', icon: 'fa-solid fa-spa', cat: 'spicy', isSpicy: true },

  // Level 21 - 30
  { level: 21, title: 'Vale por una cena romántica preparada para ti', desc: 'Cocinar tus platillos favoritos en una mesa decorada con flores.', icon: 'fa-solid fa-utensils', cat: 'romantic' },
  { level: 22, title: 'Vale por un baile lento a media luz', desc: 'Bailar abrazados muy pegaditos sin necesidad de música estruendosa.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 23, title: 'Vale por ver el atardecer abrazados en silencio', desc: 'Sentir que el tiempo se detiene cuando estamos juntos.', icon: 'fa-solid fa-cloud-sun', cat: 'romantic' },
  { level: 24, title: 'Vale por noche de películas, cobijas y mimos', desc: 'Ver tus películas favoritas en el sillón envueltos en abrazos.', icon: 'fa-solid fa-film', cat: 'romantic' },
  { level: 25, title: 'Vale por una carta de amor manuscrita', desc: 'Palabras sinceras escritas en papel detallando todo lo que representas.', icon: 'fa-solid fa-pen-nib', cat: 'romantic' },
  { level: 26, title: 'Vale por una escapada de fin de semana', desc: 'Explorar un pueblito o lugar mágico desconectados del resto.', icon: 'fa-solid fa-compass', cat: 'romantic' },
  { level: 27, title: 'Vale por despertarte con el desayuno en la cama', desc: 'Sorprenderte por la mañana con tu café caliente y cosas deliciosas.', icon: 'fa-solid fa-coffee', cat: 'romantic' },
  { level: 28, title: 'Vale por sostenerte fuerte en momentos difíciles', desc: 'Ser tu pañuelo, tu apoyo firme y tu abrazo de refugio en cualquier mal día.', icon: 'fa-solid fa-hands-holding-child', cat: 'romantic' },
  { level: 29, title: 'Vale por cantar juntos a todo volumen', desc: 'Cantar desatinados tus canciones favoritas riendo a carcajadas.', icon: 'fa-solid fa-microphone', cat: 'romantic' },
  { level: 30, title: 'Vale por un beso robado en el cuello y susurros picantes', desc: '¡VALE PÍCARO! Rozar mis labios por tu cuello y confesar mis deseos traviesos.', icon: 'fa-solid fa-kiss-wink-heart', cat: 'spicy', isSpicy: true },

  // Level 31 - 40
  { level: 31, title: 'Vale por un viaje por carretera disfrutando el paisaje', desc: 'Manejar tomados de la mano mientras la brisa despeina tu cabello.', icon: 'fa-solid fa-car', cat: 'romantic' },
  { level: 32, title: 'Vale por regalarte tus flores preferidas en un día cualquiera', desc: 'Llegar a buscarte con un ramo hermoso sin que sea una fecha especial.', icon: 'fa-solid fa-spa', cat: 'romantic' },
  { level: 33, title: 'Vale por velada mirando las estrellas contando sueños', desc: 'Acostados sobre una manta planeando lo que construiremos juntos.', icon: 'fa-solid fa-star', cat: 'romantic' },
  { level: 34, title: 'Vale por un abrazo gigante al llegar cansada', desc: 'Recibirte en la puerta y sostenerte hasta que sientas tranquilidad.', icon: 'fa-solid fa-heart', cat: 'romantic' },
  { level: 35, title: 'Vale por cocinar juntos en la cocina', desc: 'Hacer un desastre divertido preparando la cena entre juegos y harina.', icon: 'fa-solid fa-cookie-bite', cat: 'romantic' },
  { level: 36, title: 'Vale por encuadrar nuestra mejor fotografía', desc: 'Poner en un lugar de honor esa foto donde ambos brillamos de felicidad.', icon: 'fa-solid fa-image', cat: 'romantic' },
  { level: 37, title: 'Vale por un pacto sagrado de lealtad y amor', desc: 'Reafirmar que mi corazón te pertenece por completo.', icon: 'fa-solid fa-shield-halved', cat: 'romantic' },
  { level: 38, title: 'Vale por llevarte a tu lugar favorito', desc: 'Un paseo especial a ese rincón que te llena de nostalgia y alegría.', icon: 'fa-solid fa-map-location-dot', cat: 'romantic' },
  { level: 39, title: 'Vale por un beso bajo la lluvia', desc: 'Beso apasionado bajo las gotas de agua sin importar mojarnos.', icon: 'fa-solid fa-cloud-showers-heavy', cat: 'romantic' },
  { level: 40, title: 'Vale por una noche de juegos privados y lencería atrevida', desc: '¡VALE PÍCARO! Una velada seductora sin reglas para explorar nuestros antojos.', icon: 'fa-solid fa-lock-open', cat: 'spicy', isSpicy: true },

  // Level 41 - 50
  { level: 41, title: 'Vale por compartir nuestras llaves y un espacio propio', desc: 'El primer paso hacia vivir juntos bajo un mismo techo lleno de amor.', icon: 'fa-solid fa-key', cat: 'romantic' },
  { level: 42, title: 'Vale por planear vacaciones juntos a la playa', desc: 'Caminar descalzos por la arena sintiendo el mar y el calor del sol.', icon: 'fa-solid fa-umbrella-beach', cat: 'romantic' },
  { level: 43, title: 'Vale por dormir acurrucados toda la noche', desc: 'Despertar a medianoche y sentir que tu cuerpo encaja perfecto con el mío.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 44, title: 'Vale por adoptar una mascota juntos', desc: 'Llenar nuestro hogar de alegría con un compañero que cuidaremos los dos.', icon: 'fa-solid fa-paw', cat: 'romantic' },
  { level: 45, title: 'Vale por decorar nuestro rincón favorito', desc: 'Elegir luces, plantas y recuerdos para armar nuestro espacio acogedor.', icon: 'fa-solid fa-couch', cat: 'romantic' },
  { level: 46, title: 'Vale por un beso profundo al despertar', desc: 'Abrir los ojos y que tu cara sea lo primero hermoso que contemple.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 47, title: 'Vale por ser tu apoyo incondicional en tus metas', desc: 'Celebra cada triunfo tuyo como si fuera el mío propio.', icon: 'fa-solid fa-trophy', cat: 'romantic' },
  { level: 48, title: 'Vale por una fiesta sorpresa en tu cumpleaños', desc: 'Preparar una celebración inolvidable donde seas la reina indiscutible.', icon: 'fa-solid fa-cake-candles', cat: 'romantic' },
  { level: 49, title: 'Vale por entendernos con una sola mirada', desc: 'Esa complicidad perfecta donde sabemos lo que piensa el otro al instante.', icon: 'fa-solid fa-bolt', cat: 'romantic' },
  { level: 50, title: 'Vale por una velada a solas donde tú pones las reglas', desc: '¡VALE PÍCARO! Cumplir todos tus antojos y caprichos más atrevidos.', icon: 'fa-solid fa-wand-magic-sparkles', cat: 'spicy', isSpicy: true },

  // Level 51 - 60
  { level: 51, title: 'Vale por diseñar los planos de nuestro hogar soñado', desc: 'Imaginar cada habitación y jardín que construiremos juntos.', icon: 'fa-solid fa-house-chimney', cat: 'romantic' },
  { level: 52, title: 'Vale por ir de compras y elegir la ropa del otro', desc: 'Divertirnos probándonos estilos y consintiéndonos mutuamente.', icon: 'fa-solid fa-bag-shopping', cat: 'romantic' },
  { level: 53, title: 'Vale por superar cualquier tormenta agarrados de la mano', desc: 'Demostrar que nuestro amor es más fuerte que cualquier obstáculo.', icon: 'fa-solid fa-handshake', cat: 'romantic' },
  { level: 54, title: 'Vale por una escapada a una cabaña con chimenea', desc: 'Un fin de semana junto al fuego con chocolate caliente y abrazos.', icon: 'fa-solid fa-fire-burner', cat: 'romantic' },
  { level: 55, title: 'Vale por reír juntos hasta que duelan las mejillas', desc: 'Momentos de pura espontaneidad que llenan el alma de felicidad.', icon: 'fa-solid fa-face-grin-tears', cat: 'romantic' },
  { level: 56, title: 'Vale por una escucha paciente y amorosa siempre', desc: 'Estar presente para ti cada vez que necesites desahogar tu corazón.', icon: 'fa-solid fa-ear-listen', cat: 'romantic' },
  { level: 57, title: 'Vale por un paseo nocturno bajo la luna llena', desc: 'Caminar entre sombras y luces sintiendo la magia del cielo nocturno.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 58, title: 'Vale por ser tu refugio seguro ante el mundo', desc: 'Saber que en mis brazos nunca habrá juzgamientos, solo amor puro.', icon: 'fa-solid fa-heart-circle-check', cat: 'romantic' },
  { level: 59, title: 'Vale por mirarte con la misma fascinación del inicio', desc: 'Que los años pasen y seguir viéndote como la mujer más deslumbrante.', icon: 'fa-solid fa-gem', cat: 'romantic' },
  { level: 60, title: 'Vale por cumplir tu fantasía romántica más candente', desc: '¡VALE PÍCARO! Una experiencia íntima y apasionada a puerta cerrada.', icon: 'fa-solid fa-flame', cat: 'spicy', isSpicy: true },

  // Level 61 - 70
  { level: 61, title: 'Vale por ir juntos a elegir nuestros anillos', desc: 'El símbolo brillante de una promesa que durará toda la vida.', icon: 'fa-solid fa-ring', cat: 'romantic' },
  { level: 62, title: 'Vale por una propuesta de matrimonio inolvidable', desc: 'Arrodillarme frente a ti con lágrimas de emoción pidiendo ser tu esposo.', icon: 'fa-solid fa-gem', cat: 'romantic' },
  { level: 63, title: 'Vale por anunciar nuestro compromiso con felicidad', desc: 'Celebrar con nuestras familias el inicio de nuestra propia historia formal.', icon: 'fa-solid fa-champagne-glasses', cat: 'romantic' },
  { level: 64, title: 'Vale por planear los detalles de nuestra boda', desc: 'Elegir las flores, la música y los momentos de nuestro día soñado.', icon: 'fa-solid fa-scroll', cat: 'romantic' },
  { level: 65, title: 'Vale por escribir nuestros votos de amor eterno', desc: 'Plasmar en palabras el compromiso que asumimos con el alma.', icon: 'fa-solid fa-pen-fancy', cat: 'romantic' },
  { level: 66, title: 'Vale por ensayar nuestro primer vals de esposos', desc: 'Practicar los pasos de baile abrazados en la sala contando los días.', icon: 'fa-solid fa-music', cat: 'romantic' },
  { level: 67, title: 'Vale por una velada privada antes del gran día', desc: 'Brindar a solas por el amor que nos trajo hasta este momento.', icon: 'fa-solid fa-wine-glass', cat: 'romantic' },
  { level: 68, title: 'Vale por la emoción de la noche previa al altar', desc: 'Sentir mariposas en el estómago sabiendo que mañana serás mi esposa.', icon: 'fa-solid fa-heart-pulse', cat: 'romantic' },
  { level: 69, title: 'Vale por un beso cargado de complicidad antes del dar el "Sí"', desc: 'Un guiño y una sonrisa asegurándonos de que este amor es para siempre.', icon: 'fa-solid fa-sparkles', cat: 'romantic' },
  { level: 70, title: 'Vale por una noche entera de pasión desenfrenada', desc: '¡VALE PÍCARO! Entregarnos por entero sin prisas, horarios ni barreras.', icon: 'fa-solid fa-fire-flame-curved', cat: 'spicy', isSpicy: true },

  // Level 71 - 80
  { level: 71, title: 'Vale por el día de nuestra gran boda', desc: 'Caminar hacia el altar y ver la luz radiante en tus ojos vestida de novia.', icon: 'fa-solid fa-church', cat: 'romantic' },
  { level: 72, title: 'Vale por decir "Acepto" tomados de las manos', desc: 'Pronunciar el "Sí, acepto" que unirá nuestras vidas para siempre.', icon: 'fa-solid fa-heart-circle-bolt', cat: 'romantic' },
  { level: 73, title: 'Vale por nuestro primer beso oficial como esposos', desc: 'Sellamos el matrimonio entre aplausos, lágrimas y pura alegría.', icon: 'fa-solid fa-crown', cat: 'romantic' },
  { level: 74, title: 'Vale por nuestro vals rodeados de luces mágicas', desc: 'Bailar como si flotáramos en las nubes sintiendo el aplauso del universo.', icon: 'fa-solid fa-star', cat: 'romantic' },
  { level: 75, title: 'Vale por brindar por nuestro futuro próspero', desc: 'Levantar las copas sabiendo que juntos nada nos detendrá.', icon: 'fa-solid fa-champagne-glasses', cat: 'romantic' },
  { level: 76, title: 'Vale por despegar hacia nuestra Luna de Miel', desc: 'Subir al avión de la mano listos para la aventura más romántica.', icon: 'fa-solid fa-plane-departure', cat: 'romantic' },
  { level: 77, title: 'Vale por explorar un paraíso lejano unidos', desc: 'Descubrir paisajes increíbles viviendo nuestro amor en libertad.', icon: 'fa-solid fa-earth-americas', cat: 'romantic' },
  { level: 78, title: 'Vale por el primer amanecer de Luna de Miel', desc: 'Despertar en una playa tropical sintiendo tu aliento cálido en mi piel.', icon: 'fa-solid fa-sun', cat: 'romantic' },
  { level: 79, title: 'Vale por traer recuerdos inolvidables a nuestro hogar', desc: 'Llenar las paredes de recuerdos de nuestra luna de miel.', icon: 'fa-solid fa-house-user', cat: 'romantic' },
  { level: 80, title: 'Vale por un baño de espuma a solas con champán y besos de fuego', desc: '¡VALE PÍCARO! Relajarnos en la tina jacuzzi entre burbujas y caricias intensas.', icon: 'fa-solid fa-hot-tub-person', cat: 'spicy', isSpicy: true },

  // Level 81 - 90
  { level: 81, title: 'Vale por formar una familia llena de ternura y valores', desc: 'Transmitir a nuestros hijos la belleza del amor que nos tenemos.', icon: 'fa-solid fa-people-roof', cat: 'romantic' },
  { level: 82, title: 'Vale por celebrar cada aniversario como si fuera el primero', desc: 'Renovar el romanticismo año con año con sorpresas especiales.', icon: 'fa-solid fa-calendar-check', cat: 'romantic' },
  { level: 83, title: 'Vale por cuidar tu salud y felicidad en cada etapa', desc: 'Estar pendiente de ti, consentirte y cuidarte en todo momento.', icon: 'fa-solid fa-hand-holding-medical', cat: 'romantic' },
  { level: 84, title: 'Vale por seguir viajando por el mundo tomados de la mano', desc: 'Acumular sellos en el pasaporte y arrugas de felicidad en el rostro.', icon: 'fa-solid fa-passport', cat: 'romantic' },
  { level: 85, title: 'Vale por renovar nuestros votos en nuestras bodas de plata', desc: 'Volver a decirnos "Te Amo" con la experiencia de décadas compartidas.', icon: 'fa-solid fa-award', cat: 'romantic' },
  { level: 86, title: 'Vale por sonreír al ver los álbumes de toda nuestra historia', desc: 'Repasar cada foto desde el primer día y sentir orgullo del amor construido.', icon: 'fa-solid fa-book-open-reader', cat: 'romantic' },
  { level: 87, title: 'Vale por abrazarte con la misma devoción en nuestra madurez', desc: 'Ver cómo tus cabellos plateados te hacen lucir aún más hermosa.', icon: 'fa-solid fa-heart', cat: 'romantic' },
  { level: 88, title: 'Vale por contemplar a nuestros nietos y ver tu reflejo', desc: 'Ver la ternura de tus ojos replicada en las nuevas generaciones.', icon: 'fa-solid fa-users', cat: 'romantic' },
  { level: 89, title: 'Vale por agradecer al universo por haberte encontrado', desc: 'Saber que cruzarnos en esta vida fue la mayor bendición de mi existencia.', icon: 'fa-solid fa-hands-praying', cat: 'romantic' },
  { level: 90, title: 'Vale por un pase libre vitalicio para cualquier deseo pícaro', desc: '¡VALE PÍCARO VITALICIO! Canjeable en cualquier instante para lo que se te antoje.', icon: 'fa-solid fa-key', cat: 'spicy', isSpicy: true },

  // Level 91 - 100
  { level: 91, title: 'Vale por sentarnos en la mecedora a recordar nuestras locuras', desc: 'Reírnos viejitos recordando cuando iniciamos con el unicornio rosa.', icon: 'fa-solid fa-chair', cat: 'romantic' },
  { level: 92, title: 'Vale por seguir tomándote la mano con dulzura a los 80 años', desc: 'Nuestros dedos arrugaditos entrelazados exactamente como el Nivel 1.', icon: 'fa-solid fa-hand-holding-heart', cat: 'romantic' },
  { level: 93, title: 'Vale por un beso suave en la frente antes de dormir cada noche', desc: 'El ritual diario de paz que hemos mantenido durante toda la vida.', icon: 'fa-solid fa-moon', cat: 'romantic' },
  { level: 94, title: 'Vale por saber que eres y siempre fuiste mi único amor', desc: 'La certeza absoluta de que nadie más ocupó ni ocupará tu lugar.', icon: 'fa-solid fa-lock', cat: 'romantic' },
  { level: 95, title: 'Vale por un hogar que siempre fue refugio de risas y paz', desc: 'Saber que nuestra casa siempre fue un santuario de amor incondicional.', icon: 'fa-solid fa-house-heart', cat: 'romantic' },
  { level: 96, title: 'Vale por mirar atrás con cero arrepentimientos y gratitud pura', desc: 'Haber vivido una historia de amor real, sincera y profundamente hermosa.', icon: 'fa-solid fa-clapperboard', cat: 'romantic' },
  { level: 97, title: 'Vale por ser compañeros inseparables hasta el último aliento', desc: 'Caminar juntos hasta donde la vida nos lleve tomados de la mano.', icon: 'fa-solid fa-infinity', cat: 'romantic' },
  { level: 98, title: 'Vale por un amor que trasciende el tiempo y el espacio', desc: 'Un sentimiento tan puro que dejará huella imborrable en el universo.', icon: 'fa-solid fa-meteor', cat: 'romantic' },
  { level: 99, title: 'Vale por la promesa de buscarnos y encontrarnos en la siguiente vida', desc: 'Prometernos que al volver a nacer volveremos a enamorarnos al instante.', icon: 'fa-solid fa-wand-magic-sparkles', cat: 'romantic' },
  { level: 100, title: 'NUESTRA BODA PERFECTA & VIDA JUNTOS POR LA ETERNIDAD', desc: '¡EL GRAN FINAL & MÁXIMO VALE PÍCARO Y ROMÁNTICO! Haber recorrido 100 niveles de amor, casarnos, disfrutar nuestra pasión e historia y vivir enamorados por siempre.', icon: 'fa-solid fa-crown', cat: 'spicy', isSpicy: true }
];

function initMagicOrb() {
  const orb = document.getElementById('magicOrb');
  const card = document.getElementById('wishResultCard');
  const tag = document.getElementById('wishCategoryTag');
  const icon = document.getElementById('wishIcon');
  const title = document.getElementById('wishTitle');
  const desc = document.getElementById('wishDesc');
  const claimBtn = document.getElementById('claimWishBtn');
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
    
    // Determine unlocked levels count based on user progress (at least Level 1)
    const currentLevel = parseInt(localStorage.getItem('nesvi_level') || '1', 10);
    if (unlockedLevelSpan) unlockedLevelSpan.textContent = currentLevel;

    // Filter coupons up to current level
    const unlockedPool = nesvi100Vouchers.filter(c => c.level <= currentLevel);

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

    tag.textContent = `VALE NIVEL ${currentCoupon.level} - ${currentCoupon.isSpicy ? 'PÍCARO & ATREVIDO' : 'DESBLOQUEADO'}`;
    if (currentCoupon.isSpicy) {
      tag.classList.add('spicy');
    } else {
      tag.classList.remove('spicy');
    }

    icon.innerHTML = `<i class="${currentCoupon.icon}"></i>`;
    title.textContent = currentCoupon.title;
    desc.textContent = currentCoupon.desc;
    claimBtn.style.display = 'inline-flex';
    card.classList.add('glow');

    spawnHeartExplosion(orb.getBoundingClientRect());
  });

  claimBtn.addEventListener('click', () => {
    if (currentCoupon) {
      showModal(
        `¡Vale Nivel ${currentCoupon.level} Reclamado!`,
        `Has reclamado: "${currentCoupon.title}". Este hito de nuestro camino juntos ha quedado guardado para siempre.`
      );
    }
  });
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

  let currentLevel = parseInt(localStorage.getItem('nesvi_level') || '1', 10);
  let lastUnlockedDate = localStorage.getItem('nesvi_last_date') || '';
  
  // Obtener fecha actual sin hora (00:00:00)
  const now = new Date();
  const todayDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Verificar racha de días en la vida real
  if (lastUnlockedDate) {
    const parts = lastUnlockedDate.split('-');
    if (parts.length === 3) {
      const lastDateOnly = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const diffMs = todayDateOnly.getTime() - lastDateOnly.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Si faltó 1 día completo o más (diferencia de 2 días o más), ¡SE REINICIA TODO A NIVEL 1!
      if (diffDays >= 2) {
        currentLevel = 1;
        localStorage.setItem('nesvi_level', '1');
        localStorage.removeItem('nesvi_last_date');
        lastUnlockedDate = '';
        
        setTimeout(() => {
          showModal(
            '¡Racha Interrumpida - Reinicio desde el Nivel 1!',
            'Has dejado pasar un día completo sin entrar a jugar. La constelación se ha reinventado desde el Nivel 1 para comenzar de nuevo vuestro camino juntos.'
          );
        }, 1200);
      }
    }
  }

  let currentClicks = 0;
  let requiredClicks = currentLevel * 10;

  updateUIState();

  function updateUIState() {
    requiredClicks = currentLevel * 10;
    currentLevelNum.textContent = currentLevel;
    if (unlockedValesLevel) unlockedValesLevel.textContent = Math.min(currentLevel, 100);

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
