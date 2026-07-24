/* ==========================================================================
   Nesvi's Romantic World - Interactive JavaScript Engine (No-Emoji Version)
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
        // Draw 4-point star path
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
let musicInterval = null;
let isMusicPlaying = false;
let isSoundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playMagicalChime(freq = 523.25, type = 'sine') {
  if (!isSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
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

  // Configurar volumen inicial al 25%
  if (bgMusic) {
    bgMusic.volume = 0.25;
  }

  // Interruptor de Efectos de Sonido
  soundBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundBtn.classList.toggle('active', isSoundEnabled);
    if (isSoundEnabled) playMagicalChime(880);
  });

  // Función Reproducir / Pausar Stand By Me
  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicBtn.classList.add('active');
        musicIcon.className = 'fa-solid fa-pause';
      }).catch(err => {
        console.log('Autoplay suspendido por el navegador:', err);
      });
    } else {
      bgMusic.pause();
      musicBtn.classList.remove('active');
      musicIcon.className = 'fa-solid fa-play';
    }
  }

  musicBtn.addEventListener('click', () => {
    toggleMusic();
  });

  // Deslizador interactivo de Volumen (0% - 100%)
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

  // Reproducción suave al primer clic o interacción del usuario
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
   6. Expanded Magic Coupons (Shy to Spicy)
   ========================================================================== */
const nesviCoupons = [
  // Tímidos & Tiernos
  {
    category: 'shy',
    catName: 'VALE TÍMIDO & TIERNO',
    iconClass: 'fa-solid fa-eye',
    title: 'Vale por una mirada fija a los ojos',
    desc: 'Un minuto entero mirándonos fijamente a los ojos en silencio hasta que alguien se sonroje primero.'
  },
  {
    category: 'shy',
    catName: 'VALE TÍMIDO & TIERNO',
    iconClass: 'fa-solid fa-hand-holding-heart',
    title: 'Vale por una tomada de mano espontánea',
    desc: 'Entrelazar los dedos durante una caminata y no soltarnos por un buen rato.'
  },
  {
    category: 'shy',
    catName: 'VALE TÍMIDO & TIERNO',
    iconClass: 'fa-solid fa-heart',
    title: 'Vale por una caricia en el cabello',
    desc: 'Un momento relajante acariciando suavemente tu cabello mientras descansamos.'
  },
  {
    category: 'shy',
    catName: 'VALE TÍMIDO & TIERNO',
    iconClass: 'fa-solid fa-envelope',
    title: 'Vale por un mensaje romántico inesperado',
    desc: 'Un texto sincero y tierno a cualquier hora del día para recordarte lo mucho que vales.'
  },
  {
    category: 'shy',
    catName: 'VALE TÍMIDO & TIERNO',
    iconClass: 'fa-solid fa-comment-dots',
    title: 'Vale por un susurro dulce al oído',
    desc: 'Decirte bajito algo hermoso al oído que haga latir tu corazón un poquito más rápido.'
  },

  // Románticos
  {
    category: 'romantic',
    catName: 'VALE ROMÁNTICO',
    iconClass: 'fa-solid fa-mug-hot',
    title: 'Vale por una tarde de postres y café',
    desc: 'Degustar tus postres preferidos entre risas, charlas profundas y abrazos sin mirar el reloj.'
  },
  {
    category: 'romantic',
    catName: 'VALE ROMÁNTICO',
    iconClass: 'fa-solid fa-cloud-moon',
    title: 'Vale por una velada bajo las estrellas',
    desc: 'Una noche tranquila contando estrellas juntos y pidiendo deseos para el futuro.'
  },
  {
    category: 'romantic',
    catName: 'VALE ROMÁNTICO',
    iconClass: 'fa-solid fa-gift',
    title: 'Vale por ser tratada como la Reina del Universo',
    desc: 'Un día entero donde tus deseos y antojos tienen máxima prioridad con una gran sonrisa.'
  },
  {
    category: 'romantic',
    catName: 'VALE ROMÁNTICO',
    iconClass: 'fa-solid fa-film',
    title: 'Vale por Noche de Películas & Mimos',
    desc: 'Tú eliges todas las películas, cobijas suavecitas y snacks ilimitados.'
  },
  {
    category: 'romantic',
    catName: 'VALE ROMÁNTICO',
    iconClass: 'fa-solid fa-music',
    title: 'Vale por un baile lento improvisado',
    desc: 'Bailar una canción romántica a la luz tenue de la habitación sin importar nada más.'
  },

  // Pícaros & Atrevidos
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-kiss-wink-heart',
    title: 'Vale por un beso robado e inesperado',
    desc: 'Un beso apasionado en el lugar y momento menos pensado.'
  },
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-spa',
    title: 'Vale por un masaje relajante completo',
    desc: 'Un masaje en espalda y hombros con aceites aromáticos para quitar todo el estrés.'
  },
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-fire',
    title: 'Vale por 5 minutos de besos sin interrupción',
    desc: 'Un maratón ininterrumpido de besos llenos de intensidad y ternura.'
  },
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-lock-open',
    title: 'Vale por una noche de confesiones pícaras',
    desc: 'Una conversación a solas donde compartiremos secretos, fantasías y risas traviesas.'
  },
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-wand-magic-sparkles',
    title: 'Vale por cumplir una fantasía romántica',
    desc: 'Un pase especial para realizar ese detalle atrevido o romántico que tú elijas.'
  },
  {
    category: 'spicy',
    catName: 'VALE PÍCARO & ATREVIDO',
    isSpicy: true,
    iconClass: 'fa-solid fa-hand-sparkles',
    title: 'Vale por un abrazo por la espalda & beso en el cuello',
    desc: 'Sorprenderte por detrás, envolverte en mis brazos y dejar un beso muy suave y cálido en tu cuello.'
  }
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

  let activeCategory = 'all';
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
    
    // Filter coupons by selected category
    let pool = nesviCoupons;
    if (activeCategory !== 'all') {
      pool = nesviCoupons.filter(c => c.category === activeCategory);
    }
    
    currentCoupon = pool[Math.floor(Math.random() * pool.length)];

    card.classList.remove('glow');
    void card.offsetWidth;

    tag.textContent = currentCoupon.catName;
    if (currentCoupon.isSpicy) {
      tag.classList.add('spicy');
    } else {
      tag.classList.remove('spicy');
    }

    icon.innerHTML = `<i class="${currentCoupon.iconClass}"></i>`;
    title.textContent = currentCoupon.title;
    desc.textContent = currentCoupon.desc;
    claimBtn.style.display = 'inline-flex';
    card.classList.add('glow');

    spawnHeartExplosion(orb.getBoundingClientRect());
  });

  claimBtn.addEventListener('click', () => {
    if (currentCoupon) {
      showModal(
        '¡Vale Reclamado con Éxito para Nesvi!',
        `Has reclamado: "${currentCoupon.title}". Este compromiso romántico ha quedado registrado para hacerse realidad.`
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

  // Load Saved State
  let currentLevel = parseInt(localStorage.getItem('nesvi_level') || '1', 10);
  let lastUnlockedDate = localStorage.getItem('nesvi_last_date') || '';
  const todayStr = new Date().toISOString().split('T')[0];

  let currentClicks = 0;
  // Difficulty formula: Level N requires (N * 10) clicks
  let requiredClicks = currentLevel * 10;

  updateUIState();

  function updateUIState() {
    requiredClicks = currentLevel * 10;
    currentLevelNum.textContent = currentLevel;

    // Constellation stars update: 1 star every 10 levels completed
    const starsUnlocked = Math.min(Math.floor((currentLevel - 1) / 10), 10);
    starsUnlockedCount.textContent = starsUnlocked;
    updateConstellationSky(starsUnlocked);

    // Check if level for today was already completed
    if (lastUnlockedDate === todayStr) {
      // Completed for today!
      dailyStatusBanner.classList.add('completed');
      dailyStatusText.innerHTML = `<i class="fa-solid fa-check-circle"></i> ¡Nivel ${currentLevel - 1} completado hoy! Vuelve mañana para desbloquear el Nivel ${currentLevel}.`;
      bigHeart.classList.add('disabled');
      tapInstruction.textContent = 'Has completado la magia de hoy. ¡Mañana te espera un nuevo desafío!';
      progressBar.style.width = '100%';
      progressText.textContent = 'Completado por hoy';
    } else {
      // Ready to play today!
      dailyStatusBanner.classList.remove('completed');
      dailyStatusText.innerHTML = `<i class="fa-solid fa-sparkles"></i> ¡Nivel ${currentLevel} listo para jugar hoy! Objetivos: ${requiredClicks} toques.`;
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
      return; // Locked for today
    }

    currentClicks++;
    playMagicalChime(400 + currentClicks * 5);

    // Button pulse animation
    bigHeart.style.transform = 'scale(0.88)';
    setTimeout(() => { bigHeart.style.transform = 'scale(1)'; }, 100);

    const percent = Math.min(Math.round((currentClicks / requiredClicks) * 100), 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${currentClicks} / ${requiredClicks} Clics`;
    tapInstruction.textContent = `¡Sigue tocando, Nesvi! (${currentClicks} / ${requiredClicks})`;

    // LEVEL COMPLETE FOR TODAY!
    if (currentClicks >= requiredClicks) {
      lastUnlockedDate = todayStr;
      localStorage.setItem('nesvi_last_date', todayStr);
      localStorage.setItem('nesvi_level', (currentLevel + 1).toString());

      const completedLevel = currentLevel;
      currentLevel++;
      currentClicks = 0;

      playUnicornArpeggio();
      spawnHeartExplosion(bigHeart.getBoundingClientRect());

      addLogMessage(`<i class="fa-solid fa-crown"></i> ¡Felicidades Nesvi! Has conquistado el Nivel ${completedLevel}.`);

      // Check if a new constellation star was lit
      const newStarsCount = Math.min(Math.floor((currentLevel - 1) / 10), 10);
      if (completedLevel % 10 === 0) {
        showModal(
          `¡Nivel ${completedLevel} Completado & Estrella Encendida!`,
          `¡Has alcanzado el Nivel ${completedLevel}! Una nueva estrella se ha encendido en tu constelación del firmamento. Vuelve mañana para continuar tu sendero secreto.`
        );
      } else {
        showModal(
          `¡Nivel ${completedLevel} Completado!`,
          `¡Increíble, Nesvi! Has superado el desafío de hoy (${requiredClicks} clics). Tu siguiente nivel estará disponible mañana.`
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
