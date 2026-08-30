/* ============================================================
 *  BFT Demon List — Módulo de Autenticación
 *  Firebase Auth (Google) + Firestore (users / profiles)
 *  Uso:
 *    import { mountAuthUI, onAuthChange, isAdmin, isStaff }
 *      from "/auth.js";
 * ============================================================ */

import { initializeApp, getApps } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut,
  onAuthStateChanged, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, getDocs,
  doc, getDoc, setDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ── Config ─────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            "AIzaSyDo82Z627DxD175zjZ4OMUr8HCKs3nn14E",
  authDomain:        "bufferteam-a95b3.firebaseapp.com",
  projectId:         "bufferteam-a95b3",
  storageBucket:     "bufferteam-a95b3.firebasestorage.app",
  messagingSenderId: "891820441522",
  appId:             "1:891820441522:web:56062556087e8000346eab"
};

/* ── App (singleton) ─────────────────────────────────────────── */
const app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/*
 * Firebase puede empezar a resolver el usuario antes de que una llamada
 * asíncrona a setPersistence termine. Esperamos esta promesa antes de
 * registrar onAuthStateChanged para que cada página use persistentLocal
 * storage desde el primer ciclo de autenticación.
 */
const persistenceReady = setPersistence(auth, browserLocalPersistence)
  .then(() => true)
  .catch(err => {
    console.error("[auth] No se pudo configurar persistencia:", err);
    return false;
  });

export { app, auth, db };

/* ── Estado interno ──────────────────────────────────────────── */
let currentUser        = null;
let currentUserData    = null;
let currentProfileData = null;        // doc profiles/{uid} (custom name/photo/country/bio)
let authResolved       = false;       // Firebase confirmó el primer estado
let userDataResolved   = false;       // users/profiles terminó de cargar
let authGeneration     = 0;           // evita aplicar datos de una sesión anterior

const listeners = [];

function notify() {
  /*
   * Mientras Firebase no confirme el primer estado no mostramos "Iniciar
   * sesión". Si ya hay un usuario confirmado, el Header puede mostrar su
   * avatar inmediatamente; las lecturas de users/profiles sólo bloquean las
   * pantallas que necesitan roles, no la identidad de Auth.
   */
  const loading = !authResolved || (!!currentUser && !userDataResolved);
  listeners.forEach(cb => {
    try { cb(currentUser, currentUserData, loading, currentProfileData); }
    catch (err) { console.error("[auth] listener error:", err); }
  });

  /* Auto body classes (todas las páginas) */
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.toggle("is-logged", !!currentUser);
    document.body.classList.toggle("is-staff",  isStaff());
    document.body.classList.toggle("is-admin",  isAdmin());
    document.body.classList.toggle("is-owner",  isOwner());
    document.body.classList.toggle("is-loading-auth", loading);
  }
}

/* ── API pública: estado / roles ─────────────────────────────── */
export function onAuthChange(callback) {
  listeners.push(callback);
  callback(currentUser, currentUserData,
    !authResolved || (!!currentUser && !userDataResolved),
    currentProfileData);
  return () => {
    const i = listeners.indexOf(callback);
    if (i >= 0) listeners.splice(i, 1);
  };
}

export function getCurrentUser()        { return currentUser; }
export function getCurrentUserData()    { return currentUserData; }
export function getCurrentProfileData() { return currentProfileData; }
export function isAuthResolved()        { return authResolved; }

/* Refrescar el perfil desde Firestore tras una edición → propaga a todas las vistas */
export async function refreshProfile() {
  if (!currentUser) return null;
  try {
    const snap = await getDoc(doc(db, "profiles", currentUser.uid));
    currentProfileData = snap.exists() ? snap.data() : null;
    notify();
    return currentProfileData;
  } catch (err) {
    console.error("[auth] refreshProfile error:", err);
    return null;
  }
}

export function hasRole(...roles) {
  return !!currentUserData && roles.includes(currentUserData.role);
}
export function isOwner() { return hasRole("Owner"); }
export function isAdmin() { return hasRole("Admin", "Owner"); }
export function isStaff() { return hasRole("Mod", "Admin", "Owner"); }
export function isLogged() { return !!currentUser; }

/* ── Login / Logout ──────────────────────────────────────────── */
function isInIframe() {
  try { return window.self !== window.top; }
  catch (e) { return true; }
}

export async function loginGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  if (isInIframe()) {
    return signInWithRedirect(auth, provider);
  }

  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    if (
      err.code === "auth/popup-blocked" ||
      err.code === "auth/popup-closed-by-user" ||
      err.code === "auth/cancelled-popup-request" ||
      err.code === "auth/operation-not-supported-in-this-environment"
    ) {
      return signInWithRedirect(auth, provider);
    }
    throw err;
  }
}

export async function logout() {
  return signOut(auth);
}

/* ── Crear/actualizar documentos en Firestore ────────────────── */
async function ensureUserDocs(user) {
  const userRef    = doc(db, "users",    user.uid);
  const profileRef = doc(db, "profiles", user.uid);

  const [userSnap, profileSnap] = await Promise.all([
    getDoc(userRef),
    getDoc(profileRef)
  ]);

  /* users/{uid} — refrescamos email/lastLogin pero NO sobreescribimos nombre/foto */
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      role: "Default",
      banned: false,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      email: user.email || ""
    });
  }

  /* profiles/{uid} — sólo creación inicial; ya nunca se sobreescribe */
  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      uid: user.uid,
      name: user.displayName || "Sin nombre",
      photoURL: user.photoURL || "",
      country: "",
      bio: "",
      points: 0,
      recordsCount: 0,
      createdAt: serverTimestamp()
    });
  }

  /* Releer ambos docs frescos */
  const [freshUser, freshProfile] = await Promise.all([
    getDoc(userRef),
    getDoc(profileRef)
  ]);
  return {
    userData: freshUser.exists() ? freshUser.data() : null,
    profileData: freshProfile.exists() ? freshProfile.data() : null
  };
}

/* ── Listener global de auth ─────────────────────────────────── */
async function bootstrapAuth() {
  await persistenceReady;

  /*
   * Procesamos primero cualquier resultado de redirect. Así una navegación
   * que vuelve de Google no pasa por un estado intermedio "sin sesión"
   * antes de que el listener reciba al usuario autenticado.
   */
  try {
    await getRedirectResult(auth);
  } catch (err) {
    if (err && err.code !== "auth/no-auth-event") {
      console.error("[auth] redirect result error:", err);
    }
  }

  onAuthStateChanged(auth, user => {
    const generation = ++authGeneration;

    /*
     * Resolvemos la identidad de Firebase antes de leer Firestore. Esto
     * evita que una cuenta confirmada vuelva a pasar por el botón de login.
     */
    currentUser        = user || null;
    currentUserData    = null;
    currentProfileData = null;
    userDataResolved   = !user;
    authResolved       = true;

    notify();

    if (!user) return;

    ensureUserDocs(user)
      .then(({ userData, profileData }) => {
        if (generation !== authGeneration || currentUser?.uid !== user.uid) return;
        currentUserData    = userData;
        currentProfileData = profileData;
        userDataResolved   = true;
        notify();
      })
      .catch(err => {
        if (generation !== authGeneration || currentUser?.uid !== user.uid) return;
        console.error("[auth] Error inicializando usuario:", err);
        currentUserData  = null;
        userDataResolved = true;
        notify();
      });
  });
}

bootstrapAuth().catch(err => {
  /*
   * No asumimos "sin sesión" ante un fallo temporal. El Header permanece
   * pendiente hasta que Firebase entregue un estado real.
   */
  console.error("[auth] No se pudo iniciar Firebase Auth:", err);
});

/* ============================================================
 *  UI: monta el widget en el nav (loading / login / user-menu)
 * ============================================================ */
export function mountAuthUI(slotId = "authSlot") {
  const slot = document.getElementById(slotId);
  if (!slot) {
    console.warn("[auth] No se encontró #" + slotId);
    return;
  }
  if (slot.dataset.bftAuthMounted === "1") return;
  slot.dataset.bftAuthMounted = "1";

  function render(user, data, loading, profile) {
    /*
     * No mostramos datos de Firebase Auth mientras users/{uid} y
     * profiles/{uid} todavía se están hidratando. El primer render
     * autenticado debe ser ya el perfil definitivo de Firestore.
     */
    if (loading) {
      slot.innerHTML = `
        <div class="auth-loading auth-skeleton" aria-busy="true" aria-label="Cargando perfil">
          <span class="auth-skeleton-avatar"></span>
          <span class="auth-skeleton-line"></span>
        </div>`;
      return;
    }

    /* 2) Sin sesión → botón login */
    if (!user) {
      slot.innerHTML = `
        <button class="auth-login-btn" id="authLoginBtn">
          <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.4 4 9.8 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.4 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"/>
          </svg>
          <span>Iniciar sesión</span>
        </button>
      `;
      document.getElementById("authLoginBtn").onclick = async () => {
        try { await loginGoogle(); }
        catch (err) {
          console.error("[auth] Login error:", err);
          if (err.code !== "auth/popup-closed-by-user" &&
              err.code !== "auth/cancelled-popup-request") {
            alert("Error al iniciar sesión: " + err.message);
          }
        }
      };
      return;
    }

    /* 3) Usuario logueado → avatar + menú
       (preferimos profile.name / profile.photoURL si el usuario los personalizó) */
    const role  = (data && data.role) || "Default";
    /*
     * El nombre y la foto visibles son exclusivamente los datos de
     * profiles/{uid}; no usamos displayName/photoURL como fallback visual.
     */
    const name  = (profile && profile.name) || "Usuario";
    const email = user.email             || "";
    const photo = (profile && profile.photoURL) || "";
    const initials = (name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    const showStaffLink = ["Mod","Admin","Owner"].includes(role);

    /* Escapamos SIEMPRE photo/name antes de meterlos en HTML — si el usuario
       guardó una URL con comillas o caracteres raros se rompía el <img> y
       el avatar salía gigante con código suelto debajo. */
    const photoSafe = escapeHtml(photo);
    const nameSafe  = escapeHtml(name);
    const initialsSafe = escapeHtml(initials);
    slot.innerHTML = `
      <div class="auth-user" id="authUser">
        ${photo
          ? `<img src="${photoSafe}" class="auth-avatar" alt="${nameSafe}" referrerpolicy="no-referrer">`
          : `<div class="auth-avatar auth-avatar-fallback">${initialsSafe}</div>`}
        <div class="auth-menu" id="authMenu">
          <div class="auth-menu-head">
            ${photo
              ? `<img src="${photoSafe}" class="auth-menu-photo" alt="${nameSafe}" referrerpolicy="no-referrer">`
              : `<div class="auth-menu-photo auth-avatar-fallback">${initialsSafe}</div>`}
            <div class="auth-menu-info">
              <div class="auth-menu-name">${escapeHtml(name)}</div>
              <div class="auth-menu-email">${escapeHtml(email)}</div>
              <div class="auth-menu-role auth-role-${role.toLowerCase()}">${role}</div>
            </div>
          </div>
          <a class="auth-profile-btn" href="/profile.html?id=${user.uid}">Mi Perfil</a>
          ${showStaffLink ? `<a class="auth-staff-btn" href="/panel.html">Panel de Records</a>` : ``}
          <button class="auth-logout-btn" id="authLogoutBtn">Cerrar sesión</button>
        </div>
      </div>
    `;

    const userEl = document.getElementById("authUser");
    const menu   = document.getElementById("authMenu");
    userEl.querySelector(".auth-avatar").onclick = (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    };
    document.addEventListener("click", (e) => {
      if (!userEl.contains(e.target)) menu.classList.remove("open");
    });
    document.getElementById("authLogoutBtn").onclick = async () => {
      try { await logout(); }
      catch (err) { console.error("[auth] Logout error:", err); }
    };
  }

  onAuthChange(render);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[c]);
}

/* ============================================================
 *  Header compartido
 *  Todas las páginas estáticas pasan por aquí para evitar que
 *  una copia antigua del header vuelva a desalinearse.
 * ============================================================ */
function isPemonHeaderRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const file = path.split("/").pop().toLowerCase();
  return file === "pemonlist.html"
    || file === "pemon-level.html"
    || (file === "submit.html"
      && new URLSearchParams(window.location.search).get("list") === "pemon");
}

function isNotificationsRoute() {
  return window.location.pathname.replace(/\/+$/, "").split("/").pop().toLowerCase()
    === "notifications.html";
}

function sharedHeaderMarkup(isPemon) {
  const submitHref = isPemon ? "/submit.html?list=pemon" : "/submit.html";
  const submitKey = isPemon ? "nav_submit_pemon" : "nav_submit";
  const brandFull = isPemon ? "BFT Pemon List" : "BFT Demon List";
  const brandShort = isPemon ? "BFT PL" : "BFT DL";
  return `
    <div class="bft-header-left">
      <a class="bft-brand" href="/" aria-label="${brandFull}">
        <img src="/logo.png" class="logo-img" alt="Logo">
        <span class="logo-text bft-logo-text">
          <span class="logo-full">${brandFull}</span>
          <span class="logo-short">${brandShort}</span>
        </span>
      </a>
    </div>
    <div class="bft-header-actions">
      <nav class="nav-links bft-header-nav" id="navLinks">
        <a href="/" data-i18n="nav_home">Home</a>
        <a href="/demonlist.html" data-i18n="nav_demonlist">Demon List</a>
        <a href="/pemonlist.html" data-i18n="nav_pemonlist">Pemon List</a>
        <a href="/leaderboards.html" data-i18n="nav_leaderboards">Leaderboards</a>
        <a href="/notifications.html" class="bft-notifications-link">
          <span class="notification-label" data-i18n="nav_notifications">✉ Notificaciones</span>
          <span class="notification-badge" id="notificationBadge" hidden aria-label="Notificaciones nuevas">0</span>
        </a>
        <a href="${submitHref}" data-i18n="${submitKey}">${isPemon ? "Enviar Record Pemon" : "Enviar Record"}</a>
        <a href="/guidelines.html" data-i18n="nav_guidelines">Guidelines</a>
        <a href="/panel.html" class="staff-only" data-i18n="nav_panel">Panel de Records</a>
        <a href="/staff-control.html" class="owner-only" data-i18n="nav_staff_control">Control Staff</a>
        <a href="/admin-dev.html" class="admin-only" data-i18n="nav_admin_dev">Admin Dev</a>
      </nav>
      <div id="langSlot"></div>
      <div class="auth-slot" id="authSlot"></div>
      <button class="menu-toggle" id="menuToggle" type="button" aria-label="Abrir menú">☰</button>
    </div>`;
}

function mountSharedHeader() {
  const header = document.querySelector("header.top-header");
  if (!header) return;

  const isHome = !!document.querySelector(".home-page");
  const isPemon = isPemonHeaderRoute();
  header.classList.add("bft-site-header");

  /*
   * Home está renderizado por React: conserva su árbol para que los
   * cambios de idioma no sean pisados, pero comparte las mismas clases.
   * Las páginas estáticas sí se reemplazan completamente por el template
   * común para eliminar diferencias históricas entre archivos.
   */
  if (!isHome) {
    header.innerHTML = sharedHeaderMarkup(isPemon);
  }

  const nav = header.querySelector("#navLinks");
  const menu = header.querySelector("#menuToggle, .menu-toggle");
  const toggle = () => nav?.classList.toggle("active");
  window.toggleMenu = toggle;

  /* pemon-level.html ya registra su listener por compatibilidad. */
  if (!isHome && menu && menu.id !== "menuToggle") {
    menu.onclick = toggle;
  }

  const notificationsLink = header.querySelector(".bft-notifications-link")
    || header.querySelector('a[href="/notifications.html"]');
  notificationsLink?.addEventListener("click", () => markNotificationsSeen());

  if (isNotificationsRoute()) markNotificationsSeen();
}

/* ============================================================
 *  Badge de notificaciones nuevas
 *  Se basa en records aceptados desde la última visita a
 *  Notificaciones. El estado de "revisado" es local al navegador,
 *  apropiado para este indicador decorativo.
 * ============================================================ */
const NOTIFICATIONS_SEEN_KEY = "bft_notifications_seen_at";
let notificationRequestId = 0;

function notificationTimestamp(record) {
  const value = record?.acceptedAt || record?.moderatedAt || record?.updatedAt || record?.createdAt;
  if (!value) return 0;
  try {
    return value.toMillis ? value.toMillis() : new Date(value).getTime();
  } catch (_) {
    return 0;
  }
}

function notificationSeenAt() {
  try {
    const value = Number(localStorage.getItem(NOTIFICATIONS_SEEN_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (_) {
    return 0;
  }
}

function renderNotificationBadge(count) {
  const safeCount = Math.max(0, Math.floor(Number(count) || 0));
  document.querySelectorAll(".notification-badge").forEach(badge => {
    badge.textContent = safeCount > 99 ? "99+" : String(safeCount);
    badge.hidden = safeCount === 0;
    badge.setAttribute("aria-label", `${safeCount} notificaciones nuevas`);
  });
}

export function markNotificationsSeen() {
  try { localStorage.setItem(NOTIFICATIONS_SEEN_KEY, String(Date.now())); }
  catch (_) {}
  renderNotificationBadge(0);
}

async function refreshNotificationBadge(user) {
  const requestId = ++notificationRequestId;
  try {
    const [snap1, snap2] = await Promise.all([
      getDocs(query(collection(db, "records"), where("userId", "==", user.uid))),
      getDocs(query(collection(db, "records"), where("player2Id", "==", user.uid)))
    ]);
    if (requestId !== notificationRequestId) return;

    const records = new Map();
    snap1.forEach(snapshot => records.set(snapshot.id, snapshot.data()));
    snap2.forEach(snapshot => records.set(snapshot.id, snapshot.data()));

    const seenAt = notificationSeenAt();
    const unread = [...records.values()].filter(record =>
      record.status === "Accepted"
      && (!seenAt || notificationTimestamp(record) > seenAt)
    ).length;
    renderNotificationBadge(unread);
  } catch (err) {
    if (requestId === notificationRequestId) {
      console.warn("[auth] No se pudo cargar el badge de notificaciones:", err);
      renderNotificationBadge(0);
    }
  }
}

/* ============================================================
 *  CSS del widget (inyectado una sola vez)
 * ============================================================ */
(function injectAuthCss() {
  if (document.getElementById("auth-css")) return;
  const css = `
    /* Header compartido */
    .bft-site-header {
      position:fixed !important; top:0 !important; left:0 !important;
      width:100% !important; height:60px !important;
      display:flex !important; align-items:center !important;
      justify-content:space-between !important;
      padding:0 15px !important; z-index:9999 !important;
      background:rgba(0,0,0,0.55) !important;
      backdrop-filter:blur(10px) !important;
      font-family:'Montserrat',sans-serif !important;
    }
    .bft-site-header .bft-header-left,
    .bft-site-header .bft-brand {
      display:flex; align-items:center; gap:10px; min-width:0;
    }
    .bft-site-header .bft-brand {
      color:inherit; text-decoration:none;
    }
    .bft-site-header .logo-img {
      width:38px !important; height:38px !important; flex:0 0 38px;
    }
    .bft-site-header .bft-logo-text {
      color:#fff !important; font-weight:700 !important;
      font-size:1.1rem !important; white-space:nowrap;
    }
    .bft-site-header .logo-short { display:none; }
    .bft-site-header .bft-header-actions {
      display:flex; align-items:center; gap:10px; min-width:0;
    }
    .bft-site-header .bft-header-nav {
      display:flex; align-items:center; gap:15px;
    }
    .bft-site-header .bft-header-nav a {
      position:relative; color:#fff; text-decoration:none;
      font-size:.95rem; white-space:nowrap;
    }
    .bft-site-header .bft-header-nav a:hover { color:#c7ff3b; }
    .bft-site-header .bft-notifications-link {
      display:inline-flex; align-items:center; gap:4px;
    }
    .notification-badge {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:17px; height:17px; padding:0 4px;
      border-radius:999px; background:#e53935; color:#fff;
      font:700 .62rem/1 'Montserrat',sans-serif;
      box-shadow:0 0 0 2px rgba(0,0,0,.65);
      transform:translateY(-7px);
    }
    .bft-site-header .menu-toggle {
      display:none; align-items:center; justify-content:center;
      width:40px; height:40px; padding:0; border:0;
      background:none; color:#fff; font-size:28px;
      cursor:pointer; user-select:none;
    }
    @media (max-width:768px) {
      .bft-site-header .logo-full { display:none !important; }
      .bft-site-header .logo-short { display:inline !important; }
      .bft-site-header .menu-toggle { display:flex !important; }
      .bft-site-header .bft-header-nav {
        display:none; flex-direction:column; align-items:stretch;
        position:absolute; top:60px; right:10px; gap:8px;
        min-width:190px; max-width:calc(100vw - 20px);
        padding:10px; border-radius:10px;
        background:rgba(0,0,0,.94);
        box-shadow:0 12px 28px rgba(0,0,0,.45);
      }
      .bft-site-header .bft-header-nav.active { display:flex; }
      .bft-site-header .bft-header-nav a { padding:4px 6px; }
    }

    .auth-slot { display:flex; align-items:center; }

    /* Cargando sesión */
    .auth-loading {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 14px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: rgba(230,230,230,0.7);
      font-family:'Montserrat',sans-serif;
      font-size:.82rem; font-weight:600;
    }
    .auth-skeleton {
      width:132px; height:36px; padding:0;
      border:0; background:transparent;
      overflow:hidden;
    }
    .auth-skeleton-avatar,
    .auth-skeleton-line {
      display:block;
      background:linear-gradient(90deg,
        rgba(255,255,255,.08) 25%,
        rgba(255,255,255,.18) 50%,
        rgba(255,255,255,.08) 75%);
      background-size:200% 100%;
      animation:auth-skeleton-shimmer 1.2s ease-in-out infinite;
    }
    .auth-skeleton-avatar {
      width:36px; height:36px; border-radius:50%; flex-shrink:0;
    }
    .auth-skeleton-line {
      width:78px; height:12px; border-radius:999px;
    }
    @keyframes auth-skeleton-shimmer {
      from { background-position:200% 0; }
      to { background-position:-200% 0; }
    }
    .auth-spinner {
      width:14px; height:14px; border-radius:50%;
      border:2px solid rgba(199,255,59,0.25);
      border-top-color: #c7ff3b;
      animation: auth-spin .7s linear infinite;
    }
    @keyframes auth-spin { to { transform: rotate(360deg); } }

    /* Login */
    .auth-login-btn {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 14px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color:#fff;
      font-family:'Montserrat',sans-serif;
      font-size:.85rem; font-weight:600;
      cursor:pointer;
      transition: background .2s, border-color .2s;
    }
    .auth-login-btn:hover {
      background: rgba(199,255,59,0.12);
      border-color: rgba(199,255,59,0.35);
    }

    /* Usuario */
    .auth-user { position:relative; }

    .auth-avatar {
      width:36px; height:36px; border-radius:50%;
      object-fit:cover;
      border:2px solid rgba(199,255,59,0.45);
      cursor:pointer;
      transition: border-color .2s, transform .15s;
      display:block;
    }
    .auth-avatar:hover { border-color: rgba(199,255,59,0.85); transform:scale(1.05); }
    .auth-avatar-fallback {
      display:flex; align-items:center; justify-content:center;
      background:linear-gradient(135deg,#1a4d1a,#7fff3b);
      color:#000; font-weight:700; font-size:.85rem;
    }

    .auth-menu {
      position:absolute;
      top: calc(100% + 10px); right:0;
      width:260px;
      background: rgba(15,15,18,0.97);
      backdrop-filter: blur(14px);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:14px;
      padding:14px;
      box-shadow: 0 14px 40px rgba(0,0,0,0.65);
      opacity:0; pointer-events:none;
      transform: translateY(-6px);
      transition: opacity .18s, transform .18s;
      z-index:10001;
    }
    .auth-menu.open { opacity:1; pointer-events:auto; transform:translateY(0); }

    .auth-menu-head { display:flex; gap:12px; align-items:center; padding-bottom:12px;
      border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:12px; }
    .auth-menu-photo {
      width:48px; height:48px; border-radius:50%; object-fit:cover;
      border:2px solid rgba(199,255,59,0.45);
      flex-shrink:0;
    }
    .auth-menu-info { min-width:0; flex:1; }
    .auth-menu-name { color:#fff; font-weight:700; font-size:.92rem;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .auth-menu-email { color: rgba(255,255,255,0.5); font-size:.75rem; margin-top:2px;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .auth-menu-role {
      display:inline-block; margin-top:6px;
      padding:2px 9px; border-radius:999px;
      font-size:.7rem; font-weight:700; letter-spacing:.5px;
      text-transform:uppercase;
    }
    .auth-role-default { background:rgba(255,255,255,0.08); color:#cfcfcf; }
    .auth-role-mod     { background:rgba(0,180,255,0.18);  color:#7fd8ff; }
    .auth-role-admin   { background:rgba(199,255,59,0.18); color:#c7ff3b; }
    .auth-role-owner   { background:linear-gradient(90deg,#7fff3b,#ffd700); color:#0a1a00; }
    .auth-role-booster { background:linear-gradient(90deg,#b14eff,#ff7ad9); color:#1b0033; }

    .auth-profile-btn, .auth-staff-btn {
      display:block; width:100%; text-align:center;
      padding:9px; margin-bottom:8px;
      border-radius:9px;
      font-family:'Montserrat',sans-serif;
      font-size:.85rem; font-weight:700;
      cursor:pointer; text-decoration:none;
      transition: background .2s, transform .15s;
    }
    .auth-profile-btn {
      border:1px solid rgba(199,255,59,0.3);
      background: linear-gradient(90deg, rgba(26,77,26,0.6), rgba(124,252,0,0.18));
      color:#dfffbe;
    }
    .auth-profile-btn:hover {
      background: linear-gradient(90deg, rgba(26,77,26,0.85), rgba(124,252,0,0.32));
      transform: translateY(-1px);
    }
    .auth-staff-btn {
      border:1px solid rgba(0,180,255,0.3);
      background: linear-gradient(90deg, rgba(0,80,140,0.4), rgba(0,180,255,0.18));
      color:#cdeeff;
    }
    .auth-staff-btn:hover {
      background: linear-gradient(90deg, rgba(0,80,140,0.65), rgba(0,180,255,0.32));
      transform: translateY(-1px);
    }

    .auth-logout-btn {
      width:100%;
      padding:9px;
      border-radius:9px;
      border:1px solid rgba(255,90,90,0.25);
      background:rgba(255,80,80,0.12);
      color:#ff9a9a;
      font-family:'Montserrat',sans-serif;
      font-size:.85rem; font-weight:600;
      cursor:pointer;
      transition: background .2s;
    }
    .auth-logout-btn:hover { background:rgba(255,80,80,0.25); color:#fff; }

    /* Visibilidad por rol — usable en cualquier página */
    .staff-only { display: none !important; }
    .admin-only { display: none !important; }
    body.is-staff .staff-only { display: revert !important; }
    body.is-admin .admin-only { display: revert !important; }
    .owner-only { display: none !important; }
    body.is-owner .owner-only { display: revert !important; }

    @media (max-width:680px){
      .auth-menu { width:230px; right:-8px; }
    }
  `;
  const style = document.createElement("style");
  style.id = "auth-css";
  style.textContent = css;
  document.head.appendChild(style);
})();

mountSharedHeader();

onAuthChange((user, data, loading) => {
  if (loading || !user) {
    ++notificationRequestId;
    renderNotificationBadge(0);
    return;
  }
  refreshNotificationBadge(user);
});
