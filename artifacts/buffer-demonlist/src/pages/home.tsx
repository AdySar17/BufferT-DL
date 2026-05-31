import React, { useEffect, useState } from "react";

/* ─── Auth widget (idéntico al de las otras páginas) ─── */
function useAuthWidget() {
  useEffect(() => {
    const id = "auth-mount-script";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "module";
    script.textContent = `
      import { mountAuthUI } from "/auth.js";
      mountAuthUI("authSlot");
    `;
    document.head.appendChild(script);
  }, []);
}

/* ─── Tipos para datos en vivo ─── */
type LiveLevel = {
  id: string;
  name: string;
  author: string;
  position: number;
  value: number;
  thumbnail?: string;
  background?: string;
  glow?: string;
  video?: string;
};

type LiveRecord = {
  id: string;
  playerName: string;
  playerPhoto?: string;
  levelName: string;
  levelId: string;
  percent: number;
  acceptedAt?: any;
};

type LiveStats = {
  records: number;
  players: number;
  levels: number;
  recent: number;
};

const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 horas

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL_MS) return data as T;
  } catch {}
  return null;
}

function writeCache(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

/* ─── Hook que carga todo desde Firestore ─── */
function useLiveData() {
  const [stats, setStats] = useState<LiveStats>({ records: 0, players: 0, levels: 0, recent: 0 });
  const [top10, setTop10] = useState<LiveLevel[]>([]);
  const [records, setRecords] = useState<LiveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = readCache<{ stats: LiveStats; top10: LiveLevel[]; records: LiveRecord[] }>("home_livedata");
      if (cached) {
        setStats(cached.stats);
        setTop10(cached.top10);
        setRecords(cached.records);
        setLoading(false);
        return;
      }
      try {
        /* Esquivar el análisis estático de Vite: estos módulos se sirven en
           runtime (auth.js desde /public, Firebase desde CDN). */
        const dynImport: (s: string) => Promise<any> = new Function(
          "u",
          "return import(u)"
        ) as any;
        const auth = await dynImport("/auth.js");
        const fs = await dynImport(
          "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );
        const { db } = auth as any;
        const {
          collection, query, orderBy, limit, where, getDocs, getCountFromServer, doc, getDoc,
        } = fs as any;

        /* Top 10 niveles */
        const lvlSnap = await getDocs(
          query(collection(db, "levels"), orderBy("position", "asc"), limit(10))
        );
        const lvls: LiveLevel[] = [];
        lvlSnap.forEach((d: any) => lvls.push({ id: d.id, ...(d.data() as any) }));

        /* Records aceptados recientes (5).
           Sin `where` para no requerir un índice compuesto: solo los aceptados
           tienen `acceptedAt`, así que orderBy los filtra implícitamente. */
        const recSnap = await getDocs(
          query(
            collection(db, "records"),
            orderBy("acceptedAt", "desc"),
            limit(5)
          )
        );

        const rawRecs: any[] = [];
        recSnap.forEach((d: any) => rawRecs.push({ id: d.id, ...d.data() }));

        /* Resolver nombre de jugador y de nivel para cada record */
        const recsResolved: LiveRecord[] = await Promise.all(
          rawRecs.map(async (r: any) => {
            let playerName = "Jugador";
            let playerPhoto: string | undefined;
            let levelName = "Nivel";
            try {
              if (r.userId) {
                const p = await getDoc(doc(db, "profiles", r.userId));
                if (p.exists()) {
                  const pd = p.data();
                  playerName = pd.displayName || pd.name || playerName;
                  playerPhoto = pd.photoURL;
                } else {
                  const u = await getDoc(doc(db, "users", r.userId));
                  if (u.exists()) {
                    const ud = u.data();
                    playerName = ud.displayName || ud.name || playerName;
                    playerPhoto = ud.photoURL;
                  }
                }
              }
              if (r.levelId) {
                const lv = await getDoc(doc(db, "levels", r.levelId));
                if (lv.exists()) levelName = lv.data().name || levelName;
              }
            } catch {}
            return {
              id: r.id,
              playerName,
              playerPhoto,
              levelName,
              levelId: r.levelId,
              percent: r.percent || 100,
              acceptedAt: r.acceptedAt,
            };
          })
        );

        /* Conteos: intenta getCountFromServer primero (barato).
         * Si falla por cuota, usa getDocs con limit alto como fallback. */
        async function countCol(colRef: any, label: string): Promise<number> {
          if (typeof getCountFromServer === "function") {
            try {
              const snap = await getCountFromServer(colRef);
              const n = snap.data().count;
              if (typeof n === "number") return n;
            } catch (e) {
              console.warn(`[home] count agregado falló (${label}), usando fallback:`, e);
            }
          }
          // Fallback: getDocs con limit grande para aproximar el conteo
          try {
            const snap = await getDocs(query(colRef, limit(1000)));
            return snap.size;
          } catch (e2) {
            console.warn(`[home] fallback getDocs también falló (${label}):`, e2);
          }
          return 0;
        }

        const [recordsCount, playersCount, levelsCount] = await Promise.all([
          countCol(
            query(collection(db, "records"), where("status", "==", "Accepted")),
            "records"
          ),
          countCol(collection(db, "profiles"), "profiles"),
          countCol(collection(db, "levels"), "levels"),
        ]);

        if (cancelled) return;
        const newStats = {
          records: recordsCount,
          players: playersCount,
          levels: levelsCount,
          recent: recsResolved.length,
        };
        writeCache("home_livedata", { stats: newStats, top10: lvls, records: recsResolved });
        setTop10(lvls);
        setRecords(recsResolved);
        setStats(newStats);
        setLoading(false);
      } catch (err) {
        console.error("[home] error cargando datos en vivo:", err);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, top10, records, loading };
}

/* ─── Tipos Staff ─── */
type StaffMember = {
  uid: string;
  name: string;
  role: "Owner" | "Admin" | "Mod";
  photoURL?: string;
  _profile: { name?: string; photoURL?: string } | null;
};

/* ─── Hook que carga los miembros del staff ─── */
function useStaffMembers() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = readCache<StaffMember[]>("home_staff");
      if (cached) {
        setStaffMembers(cached);
        setLoadingStaff(false);
        return;
      }
      try {
        const dynImport: (s: string) => Promise<any> = new Function("u", "return import(u)") as any;
        const auth = await dynImport("/auth.js");
        const fs   = await dynImport("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const { db } = auth as any;
        const { collection, query, where, getDocs, doc, getDoc } = fs as any;

        const snap = await getDocs(
          query(collection(db, "users"), where("role", "in", ["Owner", "Admin", "Mod"]))
        );
        const members: StaffMember[] = [];
        snap.forEach((d: any) => members.push({ uid: d.id, _profile: null, ...d.data() }));

        await Promise.all(
          members.map(async (m) => {
            try {
              const p = await getDoc(doc(db, "profiles", m.uid));
              m._profile = p.exists() ? (p.data() as any) : null;
            } catch {}
          })
        );

        writeCache("home_staff", members);
        if (!cancelled) setStaffMembers(members);
      } catch (e) {
        console.warn("[home] staff load failed:", e);
      } finally {
        if (!cancelled) setLoadingStaff(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { staffMembers, loadingStaff };
}

/* ─── Tipo Changelog ─── */
type ChangelogEntry = {
  id: string;
  type: "NEW" | "MOVED";
  levelId: string;
  levelName: string;
  newPosition: number;
  oldPosition: number | null;
  createdAt?: any;
};

/* ─── Hook que carga los últimos 5 eventos del changelog ─── */
function useChangelog() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [loadingCl, setLoadingCl] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = readCache<ChangelogEntry[]>("home_changelog");
      if (cached) {
        setEntries(cached);
        setLoadingCl(false);
        return;
      }
      try {
        const dynImport: (s: string) => Promise<any> = new Function("u", "return import(u)") as any;
        const auth = await dynImport("/auth.js");
        const fs   = await dynImport("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const { db } = auth as any;
        const { collection, query, orderBy, limit, getDocs } = fs as any;

        const snap = await getDocs(
          query(collection(db, "changelog"), orderBy("createdAt", "desc"), limit(5))
        );
        const rows: ChangelogEntry[] = [];
        snap.forEach((d: any) => rows.push({ id: d.id, ...d.data() }));
        writeCache("home_changelog", rows);
        if (!cancelled) setEntries(rows);
      } catch (e) {
        console.warn("[home] changelog load failed:", e);
      } finally {
        if (!cancelled) setLoadingCl(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { entries, loadingCl };
}

/* ─── Helpers ─── */
function timeAgo(ts: any): string {
  if (!ts) return "";
  let d: Date;
  if (typeof ts.toDate === "function") {
    // Firestore Timestamp en vivo
    d = ts.toDate();
  } else if (typeof ts === "object" && typeof ts.seconds === "number") {
    // Firestore Timestamp serializado desde localStorage ({seconds, nanoseconds})
    d = new Date(ts.seconds * 1000);
  } else {
    d = new Date(ts);
  }
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} d`;
  return d.toLocaleDateString();
}

/* ─── Estilos compartidos ─── */
const PAGE_BG: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily: "'Montserrat', sans-serif",
  color: "#fff",
  background: "black url('https://iili.io/BrsOUyG.jpg') repeat top left fixed",
  backgroundSize: "auto",
  paddingTop: 70,
};

const HEADER_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 15px",
  zIndex: 9999,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(10px)",
};

/* ─── Componente principal ─── */
export default function Home() {
  useAuthWidget();
  const { stats, top10, records, loading } = useLiveData();
  const { entries: changelogEntries, loadingCl } = useChangelog();
  const { staffMembers, loadingStaff } = useStaffMembers();

  /* Inyectar fuente Montserrat (como hace demonlist.html) */
  useEffect(() => {
    const id = "google-font-montserrat";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap";
    document.head.appendChild(link);
  }, []);

  /* Estilos responsive (media queries) — no se pueden expresar inline.
     El header replica el de demonlist.html (con botón hamburguesa). */
  useEffect(() => {
    const id = "home-responsive-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      /* Header global tipo demonlist.html */
      .top-header {
        position: fixed; top: 0; left: 0;
        width: 100%; height: 60px;
        display: flex; align-items: center; justify-content: space-between;
        padding: 0 15px; z-index: 9999;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(10px);
        font-family: 'Montserrat', sans-serif;
      }
      .top-header .left { display: flex; align-items: center; gap: 10px; }
      .top-header .logo-img { width: 38px; height: 38px; }
      .top-header .logo-text { color: white; font-weight: bold; font-size: 1.1rem; }
      .top-header .nav-links { display: flex; gap: 15px; }
      .top-header .nav-links a {
        color: white; text-decoration: none; font-size: 0.95rem;
        font-family: 'Montserrat', sans-serif;
      }
      .top-header .nav-links a:hover { color: #7cfc00; }
      .top-header .menu-toggle {
        display: none;
        font-size: 28px; color: white;
        width: 40px; height: 40px;
        align-items: center; justify-content: center;
        cursor: pointer; user-select: none;
      }

      /* Top 10 cards: forzar Montserrat */
      .home-top-card, .home-top-card * { font-family: 'Montserrat', sans-serif; }

      /* Role-based visibility (mirrors auth.js CSS for React context) */
      .staff-only  { display: none !important; }
      body.is-staff .staff-only  { display: revert !important; }
      body.is-admin .staff-only  { display: revert !important; }
      body.is-owner .staff-only  { display: revert !important; }
      .owner-only  { display: none !important; }
      body.is-owner .owner-only  { display: revert !important; }
      .admin-only  { display: none !important; }
      body.is-admin .admin-only  { display: revert !important; }
      body.is-owner .admin-only  { display: revert !important; }

      @media (max-width: 768px) {
        .top-header .menu-toggle { display: flex; }
        .top-header .nav-links {
          display: none; flex-direction: column;
          position: absolute; top: 60px; right: 10px;
          background: rgba(0,0,0,0.9);
          padding: 10px; border-radius: 10px; gap: 8px;
        }
        .top-header .nav-links.active { display: flex; }

        .home-top-card { padding: 12px !important; gap: 10px !important; border-radius: 14px !important; }
        .home-top-pos  { min-width: 38px !important; font-size: 1.3rem !important; }
        .home-top-thumb{ width: 90px !important; }
        .home-top-name { font-size: 1rem !important; }
        .home-top-author { font-size: 0.78rem !important; }
        .home-top-pts  { font-size: 0.95rem !important; }

        .home-hero-title { font-size: clamp(1.8rem, 9vw, 2.6rem) !important; }
        .home-hero-text  { font-size: 0.92rem !important; padding: 0 4px; }
      }
      @media (max-width: 460px) {
        .home-top-thumb { display: none !important; }
        .home-top-pos   { font-size: 1.15rem !important; min-width: 32px !important; }
      }
    `;
    document.head.appendChild(style);

    // Toggle del menú hamburguesa (igual que en demonlist.html)
    (window as any).toggleMenu = () => {
      const el = document.getElementById("navLinks");
      if (el) el.classList.toggle("active");
    };
  }, []);

  return (
    <div style={PAGE_BG} className="home-page">
      {/* ───────── HEADER (idéntico al de demonlist.html, con hamburguesa) ───────── */}
      <header className="top-header">
        <div className="left">
          <img src="https://iili.io/BN3Yhpp.png" className="logo-img" alt="Logo" />
          <div className="logo-text">BFT Demon List</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <nav className="nav-links" id="navLinks">
            <a href="/">Home</a>
            <a href="/demonlist.html">Demon List</a>
            <a href="/leaderboards.html">Leaderboards</a>
            <a href="/notifications.html">✉ Notificaciones</a>
            <a href="/submit.html">Enviar Record</a>
            <a href="/guidelines.html">Guidelines</a>
            <a href="/panel.html" className="staff-only">Panel de Records</a>
            <a href="/staff-control.html" className="owner-only">Control Staff</a>
            <a href="/admin-dev.html" className="admin-only">Admin Dev</a>
          </nav>
          <div className="auth-slot" id="authSlot"></div>
          <div
            className="menu-toggle"
            onClick={() => (window as any).toggleMenu && (window as any).toggleMenu()}
          >
            ☰
          </div>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section style={{ textAlign: "center", padding: "60px 20px 30px" }}>
        <h1
          className="home-hero-title"
          style={{
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: -1,
            textTransform: "uppercase",
            margin: 0,
            textShadow: "0 0 30px rgba(124,252,0,0.35)",
          }}
        >
          BufferTeam{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg,#1a4d1a 0%,#7cfc00 50%,#c7ff3b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Demon List
          </span>
        </h1>
        <p
          className="home-hero-text"
          style={{
            marginTop: 14,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 620,
            margin: "14px auto 0",
            fontSize: "1.05rem",
            lineHeight: 1.6,
          }}
        >
          El ranking oficial de los demons más difíciles completados por la
          comunidad BufferTeam.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 26,
            flexWrap: "wrap",
          }}
        >
          <a href="/demonlist.html" style={btnPrimary}>
            Ver Demon List
          </a>
          <a href="/submit.html" style={btnSecondary}>
            Enviar Record
          </a>
        </div>
      </section>

      {/* ───────── CHANGELOG ───────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "40px auto 0",
          padding: "0 20px",
        }}
      >
        <SectionTitle>Últimos cambios en la lista</SectionTitle>

        {loadingCl && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            Cargando…
          </p>
        )}

        {!loadingCl && changelogEntries.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Aún no hay cambios registrados.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {changelogEntries.map((entry) => {
            const isNew = entry.type === "NEW";
            return (
              <a
                key={entry.id}
                href={`/level.html?id=${entry.levelId}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "rgba(15,25,15,0.75)",
                  border: `1px solid ${isNew ? "rgba(124,252,0,0.22)" : "rgba(199,255,59,0.18)"}`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = isNew
                    ? "rgba(124,252,0,0.5)"
                    : "rgba(199,255,59,0.45)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 14px rgba(124,252,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = isNew
                    ? "rgba(124,252,0,0.22)"
                    : "rgba(199,255,59,0.18)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isNew
                      ? "linear-gradient(135deg,#1a4d1a,#7cfc00)"
                      : "linear-gradient(135deg,#2a2a00,#c7ff3b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {isNew ? "★" : "↕"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.levelName}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                    {isNew
                      ? `Añadido en #${entry.newPosition}`
                      : `Movido de #${entry.oldPosition ?? "?"} → #${entry.newPosition}`}
                    {" · "}{timeAgo(entry.createdAt)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: isNew ? "#7cfc00" : "#c7ff3b",
                    flexShrink: 0,
                  }}
                >
                  {isNew ? "NUEVO" : "MOVIDO"}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ───────── STAFF ───────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "48px auto 0",
          padding: "0 20px",
        }}
      >
        <SectionTitle>Nuestro Staff</SectionTitle>

        {loadingStaff && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.55)" }}>
            Cargando staff…
          </p>
        )}

        {!loadingStaff && staffMembers.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
            Sin miembros de staff registrados.
          </p>
        )}

        {(["Owner", "Admin", "Mod"] as const).map((role) => {
          const group = staffMembers.filter((m) => m.role === role);
          if (!group.length) return null;
          const roleLabel =
            role === "Owner" ? "Owners" : role === "Admin" ? "Administradores" : "Moderadores";
          const roleColor =
            role === "Owner" ? "#ffd700" : role === "Admin" ? "#c7ff3b" : "#7fd8ff";
          return (
            <div key={role} style={{ marginBottom: 30 }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  color: roleColor,
                  marginBottom: 14,
                  opacity: 0.9,
                }}
              >
                {roleLabel}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {group.map((m) => {
                  const name =
                    (m._profile as any)?.name || m.name || "Sin nombre";
                  const photo =
                    (m._profile as any)?.photoURL || m.photoURL || "";
                  const initials = name.slice(0, 2).toUpperCase();
                  return (
                    <a
                      key={m.uid}
                      href={`/profile.html?id=${m.uid}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 9,
                        background: "rgba(8,16,8,0.8)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 14,
                        padding: "16px 14px 12px",
                        minWidth: 96,
                        maxWidth: 110,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor =
                          roleColor + "55";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          `0 0 16px ${roleColor}18`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor =
                          "rgba(255,255,255,0.09)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "";
                      }}
                    >
                      {photo ? (
                        <img
                          src={photo}
                          alt={name}
                          referrerPolicy="no-referrer"
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: `2px solid ${roleColor}77`,
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(135deg,#1a4d1a,#7fff3b)",
                            fontWeight: 800,
                            color: "#000",
                            fontSize: "1rem",
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                      )}
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 82,
                          }}
                        >
                          {name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            color: roleColor,
                            marginTop: 4,
                          }}
                        >
                          {role}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ───────── STATS ───────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "30px auto 0",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            label="Records registrados"
            value={loading ? "…" : stats.records.toLocaleString()}
          />
          <StatCard
            label="Jugadores"
            value={loading ? "…" : stats.players.toLocaleString()}
          />
          <StatCard
            label="Niveles Registrados"
            value={loading ? "…" : stats.levels.toLocaleString()}
          />
          <StatCard
            label="Registros recientes"
            value={loading ? "…" : stats.recent.toString()}
          />
        </div>
      </section>

      {/* ───────── TOP 10 ───────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "50px auto 0",
          padding: "0 20px",
        }}
      >
        <SectionTitle>Top 10 Demons</SectionTitle>

        {loading && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            Cargando niveles…
          </p>
        )}

        {!loading && top10.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            Aún no hay niveles en la lista.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {top10.map((lv) => (
            <a
              key={lv.id}
              href={`/level.html?id=${lv.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div
                className="home-top-card"
                style={{
                  position: "relative",
                  width: "100%",
                  padding: 18,
                  borderRadius: 18,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: lv.background
                    ? `url('${lv.background}') center/cover`
                    : "rgba(20,30,20,0.7)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "scale(1.015)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 25px rgba(255,255,255,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                {/* overlay oscuro */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.45)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  className="home-top-pos"
                  style={{
                    position: "relative",
                    minWidth: 60,
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#ffffff",
                    textShadow: "0 0 10px rgba(0,0,0,0.6)",
                  }}
                >
                  #{lv.position}
                </div>

                {lv.thumbnail && (
                  <img
                    className="home-top-thumb"
                    src={lv.thumbnail}
                    alt={lv.name}
                    style={{
                      position: "relative",
                      width: 140,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  />
                )}

                <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                  <div
                    className="home-top-name"
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      marginBottom: 4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#ffffff",
                    }}
                  >
                    {lv.name}
                  </div>
                  <div
                    className="home-top-author"
                    style={{ opacity: 0.85, fontSize: "0.95rem", color: "#ffffff" }}
                  >
                    By {lv.author}
                  </div>
                </div>

                <div
                  className="home-top-pts"
                  style={{
                    position: "relative",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    textShadow: "0 0 8px rgba(0,0,0,0.5)",
                    flexShrink: 0,
                  }}
                >
                  {Math.round(lv.value || 0)} pt
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/demonlist.html" style={btnPrimary}>
            Ver lista completa
          </a>
        </div>
      </section>

      {/* ───────── REGISTROS RECIENTES ───────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "60px auto 0",
          padding: "0 20px",
        }}
      >
        <SectionTitle>Registros recientes</SectionTitle>

        {loading && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            Cargando…
          </p>
        )}

        {!loading && records.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
            Todavía no hay records aceptados.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {records.map((r) => (
            <a
              key={r.id}
              href={`/level.html?id=${r.levelId}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "rgba(15,25,15,0.75)",
                border: "1px solid rgba(124,252,0,0.18)",
                borderRadius: 14,
                padding: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(124,252,0,0.55)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 18px rgba(124,252,0,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(124,252,0,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
              }}
            >
              {r.playerPhoto ? (
                <img
                  src={r.playerPhoto}
                  alt={r.playerName}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(124,252,0,0.4)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#1a4d1a,#7cfc00)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  {r.playerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {r.playerName}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.7)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {Number(r.percent) >= 100 ? (
                    <>completó <span style={{ color: "#7cfc00" }}>{r.levelName}</span></>
                  ) : (
                    <>hizo un progreso del <span style={{ color: "#c7ff3b", fontWeight: 700 }}>{r.percent}%</span> en <span style={{ color: "#7cfc00" }}>{r.levelName}</span></>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.45)",
                    marginTop: 2,
                  }}
                >
                  {timeAgo(r.acceptedAt)} · {r.percent}%
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer
        style={{
          marginTop: 80,
          padding: "30px 20px",
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.85rem",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
        }}
      >
        © {new Date().getFullYear()} BufferTeam Demon List · No afiliado con
        RobTop Games
      </footer>
    </div>
  );
}

/* ─── Subcomponentes / estilos ─── */
const navLink: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "0.95rem",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: 12,
  background: "linear-gradient(135deg,#1a4d1a,#7cfc00)",
  color: "#fff",
  fontWeight: 700,
  textDecoration: "none",
  boxShadow: "0 0 18px rgba(124,252,0,0.35)",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-block",
  padding: "12px 24px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(124,252,0,0.4)",
  color: "#fff",
  fontWeight: 700,
  textDecoration: "none",
  transition: "background 0.2s",
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(15,25,15,0.75)",
        border: "1px solid rgba(124,252,0,0.2)",
        borderRadius: 14,
        padding: "20px 16px",
        textAlign: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          color: "#c7ff3b",
          textShadow: "0 0 12px rgba(199,255,59,0.45)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: "0.78rem",
          color: "rgba(255,255,255,0.65)",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "1.6rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 22,
        color: "#fff",
        textAlign: "center",
        textShadow: "0 0 18px rgba(124,252,0,0.35)",
      }}
    >
      {children}
    </h2>
  );
}


