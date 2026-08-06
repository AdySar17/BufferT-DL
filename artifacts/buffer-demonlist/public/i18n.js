/**
 * BFT Demon List — Sistema de internacionalización (i18n)
 * ─────────────────────────────────────────────────────────
 * · Traducciones centralizadas para todas las páginas.
 * · 100% client-side, sin lecturas extra de Firestore.
 * · Idioma guardado en localStorage con clave "bft_lang".
 * · Incluir en cada HTML con: <script src="/i18n.js"></script>
 */
(function () {
  'use strict';

  /* ── Idiomas disponibles ─────────────────────────────── */
  const LANGS = {
    es: '🇪🇸 Español',
    en: '🇺🇸 English',
    ru: '🇷🇺 Русский',
    pt: '🇧🇷 Português',
    fr: '🇫🇷 Français',
    vi: '🇻🇳 Tiếng Việt',
  };
  const LANG_FLAGS = { es:'🇪🇸', en:'🇺🇸', ru:'🇷🇺', pt:'🇧🇷', fr:'🇫🇷', vi:'🇻🇳' };
  const DEFAULT_LANG = 'es';
  const STORAGE_KEY  = 'bft_lang';

  /* ── Diccionario de traducciones ─────────────────────── */
  const T = {
    /* ─ Navegación ─ */
    nav_home:          { es:'Home',              en:'Home',          ru:'Главная',                pt:'Início',        fr:'Accueil',        vi:'Trang chủ' },
    nav_demonlist:     { es:'Demon List',        en:'Demon List',    ru:'Список демонов',         pt:'Demon List',    fr:'Demon List',     vi:'Demon List' },
    nav_leaderboards:  { es:'Leaderboards',      en:'Leaderboards',  ru:'Таблица лидеров',        pt:'Rankings',      fr:'Classements',    vi:'Bảng xếp hạng' },
    nav_notifications: { es:'✉ Notificaciones',  en:'✉ Notifications', ru:'✉ Уведомления',       pt:'✉ Notificações',fr:'✉ Notifications',vi:'✉ Thông báo' },
    nav_submit:        { es:'Enviar Record',     en:'Submit Record', ru:'Отправить рекорд',       pt:'Enviar Record',  fr:'Soumettre un record', vi:'Gửi Record' },
    nav_guidelines:    { es:'Guidelines',        en:'Guidelines',    ru:'Правила',                pt:'Diretrizes',    fr:'Règles',         vi:'Hướng dẫn' },
    nav_panel:         { es:'Panel de Records',  en:'Records Panel', ru:'Панель записей',         pt:'Painel Records', fr:'Panneau Records', vi:'Bảng Records' },
    nav_staff_control: { es:'Control Staff',     en:'Staff Control', ru:'Управление Staff',       pt:'Controle Staff', fr:'Contrôle Staff', vi:'Quản lý Staff' },
    nav_admin_dev:     { es:'Admin Dev',         en:'Admin Dev',     ru:'Admin Dev',              pt:'Admin Dev',     fr:'Admin Dev',      vi:'Admin Dev' },

    /* ─ Hero ─ */
    hero_desc: {
      es: 'El ranking oficial de los demons más difíciles completados por la comunidad BufferTeam.',
      en: 'The official ranking of the hardest demons completed by the BufferTeam community.',
      ru: 'Официальный рейтинг самых сложных демонов, пройденных сообществом BufferTeam.',
      pt: 'O ranking oficial dos demons mais difíceis completados pela comunidade BufferTeam.',
      fr: 'Le classement officiel des demons les plus difficiles complétés par la communauté BufferTeam.',
      vi: 'Bảng xếp hạng chính thức các demon khó nhất được hoàn thành bởi cộng đồng BufferTeam.',
    },
    btn_view_list: { es:'Ver Demon List',  en:'View Demon List',    ru:'Смотреть список',      pt:'Ver Demon List',  fr:'Voir la liste',       vi:'Xem Demon List' },
    btn_submit:    { es:'Enviar Record',   en:'Submit Record',      ru:'Отправить рекорд',     pt:'Enviar Record',   fr:'Soumettre un record', vi:'Gửi Record' },

    /* ─ Changelog ─ */
    section_changelog: { es:'Últimos cambios en la lista', en:'Latest list changes',    ru:'Последние изменения',       pt:'Últimas mudanças',      fr:'Derniers changements',   vi:'Thay đổi mới nhất' },
    no_changes:        { es:'Aún no hay cambios registrados.', en:'No changes recorded yet.', ru:'Изменений пока нет.', pt:'Sem mudanças ainda.',   fr:'Aucun changement.',      vi:'Chưa có thay đổi.' },
    cl_added_at:       { es:'Añadido en',  en:'Added at',   ru:'Добавлен на',   pt:'Adicionado em',  fr:'Ajouté à',    vi:'Thêm vào' },
    cl_moved_from:     { es:'Movido de',   en:'Moved from', ru:'Перемещён с',   pt:'Movido de',      fr:'Déplacé de',  vi:'Di chuyển từ' },
    cl_new:            { es:'NUEVO',       en:'NEW',        ru:'НОВЫЙ',         pt:'NOVO',           fr:'NOUVEAU',     vi:'MỚI' },
    cl_moved:          { es:'MOVIDO',      en:'MOVED',      ru:'ПЕРЕМЕЩЁН',     pt:'MOVIDO',         fr:'DÉPLACÉ',     vi:'ĐÃ DI CHUYỂN' },

    /* ─ Staff ─ */
    section_staff: { es:'Nuestro Staff',  en:'Our Staff',       ru:'Наш стафф',       pt:'Nossa Staff',      fr:'Notre Staff',    vi:'Đội Staff' },
    role_owners:   { es:'Owners',         en:'Owners',          ru:'Владельцы',       pt:'Owners',           fr:'Owners',         vi:'Owners' },
    role_admins:   { es:'Administradores',en:'Administrators',  ru:'Администраторы',  pt:'Administradores',  fr:'Administrateurs',vi:'Quản trị viên' },
    role_mods:     { es:'Moderadores',    en:'Moderators',      ru:'Модераторы',      pt:'Moderadores',      fr:'Modérateurs',    vi:'Điều hành viên' },
    no_staff:      { es:'Sin miembros de staff registrados.', en:'No staff members registered.', ru:'Нет сотрудников.', pt:'Sem membros de staff.', fr:'Aucun membre du staff.', vi:'Không có thành viên staff.' },

    /* ─ Stats ─ */
    stat_records: { es:'Records registrados', en:'Registered records', ru:'Рекорды',        pt:'Records registrados', fr:'Records enregistrés', vi:'Records đã đăng ký' },
    stat_players: { es:'Jugadores',            en:'Players',            ru:'Игроки',         pt:'Jogadores',           fr:'Joueurs',             vi:'Người chơi' },
    stat_levels:  { es:'Niveles Registrados',  en:'Registered Levels',  ru:'Уровни',         pt:'Níveis Registrados',  fr:'Niveaux enregistrés', vi:'Màn chơi đã đăng ký' },
    stat_recent:  { es:'Registros recientes',  en:'Recent records',     ru:'Последние',      pt:'Records recentes',    fr:'Records récents',     vi:'Records gần đây' },

    /* ─ Top 10 ─ */
    section_top10: { es:'Top 10 Demons', en:'Top 10 Demons', ru:'Топ 10 демонов', pt:'Top 10 Demons', fr:'Top 10 Demons', vi:'Top 10 Demons' },
    no_levels:     { es:'Aún no hay niveles en la lista.', en:'No levels in the list yet.', ru:'Уровней пока нет.', pt:'Ainda não há níveis.', fr:'Aucun niveau.', vi:'Chưa có màn chơi.' },
    btn_full_list: { es:'Ver lista completa', en:'View full list', ru:'Полный список', pt:'Ver lista completa', fr:'Voir la liste complète', vi:'Xem toàn bộ danh sách' },

    /* ─ Records recientes ─ */
    section_recent: { es:'Registros recientes', en:'Recent records',   ru:'Последние рекорды', pt:'Records recentes',  fr:'Records récents', vi:'Records gần đây' },
    loading:        { es:'Cargando…',           en:'Loading…',         ru:'Загрузка…',         pt:'Carregando…',       fr:'Chargement…',     vi:'Đang tải…' },
    no_records:     { es:'Todavía no hay records aceptados.', en:'No accepted records yet.', ru:'Принятых рекордов нет.', pt:'Sem records aceitos.', fr:'Aucun record accepté.', vi:'Chưa có records.' },
    rec_completed:  { es:'completó',            en:'completed',        ru:'прошёл',            pt:'completou',         fr:'a complété',      vi:'đã hoàn thành' },
    rec_progress:   { es:'hizo un progreso del',en:'made progress of', ru:'достиг',            pt:'fez um progresso de',fr:'a progressé de',  vi:'đạt tiến độ' },
    rec_in:         { es:'en',                  en:'in',               ru:'в',                 pt:'em',                fr:'dans',            vi:'trong' },

    /* ─ Tiempo ─ */
    time_moment: { es:'hace un momento', en:'just now',    ru:'только что',    pt:'agora mesmo',   fr:'à l\'instant',  vi:'vừa xong' },
    time_min:    { es:'hace {n} min',    en:'{n} min ago', ru:'{n} мин назад', pt:'há {n} min',    fr:'il y a {n} min',vi:'{n} phút trước' },
    time_h:      { es:'hace {n} h',      en:'{n} h ago',   ru:'{n} ч назад',   pt:'há {n} h',      fr:'il y a {n} h',  vi:'{n} giờ trước' },
    time_d:      { es:'hace {n} d',      en:'{n} d ago',   ru:'{n} д назад',   pt:'há {n} d',      fr:'il y a {n} j',  vi:'{n} ngày trước' },

    /* ─ Footer ─ */
    footer_copy:   { es:'No afiliado con RobTop Games', en:'Not affiliated with RobTop Games', ru:'Не аффилирован с RobTop Games', pt:'Não afiliado à RobTop Games', fr:'Non affilié à RobTop Games', vi:'Không liên kết với RobTop Games' },

    /* ─ Idioma ─ */
    lang_label: { es:'Idioma', en:'Language', ru:'Язык', pt:'Idioma', fr:'Langue', vi:'Ngôn ngữ' },

    /* ─ Páginas / Secciones ─ */
    page_demonlist:   { es:'BFT Demon List',        en:'BFT Demon List',       ru:'Список демонов BFT', pt:'BFT Demon List',     fr:'BFT Demon List',       vi:'BFT Demon List' },
    page_submit:      { es:'Enviar Record',          en:'Submit Record',        ru:'Отправить рекорд',   pt:'Enviar Record',      fr:'Soumettre un record',  vi:'Gửi Record' },
    page_leaderboard: { es:'Leaderboards',           en:'Leaderboards',         ru:'Таблица лидеров',    pt:'Rankings',           fr:'Classements',          vi:'Bảng xếp hạng' },
    page_guidelines:  { es:'Guidelines',             en:'Guidelines',           ru:'Правила',            pt:'Diretrizes',         fr:'Règles',               vi:'Hướng dẫn' },
    page_notif:       { es:'Notificaciones',         en:'Notifications',        ru:'Уведомления',        pt:'Notificações',       fr:'Notifications',        vi:'Thông báo' },
    page_profile:     { es:'Perfil',                 en:'Profile',              ru:'Профиль',            pt:'Perfil',             fr:'Profil',               vi:'Hồ sơ' },

    /* ─ Demon List: interfaz ─ */
    dl_search:   { es:'🔍 Buscar nivel...',   en:'🔍 Search level...', ru:'🔍 Поиск уровня...', pt:'🔍 Buscar nível...', fr:'🔍 Rechercher...', vi:'🔍 Tìm kiếm...' },
    dl_pos:      { es:'Posición',            en:'Position',        ru:'Позиция',         pt:'Posição',         fr:'Position',      vi:'Vị trí' },
    dl_pts:      { es:'Puntos',              en:'Points',          ru:'Очки',            pt:'Pontos',          fr:'Points',        vi:'Điểm' },
    dl_by:       { es:'Por',                 en:'By',              ru:'От',              pt:'Por',             fr:'Par',           vi:'Bởi' },

    /* ─ Nivel: interfaz ─ */
    lv_records:    { es:'Records',              en:'Records',           ru:'Рекорды',        pt:'Records',          fr:'Records',         vi:'Records' },
    lv_history:    { es:'Historial de posiciones', en:'Position history', ru:'История позиций', pt:'Histórico de posições', fr:'Historique des positions', vi:'Lịch sử vị trí' },
    lv_custom_ids: { es:'IDs Custom',           en:'Custom IDs',        ru:'Пользовательские ID', pt:'IDs Customizadas', fr:'IDs personnalisées', vi:'ID tùy chỉnh' },
    lv_no_recs:    { es:'No hay records aún.',  en:'No records yet.',   ru:'Рекордов нет.',  pt:'Sem records ainda.',fr:'Aucun record.',    vi:'Chưa có records.' },
    lv_search_rec: { es:'Buscar jugador...',    en:'Search player...', ru:'Поиск игрока...', pt:'Buscar jogador...', fr:'Rechercher joueur...', vi:'Tìm người chơi...' },
    lv_player:     { es:'Jugador',              en:'Player',            ru:'Игрок',          pt:'Jogador',          fr:'Joueur',          vi:'Người chơi' },
    lv_percent:    { es:'%',                    en:'%',                 ru:'%',              pt:'%',                fr:'%',               vi:'%' },
    lv_video:      { es:'Video',                en:'Video',             ru:'Видео',          pt:'Vídeo',            fr:'Vidéo',           vi:'Video' },
    lv_no_custom:  { es:'Este nivel no tiene IDs Custom registradas.', en:'This level has no custom IDs.', ru:'Нет пользовательских ID.', pt:'Sem IDs customizadas.', fr:'Aucun ID personnalisé.', vi:'Không có ID tùy chỉnh.' },
    lv_pos_new:    { es:'NUEVO',                en:'NEW',               ru:'НОВЫЙ',          pt:'NOVO',             fr:'NOUVEAU',         vi:'MỚI' },

    /* ─ Submit: interfaz ─ */
    sub_title:      { es:'Enviar Record',           en:'Submit Record',         ru:'Отправить рекорд',     pt:'Enviar Record',       fr:'Soumettre un record',   vi:'Gửi Record' },
    sub_level:      { es:'Nivel completado',        en:'Completed level',       ru:'Пройденный уровень',   pt:'Nível completado',    fr:'Niveau complété',       vi:'Màn chơi đã hoàn thành' },
    sub_percent:    { es:'Porcentaje',              en:'Percentage',            ru:'Процент',              pt:'Porcentagem',         fr:'Pourcentage',           vi:'Phần trăm' },
    sub_video:      { es:'Enlace de video',         en:'Video link',            ru:'Ссылка на видео',      pt:'Link do vídeo',       fr:'Lien vidéo',            vi:'Link video' },
    sub_send:       { es:'Enviar',                  en:'Submit',                ru:'Отправить',            pt:'Enviar',              fr:'Soumettre',             vi:'Gửi' },

    /* ─ Leaderboards ─ */
    lb_rank:        { es:'Rango',     en:'Rank',    ru:'Ранг',    pt:'Posição',  fr:'Rang',      vi:'Hạng' },
    lb_player:      { es:'Jugador',   en:'Player',  ru:'Игрок',   pt:'Jogador',  fr:'Joueur',    vi:'Người chơi' },
    lb_points:      { es:'Puntos',    en:'Points',  ru:'Очки',    pt:'Pontos',   fr:'Points',    vi:'Điểm' },
    lb_records:     { es:'Records',   en:'Records', ru:'Рекорды', pt:'Records',  fr:'Records',   vi:'Records' },

    /* ─ Comunes ─ */
    cancel:    { es:'Cancelar',  en:'Cancel',  ru:'Отмена',     pt:'Cancelar', fr:'Annuler',    vi:'Hủy' },
    save:      { es:'Guardar',   en:'Save',    ru:'Сохранить',  pt:'Salvar',   fr:'Enregistrer',vi:'Lưu' },
    close:     { es:'Cerrar',    en:'Close',   ru:'Закрыть',    pt:'Fechar',   fr:'Fermer',     vi:'Đóng' },
    search:    { es:'Buscar',    en:'Search',  ru:'Поиск',      pt:'Buscar',   fr:'Rechercher', vi:'Tìm kiếm' },
    by:        { es:'By',        en:'By',      ru:'By',         pt:'By',       fr:'By',         vi:'By' },
    loading2:  { es:'Cargando', en:'Loading', ru:'Загрузка',   pt:'Carregando',fr:'Chargement', vi:'Đang tải' },
    no_data:   { es:'Sin datos', en:'No data', ru:'Нет данных', pt:'Sem dados', fr:'Aucune donnée', vi:'Không có dữ liệu' },

    /* ─ Leaderboards ─ */
    lb_subtitle:      { es:'Ranking de jugadores por puntos y demons completados.', en:'Player ranking by points and completed demons.', ru:'Рейтинг игроков по очкам и пройденным демонам.', pt:'Ranking de jogadores por pontos e demons completados.', fr:'Classement des joueurs par points et demons complétés.', vi:'Bảng xếp hạng người chơi theo điểm và demon đã hoàn thành.' },
    lb_category:      { es:'Categoría', en:'Category', ru:'Категория', pt:'Categoria', fr:'Catégorie', vi:'Danh mục' },
    lb_search_player: { es:'Buscar jugador por nombre...', en:'Search player by name...', ru:'Поиск игрока по имени...', pt:'Buscar jogador por nome...', fr:'Rechercher joueur par nom...', vi:'Tìm người chơi theo tên...' },
    lb_prev:          { es:'< Atrás', en:'< Back', ru:'< Назад', pt:'< Anterior', fr:'< Précédent', vi:'< Trước' },
    lb_next:          { es:'Siguiente >', en:'Next >', ru:'Вперёд >', pt:'Próximo >', fr:'Suivant >', vi:'Tiếp >' },

    /* ─ Notificaciones ─ */
    notif_title:         { es:'✉ Notificaciones', en:'✉ Notifications', ru:'✉ Уведомления', pt:'✉ Notificações', fr:'✉ Notifications', vi:'✉ Thông báo' },
    notif_subtitle:      { es:'Aquí aparecen tus records moderados por el staff.', en:'Your records moderated by staff appear here.', ru:'Здесь отображаются рекорды, проверенные персоналом.', pt:'Aqui aparecem seus records moderados pelo staff.', fr:'Vos records modérés par le staff apparaissent ici.', vi:'Các records được staff kiểm duyệt của bạn xuất hiện ở đây.' },
    notif_tab_all:       { es:'Todas', en:'All', ru:'Все', pt:'Todas', fr:'Toutes', vi:'Tất cả' },
    notif_tab_accepted:  { es:'Aceptadas', en:'Accepted', ru:'Принятые', pt:'Aceitas', fr:'Acceptées', vi:'Đã chấp nhận' },
    notif_tab_rejected:  { es:'Rechazadas', en:'Rejected', ru:'Отклонённые', pt:'Rejeitadas', fr:'Rejetées', vi:'Bị từ chối' },
    notif_loading:       { es:'Cargando notificaciones...', en:'Loading notifications...', ru:'Загрузка уведомлений...', pt:'Carregando notificações...', fr:'Chargement des notifications...', vi:'Đang tải thông báo...' },
    notif_empty:         { es:'No tienes notificaciones todavía. Cuando el staff revise un record tuyo aparecerá aquí.', en:'No notifications yet. Your notifications will appear here when staff reviews your records.', ru:'Уведомлений пока нет.', pt:'Sem notificações ainda.', fr:'Aucune notification pour l\'instant.', vi:'Chưa có thông báo.' },
    notif_error:         { es:'Error al cargar las notificaciones', en:'Error loading notifications', ru:'Ошибка загрузки уведомлений', pt:'Erro ao carregar notificações', fr:'Erreur chargement notifications', vi:'Lỗi tải thông báo' },
    notif_filter_empty:  { es:'No hay notificaciones en esta categoría.', en:'No notifications in this category.', ru:'Нет уведомлений в этой категории.', pt:'Sem notificações nesta categoria.', fr:'Aucune notification dans cette catégorie.', vi:'Không có thông báo trong danh mục này.' },
    notif_login_req:     { es:'Inicia sesión para ver tus notificaciones.', en:'Sign in to see your notifications.', ru:'Войдите, чтобы увидеть уведомления.', pt:'Faça login para ver suas notificações.', fr:'Connectez-vous pour voir vos notifications.', vi:'Đăng nhập để xem thông báo.' },
    notif_session:       { es:'Cargando sesión...', en:'Loading session...', ru:'Загрузка сессии...', pt:'Carregando sessão...', fr:'Chargement de la session...', vi:'Đang tải phiên...' },

    /* ─ Nivel (level page) ─ */
    lv_loading_level:    { es:'Cargando nivel...', en:'Loading level...', ru:'Загрузка уровня...', pt:'Carregando nível...', fr:'Chargement du niveau...', vi:'Đang tải màn chơi...' },
    lv_back:             { es:'← Volver a la lista', en:'← Back to list', ru:'← К списку', pt:'← Voltar à lista', fr:'← Retour à la liste', vi:'← Quay lại danh sách' },
    lv_tier:             { es:'Tier', en:'Tier', ru:'Тир', pt:'Tier', fr:'Tier', vi:'Tier' },
    lv_list_pts:         { es:'Puntos de Lista:', en:'List Points:', ru:'Очки списка:', pt:'Pontos de Lista:', fr:'Points de liste:', vi:'Điểm danh sách:' },
    lv_host_label:       { es:'Host:', en:'Host:', ru:'Хост:', pt:'Host:', fr:'Hôte:', vi:'Host:' },
    lv_difficulty_label: { es:'Dificultad:', en:'Difficulty:', ru:'Сложность:', pt:'Dificuldade:', fr:'Difficulté:', vi:'Độ khó:' },
    lv_id_label:         { es:'ID:', en:'ID:', ru:'ID:', pt:'ID:', fr:'ID:', vi:'ID:' },
    lv_creators_label:   { es:'Creadores', en:'Creators', ru:'Создатели', pt:'Criadores', fr:'Créateurs', vi:'Người tạo' },
    lv_min_pct:          { es:'Porcentaje mínimo:', en:'Minimum percentage:', ru:'Мин. процент:', pt:'Porcentagem mínima:', fr:'Pourcentage minimum:', vi:'Phần trăm tối thiểu:' },
    lv_pager_prev:       { es:'Atrás', en:'Back', ru:'Назад', pt:'Anterior', fr:'Précédent', vi:'Trước' },
    lv_pager_next:       { es:'Siguiente', en:'Next', ru:'Вперёд', pt:'Próximo', fr:'Suivant', vi:'Tiếp' },
    lv_first_victor_title: { es:'First Victor por País', en:'First Victor by Country', ru:'First Victor по стране', pt:'First Victor por País', fr:'First Victor par Pays', vi:'First Victor theo Quốc gia' },
    lv_first_victor_sub:   { es:'Primer jugador de cada país en completar este nivel', en:'First player of each country to complete this level', ru:'Первый игрок каждой страны, прошедший уровень', pt:'Primeiro jogador de cada país a completar este nível', fr:'Premier joueur de chaque pays à compléter ce niveau', vi:'Người chơi đầu tiên của mỗi quốc gia hoàn thành màn chơi' },
    lv_custom_ids_sub:   { es:'IDs alternativas asociadas a este nivel', en:'Alternative IDs associated with this level', ru:'Альтернативные ID этого уровня', pt:'IDs alternativas associadas a este nível', fr:'IDs alternatives associées à ce niveau', vi:'ID thay thế liên quan đến màn chơi này' },
    lv_history_sub:      { es:'Cambios registrados en este nivel', en:'Recorded changes for this level', ru:'Зафиксированные изменения уровня', pt:'Mudanças registradas neste nível', fr:'Changements enregistrés pour ce niveau', vi:'Các thay đổi được ghi lại cho màn chơi này' },
    lv_loading_records:  { es:'Cargando records...', en:'Loading records...', ru:'Загрузка рекордов...', pt:'Carregando records...', fr:'Chargement des records...', vi:'Đang tải records...' },
    lv_loading_hist:     { es:'Cargando historial...', en:'Loading history...', ru:'Загрузка истории...', pt:'Carregando histórico...', fr:'Chargement de l\'historique...', vi:'Đang tải lịch sử...' },

    /* ─ Submit page ─ */
    sub_subtitle:      { es:'Envía tu récord al equipo BufferTeam para verificación', en:'Submit your record to the BufferTeam for verification', ru:'Отправьте рекорд команде BufferTeam для проверки', pt:'Envie seu record à equipe BufferTeam para verificação', fr:'Soumettez votre record à l\'équipe BufferTeam', vi:'Gửi record cho nhóm BufferTeam để xác minh' },
    sub_login_banner:  { es:'⚠️ Inicia sesión con Google para enviar récords.', en:'⚠️ Sign in with Google to submit records.', ru:'⚠️ Войдите через Google, чтобы отправить рекорд.', pt:'⚠️ Faça login com Google para enviar records.', fr:'⚠️ Connectez-vous avec Google pour soumettre des records.', vi:'⚠️ Đăng nhập bằng Google để gửi records.' },
    sub_submitter_label: { es:'Submitter', en:'Submitter', ru:'Отправитель', pt:'Submitter', fr:'Soumetteur', vi:'Người gửi' },
    sub_change:        { es:'Cambiar', en:'Change', ru:'Изменить', pt:'Mudar', fr:'Changer', vi:'Thay đổi' },
    sub_data_title:    { es:'Datos del récord', en:'Record data', ru:'Данные рекорда', pt:'Dados do record', fr:'Données du record', vi:'Dữ liệu record' },
    sub_level_label:   { es:'Nivel', en:'Level', ru:'Уровень', pt:'Nível', fr:'Niveau', vi:'Màn chơi' },
    sub_percent_label: { es:'Porcentaje', en:'Percentage', ru:'Процент', pt:'Porcentagem', fr:'Pourcentage', vi:'Phần trăm' },
    sub_video_label:   { es:'Link del vídeo', en:'Video link', ru:'Ссылка на видео', pt:'Link do vídeo', fr:'Lien vidéo', vi:'Link video' },
    sub_mobile_label:  { es:'Completado en móvil', en:'Completed on mobile', ru:'Пройдено на мобильном', pt:'Completado no celular', fr:'Complété sur mobile', vi:'Hoàn thành trên di động' },
    sub_2p_label:      { es:'Es un nivel 2P (segundo jugador)', en:'Is a 2P level (second player)', ru:'Уровень 2P (второй игрок)', pt:'É um nível 2P (segundo jogador)', fr:'Est un niveau 2P (deuxième joueur)', vi:'Là màn 2 người (người chơi thứ 2)' },
    sub_player2_label: { es:'Segundo jugador', en:'Second player', ru:'Второй игрок', pt:'Segundo jogador', fr:'Deuxième joueur', vi:'Người chơi thứ 2' },
    sub_mode2p_label:  { es:'Modo 2P', en:'2P Mode', ru:'Режим 2P', pt:'Modo 2P', fr:'Mode 2P', vi:'Chế độ 2P' },
    sub_mobile2p_label:{ es:'El segundo jugador también juega en móvil', en:'The second player also plays on mobile', ru:'Второй игрок тоже играет на мобильном', pt:'O segundo jogador também joga no celular', fr:'Le deuxième joueur joue aussi sur mobile', vi:'Người chơi thứ 2 cũng dùng di động' },
    sub_video2_label:  { es:'Link del vídeo del 2.º jugador', en:'Second player video link', ru:'Ссылка на видео 2-го игрока', pt:'Link do vídeo do 2.º jogador', fr:'Lien vidéo du 2e joueur', vi:'Link video người chơi thứ 2' },
    sub_raw_label:     { es:'Raw footage', en:'Raw footage', ru:'Raw footage', pt:'Raw footage', fr:'Raw footage', vi:'Raw footage' },
    sub_notes_label:   { es:'Notas adicionales', en:'Additional notes', ru:'Доп. заметки', pt:'Notas adicionais', fr:'Notes supplémentaires', vi:'Ghi chú thêm' },

    /* ─ Profile page ─ */
    profile_loading:      { es:'Cargando perfil...', en:'Loading profile...', ru:'Загрузка профиля...', pt:'Carregando perfil...', fr:'Chargement du profil...', vi:'Đang tải hồ sơ...' },
    profile_pts:          { es:'Puntos', en:'Points', ru:'Очки', pt:'Pontos', fr:'Points', vi:'Điểm' },
    profile_records:      { es:'Records', en:'Records', ru:'Рекорды', pt:'Records', fr:'Records', vi:'Records' },
    profile_ranking:      { es:'Ranking', en:'Ranking', ru:'Рейтинг', pt:'Ranking', fr:'Classement', vi:'Xếp hạng' },
    profile_hardest:      { es:'Hardest', en:'Hardest', ru:'Сложнейший', pt:'Hardest', fr:'Hardest', vi:'Khó nhất' },
    profile_bio_label:    { es:'Biografía', en:'Biography', ru:'Биография', pt:'Biografia', fr:'Biographie', vi:'Tiểu sử' },
    profile_edit_btn:     { es:'Editar perfil', en:'Edit profile', ru:'Редактировать', pt:'Editar perfil', fr:'Modifier le profil', vi:'Chỉnh sửa hồ sơ' },
    profile_change_role:  { es:'Cambiar rol', en:'Change role', ru:'Изменить роль', pt:'Mudar papel', fr:'Changer le rôle', vi:'Thay đổi vai trò' },
    profile_ban:          { es:'Banear usuario', en:'Ban user', ru:'Заблокировать', pt:'Banir usuário', fr:'Bannir', vi:'Cấm người dùng' },
    profile_unban:        { es:'Quitar ban', en:'Remove ban', ru:'Разблокировать', pt:'Remover ban', fr:'Lever le ban', vi:'Bỏ cấm' },
    profile_delete:       { es:'⚠ Eliminar cuenta', en:'⚠ Delete account', ru:'⚠ Удалить аккаунт', pt:'⚠ Excluir conta', fr:'⚠ Supprimer le compte', vi:'⚠ Xóa tài khoản' },
    profile_name_label:   { es:'Nombre', en:'Name', ru:'Имя', pt:'Nome', fr:'Nom', vi:'Tên' },
    profile_photo_label:  { es:'URL de foto de perfil', en:'Profile photo URL', ru:'URL фото профиля', pt:'URL da foto de perfil', fr:'URL de la photo de profil', vi:'URL ảnh hồ sơ' },
    profile_country_label:{ es:'País', en:'Country', ru:'Страна', pt:'País', fr:'Pays', vi:'Quốc gia' },
    profile_youtube_label:{ es:'Canal de YouTube (opcional)', en:'YouTube channel (optional)', ru:'Канал YouTube (необязательно)', pt:'Canal do YouTube (opcional)', fr:'Chaîne YouTube (optionnel)', vi:'Kênh YouTube (tuỳ chọn)' },
    profile_bio_edit:     { es:'Biografía', en:'Biography', ru:'Биография', pt:'Biografia', fr:'Biographie', vi:'Tiểu sử' },
    profile_cosm_btn:     { es:'🎨 Cosméticos', en:'🎨 Cosmetics', ru:'🎨 Косметика', pt:'🎨 Cosméticos', fr:'🎨 Cosmétiques', vi:'🎨 Trang trí' },
  };

  /* ── Mapa href → clave de traducción (para nav automático) ─── */
  const NAV_HREF_MAP = {
    '/':                   'nav_home',
    '/demonlist.html':     'nav_demonlist',
    '/leaderboards.html':  'nav_leaderboards',
    '/notifications.html': 'nav_notifications',
    '/submit.html':        'nav_submit',
    '/guidelines.html':    'nav_guidelines',
    '/panel.html':         'nav_panel',
    '/staff-control.html': 'nav_staff_control',
    '/admin-dev.html':     'nav_admin_dev',
  };

  /* ── Runtime ─────────────────────────────────────────────── */
  var i18n = {
    LANGS: LANGS,
    T: T,
    current: (function() {
      var saved = localStorage.getItem(STORAGE_KEY);
      return (saved && LANGS[saved]) ? saved : DEFAULT_LANG;
    })(),

    /** Traduce una clave. Acepta vars: {n: 5} para reemplazar {n}. */
    t: function(key, vars) {
      var entry = T[key];
      if (!entry) return key;
      var str = entry[this.current] || entry[DEFAULT_LANG] || key;
      if (vars) {
        Object.keys(vars).forEach(function(k) {
          str = str.replace('{' + k + '}', vars[k]);
        });
      }
      return str;
    },

    /** Cambia el idioma, lo guarda en localStorage y recarga la UI. */
    setLang: function(code) {
      if (!LANGS[code]) return;
      this.current = code;
      localStorage.setItem(STORAGE_KEY, code);
      this.apply();
      // Actualiza botones del selector
      document.querySelectorAll('.bft-lang-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === code);
      });
      // Actualiza el flag del trigger
      document.querySelectorAll('.bft-lang-trigger').forEach(function(trigger) {
        var flagEl = trigger.querySelector('.bft-lang-flag');
        if (flagEl) flagEl.textContent = LANG_FLAGS[code] || '🌐';
      });
      // Avisa a React (home.tsx escucha este evento)
      window.dispatchEvent(new CustomEvent('bft-lang-change', { detail: { lang: code } }));
    },

    /** Aplica todas las traducciones a los elementos con data-i18n y a los nav links. */
    apply: function() {
      var self = this;

      // 1. data-i18n → textContent
      document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
          el.placeholder = self.t(key);
        } else {
          el.textContent = self.t(key);
        }
      });

      // 2. data-i18n-placeholder → placeholder
      document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.placeholder = self.t(el.getAttribute('data-i18n-placeholder'));
      });

      // 3. Nav links automáticos por href
      document.querySelectorAll('.nav-links a, nav a').forEach(function(a) {
        var href = a.getAttribute('href');
        var key  = NAV_HREF_MAP[href];
        if (key) a.textContent = self.t(key);
      });
    },

    /** Inyecta el CSS del selector de idiomas (auto llamado una vez). */
    _injectCSS: function() {
      if (document.getElementById('bft-i18n-css')) return;
      var style = document.createElement('style');
      style.id = 'bft-i18n-css';
      style.textContent = [
        '.bft-lang-selector{position:relative;display:inline-flex;align-items:center;}',
        '.bft-lang-trigger{',
        '  display:inline-flex;align-items:center;gap:5px;',
        '  padding:5px 9px;border-radius:8px;cursor:pointer;',
        '  background:rgba(255,255,255,0.08);',
        '  border:1px solid rgba(255,255,255,0.14);',
        '  color:#fff;font-size:0.9rem;font-family:Montserrat,sans-serif;',
        '  transition:background 0.15s,border-color 0.15s;white-space:nowrap;',
        '  user-select:none;',
        '}',
        '@media(hover:hover){.bft-lang-trigger:hover{background:rgba(255,255,255,0.15);border-color:rgba(124,252,0,0.3);}}',
        '.bft-lang-arrow{font-size:0.65rem;opacity:0.7;}',
        '.bft-lang-dropdown{',
        '  position:absolute;top:calc(100% + 6px);right:0;',
        '  background:rgba(8,18,8,0.97);',
        '  border:1px solid rgba(124,252,0,0.22);',
        '  border-radius:10px;padding:5px;min-width:160px;',
        '  z-index:99999;box-shadow:0 8px 28px rgba(0,0,0,0.55);',
        '  display:none;',
        '}',
        '.bft-lang-dropdown.open{display:block;}',
        '.bft-lang-btn{',
        '  display:block;width:100%;text-align:left;',
        '  background:none;border:none;',
        '  color:rgba(255,255,255,0.8);',
        '  padding:7px 10px;border-radius:7px;cursor:pointer;',
        '  font-size:0.87rem;font-family:Montserrat,sans-serif;',
        '  transition:background 0.12s,color 0.12s;',
        '}',
        '.bft-lang-btn:hover{background:rgba(124,252,0,0.12);color:#fff;}',
        '.bft-lang-btn.active{color:#c7ff3b;font-weight:700;}',
        /* Responsive logo title — controlled by JS ResizeObserver (.header-compact class) */
        '.logo-full{display:inline;}',
        '.logo-short{display:none;}',
        '.header-compact .logo-full{display:none;}',
        '.header-compact .logo-short{display:inline;}',
      ].join('');
      document.head.appendChild(style);
    },

    /** Renderiza el selector dentro del elemento #id dado. */
    renderSelector: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      if (container.querySelector('.bft-lang-selector')) return; // ya existe

      this._injectCSS();
      var self = this;

      var wrapper  = document.createElement('div');
      wrapper.className = 'bft-lang-selector';

      var trigger  = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'bft-lang-trigger';
      trigger.innerHTML =
        '<span class="bft-lang-flag">' + (LANG_FLAGS[this.current] || '🌐') + '</span>' +
        '<span class="bft-lang-arrow">▾</span>';
      trigger.title = this.t('lang_label');

      var dropdown = document.createElement('div');
      dropdown.className = 'bft-lang-dropdown';

      Object.keys(LANGS).forEach(function(code) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bft-lang-btn' + (code === self.current ? ' active' : '');
        btn.setAttribute('data-lang', code);
        btn.textContent = LANGS[code];
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          self.setLang(code);
          dropdown.classList.remove('open');
        });
        dropdown.appendChild(btn);
      });

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Cerrar al hacer clic fuera
      document.addEventListener('click', function() {
        dropdown.classList.remove('open');
      });

      wrapper.appendChild(trigger);
      wrapper.appendChild(dropdown);
      container.appendChild(wrapper);
    },

    /** Watches the header for overflow and toggles .header-compact to abbreviate the title. */
    _watchHeader: function() {
      var header = document.querySelector('.top-header');
      if (!header) return;
      var check = function() {
        var leftEl  = header.querySelector('.left');
        var rightEl = leftEl && leftEl.nextElementSibling;
        if (!leftEl || !rightEl) return;
        /* Compare combined scrollWidth of both sides vs available width */
        var available = header.clientWidth - 30;
        var used      = leftEl.scrollWidth + rightEl.scrollWidth + 14;
        header.classList.toggle('header-compact', used > available * 0.95);
      };
      check();
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(check);
        ro.observe(header);
      }
      window.addEventListener('resize', check);
    },
  };

  window.BFT_I18N = i18n;

  /* ── Auto-apply cuando el DOM esté listo ──────────────── */
  function _onReady() {
    i18n._injectCSS();
    i18n.apply();
    i18n._watchHeader();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _onReady);
  } else {
    _onReady();
  }
})();
