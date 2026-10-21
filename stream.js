/* Progressive enhancement: all portfolio content is already in the HTML.
   This never fetches, removes, or rewrites the portfolio's text. */
// A native disclosure also reveals the supplied portrait without JavaScript.
(() => {
  const studio = document.getElementById('portrait-studio');
  if (!studio) return;
  const introduction = document.getElementById('hero-introduction');
  const control = studio.querySelector('summary');
  const status = studio.querySelector('.portrait-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;

  function reveal() {
    window.clearTimeout(timer);
    studio.classList.remove('is-generating');
    status.textContent = 'Here’s a face to go with the name.';
  }

  studio.addEventListener('toggle', () => {
    reveal();
    // The grid keeps the introduction's space while CSS crossfades the views.
    // Inert also removes its links from keyboard navigation during the fade.
    introduction.inert = studio.open;
    if (!studio.open || motion.matches) return;
    status.textContent = 'Generating an image…';
    studio.classList.add('is-generating');
    timer = window.setTimeout(reveal, 1200);
  });
  motion.addEventListener('change', event => { if (event.matches) reveal(); });
  document.querySelector('a[href="#about"]')?.addEventListener('click', () => { studio.open = false; });
  document.addEventListener('keydown', event => {
    if (!studio.open) return;
    if (event.key === 'Escape') {
      studio.open = false;
      control.focus({ preventScroll: true });
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      studio.open = false;
    }
  });
  window.addEventListener('pagehide', reveal);
})();

(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.getElementById('stream-toggle');
  const root = document.documentElement;
  const words = [];
  let streaming = false;
  let frame;
  let watchdog;
  let cursor;

  function finish() {
    root.classList.remove('is-streaming');
    streaming = false;
    window.cancelAnimationFrame(frame);
    window.clearTimeout(watchdog);
    cursor?.classList.remove('stream-cursor');
    cursor = null;
    toggle.textContent = 'Replay text';
  }

  // Nothing is animated for reduced motion, a direct section link, or a
  // restored scroll position. These visits should be immediately readable.
  if (!toggle || motion.matches || window.location.hash || window.scrollY > 0) return;

  try {
    for (const element of document.querySelectorAll('[data-stream]')) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      for (const node of nodes) {
        const fragment = document.createDocumentFragment();
        for (const part of node.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
          } else {
            const word = document.createElement('span');
            word.className = 'stream-word';
            word.textContent = part;
            fragment.append(word);
            words.push(word);
          }
        }
        node.replaceWith(fragment);
      }
    }

    function start() {
      if (motion.matches || !words.length) return;
      finish();
      for (const word of words) word.setAttribute('data-pending', '');
      toggle.textContent = 'Show all text';
      toggle.hidden = false;
      streaming = true;
      // Schedule the safety reset before hiding any words. Even an interrupted
      // animation cannot leave the page visually incomplete indefinitely.
      watchdog = window.setTimeout(finish, 6500);
      root.classList.add('is-streaming');
      const started = performance.now() + 120;
      const duration = Math.min(4800, Math.max(1800, words.length * 16));
      let revealed = 0;

      function tick(now) {
        try {
          const count = Math.min(words.length, Math.floor(Math.max(0, now - started) / duration * words.length));
          if (count > revealed) {
            cursor?.classList.remove('stream-cursor');
            while (revealed < count) words[revealed++].removeAttribute('data-pending');
            cursor = words[revealed - 1];
            cursor.classList.add('stream-cursor');
          }
          if (revealed < words.length) frame = window.requestAnimationFrame(tick);
          else finish();
        } catch {
          finish();
        }
      }
      frame = window.requestAnimationFrame(tick);
    }

    toggle.addEventListener('click', () => {
      if (streaming) {
        finish();
      } else {
        const studio = document.getElementById('portrait-studio');
        if (studio) studio.open = false;
        start();
      }
    });
    document.getElementById('portrait-studio')?.addEventListener('toggle', event => {
      if (event.target.open) finish();
    });
    // Explicit skips, keyboard focus, browser find, and printing never wait.
    // Scrolling leaves the word-by-word animation running.
    document.addEventListener('focusin', event => {
      if (streaming && event.target !== toggle) finish();
    });
    document.addEventListener('click', event => {
      if (streaming && event.target.closest('a')) finish();
    });
    document.addEventListener('keydown', event => {
      if (streaming && (event.key === 'Escape' || event.ctrlKey || event.metaKey)) finish();
    });
    window.addEventListener('beforeprint', finish);
    window.addEventListener('pagehide', finish);
    window.addEventListener('pageshow', event => { if (event.persisted) finish(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
    motion.addEventListener('change', event => {
      if (event.matches) {
        finish();
        toggle.hidden = true;
      }
    });

    start();
  } catch {
    finish();
    toggle.hidden = true;
  }
})();

// Let the fixed contact panel gently trail scrolling, then return to center.
(() => {
  const panel = document.querySelector('.contact-links');
  if (!panel) return;
  const motion = window.matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)');
  let lastScroll = window.scrollY;
  let offset = 0;
  let frame = 0;
  let lastTime = 0;

  function reset() {
    window.cancelAnimationFrame(frame);
    frame = 0;
    offset = 0;
    lastScroll = window.scrollY;
    panel.style.removeProperty('--contact-offset');
  }

  function settle(now) {
    const elapsed = Math.min(now - lastTime, 64);
    lastTime = now;
    offset *= Math.exp(-elapsed / 150);
    if (Math.abs(offset) < 0.1) {
      reset();
      return;
    }
    panel.style.setProperty('--contact-offset', `${offset.toFixed(2)}px`);
    frame = window.requestAnimationFrame(settle);
  }

  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (!motion.matches) return;
    const limit = Math.min(36, Math.max(0, (window.innerHeight - panel.offsetHeight) / 2 - 16));
    offset = Math.max(-limit, Math.min(limit, offset - delta * 0.3));
    panel.style.setProperty('--contact-offset', `${offset.toFixed(2)}px`);
    if (!frame) {
      lastTime = performance.now();
      frame = window.requestAnimationFrame(settle);
    }
  }, { passive: true });
  motion.addEventListener('change', reset);
  window.addEventListener('resize', reset);
  window.addEventListener('pagehide', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
})();
