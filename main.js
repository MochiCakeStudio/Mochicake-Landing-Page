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
  var startBtn = document.getElementById('startBtn');
  var startMenuDrawer = document.getElementById('startMenuDrawer');
  var startMenuClose = document.getElementById('startMenuClose');
  document.addEventListener('click', function(e) {
    // If Start button is clicked, toggle drawer
    if (startBtn && startMenuDrawer && startBtn.contains(e.target)) {
      startMenuDrawer.classList.toggle('hidden');
    } else if (startMenuDrawer && !startMenuDrawer.contains(e.target) && !startBtn.contains(e.target)) {
      // Click outside drawer closes it
      startMenuDrawer.classList.add('hidden');
    }
  });
  // Close Start Menu Drawer with header X button
  if (startMenuClose && startMenuDrawer) {
    startMenuClose.addEventListener('click', function() {
      startMenuDrawer.classList.add('hidden');
    });
  }

  // --- Audio Feedback for Navigation Buttons ---
  // Play guestbook chime (first 1s) on Home, About, Projects, Guestbook click
  const navButtons = document.querySelectorAll('.bar-app');
  const guestbookChime = document.getElementById('guestbook-chime');
  navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (guestbookChime) {
        guestbookChime.currentTime = 0;
        guestbookChime.play();
        setTimeout(() => {
          guestbookChime.pause();
          guestbookChime.currentTime = 0;
        }, 1000); // Stop after 1 second
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
    },
    FAQ: {
      btn: getBarAppByText('FAQ'),
      popup: document.getElementById('popup-window-faq'),
      close: document.getElementById('popup-close-faq'),
      titleBar: document.getElementById('popup-title-bar-faq'),
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

  // FAQ Popup logic
  var faqTab = document.getElementById('faq-tab');
  var faqPopup = document.getElementById('popup-window-faq');
  var faqClose = document.getElementById('popup-close-faq');

  if (faqTab && faqPopup && faqClose) {
    faqTab.addEventListener('click', function() {
      // Hide all other popups
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      // Toggle FAQ popup
      if (faqPopup.classList.contains('hidden')) {
        faqPopup.classList.remove('hidden');
        faqPopup.focus && faqPopup.focus();
      } else {
        faqPopup.classList.add('hidden');
      }
    });
    faqClose.addEventListener('click', function() {
      faqPopup.classList.add('hidden');
    });
    // Make FAQ popup draggable
    var titleBar = faqPopup.querySelector('.title-bar');
    var isDragging = false, offsetX = 0, offsetY = 0;
    titleBar.addEventListener('mousedown', function(e) {
      isDragging = true;
      offsetX = e.clientX - faqPopup.offsetLeft;
      offsetY = e.clientY - faqPopup.offsetTop;
      faqPopup.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      faqPopup.style.left = (e.clientX - offsetX) + 'px';
      faqPopup.style.top = (e.clientY - offsetY) + 'px';
      faqPopup.style.transform = 'none';
    });
    document.addEventListener('mouseup', function() {
      isDragging = false;
      faqPopup.style.cursor = 'grab';
      document.body.style.userSelect = '';
    });
  }

  // Socials dropdown logic
  var socialsTab = document.getElementById('socials-tab');
  var socialsDropdown = document.getElementById('socials-dropdown');
  var socialsArrow = document.getElementById('socials-arrow');
  if (socialsTab && socialsDropdown && socialsArrow) {
    socialsTab.addEventListener('click', function() {
      var open = socialsDropdown.style.display === 'block';
      socialsDropdown.style.display = open ? 'none' : 'block';
      socialsArrow.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
    });
  }

  // --- Start Menu Home Link triggers Home popup ---
  var startmenuHomeBtn = document.getElementById('startmenuHomeBtn');
  var homePopup = document.getElementById('popup-window-home');
  var homeNavBtn = getBarAppByText('Home');
  if (startmenuHomeBtn && homePopup) {
    startmenuHomeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Mimic nav Home button: open Home popup, highlight nav button
      // Hide all other popups
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      homePopup.classList.remove('hidden');
      if (homeNavBtn) {
        homeNavBtn.style.background = '#ffc0c8';
        homeNavBtn.style.color = '#000';
      }
    });
  }

  // --- Start Menu Links trigger popups like nav bar ---
  var startmenuAboutBtn = document.getElementById('startmenuAboutBtn');
  var aboutPopup = document.getElementById('popup-window-about');
  var aboutNavBtn = getBarAppByText('About');
  if (startmenuAboutBtn && aboutPopup) {
    startmenuAboutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      aboutPopup.classList.remove('hidden');
      if (aboutNavBtn) {
        aboutNavBtn.style.background = '#ffe0c8';
        aboutNavBtn.style.color = '#000';
      }
    });
  }

  var startmenuProjectsBtn = document.getElementById('startmenuProjectsBtn');
  var projectsPopup = document.getElementById('popup-window-projects');
  var projectsNavBtn = getBarAppByText('Projects');
  if (startmenuProjectsBtn && projectsPopup) {
    startmenuProjectsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      projectsPopup.classList.remove('hidden');
      if (projectsNavBtn) {
        projectsNavBtn.style.background = '#e0ffc8';
        projectsNavBtn.style.color = '#000';
      }
    });
  }

  var startmenuGuestbookBtn = document.getElementById('startmenuGuestbookBtn');
  var guestbookPopup = document.getElementById('popup-window-guestbook');
  var guestbookNavBtn = getBarAppByText('Guestbook');
  if (startmenuGuestbookBtn && guestbookPopup) {
    startmenuGuestbookBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      guestbookPopup.classList.remove('hidden');
      if (guestbookNavBtn) {
        guestbookNavBtn.style.background = '';
        guestbookNavBtn.style.color = '#000';
      }
    });
  }

  var startmenuFaqBtn = document.getElementById('startmenuFaqBtn');
  var faqPopup = document.getElementById('popup-window-faq');
  var faqNavBtn = getBarAppByText('FAQ');
  if (startmenuFaqBtn && faqPopup) {
    startmenuFaqBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var popups = document.querySelectorAll('.window');
      popups.forEach(function(p) { p.classList.add('hidden'); });
      faqPopup.classList.remove('hidden');
      if (faqNavBtn) {
        faqNavBtn.style.background = '';
        faqNavBtn.style.color = '#000';
      }
    });
  }

  // --- Start Menu Socials Button (dropdown/flyout) ---
  var startmenuSocialsBtn = document.getElementById('startmenuSocialsBtn');
  var socialsDropdown = document.getElementById('socials-dropdown');
  var socialsArrow = document.getElementById('socials-arrow');
  if (startmenuSocialsBtn && socialsDropdown && socialsArrow) {
    startmenuSocialsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var open = socialsDropdown.style.display === 'block';
      socialsDropdown.style.display = open ? 'none' : 'block';
      socialsArrow.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
    });
  }
});
