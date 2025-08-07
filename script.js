document.addEventListener("DOMContentLoaded", () => {
  // ✅ Fade-in with optional sound effect
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Optional sound effect on fade-in
        if (!entry.target.dataset.played) {
          const audio = new Audio("fadein-sound.mp3"); // Adjust if needed
          setTimeout(() => {
            audio.play().catch(() => {});
          }, 150); // adds slight delay
          entry.target.dataset.played = "true";
        }
      }
    });
  }, {
    threshold: 0.05
  });

  document.querySelectorAll(".fade-in-section").forEach(section => {
    fadeObserver.observe(section);
  });

  // ✅ Animate background gradient shift
  const animatedSections = document.querySelectorAll(".animated-gradient-bg");
  let bgPos = 0;
  const speed = 0.05;

  function animateGradient() {
    bgPos = (bgPos + speed) % 600;
    animatedSections.forEach(section => {
      section.style.backgroundPosition = `${bgPos}% 50%`;
    });
    requestAnimationFrame(animateGradient);
  }
  animateGradient();

  window.addEventListener('resize', () => {
    bgPos = 0; // reset for new layout
  });

  // ✅ Smooth scroll for nav links
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ✅ Optional: pause gradient text animation on hover
  const gradientTextLinks = document.querySelectorAll("nav .gradient-text");
  gradientTextLinks.forEach(el => {
    el.addEventListener("mouseenter", () => {
      el.style.animationPlayState = "paused";
      el.style.color = "#00f4f0";
      el.style.background = "none";
      el.style.webkitTextFillColor = "unset";
    });
    el.addEventListener("mouseleave", () => {
      el.style.animationPlayState = "running";
      el.style.color = "transparent";
      el.style.background = "";
      el.style.webkitTextFillColor = "transparent";
    });
  });

  // ✅ Optionally show only one section (can remove this block if not needed)
  const allSections = document.querySelectorAll(".page-section");
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").replace("#", "");
      allSections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add("show");
        } else {
          section.classList.remove("show");
        }
      });
    });
  });

  // Show only home at first (if using .page-section based visibility)
  allSections.forEach(section => {
    if (section.id !== "home") {
      section.classList.remove("show");
    } else {
      section.classList.add("show");
    }
  });

  // Scroll-to-top button logic
  const scrollBtn = document.createElement('button');
  scrollBtn.textContent = '↑';
  scrollBtn.className = 'scroll-top-btn';
  document.body.appendChild(scrollBtn);

  scrollBtn.style.position = 'fixed';
  scrollBtn.style.bottom = '20px';
  scrollBtn.style.right = '20px';
  scrollBtn.style.padding = '10px 15px';
  scrollBtn.style.borderRadius = '5px';
  scrollBtn.style.border = 'none';
  scrollBtn.style.backgroundColor = '#ffffff99';
  scrollBtn.style.color = '#333';
  scrollBtn.style.cursor = 'pointer';
  scrollBtn.style.zIndex = '999';
  scrollBtn.style.display = 'none';
  scrollBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  scrollBtn.style.backdropFilter = 'blur(5px)';

  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Lazy load images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const lazyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.dataset.src) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  });

  lazyImages.forEach(img => {
    lazyObserver.observe(img);
  });
  // Falling flowers on welcome button click
  const welcomeBtn = document.querySelector('.welcome-button');

  welcomeBtn && welcomeBtn.addEventListener('click', () => {
    const numLines = 10; // number of vertical lines/columns
    const lineSpacing = window.innerWidth / numLines;

    for (let i = 0; i < 30; i++) {
      const flower = document.createElement('img');
      flower.src = 'flower.png'; // Path to flower image
      flower.classList.add('flower');
      flower.style.position = 'fixed';

      // Pick a random line index between 0 and numLines - 1
      const lineIndex = Math.floor(Math.random() * numLines);

      // Calculate x position based on line index + small random offset
      const xPos = lineIndex * lineSpacing + (Math.random() * lineSpacing * 0.5);

      flower.style.left = `${xPos}px`;
      flower.style.top = `-100px`; // Start above screen
      flower.style.zIndex = 9999;
      document.body.appendChild(flower);

      const fallDistance = window.innerHeight + 200;

      flower.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${fallDistance}px)`, opacity: 0 }
      ], {
        duration: 5000,
        easing: 'ease-in',
        fill: 'forwards'
      });

      setTimeout(() => {
        flower.remove();
      }, 5000);

      removeOldFlowers(); // limit number of flowers
    }
  });

  // Smooth one-at-a-time audio playback with volume fading
  const audioTracks = document.querySelectorAll('audio');

  audioTracks.forEach(audio => {
    audio.volume = 0;
    audio.addEventListener('play', () => {
      audioTracks.forEach(other => {
        if (other !== audio) {
          fadeOutAudio(other);
          other.pause();
        }
      });
      fadeInAudio(audio);
    });

    audio.addEventListener('pause', () => {
      fadeOutAudio(audio);
    });
  });

  function fadeInAudio(el) {
    el.volume = 0;
    let volume = 0;
    const fade = setInterval(() => {
      if (volume < 1) {
        volume += 0.05;
        el.volume = Math.min(volume, 1);
      } else {
        clearInterval(fade);
      }
    }, 50);
  }

  function fadeOutAudio(el) {
    let volume = el.volume;
    const fade = setInterval(() => {
      if (volume > 0) {
        volume -= 0.05;
        el.volume = Math.max(volume, 0);
      } else {
        clearInterval(fade);
      }
    }, 50);
  }
});


const tapSound = new Audio('mouse-tap-single-studio-vocal-hd-379364.mp3');
tapSound.preload = 'auto';
tapSound.load();

document.addEventListener('click', (event) => {
  const target = event.target;
  if (
    target.tagName === 'BUTTON' ||
    (target.tagName === 'A' && target.href) ||
    target.closest('button') ||
    target.closest('a[href]')
  ) {
    const soundClone = tapSound.cloneNode();
    soundClone.volume = 0.8 + Math.random() * 0.2;
    soundClone.playbackRate = 0.9 + Math.random() * 0.2;
    soundClone.play();
  }
});

const MAX_FLOWERS = 70;

function removeOldFlowers() {
  const flowers = document.querySelectorAll('.flower');
  if (flowers.length > MAX_FLOWERS) {
    for (let i = 0; i < flowers.length - MAX_FLOWERS; i++) {
      flowers[i].remove();
    }
  }
}