// Coatform AI chat assistant (site-wide widget).
// Talks to /api/chat, keeps the conversation for the browser tab so it
// survives page changes, and emails every captured lead via CFsendLead.
// If the AI is unavailable it falls back to a short contact form.
(() => {
  const cfg = window.CF || {};
  const KEY = 'cf-chat-v1';
  const GREETING = "Hi! 👋 I'm Coaty, Coatform's painting assistant. Ask me anything about your project, or tell me what you'd like painted and I'll give you a rough price in under a minute.";
  const CHIPS = ['How much to paint a room?', 'Get me a free quote', 'Do you paint condos?', 'Can I supply my own paint?'];

  const load = () => {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || null; } catch { return null; }
  };
  let state = load() || { open: false, history: [], shown: [], sent: [], fallback: false, teased: false };
  const save = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // Light formatting for assistant replies: links, phone, **bold**, bullet lines.
  const format = (text) => {
    let h = esc(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<)]+[^\s<).,!?])/g, '<a href="$1">$1</a>');
    if (cfg.phone) h = h.split(esc(cfg.phone)).join(`<a href="tel:${cfg.phoneHref}">${esc(cfg.phone)}</a>`);
    const lines = h.split('\n');
    let out = '';
    let inList = false;
    for (const line of lines) {
      const m = line.match(/^\s*[-•*]\s+(.*)/);
      if (m) {
        if (!inList) { out += '<ul>'; inList = true; }
        out += `<li>${m[1]}</li>`;
      } else {
        if (inList) { out += '</ul>'; inList = false; }
        if (line.trim()) out += `<p>${line}</p>`;
      }
    }
    return out + (inList ? '</ul>' : '');
  };

  // ---------- DOM ----------
  const root = document.createElement('div');
  root.className = 'cf-chat';
  root.innerHTML = `
    <div class="cf-chat__tease" hidden>
      <button type="button" class="cf-chat__tease-x" aria-label="Dismiss">×</button>
      <button type="button" class="cf-chat__tease-msg">💬 Want a rough price for your project? Ask me, it takes a minute.</button>
    </div>
    <button type="button" class="cf-chat__launch" aria-expanded="false" aria-controls="cf-chat-panel">
      <span class="cf-chat__launch-icon" aria-hidden="true">💬</span><span class="cf-chat__launch-txt">Get a price</span>
    </button>
    <section class="cf-chat__panel" id="cf-chat-panel" role="dialog" aria-label="Chat with Coatform Painting" hidden>
      <header class="cf-chat__head">
        <img src="/assets/img/mark.png" alt="" width="36" height="36">
        <div><strong>Coaty</strong><span><i></i>Coatform's painting assistant</span></div>
        <button type="button" class="cf-chat__close" aria-label="Close chat">×</button>
      </header>
      <div class="cf-chat__log" aria-live="polite"></div>
      <div class="cf-chat__chips"></div>
      <form class="cf-chat__form">
        <label class="sr-only" for="cf-chat-input">Your message</label>
        <textarea id="cf-chat-input" rows="1" maxlength="1200" placeholder="Type your question…" autocomplete="off"></textarea>
        <button type="submit" aria-label="Send">➤</button>
      </form>
      <p class="cf-chat__fine">AI assistant · prices are rough estimates, not quotes · <a href="/privacy/">Privacy</a></p>
    </section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const panel = $('.cf-chat__panel');
  const launch = $('.cf-chat__launch');
  const log = $('.cf-chat__log');
  const chips = $('.cf-chat__chips');
  const form = $('.cf-chat__form');
  const input = $('#cf-chat-input');
  const tease = $('.cf-chat__tease');
  let busy = false;

  const scroll = () => { log.scrollTop = log.scrollHeight; };
  const bubble = (role, html) => {
    const el = document.createElement('div');
    el.className = `cf-chat__msg cf-chat__msg--${role}`;
    el.innerHTML = html;
    log.appendChild(el);
    scroll();
    return el;
  };
  const addShown = (role, text) => {
    state.shown.push({ role, text });
    save();
    bubble(role, role === 'bot' ? format(text) : `<p>${esc(text)}</p>`);
  };

  function renderAll() {
    log.innerHTML = '';
    bubble('bot', format(GREETING));
    state.shown.forEach((m) => bubble(m.role, m.role === 'bot' ? format(m.text) : `<p>${esc(m.text)}</p>`));
    chips.innerHTML = state.shown.length ? '' : CHIPS.map((c) => `<button type="button">${esc(c)}</button>`).join('');
    if (state.fallback) showFallbackForm();
  }

  function setOpen(open) {
    state.open = open;
    save();
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    launch.setAttribute('aria-expanded', String(open));
    if (open) {
      tease.hidden = true;
      state.teased = true;
      save();
      scroll();
      if (matchMedia('(min-width: 761px)').matches) input.focus();
      if (window.gtag) window.gtag('event', 'chat_open');
    }
  }

  // ---------- leads ----------
  const transcript = () => state.shown.map((m) => `${m.role === 'bot' ? 'Coaty' : 'Visitor'}: ${m.text}`).join('\n\n').slice(-8000);

  function sendLead(lead) {
    const id = [lead.name, lead.phone, lead.email].join('|').toLowerCase();
    if (state.sent.includes(id)) return;
    state.sent.push(id);
    save();
    const data = {
      name: lead.name, phone: lead.phone, email: lead.email, address: lead.address, city: lead.city,
      service: lead.service, projectDetails: lead.projectDetails, timeline: lead.timeline,
      estimateShown: lead.estimateGiven, preferredContact: lead.preferredContact,
      source: 'AI chat assistant', transcript: transcript(),
    };
    window.CFsendLead?.(data, `🤖 New chat lead — ${lead.name}${lead.city ? ` in ${lead.city}` : ''}`).catch(() => {
      state.sent = state.sent.filter((x) => x !== id);
      save();
    });
    if (window.gtag) window.gtag('event', 'generate_lead', { form: 'chat' });
  }

  // ---------- fallback form (AI offline) ----------
  function showFallbackForm() {
    if (log.querySelector('.cf-chat__lead')) return;
    const wrap = bubble('bot', `<p>Leave your details and we'll get back to you within 1 business day, or call <a href="tel:${cfg.phoneHref}">${esc(cfg.phone)}</a>.</p>
      <form class="cf-chat__lead">
        <input name="name" placeholder="Your name" required autocomplete="name">
        <input name="phone" type="tel" placeholder="Phone" autocomplete="tel">
        <input name="email" type="email" placeholder="Email" autocomplete="email">
        <input name="address" placeholder="Address / city" autocomplete="street-address">
        <textarea name="projectDetails" rows="2" placeholder="What would you like painted?" required></textarea>
        <button type="submit" class="btn btn--block">Send</button>
      </form>`);
    const f = wrap.querySelector('form');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!f.phone.value.trim() && !f.email.value.trim()) {
        f.phone.setCustomValidity('Add a phone number or email');
        f.phone.reportValidity();
        f.phone.setCustomValidity('');
        return;
      }
      if (!f.reportValidity()) return;
      const d = Object.fromEntries(new FormData(f));
      sendLead({ ...d, city: '' });
      f.replaceWith(Object.assign(document.createElement('p'), { textContent: `Thanks ${d.name.split(' ')[0]}! 🎉 We'll be in touch within 1 business day.` }));
      state.fallback = false;
      save();
    });
  }

  // ---------- chat ----------
  async function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    chips.innerHTML = '';
    addShown('user', text.trim());
    const typing = bubble('bot', '<span class="cf-chat__dots"><i></i><i></i><i></i></span>');
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ history: state.history, message: text.trim() }),
        signal: ctrl.signal,
      }).finally(() => clearTimeout(t));
      const r = await res.json().catch(() => ({}));
      (r.leads || []).forEach(sendLead);
      typing.remove();
      if (res.ok && r.reply) {
        state.history = r.history;
        addShown('bot', r.reply);
      } else if (res.status === 429 && !r.limit) {
        addShown('bot', `Sorry, I'm a bit swamped right now. Try again in a moment, or call us at ${cfg.phone}.`);
      } else {
        if (r.reset) state.history = [];
        state.fallback = true;
        save();
        showFallbackForm();
      }
    } catch {
      typing.remove();
      state.fallback = true;
      save();
      showFallbackForm();
    } finally {
      busy = false;
    }
  }

  launch.addEventListener('click', () => setOpen(panel.hidden));
  $('.cf-chat__close').addEventListener('click', () => { setOpen(false); launch.focus(); });
  $('.cf-chat__tease-msg').addEventListener('click', () => setOpen(true));
  $('.cf-chat__tease-x').addEventListener('click', () => { tease.hidden = true; state.teased = true; save(); });
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = '';
    input.style.height = '';
    ask(v);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  input.addEventListener('input', () => {
    input.style.height = '';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  // Any "chat with us" link on the page can open the assistant.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-chat]')) { e.preventDefault(); setOpen(true); }
  });

  // Lets other page code (e.g. the /links/ page) open the chat or ask a question.
  window.CFchat = { open: () => setOpen(true), ask: (text) => { setOpen(true); ask(text); } };

  renderAll();
  if (state.open) setOpen(true);
  // Deep links from social posts: ?chat=1 opens the assistant, ?ask=... also sends a question.
  const params = new URLSearchParams(location.search);
  if (params.has('chat') || params.has('ask')) {
    const q = (params.get('ask') || '').slice(0, 300);
    params.delete('chat');
    params.delete('ask');
    history.replaceState(null, '', location.pathname + (params.size ? `?${params}` : '') + location.hash);
    setOpen(true);
    if (q && !state.shown.length) ask(q);
  }
  // Friendly nudge after a little browsing, once per visit.
  if (!state.teased && !state.open) {
    setTimeout(() => { if (panel.hidden && !state.teased) tease.hidden = false; }, 12000);
  }
})();
