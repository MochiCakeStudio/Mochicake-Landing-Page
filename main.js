// --- Splash Screen Enter Button Handler ---
function enterSite() {
  // Play entry sound and hide splash, show main content
  const sound = document.getElementById('enter-sound');
  sound.currentTime = 0;
  sound.play();
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
}

// --- Main DOMContentLoaded Handler ---
document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;

  // --- Interactive Elements: Pointer Cursor ---
  // Remove sparkle cursor on hover, revert to pointer
  const sparkleTargets = document.querySelectorAll('button, .bar-app, .start-btn, .title-bar-buttons span');
  sparkleTargets.forEach(el => {
    el.addEventListener('mouseenter', () => { body.classList.remove('sparkle-cursor'); body.style.cursor = 'pointer'; });
    el.addEventListener('mouseleave', () => { body.style.cursor = 'default'; });
  });

  // --- Start Menu Drawer Toggle ---
  const startBtn = document.getElementById('startBtn');
  const startMenuDrawer = document.getElementById('startMenuDrawer');
  document.addEventListener('click', function(e) {
    // If Start button is clicked, toggle drawer
    if (startBtn && startMenuDrawer && startBtn.contains(e.target)) {
      startMenuDrawer.classList.toggle('hidden');
    } else if (startMenuDrawer && !startMenuDrawer.contains(e.target)) {
      // Click outside drawer closes it
      startMenuDrawer.classList.add('hidden');
    }
  });

  // --- Audio Feedback for Navigation Buttons ---
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

  // --- Pop-up Window Logic for Desktop Bar Apps ---
  // Select nav buttons by text content instead of nth-child
  function getBarAppByText(text) {
    return Array.from(document.querySelectorAll('.bar-app')).find(el => el.textContent.trim().toLowerCase() === text.toLowerCase());
  }
  const popups = {
    Home: {
      btn: getBarAppByText('Home'),
      popup: document.getElementById('popup-window-home'),
      close: document.getElementById('popup-close-home'),
      titleBar: document.getElementById('popup-title-bar-home'),
      color: '#ffc0c8',
    },
    About: {
      btn: getBarAppByText('About'),
      popup: document.getElementById('popup-window-about'),
      close: document.getElementById('popup-close-about'),
      titleBar: document.getElementById('popup-title-bar-about'),
      color: '#ffe0c8',
    },
    Projects: {
      btn: getBarAppByText('Projects'),
      popup: document.getElementById('popup-window-projects'),
      close: document.getElementById('popup-close-projects'),
      titleBar: document.getElementById('popup-title-bar-projects'),
      color: '#e0ffc8',
    },
    Guestbook: {
      btn: getBarAppByText('Guestbook'),
      popup: document.getElementById('popup-window-guestbook'),
      close: document.getElementById('popup-close-guestbook'),
      titleBar: document.getElementById('popup-title-bar-guestbook'),
      color: '#c8e0ff',
    },
  };
  Object.values(popups).forEach(({btn, popup, close, titleBar, color}) => {
    if (btn && popup && close && titleBar) {
      // --- Highlight nav button when popup is open ---
      function setActive(active) {
        btn.style.background = active ? color : 'none';
        btn.style.color = active ? '#000' : '#fff';
      }
      // --- Toggle popup open/close on nav button click ---
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
      // --- Close popup on close button click ---
      close.addEventListener('click', function() {
        popup.classList.add('hidden');
        setActive(false);
      });
      // --- Draggable Popup Window Logic ---
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
