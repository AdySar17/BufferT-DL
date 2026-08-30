import React, { useCallback, useEffect, useState } from "react";

/* ─── Auth widget ─── */
function useAuthWidget() {
  useEffect(() => {
    const id = "auth-mount-script";
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "module";
    script.textContent = `import { mountAuthUI } from "/auth.js"; mountAuthUI("authSlot");`;
    document.head.appendChild(script);
  }, []);
}

/* ─── Idiomas disponibles ─── */
const LANGS: Record<string, string> = {
  es: "🇪🇸 Español",
  en: "🇺🇸 English",
  ru: "🇷🇺 Русский",
  pt: "🇧🇷 Português",
  fr: "🇫🇷 Français",
  vi: "🇻🇳 Tiếng Việt",
};
const LANG_FLAGS: Record<string, string> = {
  es: "🇪🇸", en: "🇺🇸", ru: "🇷🇺", pt: "🇧🇷", fr: "🇫🇷", vi: "🇻🇳",
};

/* ─── Diccionario de traducciones ─── */
const TR: Record<string, Record<string, string>> = {
  nav_home:          { es:"Home",               en:"Home",           ru:"Главная",               pt:"Início",          fr:"Accueil",           vi:"Trang chủ" },
  nav_demonlist:     { es:"Demon List",          en:"Demon List",     ru:"Список демонов",        pt:"Demon List",      fr:"Demon List",        vi:"Demon List" },
  nav_pemonlist:     { es:"PemonList",           en:"PemonList",      ru:"PemonList",             pt:"PemonList",       fr:"PemonList",        vi:"PemonList" },
  nav_leaderboards:  { es:"Leaderboards",        en:"Leaderboards",   ru:"Таблица лидеров",       pt:"Rankings",        fr:"Classements",       vi:"Bảng xếp hạng" },
  nav_notifications: { es:"✉ Notificaciones",    en:"✉ Notifications",ru:"✉ Уведомления",        pt:"✉ Notificações",  fr:"✉ Notifications",   vi:"✉ Thông báo" },
  nav_submit:        { es:"Enviar Record",       en:"Submit Record",  ru:"Отправить рекорд",      pt:"Enviar Record",   fr:"Soumettre un record",vi:"Gửi Record" },
  nav_guidelines:    { es:"Guidelines",          en:"Guidelines",     ru:"Правила",               pt:"Diretrizes",      fr:"Règles",            vi:"Hướng dẫn" },
  nav_panel:         { es:"Panel de Records",    en:"Records Panel",  ru:"Панель записей",        pt:"Painel Records",  fr:"Panneau Records",   vi:"Bảng Records" },
  nav_staff_control: { es:"Control Staff",       en:"Staff Control",  ru:"Управление Staff",      pt:"Controle Staff",  fr:"Contrôle Staff",    vi:"Quản lý Staff" },
  nav_admin_dev:     { es:"Admin Dev",            en:"Admin Dev",      ru:"Admin Dev",             pt:"Admin Dev",       fr:"Admin Dev",         vi:"Admin Dev" },

  hero_desc: {
    es: "El ranking oficial de los demons más difíciles completados por la comunidad BufferTeam.",
    en: "The official ranking of the hardest demons completed by the BufferTeam community.",
    ru: "Официальный рейтинг самых сложных демонов, пройденных сообществом BufferTeam.",
    pt: "O ranking oficial dos demons mais difíceis completados pela comunidade BufferTeam.",
    fr: "Le classement officiel des demons les plus difficiles complétés par la communauté BufferTeam.",
    vi: "Bảng xếp hạng chính thức các demon khó nhất được hoàn thành bởi cộng đồng BufferTeam.",
  },
  btn_view_list:     { es:"Ver Demon List",         en:"View Demon List",      ru:"Смотреть список",      pt:"Ver Demon List",    fr:"Voir la liste",           vi:"Xem Demon List" },
  btn_submit:        { es:"Enviar Record",           en:"Submit Record",        ru:"Отправить рекорд",     pt:"Enviar Record",    fr:"Soumettre un record",     vi:"Gửi Record" },

  section_changelog: { es:"Últimos cambios en la lista", en:"Latest list changes",    ru:"Последние изменения",    pt:"Últimas mudanças",   fr:"Derniers changements",  vi:"Thay đổi mới nhất" },
  no_changes:        { es:"Aún no hay cambios registrados.", en:"No changes recorded yet.", ru:"Изменений пока нет.", pt:"Sem mudanças ainda.", fr:"Aucun changement.",  vi:"Chưa có thay đổi." },
  cl_added_at:       { es:"Añadido en",   en:"Added at",    ru:"Добавлен на",  pt:"Adicionado em", fr:"Ajouté à",    vi:"Thêm vào" },
  cl_moved_from:     { es:"Movido de",    en:"Moved from",  ru:"Перемещён с",  pt:"Movido de",     fr:"Déplacé de",  vi:"Di chuyển từ" },
  cl_new:            { es:"NUEVO",        en:"NEW",          ru:"НОВЫЙ",        pt:"NOVO",          fr:"NOUVEAU",     vi:"MỚI" },
  cl_moved:          { es:"MOVIDO",       en:"MOVED",        ru:"ПЕРЕМЕЩЁН",    pt:"MOVIDO",        fr:"DÉPLACÉ",     vi:"ĐÃ DI CHUYỂN" },

  section_staff:     { es:"Nuestro Staff",  en:"Our Staff",       ru:"Наш стафф",       pt:"Nossa Staff",     fr:"Notre Staff",     vi:"Đội Staff" },
  role_owners:       { es:"Owners",         en:"Owners",          ru:"Владельцы",       pt:"Owners",          fr:"Owners",          vi:"Owners" },
  role_admins:       { es:"Administradores",en:"Administrators",  ru:"Администраторы",  pt:"Administradores", fr:"Administrateurs", vi:"Quản trị viên" },
  role_mods:         { es:"Moderadores",    en:"Moderators",      ru:"Модераторы",      pt:"Moderadores",     fr:"Modérateurs",     vi:"Điều hành viên" },
  no_staff:          { es:"Sin miembros de staff registrados.", en:"No staff members registered.", ru:"Нет сотрудников.", pt:"Sem membros de staff.", fr:"Aucun membre du staff.", vi:"Không có thành viên staff." },

  stat_records:      { es:"Records registrados",  en:"Registered records", ru:"Рекорды",   pt:"Records registrados", fr:"Records enregistrés",  vi:"Records đã đăng ký" },
  stat_players:      { es:"Jugadores",             en:"Players",            ru:"Игроки",    pt:"Jogadores",           fr:"Joueurs",              vi:"Người chơi" },
  stat_levels:       { es:"Niveles Registrados",   en:"Registered Levels",  ru:"Уровни",    pt:"Níveis Registrados",  fr:"Niveaux enregistrés",  vi:"Màn chơi đã đăng ký" },
  stat_recent:       { es:"Registros recientes",   en:"Recent records",     ru:"Последние", pt:"Records recentes",    fr:"Records récents",      vi:"Records gần đây" },

  section_top10:     { es:"Top 10 Demons", en:"Top 10 Demons", ru:"Топ 10 демонов",  pt:"Top 10 Demons", fr:"Top 10 Demons",           vi:"Top 10 Demons" },
  no_levels:         { es:"Aún no hay niveles en la lista.", en:"No levels in the list yet.", ru:"Уровней пока нет.", pt:"Ainda não há níveis.", fr:"Aucun niveau.", vi:"Chưa có màn chơi." },
  btn_full_list:     { es:"Ver lista completa",    en:"View full list",  ru:"Полный список",  pt:"Ver lista completa", fr:"Voir la liste complète", vi:"Xem toàn bộ danh sách" },

  section_recent:    { es:"Registros recientes",   en:"Recent records",    ru:"Последние рекорды",    pt:"Records recentes",    fr:"Records récents",   vi:"Records gần đây" },
  loading:           { es:"Cargando…",             en:"Loading…",          ru:"Загрузка…",            pt:"Carregando…",         fr:"Chargement…",       vi:"Đang tải…" },
  no_records:        { es:"Todavía no hay records aceptados.", en:"No accepted records yet.", ru:"Принятых рекордов нет.", pt:"Sem records aceitos.", fr:"Aucun record accepté.", vi:"Chưa có records." },
  rec_completed:     { es:"completó",              en:"completed",         ru:"прошёл",               pt:"completou",           fr:"a complété",        vi:"đã hoàn thành" },
  rec_progress:      { es:"hizo un progreso del",  en:"made progress of",  ru:"достиг",               pt:"fez um progresso de",  fr:"a progressé de",   vi:"đạt tiến độ" },
  rec_in:            { es:"en",                    en:"in",                ru:"в",                    pt:"em",                  fr:"dans",              vi:"trong" },

  time_moment:       { es:"hace un momento", en:"just now",    ru:"только что",    pt:"agora mesmo",  fr:"à l'instant",   vi:"vừa xong" },
  time_min:          { es:"hace {n} min",    en:"{n} min ago", ru:"{n} мин назад", pt:"há {n} min",   fr:"il y a {n} min",vi:"{n} phút trước" },
  time_h:            { es:"hace {n} h",      en:"{n} h ago",   ru:"{n} ч назад",   pt:"há {n} h",     fr:"il y a {n} h",  vi:"{n} giờ trước" },
  time_d:            { es:"hace {n} d",      en:"{n} d ago",   ru:"{n} д назад",   pt:"há {n} d",     fr:"il y a {n} j",  vi:"{n} ngày trước" },

  footer_copy:       { es:"No afiliado con RobTop Games", en:"Not affiliated with RobTop Games", ru:"Не аффилирован с RobTop Games", pt:"Não afiliado à RobTop Games", fr:"Non affilié à RobTop Games", vi:"Không liên kết với RobTop Games" },
  lang_label:        { es:"Idioma", en:"Language", ru:"Язык", pt:"Idioma", fr:"Langue", vi:"Ngôn ngữ" },
};

const STORAGE_KEY = "bft_lang";

/* ─── Hook de idioma ─── */
function useLang() {
  const [lang, setLangState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && LANGS[saved] ? saved : "es";
    } catch { return "es"; }
  });

  // Sincroniza con otras pestañas / páginas HTML
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ lang: string }>).detail;
      if (detail?.lang && LANGS[detail.lang]) setLangState(detail.lang);
    };
    window.addEventListener("bft-lang-change", handler);
    return () => window.removeEventListener("bft-lang-change", handler);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const entry = TR[key];
      if (!entry) return key;
      let str = entry[lang] ?? entry["es"] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)); });
      }
      return str;
    },
    [lang]
  );

  const setLang = useCallback((code: string) => {
    if (!LANGS[code]) return;
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    setLangState(code);
    window.dispatchEvent(new CustomEvent("bft-lang-change", { detail: { lang: code } }));
    // Sincronizar con BFT_I18N si está disponible (para páginas HTML)
    if ((window as any).BFT_I18N) (window as any).BFT_I18N.setLang(code);
  }, []);

  return { lang, t, setLang };
}

/* ─── Selector de idioma (React) ─── */
function LanguageSelector({ lang, setLang }: { lang: string; setLang: (c: string) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close, { once: true });
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        title={TR["lang_label"][lang] ?? "Idioma"}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 9px", borderRadius: 8, cursor: "pointer",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "#fff", fontSize: "0.9rem",
          fontFamily: "'Montserrat', sans-serif",
          transition: "background 0.15s, border-color 0.15s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,252,0,0.3)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
        }}
      >
        <span>{LANG_FLAGS[lang] ?? "🌐"}</span>
        <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: "rgba(8,18,8,0.97)",
            border: "1px solid rgba(124,252,0,0.22)",
            borderRadius: 10, padding: 5, minWidth: 162,
            zIndex: 99999, boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {Object.entries(LANGS).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => { setLang(code); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none",
                color: code === lang ? "#c7ff3b" : "rgba(255,255,255,0.8)",
                fontWeight: code === lang ? 700 : 400,
                padding: "7px 10px", borderRadius: 7, cursor: "pointer",
                fontSize: "0.87rem", fontFamily: "'Montserrat', sans-serif",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,252,0,0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Tipos para datos en vivo ─── */
type LiveLevel  = { id: string; name: string; author: string; position: number; value: number; thumbnail?: string; background?: string; glow?: string; video?: string; };
type LiveRecord = { id: string; playerName: string; playerPhoto?: string; levelName: string; levelId: string; percent: number; acceptedAt?: any; };
type LiveStats  = { records: number; players: number; levels: number; recent: number; };

const CACHE_TTL_MS       = 5 * 60 * 1000;
const CACHE_TTL_STAFF_MS = 12 * 60 * 60 * 1000;

function readCache<T>(key: string, ttl = CACHE_TTL_MS): T | null {
  try { const raw = localStorage.getItem(key); if (!raw) return null; const { ts, data } = JSON.parse(raw); if (Date.now() - ts < ttl) return data as T; } catch {}
  return null;
}
function writeCache(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}
function readCacheRaw<T>(key: string): T | null {
  try { const raw = localStorage.getItem(key); if (!raw) return null; const { data } = JSON.parse(raw); return data as T ?? null; } catch {}
  return null;
}

/* ─── Spinner ─── */
function LoadingSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "28px 0" }}>
      <div style={{ width: 28, height: 28, border: "3px solid rgba(124,252,0,0.15)", borderTop: "3px solid #7cfc00", borderRadius: "50%", animation: "bft-spin 0.65s linear infinite" }} />
    </div>
  );
}

/* ─── Hook: datos en vivo ─── */
function useLiveData() {
  const [stats,   setStats]   = useState<LiveStats>({ records: 0, players: 0, levels: 0, recent: 0 });
  const [top10,   setTop10]   = useState<LiveLevel[]>([]);
  const [records, setRecords] = useState<LiveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = readCache<{ stats: LiveStats; top10: LiveLevel[]; records: LiveRecord[] }>("home_livedata_v2");
      if (cached) { setStats(cached.stats); setTop10(cached.top10); setRecords(cached.records); setLoading(false); return; }
      try {
        const dynImport: (s: string) => Promise<any> = new Function("u", "return import(u)") as any;
        const auth = await dynImport("/auth.js");
        const fs   = await dynImport("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const { db } = auth as any;
        const { collection, query, orderBy, limit, where, getDocs, getCountFromServer, doc, getDoc } = fs as any;

        const lvlSnap = await getDocs(query(collection(db, "levels"), orderBy("position", "asc"), limit(10)));
        const lvls: LiveLevel[] = [];
        lvlSnap.forEach((d: any) => {
          const level = d.data() as any;
          if (level.listType !== "pemon") lvls.push({ id: d.id, ...level });
        });

        const recSnap = await getDocs(query(collection(db, "records"), orderBy("acceptedAt", "desc"), limit(5)));
        const rawRecs: any[] = [];
        recSnap.forEach((d: any) => rawRecs.push({ id: d.id, ...d.data() }));

        const recsResolved = (await Promise.all(
          rawRecs.map(async (r: any) => {
            let playerName = "Jugador"; let playerPhoto: string | undefined; let levelName = "Nivel";
            try {
              if (r.userId) {
                const p = await getDoc(doc(db, "profiles", r.userId));
                if (p.exists()) { const pd = p.data(); playerName = pd.displayName || pd.name || playerName; playerPhoto = pd.photoURL; }
                else { const u = await getDoc(doc(db, "users", r.userId)); if (u.exists()) { const ud = u.data(); playerName = ud.displayName || ud.name || playerName; playerPhoto = ud.photoURL; } }
              }
              if (r.levelId) {
                const lv = await getDoc(doc(db, "levels", r.levelId));
                if (lv.exists()) {
                  const level = lv.data();
                  if (level.listType === "pemon") return null;
                  levelName = level.name || levelName;
                }
              }
            } catch {}
            return { id: r.id, playerName, playerPhoto, levelName, levelId: r.levelId, percent: r.percent || 100, acceptedAt: r.acceptedAt };
          })
        )).filter(Boolean) as LiveRecord[];

        async function countCol(colRef: any, label: string): Promise<number> {
          if (typeof getCountFromServer === "function") { try { const snap = await getCountFromServer(colRef); const n = snap.data().count; if (typeof n === "number") return n; } catch (e) { console.warn(`[home] count (${label}):`, e); } }
          try { const snap = await getDocs(query(colRef, limit(1000))); return snap.size; } catch { return 0; }
        }
        const [allRecordsSnap, allLevelsSnap, playersCount] = await Promise.all([
          getDocs(query(collection(db, "records"), where("status", "==", "Accepted"))),
          getDocs(collection(db, "levels")),
          countCol(collection(db, "profiles"), "profiles"),
        ]);
        const demonLevelIds = new Set<string>();
        allLevelsSnap.forEach((d: any) => {
          if (d.data()?.listType !== "pemon") demonLevelIds.add(d.id);
        });
        const recordsCount = allRecordsSnap.docs.filter((d: any) =>
          demonLevelIds.has(d.data()?.levelId)
        ).length;
        const levelsCount = demonLevelIds.size;

        if (cancelled) return;
        const newStats = { records: recordsCount, players: playersCount, levels: levelsCount, recent: recsResolved.length };
        writeCache("home_livedata_v2", { stats: newStats, top10: lvls, records: recsResolved });
        setTop10(lvls); setRecords(recsResolved); setStats(newStats); setLoading(false);
      } catch (err) { console.error("[home] error cargando datos:", err); if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  return { stats, top10, records, loading };
}

/* ─── Tipos Staff ─── */
type StaffMember = { uid: string; name: string; role: "Owner" | "Admin" | "Mod"; photoURL?: string; _profile: { name?: string; photoURL?: string } | null; };

function useStaffMembers() {
  const stale = readCacheRaw<StaffMember[]>("home_staff");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(stale ?? []);
  const [loadingStaff, setLoadingStaff] = useState(!stale);

  useEffect(() => {
    const fresh = readCache<StaffMember[]>("home_staff", CACHE_TTL_STAFF_MS);
    if (fresh) { setLoadingStaff(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const dynImport: (s: string) => Promise<any> = new Function("u", "return import(u)") as any;
        const auth = await dynImport("/auth.js");
        const fs   = await dynImport("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const { db } = auth as any;
        const { collection, query, where, getDocs, doc, getDoc } = fs as any;
        const snap = await getDocs(query(collection(db, "users"), where("role", "in", ["Owner", "Admin", "Mod"])));
        const members: StaffMember[] = [];
        snap.forEach((d: any) => members.push({ uid: d.id, _profile: null, ...d.data() }));
        await Promise.all(members.map(async (m) => { try { const p = await getDoc(doc(db, "profiles", m.uid)); m._profile = p.exists() ? (p.data() as any) : null; } catch {} }));
        writeCache("home_staff", members);
        if (!cancelled) setStaffMembers(members);
      } catch (e) { console.warn("[home] staff:", e); }
      finally { if (!cancelled) setLoadingStaff(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  return { staffMembers, loadingStaff };
}

/* ─── Tipo Changelog ─── */
type ChangelogEntry = { id: string; type: "NEW" | "MOVED"; levelId: string; levelName: string; newPosition: number; oldPosition: number | null; createdAt?: any; };

function useChangelog() {
  const [entries,   setEntries]   = useState<ChangelogEntry[]>([]);
  const [loadingCl, setLoadingCl] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;
    (async () => {
      try {
        const dynImport: (s: string) => Promise<any> = new Function("u", "return import(u)") as any;
        const auth = await dynImport("/auth.js");
        const fs   = await dynImport("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const { db } = auth as any;
        const { collection, query, orderBy, limit, onSnapshot } = fs as any;
        unsub = onSnapshot(
          query(collection(db, "changelog"), orderBy("createdAt", "desc"), limit(5)),
          (snap: any) => { const rows: ChangelogEntry[] = []; snap.forEach((d: any) => rows.push({ id: d.id, ...d.data() })); setEntries(rows); setLoadingCl(false); },
          (e: any) => { console.warn("[home] changelog:", e); setLoadingCl(false); }
        );
      } catch (e) { console.warn("[home] changelog setup:", e); setLoadingCl(false); }
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  return { entries, loadingCl };
}

/* ─── Helpers ─── */
function timeAgo(ts: any, t: (key: string, vars?: Record<string, string | number>) => string): string {
  if (!ts) return "";
  let d: Date;
  if (typeof ts.toDate === "function") d = ts.toDate();
  else if (typeof ts === "object" && typeof ts.seconds === "number") d = new Date(ts.seconds * 1000);
  else d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)     return t("time_moment");
  if (diff < 3600)   return t("time_min", { n: Math.floor(diff / 60) });
  if (diff < 86400)  return t("time_h",   { n: Math.floor(diff / 3600) });
  if (diff < 604800) return t("time_d",   { n: Math.floor(diff / 86400) });
  return d.toLocaleDateString();
}

/* ─── Estilos ─── */
const PAGE_BG: React.CSSProperties = {
  minHeight: "100vh",
  fontFamily: "'Montserrat', sans-serif",
  color: "#fff",
  background: "black url('https://iili.io/BrsOUyG.jpg') repeat top left fixed",
  backgroundSize: "auto",
  paddingTop: 70,
};

/* ─── Componente principal ─── */
export default function Home() {
  useAuthWidget();
  const { lang, t, setLang }                       = useLang();
  const { stats, top10, records, loading }          = useLiveData();
  const { entries: changelogEntries, loadingCl }    = useChangelog();
  const { staffMembers, loadingStaff }              = useStaffMembers();

  /* Inyectar fuente Montserrat */
  useEffect(() => {
    const id = "google-font-montserrat";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id; link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap";
    document.head.appendChild(link);
  }, []);

  /* Estilos responsive + hero button hover CSS */
  useEffect(() => {
    const id = "home-responsive-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .top-header { position:fixed; top:0; left:0; width:100%; height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 15px; z-index:9999; background:rgba(0,0,0,0.55); backdrop-filter:blur(10px); font-family:'Montserrat',sans-serif; }
      .top-header .left { display:flex; align-items:center; gap:10px; }
      .top-header .logo-img { width:38px; height:38px; }
      .top-header .logo-text { color:white; font-weight:bold; font-size:1.1rem; }
      .top-header .nav-links { display:flex; gap:15px; }
      .top-header .nav-links a { color:white; text-decoration:none; font-size:0.95rem; font-family:'Montserrat',sans-serif; transition:color 0.18s; }
      .top-header .nav-links a:hover { color:#7cfc00; }
      .top-header .menu-toggle { display:none; font-size:28px; color:white; width:40px; height:40px; align-items:center; justify-content:center; cursor:pointer; user-select:none; }
      .top-header.header-compact .logo-full { display:none; }
      .top-header.header-compact .logo-short { display:inline; }
      .home-top-card,.home-top-card * { font-family:'Montserrat',sans-serif; }
      .staff-only { display:none!important; } body.is-staff .staff-only, body.is-admin .staff-only, body.is-owner .staff-only { display:revert!important; }
      .owner-only { display:none!important; } body.is-owner .owner-only { display:revert!important; }
      .admin-only { display:none!important; } body.is-admin .admin-only, body.is-owner .admin-only { display:revert!important; }
      @media(max-width:768px){
        .top-header .menu-toggle { display:flex; }
        .top-header .nav-links { display:none; flex-direction:column; position:absolute; top:60px; right:10px; background:rgba(0,0,0,0.9); padding:10px; border-radius:10px; gap:8px; }
        .top-header .nav-links.active { display:flex; }
        .home-top-card { padding:12px!important; gap:10px!important; border-radius:14px!important; }
        .home-top-pos  { min-width:38px!important; font-size:1.3rem!important; }
        .home-top-thumb{ width:90px!important; }
        .home-top-name { font-size:1rem!important; }
        .home-top-author { font-size:0.78rem!important; }
        .home-top-pts  { font-size:0.95rem!important; }
        .home-hero-title { font-size:clamp(1.8rem,9vw,2.6rem)!important; }
        .home-hero-text  { font-size:0.92rem!important; padding:0 4px; }
      }
      @media(max-width:460px){ .home-top-thumb { display:none!important; } .home-top-pos { font-size:1.15rem!important; min-width:32px!important; } }
      @keyframes bft-spin { to { transform:rotate(360deg); } }
    `;
    document.head.appendChild(style);

    /* shared.css para logo glow y animaciones de botones */
    const sharedId = "bft-shared-css";
    if (!document.getElementById(sharedId)) {
      const link = document.createElement("link");
      link.id = sharedId; link.rel = "stylesheet"; link.href = "/shared.css";
      document.head.appendChild(link);
    }

    (window as any).toggleMenu = () => { const el = document.getElementById("navLinks"); if (el) el.classList.toggle("active"); };

    /* Responsive logo: toggle .header-compact when header content overflows */
    const header = document.querySelector(".top-header") as HTMLElement | null;
    if (header) {
      const check = () => {
        const leftEl  = header.querySelector(".left") as HTMLElement | null;
        const rightEl = leftEl?.nextElementSibling as HTMLElement | null;
        if (!leftEl || !rightEl) return;
        const used = leftEl.scrollWidth + rightEl.scrollWidth + 14;
        header.classList.toggle("header-compact", used > header.clientWidth * 0.95);
      };
      check();
      const ro = window.ResizeObserver ? new ResizeObserver(check) : null;
      ro?.observe(header);
      window.addEventListener("resize", check);
    }
  }, []);

  return (
    <div style={PAGE_BG} className="home-page">

      {/* ───────── HEADER ───────── */}
      <header className="top-header">
        <div className="left">
          <img src="/logo.png" className="logo-img" alt="Logo" />
          <div className="logo-text"><span className="logo-full">BFT Demon List</span><span className="logo-short">BFT DL</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <nav className="nav-links" id="navLinks">
            <a href="/">{t("nav_home")}</a>
            <a href="/demonlist.html">{t("nav_demonlist")}</a>
            <a href="/pemonlist.html">{t("nav_pemonlist")}</a>
            <a href="/leaderboards.html">{t("nav_leaderboards")}</a>
            <a href="/notifications.html">{t("nav_notifications")}</a>
            <a href="/submit.html">{t("nav_submit")}</a>
            <a href="/guidelines.html">{t("nav_guidelines")}</a>
            <a href="/panel.html" className="staff-only">{t("nav_panel")}</a>
            <a href="/staff-control.html" className="owner-only">{t("nav_staff_control")}</a>
            <a href="/admin-dev.html" className="admin-only">{t("nav_admin_dev")}</a>
          </nav>
          <LanguageSelector lang={lang} setLang={setLang} />
          <div className="auth-slot" id="authSlot"></div>
          <div className="menu-toggle" onClick={() => (window as any).toggleMenu?.()}>☰</div>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section style={{ textAlign: "center", padding: "60px 20px 30px" }}>
        <h1
          className="home-hero-title"
          style={{ fontSize: "clamp(2.5rem,7vw,4.5rem)", fontWeight: 900, letterSpacing: -1, textTransform: "uppercase", margin: 0, textShadow: "0 0 30px rgba(124,252,0,0.35)" }}
        >
          BufferTeam{" "}
          <span style={{ background: "linear-gradient(135deg,#1a4d1a 0%,#7cfc00 50%,#c7ff3b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Demon List
          </span>
        </h1>
        <p className="home-hero-text" style={{ marginTop: 14, color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "14px auto 0", fontSize: "1.05rem", lineHeight: 1.6 }}>
          {t("hero_desc")}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
          <a href="/demonlist.html" className="bft-hero-btn bft-hero-btn-primary">
            {t("btn_view_list")}
          </a>
          <a href="/submit.html" className="bft-hero-btn bft-hero-btn-secondary">
            {t("btn_submit")}
          </a>
        </div>
      </section>

      {/* ───────── CHANGELOG ───────── */}
      <section style={{ maxWidth: 1100, margin: "40px auto 0", padding: "0 20px" }}>
        <SectionTitle>{t("section_changelog")}</SectionTitle>
        {loadingCl && <LoadingSpinner />}
        {!loadingCl && changelogEntries.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>{t("no_changes")}</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {changelogEntries.map((entry) => {
            const isNew = entry.type === "NEW";
            return (
              <a key={entry.id} href={`/level.html?id=${entry.levelId}`}
                style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(15,25,15,0.75)", border:`1px solid ${isNew?"rgba(124,252,0,0.22)":"rgba(199,255,59,0.18)"}`, borderRadius:12, padding:"12px 16px", textDecoration:"none", color:"inherit", transition:"border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isNew?"rgba(124,252,0,0.5)":"rgba(199,255,59,0.45)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow="0 0 14px rgba(124,252,0,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = isNew?"rgba(124,252,0,0.22)":"rgba(199,255,59,0.18)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow=""; }}
              >
                <div style={{ width:36, height:36, borderRadius:10, background:isNew?"linear-gradient(135deg,#1a4d1a,#7cfc00)":"linear-gradient(135deg,#2a2a00,#c7ff3b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>
                  {isNew ? "★" : "↕"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:"0.95rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{entry.levelName}</div>
                  <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.6)", marginTop:2 }}>
                    {isNew
                      ? `${t("cl_added_at")} #${entry.newPosition}`
                      : `${t("cl_moved_from")} #${entry.oldPosition ?? "?"} → #${entry.newPosition}`}
                    {" · "}{timeAgo(entry.createdAt, t)}
                  </div>
                </div>
                <div style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:isNew?"#7cfc00":"#c7ff3b", flexShrink:0 }}>
                  {isNew ? t("cl_new") : t("cl_moved")}
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ───────── STAFF ───────── */}
      <section style={{ maxWidth: 1100, margin: "48px auto 0", padding: "0 20px" }}>
        <SectionTitle>{t("section_staff")}</SectionTitle>
        {loadingStaff && <LoadingSpinner />}
        {!loadingStaff && staffMembers.length === 0 && (
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"0.9rem" }}>{t("no_staff")}</p>
        )}
        {(["Owner", "Admin", "Mod"] as const).map((role) => {
          const group = staffMembers.filter((m) => m.role === role);
          if (!group.length) return null;
          const roleLabel = role === "Owner" ? t("role_owners") : role === "Admin" ? t("role_admins") : t("role_mods");
          const roleColor = role === "Owner" ? "#ffd700" : role === "Admin" ? "#c7ff3b" : "#7fd8ff";
          return (
            <div key={role} style={{ marginBottom: 30 }}>
              <div style={{ fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:1.4, color:roleColor, marginBottom:14, opacity:0.9 }}>{roleLabel}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                {group.map((m) => {
                  const name    = (m._profile as any)?.name || m.name || "—";
                  const photo   = (m._profile as any)?.photoURL || m.photoURL || "";
                  const initials = name.slice(0, 2).toUpperCase();
                  return (
                    <a key={m.uid} href={`/profile.html?id=${m.uid}`}
                      style={{ textDecoration:"none", color:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:9, background:"rgba(8,16,8,0.8)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:14, padding:"16px 14px 12px", minWidth:96, maxWidth:110, transition:"border-color 0.2s, box-shadow 0.2s", cursor:"pointer" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor=roleColor+"55"; (e.currentTarget as HTMLAnchorElement).style.boxShadow=`0 0 16px ${roleColor}18`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.09)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow=""; }}
                    >
                      {photo
                        ? <img src={photo} alt={name} referrerPolicy="no-referrer" style={{ width:52, height:52, borderRadius:"50%", objectFit:"cover", border:`2px solid ${roleColor}77`, display:"block" }} />
                        : <div style={{ width:52, height:52, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#1a4d1a,#7fff3b)", fontWeight:800, color:"#000", fontSize:"1rem", flexShrink:0 }}>{initials}</div>
                      }
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontWeight:700, fontSize:"0.78rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:82 }}>{name}</div>
                        <div style={{ fontSize:"0.62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, color:roleColor, marginTop:4 }}>{role}</div>
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
      <section style={{ maxWidth: 1100, margin: "30px auto 0", padding: "0 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
          <StatCard label={t("stat_records")} value={loading ? "…" : stats.records.toLocaleString()} />
          <StatCard label={t("stat_players")} value={loading ? "…" : stats.players.toLocaleString()} />
          <StatCard label={t("stat_levels")}  value={loading ? "…" : stats.levels.toLocaleString()} />
          <StatCard label={t("stat_recent")}  value={loading ? "…" : stats.recent.toString()} />
        </div>
      </section>

      {/* ───────── TOP 10 ───────── */}
      <section style={{ maxWidth: 1100, margin: "50px auto 0", padding: "0 20px" }}>
        <SectionTitle>{t("section_top10")}</SectionTitle>
        {loading && <LoadingSpinner />}
        {!loading && top10.length === 0 && (
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>{t("no_levels")}</p>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {top10.map((lv) => (
            <a key={lv.id} href={`/level.html?id=${lv.id}`} style={{ textDecoration:"none", color:"inherit", display:"block" }}>
              <div className="home-top-card"
                style={{ position:"relative", width:"100%", padding:18, borderRadius:18, overflow:"hidden", display:"flex", alignItems:"center", gap:16, background:lv.background?`url('${lv.background}') center/cover`:"rgba(20,30,20,0.7)", border:"1px solid rgba(255,255,255,0.18)", transition:"transform 0.25s, box-shadow 0.25s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform="scale(1.015)"; (e.currentTarget as HTMLDivElement).style.boxShadow="0 0 25px rgba(255,255,255,0.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform=""; (e.currentTarget as HTMLDivElement).style.boxShadow=""; }}
              >
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", pointerEvents:"none" }} />
                <div className="home-top-pos" style={{ position:"relative", minWidth:60, textAlign:"center", fontSize:"2rem", fontWeight:900, color:"#ffffff", textShadow:"0 0 10px rgba(0,0,0,0.6)" }}>#{lv.position}</div>
                {lv.thumbnail && <img className="home-top-thumb" src={lv.thumbnail} alt={lv.name} style={{ position:"relative", width:140, borderRadius:10, flexShrink:0 }} />}
                <div style={{ position:"relative", flex:1, minWidth:0 }}>
                  <div className="home-top-name"  style={{ fontSize:"1.3rem", fontWeight:700, marginBottom:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", color:"#ffffff" }}>{lv.name}</div>
                  <div className="home-top-author" style={{ opacity:0.85, fontSize:"0.95rem", color:"#ffffff" }}>By {lv.author}</div>
                </div>
                <div className="home-top-pts" style={{ position:"relative", fontSize:"1.2rem", fontWeight:800, color:"#ffffff", textShadow:"0 0 8px rgba(0,0,0,0.5)", flexShrink:0 }}>{Math.round(lv.value || 0)} pt</div>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:24 }}>
          <a href="/demonlist.html" className="bft-hero-btn bft-hero-btn-primary">{t("btn_full_list")}</a>
        </div>
      </section>

      {/* ───────── REGISTROS RECIENTES ───────── */}
      <section style={{ maxWidth: 1100, margin: "60px auto 0", padding: "0 20px" }}>
        <SectionTitle>{t("section_recent")}</SectionTitle>
        {loading && <p style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>{t("loading")}</p>}
        {!loading && records.length === 0 && (
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.6)" }}>{t("no_records")}</p>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
          {records.map((r) => (
            <a key={r.id} href={`/level.html?id=${r.levelId}`}
              style={{ textDecoration:"none", color:"inherit", background:"rgba(15,25,15,0.75)", border:"1px solid rgba(124,252,0,0.18)", borderRadius:14, padding:14, display:"flex", alignItems:"center", gap:12, transition:"border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(124,252,0,0.55)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow="0 0 18px rgba(124,252,0,0.25)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(124,252,0,0.18)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow=""; }}
            >
              {r.playerPhoto
                ? <img src={r.playerPhoto} alt={r.playerName} style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover", border:"1px solid rgba(124,252,0,0.4)" }} />
                : <div style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#1a4d1a,#7cfc00)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff" }}>{r.playerName.charAt(0).toUpperCase()}</div>
              }
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.playerName}</div>
                <div style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {Number(r.percent) >= 100
                    ? <>{t("rec_completed")} <span style={{ color:"#7cfc00" }}>{r.levelName}</span></>
                    : <>{t("rec_progress")} <span style={{ color:"#c7ff3b", fontWeight:700 }}>{r.percent}%</span> {t("rec_in")} <span style={{ color:"#7cfc00" }}>{r.levelName}</span></>
                  }
                </div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", marginTop:2 }}>{timeAgo(r.acceptedAt, t)} · {r.percent}%</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer style={{ marginTop:80, padding:"30px 20px", textAlign:"center", color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", background:"rgba(0,0,0,0.45)", backdropFilter:"blur(8px)" }}>
        © {new Date().getFullYear()} BufferTeam Demon List · {t("footer_copy")}
      </footer>
    </div>
  );
}

/* ─── Subcomponentes ─── */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background:"rgba(15,25,15,0.75)", border:"1px solid rgba(124,252,0,0.2)", borderRadius:14, padding:"20px 16px", textAlign:"center", backdropFilter:"blur(8px)" }}>
      <div style={{ fontSize:"2rem", fontWeight:900, color:"#c7ff3b", textShadow:"0 0 12px rgba(199,255,59,0.45)", lineHeight:1 }}>{value}</div>
      <div style={{ marginTop:8, fontSize:"0.78rem", color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:1.5, fontWeight:600 }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize:"1.6rem", fontWeight:800, textTransform:"uppercase", letterSpacing:1, marginBottom:22, color:"#fff", textAlign:"center", textShadow:"0 0 18px rgba(124,252,0,0.35)" }}>
      {children}
    </h2>
  );
}
