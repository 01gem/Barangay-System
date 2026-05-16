/* ─────────────────────────────────────────
   BARANGAYLINK — OFFICIAL.JS
───────────────────────────────────────── */

const API_BASE = '../api';
let RESIDENTS = [];
let DOC_REQUESTS = [];
let COMPLAINTS_ADMIN = [];
const ANNOUNCEMENTS_DATA = [];
const SERVICES_DATA = [];
const AUDIT_LOG = [];

// ── TAB SWITCHING ─────────────────────────
function switchTab(name) {
  document.querySelectorAll('.snav-item[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${name}`));
  const titles = {
    dashboard:'Dashboard', residents:'Resident Management', requests:'Document Requests',
    complaints:'Complaints & Concerns', announcements:'Announcements',
    services:'Local Services Directory', auditlog:'Audit Log'
  };
  document.getElementById('pageTitle').textContent = titles[name] || name;
}
function initNav() {
  document.querySelectorAll('.snav-item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

// ── DASHBOARD ─────────────────────────────
function renderDashStats() {
  const el = document.getElementById('dashStats');
  if (!el) return;
  const totalResidents = RESIDENTS.length;
  const pendingRequests = DOC_REQUESTS.filter(r => r.status === 'pending').length;
  const openComplaints = COMPLAINTS_ADMIN.filter(c => c.status !== 'resolved').length;
  const verifiedServices = SERVICES_DATA.length;
  const stats = [
    { val:String(totalResidents),  lbl:'Total Residents',   trend:'0 this month', ico:'fa-users',      bg:'#DBEAFE', color:'#1976D2' },
    { val:String(pendingRequests), lbl:'Pending Requests',  trend:'0 pending',    ico:'fa-file-clock', bg:'#FEF9C3', color:'#D97706' },
    { val:String(openComplaints),  lbl:'Open Complaints',   trend:'0 open',       ico:'fa-flag',       bg:'#FEE2E2', color:'#EF4444' },
    { val:String(verifiedServices),lbl:'Verified Services', trend:'0 verified',   ico:'fa-store',      bg:'#CCFBF1', color:'#0D9488' },
  ];
  el.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="sc-ico" style="background:${s.bg};color:${s.color}"><i class="fa-solid ${s.ico}"></i></div>
      <div class="sc-data">
        <div class="sc-val">${s.val}</div>
        <div class="sc-lbl">${s.lbl}</div>
        <div class="sc-trend"><i class="fa-solid fa-arrow-trend-up"></i> ${s.trend}</div>
      </div>
    </div>
  `).join('');
}

function renderDashPendingReqs() {
  const el = document.getElementById('dashPendingReqs');
  if (!el) return;
  const pending = DOC_REQUESTS.filter(r => r.status === 'pending').slice(0,3);
  el.innerHTML = pending.map(r => `
    <div class="mini-row">
      <div class="mr-icon" style="background:#DBEAFE;color:#1976D2"><i class="fa-solid fa-file-lines"></i></div>
      <div class="mr-text">
        <div class="mr-title">${r.resident}</div>
        <div class="mr-sub">${r.type} · ${r.date}</div>
      </div>
      <span class="status-badge status-pending">Pending</span>
    </div>
  `).join('');
}

function renderDashOpenComplaints() {
  const el = document.getElementById('dashOpenComplaints');
  if (!el) return;
  const open = COMPLAINTS_ADMIN.filter(c => c.status === 'open' || c.status === 'investigating').slice(0,3);
  el.innerHTML = open.map(c => `
    <div class="mini-row">
      <div class="mr-icon" style="background:#FEE2E2;color:#EF4444"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <div class="mr-text">
        <div class="mr-title">${c.cat}</div>
        <div class="mr-sub">${c.filer} · ${c.loc}</div>
      </div>
      <span class="status-badge status-${c.status}">${c.status}</span>
    </div>
  `).join('');
}

function renderDashActivity() {
  const el = document.getElementById('dashActivity');
  if (!el) return;
  const COLORS = { 'Request Approved':'#059669', 'Request Submitted':'#1976D2', 'Announcement Posted':'#D97706', 'Complaint Filed':'#EF4444', 'Resident Verified':'#0D9488', 'Login':'#94A3B8', 'Status Updated':'#0EA5E9' };
  el.innerHTML = AUDIT_LOG.slice(0,6).map(a => `
    <div class="activity-row">
      <div class="act-dot" style="background:${COLORS[a.action] || '#94A3B8'}"></div>
      <div class="act-text"><strong>${a.user}</strong> — ${a.action} in <strong>${a.module}</strong></div>
      <div class="act-time">${a.ts.split(' ')[1]}</div>
    </div>
  `).join('');
}

// ── RESIDENTS TABLE ───────────────────────
function renderResidents(data) {
  const tbody = document.getElementById('residentsBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => `
    <tr>
      <td><code style="font-size:12px;color:var(--blue-mid)">${r.id}</code></td>
      <td style="font-weight:600;color:var(--text)">${r.name}</td>
      <td>${r.addr}</td>
      <td>${r.contact}</td>
      <td><span class="status-badge status-${r.status}">${r.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-action view" onclick="showModal('Resident Profile','${r.name} — ${r.addr} — ${r.contact} — Status: ${r.status}')">View</button>
          <button class="btn-action process" onclick="openEditResidentForm(${r.dbId})">Edit</button>
          <button class="btn-action reject" onclick="deleteResident(${r.dbId})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}
function initResidentTable() {
  renderResidents(RESIDENTS);
  document.getElementById('residentSearch')?.addEventListener('input', filterResidents);
  document.getElementById('residentStatusFilter')?.addEventListener('change', filterResidents);
}
function filterResidents() {
  const q = document.getElementById('residentSearch').value.toLowerCase();
  const s = document.getElementById('residentStatusFilter').value;
  renderResidents(RESIDENTS.filter(r => {
    return (r.name.toLowerCase().includes(q) || r.addr.toLowerCase().includes(q)) &&
           (s === 'all' || r.status === s);
  }));
}

// ── DOC REQUESTS TABLE ────────────────────
function renderDocRequests(data) {
  const tbody = document.getElementById('reqsBody');
  if (!tbody) return;
  tbody.innerHTML = data.map(r => `
    <tr>
      <td><code style="font-size:12px;color:var(--blue-mid)">${r.ref}</code></td>
      <td style="font-weight:600">${r.resident}</td>
      <td>${r.residentEmail || '<span style="color:var(--text-3)">No email</span>'}</td>
      <td>${r.type}</td>
      <td>${r.purpose}</td>
      <td>${r.date}</td>
      <td><span class="status-badge status-${r.status}">${r.status}</span></td>
      <td>
        <div class="action-btns">
          ${r.status === 'pending'    ? `<button class="btn-action process" onclick="updateReqStatus('${r.ref}','processing')">Process</button>` : ''}
          ${r.status === 'processing' ? `<button class="btn-action ready"   onclick="updateReqStatus('${r.ref}','ready')">Mark Ready</button>` : ''}
          ${r.status === 'ready'      ? `<button class="btn-action approve" onclick="updateReqStatus('${r.ref}','completed')">Complete</button>` : ''}
          ${r.status !== 'completed'  ? `<button class="btn-action ready" onclick="notifyPickupReady('${r.ref}')">Notify Ready</button>` : ''}
          <button class="btn-action view" onclick="showModal('Request Details','${r.ref} — ${r.resident} (${r.residentEmail || 'No email'}) — ${r.type}')">View</button>
        </div>
      </td>
    </tr>
  `).join('');
}
function updateReqStatus(ref, newStatus) {
  const r = DOC_REQUESTS.find(x => x.ref === ref);
  if (!r) return;
  r.status = newStatus;
  renderDocRequests(DOC_REQUESTS);
  renderDashPendingReqs();
  document.getElementById('reqPendBadge').textContent = DOC_REQUESTS.filter(x => x.status === 'pending').length;
  showToastAdmin('Status Updated', `${ref} has been updated to "${newStatus}".`);
}

async function notifyPickupReady(ref) {
  const req = DOC_REQUESTS.find(r => r.ref === ref);
  if (!req) return;
  const emailOverride = window.prompt(
    `Notify ${req.resident} that ${ref} is ready for pickup.\nIf you know the resident email, enter it below. Leave blank to auto-detect.`,
    ''
  );
  try {
    const payload = { reference_no: ref };
    if (emailOverride && emailOverride.trim() !== '') {
      payload.email = emailOverride.trim();
    }
    const data = await fetchJson(`${API_BASE}/requests/notify_ready.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Source': 'official'
      },
      body: JSON.stringify(payload)
    });
    await loadRequests();
    await refreshDashboard();
    showToastAdmin('Resident Notified', data.message || `${ref} pickup notification email sent.`);
  } catch (err) {
    showToastAdmin('Notify Failed', err.message);
  }
}
function initDocRequestsTable() {
  renderDocRequests(DOC_REQUESTS);
  document.getElementById('reqSearch')?.addEventListener('input', () => {
    const q = document.getElementById('reqSearch').value.toLowerCase();
    const s = document.getElementById('reqStatusFilter').value;
    renderDocRequests(DOC_REQUESTS.filter(r => (r.resident.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q)) && (s === 'all' || r.status === s)));
  });
  document.getElementById('reqStatusFilter')?.addEventListener('change', () => {
    document.getElementById('reqSearch').dispatchEvent(new Event('input'));
  });
}

// ── COMPLAINTS ADMIN ──────────────────────
function renderComplaintsAdmin(data) {
  const el = document.getElementById('complaintsAdminList');
  if (!el) return;
  el.innerHTML = data.map(c => `
    <div class="complaint-admin-row" id="comp-${c.ref.replace('#','')}">
      <div class="ca-top">
        <div>
          <div class="ca-ref">${c.ref} · ${c.filer}</div>
          <div class="ca-title">${c.cat} — ${c.loc}</div>
        </div>
        <span class="status-badge status-${c.status}">${c.status}</span>
      </div>
      <div class="ca-meta">
        <span><i class="fa-regular fa-calendar"></i> Filed: ${c.date}</span>
        ${c.note ? `<span><i class="fa-solid fa-comment"></i> ${c.note}</span>` : ''}
      </div>
      <div class="ca-actions">
        <label>Update:</label>
        <select class="ca-status-select" id="compStatus-${c.ref}">
          <option value="open"          ${c.status==='open'          ?'selected':''}>Open</option>
          <option value="investigating" ${c.status==='investigating' ?'selected':''}>Investigating</option>
          <option value="resolved"      ${c.status==='resolved'      ?'selected':''}>Resolved</option>
        </select>
        <input type="text" class="ca-note-input" id="compNote-${c.ref}" placeholder="Add official note…" value="${c.note}" />
        <button class="btn-action resolve" onclick="updateComplaint('${c.ref}')">Save</button>
        <button class="btn-action view" onclick="showModal('Complaint Detail','${c.ref} — ${c.cat} — Filed by ${c.filer}')">View</button>
      </div>
    </div>
  `).join('');
}
function updateComplaint(ref) {
  const c = COMPLAINTS_ADMIN.find(x => x.ref === ref);
  if (c) {
    c.status = document.getElementById(`compStatus-${ref}`).value;
    c.note   = document.getElementById(`compNote-${ref}`).value;
    renderComplaintsAdmin(COMPLAINTS_ADMIN);
    document.getElementById('compPendBadge').textContent = COMPLAINTS_ADMIN.filter(x => x.status !== 'resolved').length;
    showToastAdmin('Complaint Updated', `${ref} status updated to "${c.status}".`);
  }
}

function mapResidentRow(row) {
  return {
    dbId: Number(row.id),
    id: `RS-${String(row.id).padStart(4, '0')}`,
    name: `${row.fname} ${row.lname}`.trim(),
    fname: row.fname || '',
    lname: row.lname || '',
    addr: row.address || '-',
    contact: row.contact || '-',
    email: row.email || '',
    status: 'verified'
  };
}

function mapRequestRow(row) {
  return {
    ref: row.reference_no,
    resident: row.resident_name || 'Resident',
    residentEmail: row.resident_email || '',
    type: row.document_type,
    purpose: row.purpose,
    date: row.date_requested,
    status: row.status
  };
}

function mapComplaintRow(row) {
  return {
    ref: row.reference_no,
    filer: row.resident_name,
    cat: row.category,
    loc: row.location_text,
    date: row.date_filed,
    status: row.status,
    note: row.official_note || ''
  };
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = null;

  if (raw.trim() !== '') {
    try {
      data = JSON.parse(raw);
    } catch (err) {
      data = null;
    }
  }

  if (!res.ok) {
    if (data && data.message) {
      throw new Error(data.message);
    }
    throw new Error(`Server request failed (HTTP ${res.status}).`);
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Server returned an invalid response format.');
  }

  if (!data.success) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

async function loadResidents() {
  const data = await fetchJson(`${API_BASE}/residents/list.php`);
  RESIDENTS = (data.residents || []).map(mapResidentRow);
  renderResidents(RESIDENTS);
}

async function loadRequests() {
  const data = await fetchJson(`${API_BASE}/requests/list.php`);
  DOC_REQUESTS = (data.requests || []).map(mapRequestRow);
  renderDocRequests(DOC_REQUESTS);
}

async function loadComplaints() {
  const data = await fetchJson(`${API_BASE}/complaints/list.php`);
  COMPLAINTS_ADMIN = (data.complaints || []).map(mapComplaintRow);
  renderComplaintsAdmin(COMPLAINTS_ADMIN);
}

async function refreshDashboard() {
  renderDashStats();
  renderDashPendingReqs();
  renderDashOpenComplaints();
  renderDashActivity();
  document.getElementById('reqPendBadge').textContent = DOC_REQUESTS.filter(x => x.status === 'pending').length;
  document.getElementById('compPendBadge').textContent = COMPLAINTS_ADMIN.filter(x => x.status !== 'resolved').length;
}

function initResidentCreateForm() {
  const openBtn = document.getElementById('addResidentBtn');
  const closeBtn = document.getElementById('closeResidentForm');
  const cancelBtn = document.getElementById('cancelResidentForm');
  const card = document.getElementById('residentFormCard');
  const form = document.getElementById('residentFormEl');
  const title = document.getElementById('residentFormTitle');
  const submitBtn = document.getElementById('residentFormSubmitBtn');
  const passwordLabel = document.getElementById('residentPasswordLabel');
  const passwordInput = form?.querySelector('input[name="password"]');
  if (!card || !form) return;

  const resetToCreateMode = () => {
    form.reset();
    form.resident_id.value = '';
    title.innerHTML = '<i class="fa-solid fa-user-plus"></i> Add New Resident';
    submitBtn.textContent = 'Save Resident';
    passwordLabel.textContent = 'Temporary Password';
    passwordInput.required = true;
    passwordInput.placeholder = '';
  };
  const closeForm = () => {
    card.style.display = 'none';
    resetToCreateMode();
  };

  openBtn?.addEventListener('click', () => {
    resetToCreateMode();
    card.style.display = 'block';
  });
  closeBtn?.addEventListener('click', closeForm);
  cancelBtn?.addEventListener('click', closeForm);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    const isEdit = payload.resident_id && String(payload.resident_id).trim() !== '';
    const url = isEdit ? `${API_BASE}/residents/update.php` : `${API_BASE}/residents/create.php`;
    try {
      await fetchJson(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Portal-Source': 'official'
        },
        body: JSON.stringify(payload)
      });
      closeForm();
      await loadResidents();
      await refreshDashboard();
      showToastAdmin(isEdit ? 'Resident Updated' : 'Resident Added', isEdit ? 'Resident record was updated successfully.' : 'New resident account was created successfully.');
    } catch (err) {
      showToastAdmin(isEdit ? 'Update Failed' : 'Create Failed', err.message);
    }
  });
}

function openEditResidentForm(dbId) {
  const resident = RESIDENTS.find(r => r.dbId === Number(dbId));
  const card = document.getElementById('residentFormCard');
  const form = document.getElementById('residentFormEl');
  const title = document.getElementById('residentFormTitle');
  const submitBtn = document.getElementById('residentFormSubmitBtn');
  const passwordLabel = document.getElementById('residentPasswordLabel');
  const passwordInput = form?.querySelector('input[name="password"]');
  if (!resident || !card || !form || !title || !submitBtn || !passwordLabel || !passwordInput) return;

  form.resident_id.value = String(resident.dbId);
  form.fname.value = resident.fname;
  form.lname.value = resident.lname;
  form.contact.value = resident.contact === '-' ? '' : resident.contact;
  form.email.value = resident.email;
  form.address.value = resident.addr === '-' ? '' : resident.addr;
  form.password.value = '';
  passwordInput.required = false;
  passwordInput.placeholder = 'Leave blank to keep current password';
  title.innerHTML = '<i class="fa-solid fa-pen"></i> Edit Resident';
  submitBtn.textContent = 'Update Resident';
  passwordLabel.textContent = 'New Password (optional)';
  card.style.display = 'block';
}

async function deleteResident(dbId) {
  const resident = RESIDENTS.find(r => r.dbId === Number(dbId));
  if (!resident) return;
  const ok = window.confirm(`Delete resident record for ${resident.name}?`);
  if (!ok) return;
  try {
    await fetchJson(`${API_BASE}/residents/delete.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Portal-Source': 'official'
      },
      body: JSON.stringify({ resident_id: resident.dbId })
    });
    await loadResidents();
    await refreshDashboard();
    showToastAdmin('Resident Deleted', `${resident.name} was removed from resident records.`);
  } catch (err) {
    showToastAdmin('Delete Failed', err.message);
  }
}
function initComplaintsAdmin() {
  renderComplaintsAdmin(COMPLAINTS_ADMIN);
  document.getElementById('compSearch')?.addEventListener('input', filterComplaintsAdmin);
  document.getElementById('compStatusFilter')?.addEventListener('change', filterComplaintsAdmin);
}
function filterComplaintsAdmin() {
  const q = document.getElementById('compSearch').value.toLowerCase();
  const s = document.getElementById('compStatusFilter').value;
  renderComplaintsAdmin(COMPLAINTS_ADMIN.filter(c => {
    return (c.cat.toLowerCase().includes(q) || c.filer.toLowerCase().includes(q) || c.ref.toLowerCase().includes(q)) &&
           (s === 'all' || c.status === s);
  }));
}

// ── ANNOUNCEMENTS ─────────────────────────
const CAT_COLORS = { info:'#DBEAFE', health:'#DCFCE7', env:'#F0FDF4', safety:'#FEF9C3', event:'#FAF5FF' };
function renderAnnouncementsAdmin() {
  const el = document.getElementById('announcementsAdminList');
  if (!el) return;
  el.innerHTML = ANNOUNCEMENTS_DATA.map(a => `
    <div class="ann-admin-item">
      <div class="aai-cat" style="background:${CAT_COLORS[a.cat]||'#F1F5FB'}">${a.icon}</div>
      <div class="aai-body">
        <div class="aai-title">${a.title}</div>
        <div class="aai-meta">
          <span><i class="fa-regular fa-calendar"></i> ${a.date}</span>
          <span><i class="fa-solid fa-user"></i> ${a.author}</span>
          ${a.sms ? '<span style="color:#059669"><i class="fa-solid fa-mobile"></i> SMS sent</span>' : ''}
        </div>
      </div>
      <div class="aai-actions">
        <button class="btn-action view" onclick="showModal('Announcement','${a.title}')">View</button>
      </div>
    </div>
  `).join('');
}
function initAnnouncementForm() {
  document.getElementById('newAnnBtn')?.addEventListener('click', () => { document.getElementById('annForm').style.display='block'; });
  document.getElementById('closeAnnForm')?.addEventListener('click', () => { document.getElementById('annForm').style.display='none'; });
  document.getElementById('cancelAnnForm')?.addEventListener('click', () => { document.getElementById('annForm').style.display='none'; });
  document.getElementById('annFormEl')?.addEventListener('submit', e => {
    e.preventDefault();
    const title = e.target.querySelector('input[type=text]').value;
    const sms   = document.getElementById('smsToggle').checked;
    ANNOUNCEMENTS_DATA.unshift({ id: Date.now(), cat:'info', icon:'📢', title, date:'Mar 30, 2026', author:'Barangay Official', sms });
    renderAnnouncementsAdmin();
    document.getElementById('annForm').style.display='none';
    e.target.reset();
    showToastAdmin('Announcement Posted', sms ? 'Announcement posted and SMS sent to all registered residents.' : 'Announcement posted successfully.');
  });
}

// ── SERVICES ──────────────────────────────
function renderServicesAdmin() {
  const el = document.getElementById('servicesAdminGrid');
  if (!el) return;
  el.innerHTML = SERVICES_DATA.map(s => `
    <div class="svc-admin-card">
      <div class="sac-head">
        <span class="sac-emoji">${s.emoji}</span>
        <div>
          <div class="sac-title">${s.name}</div>
          <div class="sac-cat">${s.cat}</div>
        </div>
      </div>
      <div class="sac-rating">★ ${s.rating} <span style="font-weight:400;color:var(--text-3)">(${s.reviews} reviews)</span></div>
      <div style="font-size:12px;color:var(--text-3)"><i class="fa-solid fa-location-dot"></i> ${s.addr}</div>
      <div class="sac-actions">
        <button class="btn-action view"   onclick="showModal('Service Info','${s.name} — ${s.cat} — ${s.addr}')">View</button>
        <button class="btn-action reject" onclick="alert('Remove: ${s.name} (prototype demo)')">Remove</button>
      </div>
    </div>
  `).join('');
}

// ── AUDIT LOG ─────────────────────────────
const AUDIT_TAG_COLORS = {
  'Request Approved':    '#059669', 'Request Submitted': '#1976D2',
  'Announcement Posted': '#D97706', 'Complaint Filed':   '#EF4444',
  'Resident Verified':   '#0D9488', 'Login':             '#94A3B8',
  'Status Updated':      '#0EA5E9'
};
function renderAuditLog() {
  const tbody = document.getElementById('auditBody');
  if (!tbody) return;
  tbody.innerHTML = AUDIT_LOG.map(a => `
    <tr>
      <td style="font-size:12px;white-space:nowrap">${a.ts}</td>
      <td style="font-weight:600">${a.user}</td>
      <td><span class="status-badge" style="background:var(--surface-2);color:var(--text-2)">${a.role}</span></td>
      <td><span class="audit-action-tag" style="background:${AUDIT_TAG_COLORS[a.action]||'#94A3B8'}20;color:${AUDIT_TAG_COLORS[a.action]||'#94A3B8'}">${a.action}</span></td>
      <td>${a.module}</td>
      <td style="font-size:12px;color:var(--text-3)">${a.ip}</td>
    </tr>
  `).join('');
}

 

// ── MODAL ─────────────────────────────────
function showModal(title, body) {
  document.getElementById('actionModalBox').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid var(--border)">
      <h3 style="font-size:1.3rem;font-weight:600">${title}</h3>
      <button onclick="closeModal()" style="background:none;border:none;font-size:18px;color:var(--text-3);cursor:pointer"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.7;margin-bottom:20px">${body}<br><br><em style="color:var(--text-3);font-size:12px">[In the full system, this shows a complete detail view with full history and action controls.]</em></p>
    <button onclick="closeModal()" style="padding:9px 24px;background:var(--blue-mid);color:white;border:none;border-radius:7px;font-family:'Jost',sans-serif;font-size:13px;font-weight:700;cursor:pointer">Close</button>
  `;
  document.getElementById('actionModal').classList.add('show');
}
function closeModal() { document.getElementById('actionModal').classList.remove('show'); }
document.getElementById('actionModal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

// ── TOAST ─────────────────────────────────
let toastTimeout;
function showToastAdmin(title, body) {
  let toast = document.getElementById('officialToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'officialToast';
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:white;border-radius:12px;padding:16px 20px;box-shadow:0 8px 32px rgba(11,30,69,0.18);border-left:4px solid #059669;display:flex;align-items:flex-start;gap:12px;max-width:380px;z-index:9999;transform:translateY(120px);opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1);`;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#059669;font-size:20px;margin-top:2px;flex-shrink:0"></i><div><div style="font-size:14px;font-weight:700;color:#0B1E45;margin-bottom:3px">${title}</div><div style="font-size:13px;color:#475569">${body}</div></div>`;
  clearTimeout(toastTimeout);
  requestAnimationFrame(() => { toast.style.transform='translateY(0)'; toast.style.opacity='1'; });
  toastTimeout = setTimeout(() => { toast.style.transform='translateY(120px)'; toast.style.opacity='0'; }, 5000);
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initResidentTable();
  initDocRequestsTable();
  initComplaintsAdmin();
  initResidentCreateForm();
  renderAnnouncementsAdmin();
  initAnnouncementForm();
  renderServicesAdmin();
  renderAuditLog();
  (async () => {
    try {
      await Promise.all([loadResidents(), loadRequests(), loadComplaints()]);
      await refreshDashboard();
    } catch (err) {
      showToastAdmin('Data Load Failed', err.message);
    }
  })();
});
