// Test push access
(function () {

  // ===== THEME TOGGLE =====
  var themeToggle = document.getElementById('themeToggle');
  var currentTheme = localStorage.getItem('theme') || 'light';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    initParticles();
  }

  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      // Add a brief scale animation
      this.style.transform = 'scale(0.8)';
      setTimeout(function () {
        themeToggle.style.transform = '';
      }, 200);
      applyTheme(newTheme);
    });
  }

  // ===== HERO PARTICLES =====
  var particleAnimId;

  function initParticles() {
    var canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;
    var mouseX = -1000;
    var mouseY = -1000;

    function resize() {
      var hero = document.getElementById('hero');
      if (hero) {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // Track mouse for interactive particles
    var hero = document.getElementById('hero');
    if (hero) {
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      hero.addEventListener('mouseleave', function () {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var r = isLight ? 21 : 69;
    var g = isLight ? 101 : 196;
    var b = isLight ? 192 : 232;

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2
      };
    }

    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    if (particleAnimId) cancelAnimationFrame(particleAnimId);

    var time = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse attraction
        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          var force = (180 - dist) / 180 * 0.02;
          p.x += dx * force;
          p.y += dy * force;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        var pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.5 + 0.5;
        var currentOpacity = p.opacity * (0.5 + pulse * 0.5);

        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + currentOpacity + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fill();

        // Glow effect for larger particles
        if (p.size > 2) {
          ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (currentOpacity * 0.15) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Connection lines
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx2 = particles[i].x - particles[j].x;
          var dy2 = particles[i].y - particles[j].y;
          var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 140) {
            var lineOpacity = (1 - dist2 / 140) * 0.1;
            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + lineOpacity + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particleAnimId = requestAnimationFrame(animate);
    }

    animate();
  }

  window.initParticles = initParticles;
  initParticles();

  // ===== NAV SCROLL =====
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var nav = document.querySelector('nav');
    var scrollY = window.scrollY;
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  // ===== HAMBURGER MENU =====
  var hamburger = document.querySelector('.hamburger');
  var navMobile = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      navMobile.classList.toggle('open');
    });
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('open');
      });
    });
  }

  // ===== SCROLL REVEAL (all types) =====
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Observe why-items too
  document.querySelectorAll('.why-item').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    var text = el.textContent.trim();
    var suffix = '';
    var target = 0;

    if (text.indexOf('%') !== -1) {
      suffix = '%';
      target = parseInt(text);
    } else if (text.indexOf('+') !== -1) {
      suffix = '+';
      target = parseInt(text);
    } else if (text.indexOf('M') !== -1) {
      suffix = 'M+';
      target = parseInt(text);
    } else {
      target = parseInt(text);
    }

    if (isNaN(target)) return;

    var current = 0;
    var duration = 2000;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      current = Math.floor(easedProgress * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    el.textContent = '0' + suffix;
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.why-big-stat .stat .num').forEach(function (el) {
    counterObserver.observe(el);
  });

  document.querySelectorAll('.spec-count .sc .n').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ===== PRICING SLIDER =====
  var labels = ['Less than $50k', '$50k', '$100k', '$500k', '$5M', '$10M+'];
  var slider = document.getElementById('collectionsSlider');
  var display = document.getElementById('sliderDisplay');

  function updateSlider(val) {
    if (display) display.textContent = labels[val];
    if (slider) {
      var pct = (val / slider.max) * 100;
      slider.style.background = 'linear-gradient(to right, var(--color-accent) ' + pct + '%, var(--color-border) ' + pct + '%)';
    }
  }

  if (slider) {
    slider.addEventListener('input', function () {
      updateSlider(this.value);
    });
    updateSlider(0);
  }

  // ===== FAQ TOGGLE =====
  window.toggleFaq = function (el) {
    var item = el.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function (i) {
      i.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
  };

  // ===== QUOTE BUTTON RIPPLE =====
  var quoteBtn = document.querySelector('.btn-quote');
  if (quoteBtn) {
    quoteBtn.addEventListener('click', function (e) {
      var rect = this.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 600);
    });
  }

  // ===== PARALLAX HERO SCROLL =====
  window.addEventListener('scroll', function () {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var scrolled = window.scrollY;
    var heroHeight = hero.offsetHeight;
    if (scrolled < heroHeight) {
      var content = hero.querySelector('.hero-content');
      if (content) {
        content.style.transform = 'translateY(' + (scrolled * 0.18) + 'px)';
        content.style.opacity = 1 - (scrolled / heroHeight) * 0.6;
      }
      var canvas = document.getElementById('hero-particles');
      if (canvas) {
        canvas.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
      }
    }
  });

  // ===== MAGNETIC HOVER on service cards =====
  document.querySelectorAll('.service-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 20;
      var rotateY = (centerX - x) / 20;
      card.style.transform = 'translateY(-8px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ===== TILT on testimonial cards =====
  document.querySelectorAll('.testi-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 25;
      var rotateY = (centerX - x) / 25;
      card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ===== SMOOTH SCROLL for nav links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offsetTop = target.offsetTop - 72;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== TYPED TEXT EFFECT on hero slogan =====
  var slogan = document.querySelector('.hero-slogan');
  if (slogan) {
    var sloganText = slogan.textContent;
    slogan.textContent = '';
    slogan.style.borderRight = '2px solid var(--color-primary)';
    var charIndex = 0;
    function typeChar() {
      if (charIndex < sloganText.length) {
        slogan.textContent += sloganText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 40);
      } else {
        setTimeout(function () {
          slogan.style.borderRight = 'none';
        }, 1500);
      }
    }
    setTimeout(typeChar, 600);
  }

  // ===== SCROLL PROGRESS BAR =====
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // ===== CURSOR GLOW TRAIL =====
  var cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    var glowX = 0, glowY = 0;
    var targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.classList.add('active');
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('active');
    });

    function updateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
  }

  // ===== PROCESS LINE ANIMATION =====
  var processSteps = document.querySelector('.process-steps');
  if (processSteps) {
    var processObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-animated');
        }
      });
    }, { threshold: 0.3 });
    processObserver.observe(processSteps);
  }

  // ===== TESTI-CARD REVEAL for animated stars =====
  document.querySelectorAll('.testi-card').forEach(function (card) {
    var testiObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.3 });
    testiObserver.observe(card);
  });

  // ===== NAV ACTIVE LINK HIGHLIGHT =====
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var height = sec.offsetHeight;
      var id = sec.getAttribute('id');
      var link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.style.color = 'var(--color-primary)';
        } else {
          link.style.color = '';
        }
      }
    });
  });

  // ===== RANDOM FLOATING MICRO-DOTS across page =====
  function createFloatingDots() {
    var body = document.body;
    for (var i = 0; i < 15; i++) {
      var dot = document.createElement('div');
      dot.style.cssText = 'position:fixed;width:' + (Math.random() * 4 + 2) + 'px;height:' + (Math.random() * 4 + 2) + 'px;border-radius:50%;background:rgba(var(--color-particle),' + (Math.random() * 0.08 + 0.02) + ');pointer-events:none;z-index:0;';
      dot.style.left = Math.random() * 100 + 'vw';
      dot.style.top = Math.random() * 100 + 'vh';
      dot.style.animation = 'floatingDot ' + (Math.random() * 15 + 10) + 's ease-in-out infinite ' + (Math.random() * 5) + 's';
      body.appendChild(dot);
    }

    var style = document.createElement('style');
    style.textContent = '@keyframes floatingDot{0%,100%{transform:translate(0,0);opacity:0.3}25%{transform:translate(' + (Math.random() * 40 - 20) + 'px,' + (Math.random() * -60 - 10) + 'px);opacity:0.7}50%{transform:translate(' + (Math.random() * -30 + 10) + 'px,' + (Math.random() * 40 - 20) + 'px);opacity:0.2}75%{transform:translate(' + (Math.random() * 50 - 25) + 'px,' + (Math.random() * -40) + 'px);opacity:0.5}}';
    document.head.appendChild(style);
  }
  createFloatingDots();

  // ===== ENHANCED THEME TOGGLE with spin =====
  if (themeToggle) {
    themeToggle.addEventListener('mouseenter', function () {
      this.style.transition = 'transform 0.3s ease';
      this.style.transform = 'rotate(15deg) scale(1.1)';
    });
    themeToggle.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  }

  // ===== SECTION TITLE WORD ANIMATION =====
  document.querySelectorAll('.section-title').forEach(function (title) {
    // Skip hero title (it has its own animation)
    if (title.closest('#hero')) return;

    var html = title.innerHTML;
    var words = html.split(/(\s+)/);
    var wrapped = words.map(function (word, i) {
      if (word.trim() === '') return word;
      if (word.indexOf('<') !== -1) return word; // skip HTML tags
      return '<span class="word-anim" style="display:inline-block;transition:opacity 0.5s ease ' + (i * 0.06) + 's, transform 0.5s ease ' + (i * 0.06) + 's;">' + word + '</span>';
    }).join('');
    title.innerHTML = wrapped;
  });

  // Observe section titles for word animation
  var titleObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var words = entry.target.querySelectorAll('.word-anim');
        words.forEach(function (w) {
          w.style.opacity = '1';
          w.style.transform = 'translateY(0)';
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-title').forEach(function (t) {
    if (t.closest('#hero')) return;
    var words = t.querySelectorAll('.word-anim');
    words.forEach(function (w) {
      w.style.opacity = '0';
      w.style.transform = 'translateY(12px)';
    });
    titleObserver.observe(t);
  });

  // ===== EMAILJS FORM SUBMISSION =====
  var auditForm = document.getElementById('auditForm');
  var formStatus = document.getElementById('formStatus');

  if (auditForm) {
    auditForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = document.getElementById('auditSubmitBtn');
      var originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
      formStatus.style.display = 'none';

      // Get current slider selection
      var sliderDisplay = document.getElementById('sliderDisplay');
      var collectionsValue = sliderDisplay ? sliderDisplay.textContent : 'Not specified';

      // Use explicit template params rather than form data
      // Changing practiceName simply to "practice" to avoid any camelCase variable bugs
      var practiceValue = document.getElementById('auditPractice').value;
      
      var templateParams = {
        fullName: document.getElementById('auditName').value,
        practice: practiceValue,
        email: document.getElementById('auditEmail').value,
        phone: document.getElementById('auditPhone').value,
        collections: collectionsValue
      };

      console.log('Sending this EXACT object to EmailJS:', templateParams);

      emailjs.send("service_uv08rgo", "template_y5omeaf", templateParams)
        .then(function (response) {
          console.log('SUCCESS!', response.status, response.text);
          formStatus.textContent = 'Thank you! Your audit request has been sent.';
          formStatus.style.color = 'var(--color-primary)';
          formStatus.style.display = 'block';
          auditForm.reset();
          // Reset slider
          var collectionsSlider = document.getElementById('collectionsSlider');
          if (collectionsSlider) {
            collectionsSlider.value = 0;
            var evt = new Event('input');
            collectionsSlider.dispatchEvent(evt);
          }
        }, function (error) {
          console.error('FAILED...', error);
          formStatus.textContent = 'Oops! Something went wrong. Please check console or try again later.';
          formStatus.style.color = 'red';
          formStatus.style.display = 'block';
        })
        .finally(function () {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }

})();
