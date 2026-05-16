/* ─────────────────────────────────────────
   BARANGAYLINK — VISITOR.JS
───────────────────────────────────────── */

// ── MOCK DATA ────────────────────────────
const ANNOUNCEMENTS = [];

// Get announcements
function getAllAnnouncements() {
  return ANNOUNCEMENTS;
}

const SERVICES = [];

const FILTERS = ['All', 'Food', 'Retail', 'Services'];

// ── RENDER ANNOUNCEMENTS ──────────────────
function renderAnnouncements() {
  const grid = document.getElementById('announceGrid');
  if (!grid) return;
  const allAnnouncements = getAllAnnouncements();
  grid.innerHTML = allAnnouncements.slice(0, 6).map(a => `
    <div class="announce-card" onclick="">
      <div class="ac-meta">
        <span class="ac-cat ${a.cat}">${a.catLabel}</span>
        <span class="ac-date"><i class="fa-regular fa-calendar"></i> ${a.date}</span>
      </div>
      <div class="ac-title">${a.title}</div>
      <div class="ac-excerpt">${a.excerpt}</div>
    </div>
  `).join('');
}

// ── RENDER SERVICES ───────────────────────
function renderServices(filter = 'all') {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? SERVICES : SERVICES.filter(s => s.cat === filter);
  grid.innerHTML = filtered.map(s => `
    <div class="service-card">
      <div class="sc-head">
        <div class="sc-icon" style="background:${s.iconBg}; font-size:22px;">${s.emoji}</div>
        <div class="sc-info">
          <div class="sc-name">${s.name}</div>
          <div class="sc-cat">${s.catIcon} ${s.cat}</div>
        </div>
      </div>
      <div class="sc-verified"><i class="fa-solid fa-circle-check"></i> Barangay Verified</div>
      <div class="sc-desc">${s.desc}</div>
      <div class="sc-footer">
        <span class="sc-addr"><i class="fa-solid fa-location-dot"></i> ${s.addr}</span>
        <span class="sc-rating">★ ${s.rating} <span style="color:#94A3B8;font-weight:400;">(${s.reviews})</span></span>
      </div>
    </div>
  `).join('');
}

// ── FILTER BUTTONS ─────────────────────────
function initFilters() {
  const row = document.getElementById('filterRow');
  if (!row) return;
  row.innerHTML = FILTERS.map((f, i) => `
    <button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${f.toLowerCase()}">${f}</button>
  `).join('');
  row.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderServices(btn.dataset.filter);
    });
  });
}

// ── NAVBAR SCROLL ──────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── SMOOTH NAV LINKS ───────────────────────
function initNavLinks() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');
      if (target && target.startsWith('#')) {
        e.preventDefault();
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

// ── INIT ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderAnnouncements();
  initFilters();
  renderServices('all');
  initNavbar();
  initNavLinks();
});
