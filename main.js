function enterSite() {
  const sound = document.getElementById('enter-sound');
  sound.currentTime = 0;
  sound.play();
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  document.addEventListener('mousemove', function(e) {
    body.classList.add('custom-cursor-active');
    body.style.setProperty('--cursor-x', e.clientX + 'px');
    body.style.setProperty('--cursor-y', e.clientY + 'px');
    body.style.setProperty('--cursor-transform', `translate(${e.clientX - 16}px, ${e.clientY - 16}px) scaleX(-1)`);
    body.style.cursor = 'none';
    let styleTag = document.getElementById('custom-cursor-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'custom-cursor-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `body::after { transform: var(--cursor-transform, scaleX(-1) translate(-16px, -16px)); left: 0; top: 0; }`;
  });
  // Remove sparkle cursor on hover, revert to pointer
  const sparkleTargets = document.querySelectorAll('button, .bar-app, .start-btn, .title-bar-buttons span');
  sparkleTargets.forEach(el => {
    el.addEventListener('mouseenter', () => { body.classList.remove('sparkle-cursor'); body.style.cursor = 'pointer'; });
    el.addEventListener('mouseleave', () => { body.style.cursor = 'none'; });
  });
  // Play audio for 0.01s on Home, About, Projects, Guestbook click
  const navButtons = document.querySelectorAll('.bar-app');
  const sound = document.getElementById('enter-sound');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (sound) {
        sound.currentTime = 0;
        sound.play();
        setTimeout(() => { sound.pause(); sound.currentTime = 0; }, 10); // 0.01 seconds
      }
    });
  });
  // Pop up windows on nav click
  const popups = {
    Home: {
      btn: document.querySelector('.bar-app:nth-child(1)'),
      popup: document.getElementById('popup-window-home'),
      close: document.getElementById('popup-close-home'),
      titleBar: document.getElementById('popup-title-bar-home'),
      color: '#ffc0c8',
    },
    About: {
      btn: document.querySelector('.bar-app:nth-child(2)'),
      popup: document.getElementById('popup-window-about'),
      close: document.getElementById('popup-close-about'),
      titleBar: document.getElementById('popup-title-bar-about'),
      color: '#ffe0c8',
    },
    Projects: {
      btn: document.querySelector('.bar-app:nth-child(3)'),
      popup: document.getElementById('popup-window-projects'),
      close: document.getElementById('popup-close-projects'),
      titleBar: document.getElementById('popup-title-bar-projects'),
      color: '#e0ffc8',
    },
    Guestbook: {
      btn: document.querySelector('.bar-app:nth-child(4)'),
      popup: document.getElementById('popup-window-guestbook'),
      close: document.getElementById('popup-close-guestbook'),
      titleBar: document.getElementById('popup-title-bar-guestbook'),
      color: '#c8e0ff',
    },
  };
  Object.values(popups).forEach(({btn, popup, close, titleBar, color}) => {
    if (btn && popup && close && titleBar) {
      function setActive(active) {
        btn.style.background = active ? color : '#fff';
        btn.style.color = '#000';
      }
      btn.addEventListener('click', function(e) {
        // Toggle this popup only
        const isOpen = !popup.classList.contains('hidden');
        if (isOpen) {
          popup.classList.add('hidden');
          setActive(false);
        } else {
          popup.classList.remove('hidden');
          setActive(true);
        }
      });
      close.addEventListener('click', function() {
        popup.classList.add('hidden');
        setActive(false);
      });
      // Draggable
      let isDragging = false, offsetX = 0, offsetY = 0, startX = 0, startY = 0;
      titleBar.addEventListener('mousedown', function(e) {
        isDragging = true;
        popup.style.transition = 'none';
        startX = e.clientX;
        startY = e.clientY;
        const rect = popup.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
        document.body.style.userSelect = 'none';
      });
      document.addEventListener('mousemove', function(e) {
        if (isDragging) {
          let newLeft = e.clientX - offsetX;
          let newTop = e.clientY - offsetY;
          const winW = window.innerWidth, winH = window.innerHeight;
          const popupW = popup.offsetWidth, popupH = popup.offsetHeight;
          newLeft = Math.max(0, Math.min(newLeft, winW - popupW));
          newTop = Math.max(0, Math.min(newTop, winH - popupH));
          popup.style.left = newLeft + 'px';
          popup.style.top = newTop + 'px';
          popup.style.transform = 'none';
        }
      });
      document.addEventListener('mouseup', function() {
        isDragging = false;
        document.body.style.userSelect = '';
      });
    }
  });
});
