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
    nav_pemonlist:     { es:'PemonList',         en:'PemonList',     ru:'PemonList',              pt:'PemonList',     fr:'PemonList',      vi:'PemonList' },
    nav_submit_pemon:  { es:'Enviar Record Pemon', en:'Submit Pemon Record', ru:'Отправить рекорд Pemon', pt:'Enviar Record Pemon', fr:'Soumettre un record Pemon', vi:'Gửi Record Pemon' },
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
    page_pemonlist:   { es:'BFT PemonList',         en:'BFT PemonList',        ru:'PemonList BFT',     pt:'BFT PemonList',      fr:'BFT PemonList',       vi:'BFT PemonList' },
    pemon_subtitle:   { es:'La lista independiente de los niveles Platformer más difíciles.', en:'The independent list of the hardest Platformer levels.', ru:'Независимый список самых сложных Platformer-уровней.', pt:'A lista independente dos níveis Platformer mais difíceis.', fr:'La liste indépendante des niveaux Platformer les plus difficiles.', vi:'Danh sách độc lập các màn Platformer khó nhất.' },
    pemon_submit:     { es:'Enviar record Pemon', en:'Submit Pemon record', ru:'Отправить рекорд Pemon', pt:'Enviar record Pemon', fr:'Soumettre un record Pemon', vi:'Gửi record Pemon' },
    pemon_search:     { es:'Buscar nivel o creador…', en:'Search level or creator…', ru:'Поиск уровня или создателя…', pt:'Buscar nível ou criador…', fr:'Rechercher un niveau ou créateur…', vi:'Tìm màn chơi hoặc người tạo…' },
    pemon_add:        { es:'Añadir nivel', en:'Add level', ru:'Добавить уровень', pt:'Adicionar nível', fr:'Ajouter un niveau', vi:'Thêm màn chơi' },
    pemon_edit:       { es:'Editar nivel', en:'Edit level', ru:'Изменить уровень', pt:'Editar nível', fr:'Modifier le niveau', vi:'Chỉnh sửa màn chơi' },
    pemon_lunas:      { es:'Lunas', en:'Lunas', ru:'Луны', pt:'Lunas', fr:'Lunas', vi:'Lunas' },
    pemon_back:       { es:'← Volver a PemonList', en:'← Back to PemonList', ru:'← Вернуться к PemonList', pt:'← Voltar à PemonList', fr:'← Retour à PemonList', vi:'← Quay lại PemonList' },
    pemon_empty:      { es:'Aún no hay niveles Platformer en PemonList.', en:'There are no Platformer levels in PemonList yet.', ru:'В PemonList пока нет Platformer-уровней.', pt:'Ainda não há níveis Platformer na PemonList.', fr:'Aucun niveau Platformer dans PemonList pour le moment.', vi:'Chưa có màn Platformer nào trong PemonList.' },
    pemon_error:      { es:'Error al cargar PemonList:', en:'Error loading PemonList:', ru:'Ошибка загрузки PemonList:', pt:'Erro ao carregar a PemonList:', fr:'Erreur lors du chargement de PemonList :', vi:'Lỗi tải PemonList:' },
    pemon_required:   { es:'Nombre, autor y posición son obligatorios.', en:'Name, author, and position are required.', ru:'Имя, автор и позиция обязательны.', pt:'Nome, autor e posição são obrigatórios.', fr:'Le nom, l’auteur et la position sont obligatoires.', vi:'Tên, tác giả và vị trí là bắt buộc.' },
    pemon_delete_confirm: { es:'¿Eliminar este nivel de PemonList?', en:'Delete this level from PemonList?', ru:'Удалить этот уровень из PemonList?', pt:'Excluir este nível da PemonList?', fr:'Supprimer ce niveau de PemonList ?', vi:'Xóa màn chơi này khỏi PemonList?' },
    pemon_missing:    { es:'No se especificó ningún nivel.', en:'No level was specified.', ru:'Уровень не указан.', pt:'Nenhum nível foi especificado.', fr:'Aucun niveau spécifié.', vi:'Chưa chỉ định màn chơi.' },
    pemon_not_found:  { es:'Este nivel no pertenece a PemonList.', en:'This level does not belong to PemonList.', ru:'Этот уровень не принадлежит PemonList.', pt:'Este nível não pertence à PemonList.', fr:'Ce niveau ne fait pas partie de PemonList.', vi:'Màn chơi này không thuộc PemonList.' },
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
    lv_position:         { es:'Posición', en:'Position', ru:'Позиция', pt:'Posição', fr:'Position', vi:'Vị trí' },
    lv_difficulty:       { es:'Dificultad', en:'Difficulty', ru:'Сложность', pt:'Dificuldade', fr:'Difficulté', vi:'Độ khó' },
    lv_loading_hist:     { es:'Cargando historial...', en:'Loading history...', ru:'Загрузка истории...', pt:'Carregando histórico...', fr:'Chargement de l\'historique...', vi:'Đang tải lịch sử...' },

    /* ─ Submit page ─ */
    sub_subtitle:      { es:'Envía tu récord al equipo BufferTeam para verificación', en:'Submit your record to the BufferTeam for verification', ru:'Отправьте рекорд команде BufferTeam для проверки', pt:'Envie seu record à equipe BufferTeam para verificação', fr:'Soumettez votre record à l\'équipe BufferTeam', vi:'Gửi record cho nhóm BufferTeam để xác minh' },
    sub_login_banner:  { es:'⚠️ Inicia sesión con Google para enviar récords.', en:'⚠️ Sign in with Google to submit records.', ru:'⚠️ Войдите через Google, чтобы отправить рекорд.', pt:'⚠️ Faça login com Google para enviar records.', fr:'⚠️ Connectez-vous avec Google pour soumettre des records.', vi:'⚠️ Đăng nhập bằng Google để gửi records.' },
    sub_submitter_label: { es:'Submitter', en:'Submitter', ru:'Отправитель', pt:'Submitter', fr:'Soumetteur', vi:'Người gửi' },
    sub_new_type_label: { es:'Tipo', en:'Type', ru:'Тип', pt:'Tipo', fr:'Type', vi:'Loại' },
    sub_new_type_hint: { es:'Elige cómo se clasificará cuando el staff lo acepte.', en:'Choose how it will be classified when staff accepts it.', ru:'Выберите классификацию после одобрения staff.', pt:'Escolha como será classificado quando o staff aceitar.', fr:'Choisissez sa classification après acceptation par le staff.', vi:'Chọn cách phân loại khi staff chấp thuận.' },
    sub_new_type_classic: { es:'Clásico', en:'Classic', ru:'Классический', pt:'Clássico', fr:'Classique', vi:'Cổ điển' },
    sub_new_type_platformer: { es:'Plataforma', en:'Platformer', ru:'Platformer', pt:'Plataforma', fr:'Platformer', vi:'Platformer' },
    sub_new_type_2p: { es:'2 Players', en:'2 Players', ru:'2 Players', pt:'2 Players', fr:'2 Players', vi:'2 Players' },
    sub_new_type_solo: { es:'2 Players (Solo)', en:'2 Players (Solo)', ru:'2 Players (Solo)', pt:'2 Players (Solo)', fr:'2 Players (Solo)', vi:'2 Players (Solo)' },
    sub_new_type_classic_desc: { es:'Va a Demon List.', en:'Goes to Demon List.', ru:'Попадает в Demon List.', pt:'Vai para a Demon List.', fr:'Va dans la Demon List.', vi:'Vào Demon List.' },
    sub_new_type_platformer_desc: { es:'Va a PemonList y usa Lunas.', en:'Goes to PemonList and uses Lunas.', ru:'Попадает в PemonList и использует Lunas.', pt:'Vai para a PemonList e usa Lunas.', fr:'Va dans PemonList et utilise les Lunas.', vi:'Vào PemonList và dùng Lunas.' },
    sub_new_type_2p_desc: { es:'Va a Demon List con el sufijo (2P).', en:'Goes to Demon List with the (2P) suffix.', ru:'Попадает в Demon List с суффиксом (2P).', pt:'Vai para a Demon List com o sufixo (2P).', fr:'Va dans la Demon List avec le suffixe (2P).', vi:'Vào Demon List với hậu tố (2P).' },
    sub_new_type_solo_desc: { es:'Va a Demon List con el sufijo (Solo).', en:'Goes to Demon List with the (Solo) suffix.', ru:'Попадает в Demon List с суффиксом (Solo).', pt:'Vai para a Demon List com o sufixo (Solo).', fr:'Va dans la Demon List avec le suffixe (Solo).', vi:'Vào Demon List với hậu tố (Solo).' },
    sub_time_label: { es:'Tiempo', en:'Time', ru:'Время', pt:'Tempo', fr:'Temps', vi:'Thời gian' },
    sub_time_hours: { es:'Horas', en:'Hours', ru:'Часы', pt:'Horas', fr:'Heures', vi:'Giờ' },
    sub_time_minutes: { es:'Min', en:'Min', ru:'Мин', pt:'Min', fr:'Min', vi:'Phút' },
    sub_time_seconds: { es:'Seg', en:'Sec', ru:'Сек', pt:'Seg', fr:'Sec', vi:'Giây' },
    sub_time_milliseconds: { es:'Ms', en:'Ms', ru:'Мс', pt:'Ms', fr:'Ms', vi:'Ms' },
    sub_time_hint: { es:'Registra el tiempo total de la completación.', en:'Enter the total completion time.', ru:'Введите общее время прохождения.', pt:'Registre o tempo total da conclusão.', fr:'Saisissez le temps total de la complétion.', vi:'Nhập tổng thời gian hoàn thành.' },
    sub_time_parts: { es:'horas, minutos, segundos y milisegundos', en:'hours, minutes, seconds and milliseconds', ru:'часы, минуты, секунды и миллисекунды', pt:'horas, minutos, segundos e milissegundos', fr:'heures, minutes, secondes et millisecondes', vi:'giờ, phút, giây và mili giây' },
    sub_list_classic: { es:'Clásico', en:'Classic', ru:'Классический', pt:'Clássico', fr:'Classique', vi:'Cổ điển' },
    sub_list_lunas: { es:'Lunas', en:'Lunas', ru:'Lunas', pt:'Lunas', fr:'Lunas', vi:'Lunas' },
    sub_new_level_option: { es:'Nuevo Nivel', en:'New Level', ru:'Новый уровень', pt:'Novo nível', fr:'Nouveau niveau', vi:'Màn chơi mới' },
    sub_new_level_option_hint: { es:'Pide al staff que añada un nivel nuevo y registra tu récord.', en:'Ask staff to add a new level and submit your record.', ru:'Попросите staff добавить новый уровень и отправьте рекорд.', pt:'Peça ao staff para adicionar um novo nível e envie seu record.', fr:'Demandez au staff d’ajouter un niveau et envoyez votre record.', vi:'Yêu cầu staff thêm màn chơi mới rồi gửi record.' },
    sub_agree_prefix: { es:'Acepto y he leído las', en:'I accept and have read the', ru:'Я принимаю и прочитал', pt:'Aceito e li as', fr:'J’accepte et j’ai lu les', vi:'Tôi đồng ý và đã đọc' },
    sub_guidelines_link: { es:'guidelines', en:'guidelines', ru:'правила', pt:'diretrizes', fr:'règles', vi:'hướng dẫn' },
    sub_agree_demon: { es:'de la BFT Demon List', en:'of the BFT Demon List', ru:'BFT Demon List', pt:'da BFT Demon List', fr:'de la BFT Demon List', vi:'của BFT Demon List' },
    sub_agree_pemon: { es:'de PemonList', en:'of PemonList', ru:'PemonList', pt:'da PemonList', fr:'de PemonList', vi:'của PemonList' },
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

    /* ─ Auth UI ─ */
    auth_loading:    { es:'Cargando sesión...', en:'Loading session...', ru:'Загрузка сессии...', pt:'Carregando sessão...', fr:'Chargement de la session...', vi:'Đang tải phiên...' },
    auth_signin:     { es:'Iniciar sesión', en:'Sign in', ru:'Войти', pt:'Entrar', fr:'Se connecter', vi:'Đăng nhập' },
    auth_my_profile: { es:'Mi Perfil', en:'My Profile', ru:'Мой профиль', pt:'Meu Perfil', fr:'Mon Profil', vi:'Hồ sơ của tôi' },
    auth_logout:     { es:'Cerrar sesión', en:'Sign out', ru:'Выйти', pt:'Sair', fr:'Se déconnecter', vi:'Đăng xuất' },

    /* ─ Guidelines ─ */
    gl_hero_badge:   { es:'BFT Demon List · Guidelines · v1', en:'BFT Demon List · Guidelines · v1', ru:'BFT Demon List · Guidelines · v1', pt:'BFT Demon List · Guidelines · v1', fr:'BFT Demon List · Guidelines · v1', vi:'BFT Demon List · Guidelines · v1' },
    gl_hero_title:   { es:'Guías de envío de récords', en:'Record Submission Guidelines', ru:'Правила отправки рекордов', pt:'Diretrizes de Envio de Records', fr:'Directives de soumission de records', vi:'Hướng dẫn gửi Records' },
    gl_hero_desc:    { es:'Reglas creadas para mantener una lista justa, organizada y legítima para toda la comunidad. Nuestro objetivo es permitir la participación de jugadores de todos los niveles, desde principiantes hasta avanzados, sin perder la seriedad del sistema de verificación.', en:'Rules created to maintain a fair, organized, and legitimate list for the entire community. Our goal is to allow players of all skill levels to participate — from beginners to advanced — without compromising the seriousness of the verification system.', ru:'Правила для поддержания справедливого, организованного и легитимного списка для всего сообщества. Наша цель — обеспечить участие игроков всех уровней — от новичков до опытных — не теряя серьёзности системы проверки.', pt:'Regras criadas para manter uma lista justa, organizada e legítima para toda a comunidade. Nosso objetivo é permitir a participação de jogadores de todos os níveis, de iniciantes a avançados, sem perder a seriedade do sistema de verificação.', fr:'Règles créées pour maintenir une liste juste, organisée et légitime pour toute la communauté. Notre objectif est de permettre la participation des joueurs de tous niveaux, sans compromettre la rigueur du système de vérification.', vi:'Các quy tắc được tạo ra để duy trì danh sách công bằng, có tổ chức và hợp pháp cho toàn bộ cộng đồng. Mục tiêu của chúng tôi là cho phép người chơi ở mọi cấp độ tham gia mà không làm giảm tính nghiêm túc của hệ thống xác minh.' },
    gl_toc_title:    { es:'Índice', en:'Table of Contents', ru:'Содержание', pt:'Índice', fr:'Sommaire', vi:'Mục lục' },
    gl_toc_1:        { es:'Regla general', en:'General rule', ru:'Общее правило', pt:'Regra geral', fr:'Règle générale', vi:'Quy tắc chung' },
    gl_toc_2:        { es:'Video obligatorio', en:'Mandatory video', ru:'Обязательное видео', pt:'Vídeo obrigatório', fr:'Vidéo obligatoire', vi:'Video bắt buộc' },
    gl_toc_3:        { es:'Verificación por dificultad', en:'Verification by difficulty', ru:'Проверка по сложности', pt:'Verificação por dificuldade', fr:'Vérification par difficulté', vi:'Xác minh theo độ khó' },
    gl_toc_4:        { es:'Raw footage', en:'Raw footage', ru:'Raw footage', pt:'Raw footage', fr:'Raw footage', vi:'Raw footage' },
    gl_toc_5:        { es:'Records 2 Player', en:'2 Player Records', ru:'Рекорды 2 Player', pt:'Records 2 Player', fr:'Records 2 joueurs', vi:'Records 2 người chơi' },
    gl_toc_6:        { es:'Segunda revisión', en:'Second review', ru:'Повторная проверка', pt:'Segunda revisão', fr:'Deuxième révision', vi:'Xem xét lần 2' },
    gl_toc_7:        { es:'Autoridad del staff', en:'Staff authority', ru:'Полномочия персонала', pt:'Autoridade do staff', fr:'Autorité du staff', vi:'Quyền hạn của staff' },
    gl_toc_8:        { es:'Objetivo final', en:'Final goal', ru:'Финальная цель', pt:'Objetivo final', fr:'Objectif final', vi:'Mục tiêu cuối cùng' },
    gl_s1_h:         { es:'Regla general', en:'General rule', ru:'Общее правило', pt:'Regra geral', fr:'Règle générale', vi:'Quy tắc chung' },
    gl_s1_lead:      { es:'Todos los récords deben ser obtenidos de forma <strong>legítima</strong>. Los récords serán revisados por el staff: cumplir los requisitos mínimos no garantiza aceptación automática si existen dudas razonables sobre la legitimidad.', en:'All records must be obtained <strong>legitimately</strong>. Records will be reviewed by staff: meeting the minimum requirements does not guarantee automatic acceptance if there are reasonable doubts about legitimacy.', ru:'Все рекорды должны быть получены <strong>законным путём</strong>. Рекорды будут проверены персоналом: соответствие минимальным требованиям не гарантирует автоматического принятия, если есть обоснованные сомнения в легитимности.', pt:'Todos os records devem ser obtidos de forma <strong>legítima</strong>. Os records serão revisados pelo staff: cumprir os requisitos mínimos não garante aceitação automática se houver dúvidas razoáveis sobre a legitimidade.', fr:'Tous les records doivent être obtenus de manière <strong>légitime</strong>. Les records seront examinés par le staff : respecter les exigences minimales ne garantit pas une acceptation automatique s\'il existe des doutes raisonnables.', vi:'Tất cả records phải được đạt được một cách <strong>hợp pháp</strong>. Records sẽ được staff xem xét: đáp ứng các yêu cầu tối thiểu không đảm bảo chấp nhận tự động nếu có nghi ngờ hợp lý.' },
    gl_s1_nopermit:  { es:'No se permite bajo ninguna circunstancia:', en:'Not permitted under any circumstance:', ru:'Ни при каких обстоятельствах не разрешается:', pt:'Não é permitido em nenhuma circunstância:', fr:'Non autorisé en aucune circonstance :', vi:'Không được phép trong bất kỳ hoàn cảnh nào:' },
    gl_s1_no1:       { es:'Hacks', en:'Hacks', ru:'Хаки', pt:'Hacks', fr:'Hacks', vi:'Hacks' },
    gl_s1_no2:       { es:'Bots', en:'Bots', ru:'Боты', pt:'Bots', fr:'Bots', vi:'Bots' },
    gl_s1_no3:       { es:'Macros', en:'Macros', ru:'Макросы', pt:'Macros', fr:'Macros', vi:'Macros' },
    gl_s1_no4:       { es:'Speedhack', en:'Speedhack', ru:'Speedhack', pt:'Speedhack', fr:'Speedhack', vi:'Speedhack' },
    gl_s1_no5:       { es:'Physics Bypass', en:'Physics Bypass', ru:'Physics Bypass', pt:'Physics Bypass', fr:'Physics Bypass', vi:'Physics Bypass' },
    gl_s1_no6:       { es:'Ediciones engañosas de video', en:'Deceptive video edits', ru:'Обманные правки видео', pt:'Edições enganosas de vídeo', fr:'Montages vidéo trompeurs', vi:'Chỉnh sửa video gian lận' },
    gl_s1_no7:       { es:'Audio manipulado o falso', en:'Manipulated or fake audio', ru:'Изменённый или фальшивый звук', pt:'Áudio manipulado ou falso', fr:'Audio manipulé ou faux', vi:'Âm thanh bị chỉnh sửa hoặc giả mạo' },
    gl_s1_no8:       { es:'Uso de vacíos en las reglas para obtener ventaja', en:'Exploiting rule loopholes for advantage', ru:'Использование лазеек в правилах для получения преимущества', pt:'Uso de brechas nas regras para obter vantagem', fr:'Exploitation de failles dans les règles pour obtenir un avantage', vi:'Lợi dụng kẽ hở trong quy tắc để có lợi thế' },
    gl_s1_c1:        { es:'Si un jugador intenta aprovechar una falla o vacío no mencionado directamente en estas reglas, el staff podrá tratarlo como una infracción si produce <b>la misma ventaja que una trampa normal</b>.', en:'If a player attempts to exploit a flaw or loophole not directly mentioned in these rules, staff may treat it as a violation if it produces <b>the same advantage as a regular cheat</b>.', ru:'Если игрок пытается использовать ошибку или лазейку, прямо не упомянутую в правилах, персонал может расценить это как нарушение, если это даёт <b>то же преимущество, что и обычный чит</b>.', pt:'Se um jogador tentar explorar uma falha ou brecha não mencionada diretamente nestas regras, o staff poderá tratá-la como infração se ela produzir <b>a mesma vantagem que uma trapaça normal</b>.', fr:'Si un joueur tente d\'exploiter une faille ou une lacune non directement mentionnée dans ces règles, le staff pourra la traiter comme une infraction si elle procure <b>le même avantage qu\'une triche normale</b>.', vi:'Nếu người chơi cố tình khai thác lỗ hổng không được đề cập trực tiếp trong quy tắc, staff có thể coi đó là vi phạm nếu nó tạo ra <b>lợi thế tương tự như gian lận thông thường</b>.' },
    gl_s1_c2:        { es:'Cualquier intento de engaño puede resultar en <b>rechazo del récord</b>, <b>eliminación de récords previos</b> o <b>sanciones</b> en la lista.', en:'Any attempt at deception may result in <b>record rejection</b>, <b>removal of previous records</b>, or <b>sanctions</b> on the list.', ru:'Любая попытка обмана может привести к <b>отклонению рекорда</b>, <b>удалению предыдущих рекордов</b> или <b>санкциям</b> в списке.', pt:'Qualquer tentativa de engano pode resultar em <b>rejeição do record</b>, <b>remoção de records anteriores</b> ou <b>sanções</b> na lista.', fr:'Toute tentative de tromperie peut entraîner le <b>rejet du record</b>, la <b>suppression des records précédents</b> ou des <b>sanctions</b>.', vi:'Bất kỳ hành vi gian lận nào có thể dẫn đến <b>từ chối record</b>, <b>xóa các record trước đó</b> hoặc <b>hình phạt</b> trong danh sách.' },
    gl_s2_h:         { es:'Video obligatorio', en:'Mandatory video', ru:'Обязательное видео', pt:'Vídeo obrigatório', fr:'Vidéo obligatoire', vi:'Video bắt buộc' },
    gl_s2_lead:      { es:'Todo récord enviado debe contar con evidencia en video. La calidad no necesita ser perfecta, pero sí lo suficientemente clara para revisar el récord correctamente.', en:'Every submitted record must include video evidence. Quality does not need to be perfect, but it must be clear enough to properly review the record.', ru:'Каждый отправленный рекорд должен содержать видеодоказательство. Качество не обязательно должно быть идеальным, но достаточно чётким для надлежащей проверки.', pt:'Todo record enviado deve conter evidência em vídeo. A qualidade não precisa ser perfeita, mas deve ser suficientemente clara para revisar o record corretamente.', fr:'Tout record soumis doit inclure une preuve vidéo. La qualité n\'a pas besoin d\'être parfaite, mais doit être suffisamment claire pour examiner correctement le record.', vi:'Mọi record được gửi phải có bằng chứng video. Chất lượng không cần phải hoàn hảo, nhưng phải đủ rõ ràng để xem xét đúng cách.' },
    gl_s2_must:      { es:'El video debe mostrar claramente:', en:'The video must clearly show:', ru:'Видео должно чётко показывать:', pt:'O vídeo deve mostrar claramente:', fr:'La vidéo doit clairement montrer :', vi:'Video phải thể hiện rõ ràng:' },
    gl_s2_i1:        { es:'El <strong>gameplay completo</strong> del intento ganador', en:'The <strong>full gameplay</strong> of the winning attempt', ru:'<strong>Полный геймплей</strong> победной попытки', pt:'O <strong>gameplay completo</strong> da tentativa vencedora', fr:'Le <strong>gameplay complet</strong> de la tentative gagnante', vi:'<strong>Gameplay đầy đủ</strong> của lần thử thắng' },
    gl_s2_i2:        { es:'La <strong>completion</strong> del nivel', en:'The <strong>completion</strong> of the level', ru:'<strong>Прохождение</strong> уровня', pt:'A <strong>completion</strong> do nível', fr:'La <strong>completion</strong> du niveau', vi:'Việc <strong>hoàn thành</strong> màn chơi' },
    gl_s2_i3:        { es:'La <strong>pantalla final</strong> (endscreen)', en:'The <strong>endscreen</strong>', ru:'<strong>Финальный экран</strong> (endscreen)', pt:'A <strong>tela final</strong> (endscreen)', fr:'L\'<strong>écran final</strong> (endscreen)', vi:'<strong>Màn hình kết thúc</strong> (endscreen)' },
    gl_s2_c:         { es:'Una vez aceptado, el video debe permanecer disponible públicamente. Si el video es eliminado posteriormente, el récord podrá ser <b>removido de la lista</b>.', en:'Once accepted, the video must remain publicly available. If the video is later deleted, the record may be <b>removed from the list</b>.', ru:'После принятия видео должно оставаться общедоступным. Если видео будет впоследствии удалено, рекорд может быть <b>удалён из списка</b>.', pt:'Uma vez aceito, o vídeo deve permanecer disponível publicamente. Se o vídeo for excluído posteriormente, o record poderá ser <b>removido da lista</b>.', fr:'Une fois acceptée, la vidéo doit rester disponible publiquement. Si la vidéo est supprimée par la suite, le record pourra être <b>retiré de la liste</b>.', vi:'Sau khi được chấp nhận, video phải luôn công khai. Nếu video bị xóa sau đó, record có thể bị <b>xóa khỏi danh sách</b>.' },
    gl_s3_h:         { es:'Sistema de verificación por dificultad', en:'Verification system by difficulty', ru:'Система проверки по сложности', pt:'Sistema de verificação por dificuldade', fr:'Système de vérification par difficulté', vi:'Hệ thống xác minh theo độ khó' },
    gl_s3_lead:      { es:'No todos los niveles requieren el mismo grado de exigencia. Por ello, los requisitos cambian según la dificultad del nivel.', en:'Not all levels require the same degree of scrutiny. Requirements change depending on the difficulty of the level.', ru:'Не все уровни требуют одинаковой строгости. Требования меняются в зависимости от сложности уровня.', pt:'Nem todos os níveis requerem o mesmo grau de exigência. Os requisitos mudam de acordo com a dificuldade do nível.', fr:'Tous les niveaux ne nécessitent pas le même niveau d\'exigence. Les conditions varient selon la difficulté.', vi:'Không phải tất cả các màn đều cần mức độ kiểm tra như nhau. Yêu cầu thay đổi tùy theo độ khó của màn chơi.' },
    gl_s3_easy_title:{ es:'Easy Demon · Medium Demon', en:'Easy Demon · Medium Demon', ru:'Easy Demon · Medium Demon', pt:'Easy Demon · Medium Demon', fr:'Easy Demon · Medium Demon', vi:'Easy Demon · Medium Demon' },
    gl_s3_easy_sub:  { es:'Puerta de entrada para nuevos jugadores.', en:'Entry point for new players.', ru:'Начальный уровень для новых игроков.', pt:'Porta de entrada para novos jogadores.', fr:'Porte d\'entrée pour les nouveaux joueurs.', vi:'Điểm vào cho người chơi mới.' },
    gl_s3_easy_i1:   { es:'Video claro', en:'Clear video', ru:'Чёткое видео', pt:'Vídeo claro', fr:'Vidéo claire', vi:'Video rõ ràng' },
    gl_s3_easy_i2:   { es:'Completion visible', en:'Visible completion', ru:'Видимое прохождение', pt:'Completion visível', fr:'Completion visible', vi:'Hoàn thành rõ ràng' },
    gl_s3_easy_note: { es:'<strong>No es obligatorio:</strong> clicks audibles, labels, cheat indicators ni raw footage. Mientras el video muestre claramente que el nivel fue completado de forma legítima, normalmente será suficiente.', en:'<strong>Not required:</strong> audible clicks, labels, cheat indicators, or raw footage. As long as the video clearly shows the level was legitimately completed, it will normally be sufficient.', ru:'<strong>Не обязательно:</strong> слышимые клики, метки, индикаторы читов и raw footage. Если видео чётко показывает легитимное прохождение, этого, как правило, достаточно.', pt:'<strong>Não é obrigatório:</strong> cliques audíveis, labels, cheat indicators nem raw footage. Desde que o vídeo mostre claramente que o nível foi completado legitimamente, normalmente será suficiente.', fr:'<strong>Non obligatoire :</strong> clics audibles, labels, indicateurs de triche ni raw footage. Tant que la vidéo montre clairement que le niveau a été complété légitimement, cela sera normalement suffisant.', vi:'<strong>Không bắt buộc:</strong> âm thanh click, labels, cheat indicators hay raw footage. Miễn là video thể hiện rõ ràng màn chơi được hoàn thành hợp pháp, thông thường sẽ đủ.' },
    gl_s3_hard_title:{ es:'Hard Demon · Insane Demon', en:'Hard Demon · Insane Demon', ru:'Hard Demon · Insane Demon', pt:'Hard Demon · Insane Demon', fr:'Hard Demon · Insane Demon', vi:'Hard Demon · Insane Demon' },
    gl_s3_hard_sub:  { es:'Dificultad intermedia-alta — se requiere mayor evidencia técnica.', en:'Intermediate-high difficulty — greater technical evidence required.', ru:'Средне-высокая сложность — требуется больше технических доказательств.', pt:'Dificuldade intermediária-alta — maior evidência técnica requerida.', fr:'Difficulté intermédiaire-élevée — davantage de preuves techniques requises.', vi:'Độ khó trung bình-cao — cần bằng chứng kỹ thuật nhiều hơn.' },
    gl_s3_hard_i1:   { es:'Video claro', en:'Clear video', ru:'Чёткое видео', pt:'Vídeo claro', fr:'Vidéo claire', vi:'Video rõ ràng' },
    gl_s3_hard_i2:   { es:'Endscreen visible', en:'Visible endscreen', ru:'Видимый финальный экран', pt:'Endscreen visível', fr:'Endscreen visible', vi:'Màn hình kết thúc rõ ràng' },
    gl_s3_hard_i3:   { es:'Labels visibles (si utilizas mods)', en:'Visible labels (if using mods)', ru:'Видимые метки (если используешь моды)', pt:'Labels visíveis (se usar mods)', fr:'Labels visibles (si vous utilisez des mods)', vi:'Labels hiển thị (nếu dùng mods)' },
    gl_s3_hard_i4:   { es:'Cheat indicator visible (si aplica)', en:'Cheat indicator visible (if applicable)', ru:'Видимый индикатор читов (если применимо)', pt:'Cheat indicator visível (se aplicável)', fr:'Indicateur de triche visible (si applicable)', vi:'Cheat indicator hiển thị (nếu có)' },
    gl_s3_hard_note: { es:'No es obligatorio tener clicks audibles, aunque siempre ayudan al proceso de revisión.', en:'Audible clicks are not required, though they always help the review process.', ru:'Слышимые клики не обязательны, хотя всегда помогают в процессе проверки.', pt:'Não é obrigatório ter cliques audíveis, embora sempre ajudem no processo de revisão.', fr:'Les clics audibles ne sont pas obligatoires, bien qu\'ils aident toujours le processus de révision.', vi:'Âm thanh click không bắt buộc, nhưng luôn giúp quá trình xem xét.' },
    gl_s3_hard_c1:   { es:'<b>Jugadores Vanilla Geometry Dash:</b> si juegas sin mods, sin labels o sin herramientas visuales adicionales, los <b>clicks audibles son obligatorios</b>, ya que habrá menos indicadores disponibles para verificar legitimidad.', en:'<b>Vanilla Geometry Dash players:</b> if you play without mods, labels, or additional visual tools, <b>audible clicks are required</b>, as there will be fewer indicators available to verify legitimacy.', ru:'<b>Игроки на ванильном Geometry Dash:</b> если вы играете без модов, меток или дополнительных визуальных инструментов, <b>слышимые клики обязательны</b>, поскольку будет меньше индикаторов для проверки легитимности.', pt:'<b>Jogadores Vanilla Geometry Dash:</b> se você joga sem mods, sem labels ou sem ferramentas visuais adicionais, <b>os cliques audíveis são obrigatórios</b>, pois haverá menos indicadores disponíveis para verificar a legitimidade.', fr:'<b>Joueurs Vanilla Geometry Dash :</b> si vous jouez sans mods, sans labels ni outils visuels supplémentaires, les <b>clics audibles sont obligatoires</b>, car il y aura moins d\'indicateurs disponibles pour vérifier la légitimité.', vi:'<b>Người chơi Vanilla Geometry Dash:</b> nếu bạn chơi không có mods, không có labels hoặc công cụ hình ảnh bổ sung, <b>âm thanh click là bắt buộc</b>, vì sẽ có ít chỉ số hơn để xác minh tính hợp pháp.' },
    gl_s3_hard_c2:   { es:'Entregar <b>raw footage</b> mejora considerablemente la confianza del récord y acelera la revisión.', en:'Providing <b>raw footage</b> considerably improves the credibility of the record and speeds up the review.', ru:'Предоставление <b>raw footage</b> значительно повышает доверие к рекорду и ускоряет проверку.', pt:'Entregar <b>raw footage</b> melhora consideravelmente a credibilidade do record e acelera a revisão.', fr:'Fournir du <b>raw footage</b> améliore considérablement la crédibilité du record et accélère la révision.', vi:'Cung cấp <b>raw footage</b> cải thiện đáng kể độ tin cậy của record và đẩy nhanh quá trình xem xét.' },
    gl_s3_ext_title: { es:'Extreme Demon', en:'Extreme Demon', ru:'Extreme Demon', pt:'Extreme Demon', fr:'Extreme Demon', vi:'Extreme Demon' },
    gl_s3_ext_sub:   { es:'Requieren una revisión seria debido a su dificultad.', en:'Require serious review due to their difficulty.', ru:'Требуют серьёзной проверки из-за их сложности.', pt:'Requerem uma revisão séria devido à sua dificuldade.', fr:'Nécessitent une révision sérieuse en raison de leur difficulté.', vi:'Cần xem xét nghiêm túc do độ khó của chúng.' },
    gl_s3_ext_pc:    { es:'<strong>Clicks audibles obligatorios</strong> durante toda la completion.', en:'<strong>Audible clicks required</strong> throughout the entire completion.', ru:'<strong>Слышимые клики обязательны</strong> на протяжении всего прохождения.', pt:'<strong>Cliques audíveis obrigatórios</strong> durante toda a completion.', fr:'<strong>Clics audibles obligatoires</strong> tout au long de la completion.', vi:'<strong>Âm thanh click bắt buộc</strong> trong suốt quá trình hoàn thành.' },
    gl_s3_ext_mob:   { es:'Se permiten clicks ligeros o menos notorios <strong>únicamente</strong> si se entrega <strong>raw footage obligatorio</strong>. Esto permite verificar inputs en dispositivos móviles donde el audio puede ser más difícil de captar.', en:'Light or less noticeable clicks are allowed <strong>only</strong> if <strong>mandatory raw footage</strong> is provided. This allows verifying inputs on mobile devices where audio may be harder to capture.', ru:'Лёгкие или менее заметные клики допускаются <strong>только</strong> при предоставлении <strong>обязательного raw footage</strong>. Это позволяет проверить нажатия на мобильных устройствах, где аудио может быть труднее записать.', pt:'Cliques leves ou menos nítidos são permitidos <strong>somente</strong> se o <strong>raw footage obrigatório</strong> for entregue. Isso permite verificar inputs em dispositivos móveis onde o áudio pode ser mais difícil de captar.', fr:'Les clics légers ou moins perceptibles sont autorisés <strong>uniquement</strong> si le <strong>raw footage obligatoire</strong> est fourni. Cela permet de vérifier les inputs sur les appareils mobiles où l\'audio peut être plus difficile à capter.', vi:'Tiếng click nhẹ hoặc ít rõ ràng hơn được cho phép <strong>chỉ</strong> khi cung cấp <strong>raw footage bắt buộc</strong>. Điều này cho phép xác minh inputs trên thiết bị di động nơi âm thanh có thể khó ghi lại hơn.' },
    gl_s3_ext_c:     { es:'<b>Restricción adicional:</b> si el nivel se encuentra dentro del <b>Top 400+ de AREDL</b>, no se aceptarán clicks ligeros. El audio deberá ser claro y suficiente para revisión.', en:'<b>Additional restriction:</b> if the level is within the <b>AREDL Top 400+</b>, light clicks will not be accepted. Audio must be clear and sufficient for review.', ru:'<b>Дополнительное ограничение:</b> если уровень входит в <b>Top 400+ AREDL</b>, лёгкие клики не принимаются. Аудио должно быть чётким и достаточным для проверки.', pt:'<b>Restrição adicional:</b> se o nível estiver dentro do <b>Top 400+ do AREDL</b>, cliques leves não serão aceitos. O áudio deverá ser claro e suficiente para revisão.', fr:'<b>Restriction supplémentaire :</b> si le niveau se trouve dans le <b>Top 400+ d\'AREDL</b>, les clics légers ne seront pas acceptés. Le son doit être clair et suffisant pour la révision.', vi:'<b>Hạn chế thêm:</b> nếu màn chơi nằm trong <b>Top 400+ của AREDL</b>, tiếng click nhẹ sẽ không được chấp nhận. Âm thanh phải rõ ràng và đủ để xem xét.' },
    gl_s3_top_title: { es:'Top 150 Demons', en:'Top 150 Demons', ru:'Top 150 Demons', pt:'Top 150 Demons', fr:'Top 150 Demons', vi:'Top 150 Demons' },
    gl_s3_top_sub:   { es:'Máxima dificultad competitiva — se exige verificación cruzada.', en:'Maximum competitive difficulty — cross-verification required.', ru:'Максимальная конкурентная сложность — требуется перекрёстная проверка.', pt:'Máxima dificuldade competitiva — verificação cruzada exigida.', fr:'Difficulté compétitive maximale — vérification croisée exigée.', vi:'Độ khó cạnh tranh tối đa — yêu cầu xác minh chéo.' },
    gl_s3_top_i:     { es:'El récord debe estar <strong>aceptado previamente en Pointercrate</strong>.', en:'The record must be <strong>previously accepted in Pointercrate</strong>.', ru:'Рекорд должен быть <strong>предварительно принят в Pointercrate</strong>.', pt:'O record deve estar <strong>previamente aceito no Pointercrate</strong>.', fr:'Le record doit être <strong>préalablement accepté sur Pointercrate</strong>.', vi:'Record phải được <strong>chấp nhận trước trên Pointercrate</strong>.' },
    gl_s3_top_c:     { es:'Si el récord <b>no está aceptado en Pointercrate</b>, no será aceptado en BFT Demon List. Esto ayuda a mantener credibilidad total en récords de máximo nivel.', en:'If the record is <b>not accepted in Pointercrate</b>, it will not be accepted in BFT Demon List. This helps maintain full credibility for top-level records.', ru:'Если рекорд <b>не принят в Pointercrate</b>, он не будет принят в BFT Demon List. Это помогает сохранить полное доверие к рекордам высшего уровня.', pt:'Se o record <b>não estiver aceito no Pointercrate</b>, não será aceito na BFT Demon List. Isso ajuda a manter total credibilidade nos records de nível máximo.', fr:'Si le record <b>n\'est pas accepté sur Pointercrate</b>, il ne sera pas accepté sur BFT Demon List. Cela contribue à maintenir une crédibilité totale pour les records de niveau maximum.', vi:'Nếu record <b>chưa được chấp nhận trên Pointercrate</b>, nó sẽ không được chấp nhận trong BFT Demon List. Điều này giúp duy trì độ tin cậy cho các record ở cấp độ cao nhất.' },
    gl_s4_h:         { es:'Raw footage', en:'Raw footage', ru:'Raw footage', pt:'Raw footage', fr:'Raw footage', vi:'Raw footage' },
    gl_s4_lead:      { es:'El raw footage es la <strong>grabación original sin editar</strong>. Puede ser solicitado por el staff en cualquier momento, incluso si inicialmente no era obligatorio.', en:'Raw footage is the <strong>original, unedited recording</strong>. It can be requested by staff at any time, even if it was not initially required.', ru:'Raw footage — это <strong>оригинальная, неотредактированная запись</strong>. Персонал может запросить его в любое время, даже если изначально оно не было обязательным.', pt:'Raw footage é a <strong>gravação original sem edição</strong>. Pode ser solicitado pelo staff a qualquer momento, mesmo que inicialmente não fosse obrigatório.', fr:'Le raw footage est l\'<strong>enregistrement original non édité</strong>. Il peut être demandé par le staff à tout moment, même s\'il n\'était pas initialement obligatoire.', vi:'Raw footage là <strong>bản ghi gốc không chỉnh sửa</strong>. Staff có thể yêu cầu bất cứ lúc nào, ngay cả khi ban đầu không bắt buộc.' },
    gl_s4_when:      { es:'Será altamente recomendado o requerido en casos como:', en:'Highly recommended or required in cases such as:', ru:'Настоятельно рекомендуется или требуется в таких случаях, как:', pt:'Será altamente recomendado ou requerido em casos como:', fr:'Fortement recommandé ou requis dans des cas tels que :', vi:'Được khuyến nghị cao hoặc yêu cầu trong các trường hợp như:' },
    gl_s4_i1:        { es:'Extreme Demons', en:'Extreme Demons', ru:'Extreme Demons', pt:'Extreme Demons', fr:'Extreme Demons', vi:'Extreme Demons' },
    gl_s4_i2:        { es:'Top demons', en:'Top demons', ru:'Топ-демоны', pt:'Top demons', fr:'Top demons', vi:'Top demons' },
    gl_s4_i3:        { es:'Récords sospechosos', en:'Suspicious records', ru:'Подозрительные рекорды', pt:'Records suspeitos', fr:'Records suspects', vi:'Records đáng ngờ' },
    gl_s4_i4:        { es:'Audio poco claro', en:'Unclear audio', ru:'Нечёткий звук', pt:'Áudio pouco claro', fr:'Audio peu clair', vi:'Âm thanh không rõ' },
    gl_s4_i5:        { es:'Casos especiales', en:'Special cases', ru:'Особые случаи', pt:'Casos especiais', fr:'Cas spéciaux', vi:'Các trường hợp đặc biệt' },
    gl_s4_c:         { es:'Negarse a entregar raw footage cuando sea solicitado puede resultar en <b>rechazo del récord</b>.', en:'Refusing to provide raw footage when requested may result in <b>record rejection</b>.', ru:'Отказ предоставить raw footage по запросу может привести к <b>отклонению рекорда</b>.', pt:'Recusar-se a entregar raw footage quando solicitado pode resultar em <b>rejeição do record</b>.', fr:'Refuser de fournir le raw footage lorsqu\'il est demandé peut entraîner le <b>rejet du record</b>.', vi:'Từ chối cung cấp raw footage khi được yêu cầu có thể dẫn đến <b>từ chối record</b>.' },
    gl_s5_h:         { es:'Records 2 Player', en:'2 Player Records', ru:'Рекорды 2 Player', pt:'Records 2 Player', fr:'Records 2 joueurs', vi:'Records 2 người chơi' },
    gl_s5_lead:      { es:'Los niveles 2 Player también son aceptados dentro de la lista.', en:'2 Player levels are also accepted in the list.', ru:'Уровни 2 Player также принимаются в списке.', pt:'Os níveis 2 Player também são aceitos na lista.', fr:'Les niveaux 2 joueurs sont également acceptés dans la liste.', vi:'Các màn 2 người chơi cũng được chấp nhận trong danh sách.' },
    gl_s5_i1:        { es:'Ambos jugadores deben estar <strong>correctamente identificados</strong>.', en:'Both players must be <strong>correctly identified</strong>.', ru:'Оба игрока должны быть <strong>правильно идентифицированы</strong>.', pt:'Ambos os jogadores devem ser <strong>corretamente identificados</strong>.', fr:'Les deux joueurs doivent être <strong>correctement identifiés</strong>.', vi:'Cả hai người chơi phải được <strong>xác định chính xác</strong>.' },
    gl_s5_i2:        { es:'Si el récord fue realizado mediante <strong>Globed</strong>, deben presentarse <strong>ambas POV</strong> o un enlace a la segunda perspectiva.', en:'If the record was done via <strong>Globed</strong>, <strong>both POVs</strong> must be provided or a link to the second perspective.', ru:'Если рекорд был записан через <strong>Globed</strong>, необходимо предоставить <strong>оба ракурса</strong> или ссылку на второй.', pt:'Se o record foi realizado via <strong>Globed</strong>, ambas as POV devem ser apresentadas ou um link para a segunda perspectiva.', fr:'Si le record a été réalisé via <strong>Globed</strong>, les <strong>deux POV</strong> doivent être présentées ou un lien vers la deuxième perspective.', vi:'Nếu record được thực hiện qua <strong>Globed</strong>, phải cung cấp <strong>cả hai POV</strong> hoặc liên kết đến góc nhìn thứ hai.' },
    gl_s5_i3:        { es:'Si ambos jugadores completaron el nivel en un <strong>mismo dispositivo</strong>, un solo video será suficiente.', en:'If both players completed the level on the <strong>same device</strong>, a single video will be sufficient.', ru:'Если оба игрока прошли уровень на <strong>одном устройстве</strong>, одного видео будет достаточно.', pt:'Se ambos os jogadores completaram o nível em um <strong>mesmo dispositivo</strong>, um único vídeo será suficiente.', fr:'Si les deux joueurs ont complété le niveau sur le <strong>même appareil</strong>, une seule vidéo suffira.', vi:'Nếu cả hai người chơi hoàn thành màn trên <strong>cùng một thiết bị</strong>, một video sẽ là đủ.' },
    gl_s5_c:         { es:'El staff podrá solicitar información adicional si existen dudas sobre la participación real de ambos jugadores.', en:'Staff may request additional information if there are doubts about the actual participation of both players.', ru:'Персонал может запросить дополнительную информацию, если есть сомнения в реальном участии обоих игроков.', pt:'O staff poderá solicitar informações adicionais se houver dúvidas sobre a participação real de ambos os jogadores.', fr:'Le staff pourra demander des informations supplémentaires s\'il existe des doutes sur la participation réelle des deux joueurs.', vi:'Staff có thể yêu cầu thông tin bổ sung nếu có nghi ngờ về sự tham gia thực sự của cả hai người chơi.' },
    gl_s6_h:         { es:'Segunda revisión / Supervisión', en:'Second Review / Supervision', ru:'Повторная проверка / Наблюдение', pt:'Segunda revisão / Supervisão', fr:'Deuxième révision / Supervision', vi:'Xem xét lần 2 / Giám sát' },
    gl_s6_lead:      { es:'Un récord aceptado <strong>no significa aprobación permanente</strong>.', en:'An accepted record <strong>does not mean permanent approval</strong>.', ru:'Принятый рекорд <strong>не означает постоянного одобрения</strong>.', pt:'Um record aceito <strong>não significa aprovação permanente</strong>.', fr:'Un record accepté <strong>ne signifie pas une approbation permanente</strong>.', vi:'Một record được chấp nhận <strong>không có nghĩa là chấp thuận vĩnh viễn</strong>.' },
    gl_s6_if:        { es:'Si con el tiempo aparecen:', en:'If over time the following arise:', ru:'Если со временем появляются:', pt:'Se com o tempo surgirem:', fr:'Si au fil du temps apparaissent :', vi:'Nếu theo thời gian xuất hiện:' },
    gl_s6_i1:        { es:'Sospechas razonables', en:'Reasonable suspicions', ru:'Обоснованные подозрения', pt:'Suspeitas razoáveis', fr:'Soupçons raisonnables', vi:'Nghi ngờ hợp lý' },
    gl_s6_i2:        { es:'Reportes de la comunidad', en:'Community reports', ru:'Отчёты сообщества', pt:'Relatórios da comunidade', fr:'Signalements de la communauté', vi:'Báo cáo từ cộng đồng' },
    gl_s6_i3:        { es:'Nuevas pruebas', en:'New evidence', ru:'Новые доказательства', pt:'Novas provas', fr:'Nouveaux éléments de preuve', vi:'Bằng chứng mới' },
    gl_s6_i4:        { es:'Inconsistencias técnicas', en:'Technical inconsistencies', ru:'Технические несоответствия', pt:'Inconsistências técnicas', fr:'Incohérences techniques', vi:'Sự không nhất quán kỹ thuật' },
    gl_s6_then:      { es:'El récord podrá ser enviado a <strong>Revisión de Supervisión</strong>, donde múltiples miembros del staff lo analizarán nuevamente con mayor profundidad. Tras la revisión, el récord podrá:', en:'The record may be sent to <strong>Supervision Review</strong>, where multiple staff members will analyze it again in greater depth. After the review, the record may:', ru:'Рекорд может быть отправлен на <strong>Надзорную проверку</strong>, где несколько членов персонала проанализируют его снова более глубоко. После проверки рекорд может:', pt:'O record poderá ser enviado para <strong>Revisão de Supervisão</strong>, onde múltiplos membros do staff o analisarão novamente com maior profundidade. Após a revisão, o record poderá:', fr:'Le record pourra être envoyé en <strong>Révision de supervision</strong>, où plusieurs membres du staff l\'analyseront à nouveau plus en profondeur. Après révision, le record pourra :', vi:'Record có thể được gửi đến <strong>Xem xét Giám sát</strong>, nơi nhiều thành viên staff sẽ phân tích lại kỹ hơn. Sau khi xem xét, record có thể:' },
    gl_s6_r1:        { es:'Mantenerse aceptado', en:'Remain accepted', ru:'Остаться принятым', pt:'Manter-se aceito', fr:'Rester accepté', vi:'Vẫn được chấp nhận' },
    gl_s6_r2:        { es:'Ser removido', en:'Be removed', ru:'Быть удалён', pt:'Ser removido', fr:'Être retiré', vi:'Bị xóa' },
    gl_s6_r3:        { es:'Solicitar evidencia adicional al jugador', en:'Request additional evidence from the player', ru:'Запросить дополнительные доказательства у игрока', pt:'Solicitar evidência adicional ao jogador', fr:'Demander des preuves supplémentaires au joueur', vi:'Yêu cầu bằng chứng bổ sung từ người chơi' },
    gl_s7_h:         { es:'Autoridad del staff', en:'Staff authority', ru:'Полномочия персонала', pt:'Autoridade do staff', fr:'Autorité du staff', vi:'Quyền hạn của staff' },
    gl_s7_lead:      { es:'El staff tiene la <strong>decisión final</strong> en situaciones no contempladas directamente en estas reglas.', en:'Staff has the <strong>final decision</strong> in situations not directly covered by these rules.', ru:'Персонал имеет <strong>окончательное решение</strong> в ситуациях, прямо не предусмотренных этими правилами.', pt:'O staff tem a <strong>decisão final</strong> em situações não contempladas diretamente nestas regras.', fr:'Le staff a la <strong>décision finale</strong> dans les situations non directement couvertes par ces règles.', vi:'Staff có <strong>quyết định cuối cùng</strong> trong các tình huống không được đề cập trực tiếp trong quy tắc.' },
    gl_s7_i1:        { es:'Casos especiales', en:'Special cases', ru:'Особые случаи', pt:'Casos especiais', fr:'Cas spéciaux', vi:'Các trường hợp đặc biệt' },
    gl_s7_i2:        { es:'Métodos nuevos de trampa', en:'New cheating methods', ru:'Новые методы читерства', pt:'Novos métodos de trapaça', fr:'Nouvelles méthodes de triche', vi:'Phương pháp gian lận mới' },
    gl_s7_i3:        { es:'Evidencia insuficiente', en:'Insufficient evidence', ru:'Недостаточные доказательства', pt:'Evidência insuficiente', fr:'Preuves insuffisantes', vi:'Bằng chứng không đủ' },
    gl_s7_i4:        { es:'Situaciones ambiguas', en:'Ambiguous situations', ru:'Неоднозначные ситуации', pt:'Situações ambíguas', fr:'Situations ambiguës', vi:'Tình huống mơ hồ' },
    gl_s7_c:         { es:'Nuestro objetivo no es perjudicar jugadores legítimos, sino <b>proteger la integridad de la lista</b>.', en:'Our goal is not to harm legitimate players, but to <b>protect the integrity of the list</b>.', ru:'Наша цель — не навредить легитимным игрокам, а <b>защитить целостность списка</b>.', pt:'Nosso objetivo não é prejudicar jogadores legítimos, mas <b>proteger a integridade da lista</b>.', fr:'Notre objectif n\'est pas de nuire aux joueurs légitimes, mais de <b>protéger l\'intégrité de la liste</b>.', vi:'Mục tiêu của chúng tôi không phải là làm hại người chơi hợp pháp, mà là <b>bảo vệ tính toàn vẹn của danh sách</b>.' },
    gl_s8_h:         { es:'Objetivo final', en:'Final goal', ru:'Финальная цель', pt:'Objetivo final', fr:'Objectif final', vi:'Mục tiêu cuối cùng' },
    gl_s8_p1:        { es:'Queremos construir una lista <strong>competitiva, seria y abierta para todos</strong>.', en:'We want to build a list that is <strong>competitive, serious, and open to everyone</strong>.', ru:'Мы хотим создать список, который является <strong>конкурентным, серьёзным и открытым для всех</strong>.', pt:'Queremos construir uma lista <strong>competitiva, séria e aberta para todos</strong>.', fr:'Nous voulons construire une liste <strong>compétitive, sérieuse et ouverte à tous</strong>.', vi:'Chúng tôi muốn xây dựng một danh sách <strong>cạnh tranh, nghiêm túc và mở cửa cho tất cả mọi người</strong>.' },
    gl_s8_p2:        { es:'No importa si eres principiante o profesional. Si juegas legítimamente y mejoras como jugador, <strong>tienes un lugar aquí</strong>.', en:'It doesn\'t matter if you\'re a beginner or a professional. If you play legitimately and improve as a player, <strong>you have a place here</strong>.', ru:'Неважно, новичок вы или профессионал. Если вы играете честно и развиваетесь, <strong>здесь есть место для вас</strong>.', pt:'Não importa se você é iniciante ou profissional. Se você joga legitimamente e melhora como jogador, <strong>você tem um lugar aqui</strong>.', fr:'Peu importe si vous êtes débutant ou professionnel. Si vous jouez légitimement et progressez en tant que joueur, <strong>vous avez une place ici</strong>.', vi:'Không quan trọng bạn là người mới hay chuyên nghiệp. Nếu bạn chơi hợp pháp và cải thiện bản thân, <strong>bạn có một chỗ ở đây</strong>.' },
    gl_cta:          { es:'Volver a enviar mi récord →', en:'Go submit my record →', ru:'Отправить мой рекорд →', pt:'Ir enviar meu record →', fr:'Aller soumettre mon record →', vi:'Đến gửi record của tôi →' },

    /* ─ Profile page (JS strings) ─ */
    profile_no_bio:       { es:'Este usuario aún no ha escrito una biografía.', en:'This user hasn\'t written a bio yet.', ru:'Этот пользователь ещё не написал биографию.', pt:'Este usuário ainda não escreveu uma biografia.', fr:'Cet utilisateur n\'a pas encore rédigé de biographie.', vi:'Người dùng này chưa viết tiểu sử.' },
    profile_login_req:    { es:'Inicia sesión para ver tu perfil, o abre el enlace de un usuario.', en:'Sign in to view your profile, or open a user\'s link.', ru:'Войдите, чтобы посмотреть свой профиль, или откройте ссылку пользователя.', pt:'Faça login para ver seu perfil, ou abra o link de um usuário.', fr:'Connectez-vous pour voir votre profil, ou ouvrez le lien d\'un utilisateur.', vi:'Đăng nhập để xem hồ sơ của bạn, hoặc mở liên kết của người dùng.' },
    profile_no_records_js:{ es:'Este usuario aún no tiene records.', en:'This user has no records yet.', ru:'У этого пользователя ещё нет рекордов.', pt:'Este usuário ainda não tem records.', fr:'Cet utilisateur n\'a pas encore de records.', vi:'Người dùng này chưa có records.' },
    profile_resend_btn:   { es:'↩ Mandar a revisión', en:'↩ Send for review', ru:'↩ На проверку', pt:'↩ Enviar para revisão', fr:'↩ Envoyer en révision', vi:'↩ Gửi xem xét lại' },
    profile_pct_invalid:  { es:'Porcentaje inválido (1–100).', en:'Invalid percentage (1–100).', ru:'Неверный процент (1–100).', pt:'Porcentagem inválida (1–100).', fr:'Pourcentage invalide (1–100).', vi:'Phần trăm không hợp lệ (1–100).' },
    profile_pct_min_err:  { es:'Error, el % mínimo de este nivel es {n}%', en:'Error, the minimum % for this level is {n}%', ru:'Ошибка, минимальный % для этого уровня — {n}%', pt:'Erro, o % mínimo deste nível é {n}%', fr:'Erreur, le % minimum de ce niveau est {n}%', vi:'Lỗi, % tối thiểu của màn này là {n}%' },
    profile_video_req:    { es:'El link del video es obligatorio.', en:'The video link is required.', ru:'Ссылка на видео обязательна.', pt:'O link do vídeo é obrigatório.', fr:'Le lien vidéo est obligatoire.', vi:'Link video là bắt buộc.' },
    profile_video2_req:   { es:'El video del segundo jugador es obligatorio (o marca \'Mismo dispositivo\').', en:'The second player\'s video is required (or check \'Same device\').', ru:'Видео второго игрока обязательно (или отметьте «Одно устройство»).', pt:'O vídeo do segundo jogador é obrigatório (ou marque \'Mesmo dispositivo\').', fr:'La vidéo du deuxième joueur est obligatoire (ou cochez \'Même appareil\').', vi:'Video của người chơi thứ 2 là bắt buộc (hoặc tích vào \'Cùng thiết bị\').' },
    profile_same_device:  { es:'Mismo dispositivo (1 solo video)', en:'Same device (1 video only)', ru:'Одно устройство (1 видео)', pt:'Mesmo dispositivo (1 só vídeo)', fr:'Même appareil (1 vidéo seulement)', vi:'Cùng thiết bị (1 video)' },
    profile_with_partner: { es:'Con: {name}', en:'With: {name}', ru:'С: {name}', pt:'Com: {name}', fr:'Avec : {name}', vi:'Cùng: {name}' },
    profile_mobile_tag:   { es:'📱 Móvil', en:'📱 Mobile', ru:'📱 Мобильный', pt:'📱 Celular', fr:'📱 Mobile', vi:'📱 Di động' },
    profile_pts_unit:     { es:'puntos', en:'points', ru:'очков', pt:'pontos', fr:'points', vi:'điểm' },
    profile_st_pending:   { es:'Pendiente', en:'Pending', ru:'Ожидает', pt:'Pendente', fr:'En attente', vi:'Đang chờ' },
    profile_st_accepted:  { es:'Aceptado', en:'Accepted', ru:'Принят', pt:'Aceito', fr:'Accepté', vi:'Đã chấp nhận' },
    profile_st_rejected:  { es:'Rechazado', en:'Rejected', ru:'Отклонён', pt:'Rejeitado', fr:'Rejeté', vi:'Bị từ chối' },
    profile_see_video:    { es:'Ver video ▶', en:'Watch video ▶', ru:'Смотреть видео ▶', pt:'Ver vídeo ▶', fr:'Voir la vidéo ▶', vi:'Xem video ▶' },
    profile_btn_update:   { es:'Actualizar', en:'Update', ru:'Обновить', pt:'Atualizar', fr:'Mettre à jour', vi:'Cập nhật' },
    profile_btn_delete:   { es:'Eliminar', en:'Delete', ru:'Удалить', pt:'Excluir', fr:'Supprimer', vi:'Xóa' },
    profile_date_acc:     { es:'Aceptado: ', en:'Accepted: ', ru:'Принят: ', pt:'Aceito: ', fr:'Accepté : ', vi:'Đã chấp nhận: ' },
    profile_date_rej:     { es:'Rechazado: ', en:'Rejected: ', ru:'Отклонён: ', pt:'Rejeitado: ', fr:'Rejeté : ', vi:'Bị từ chối: ' },
    profile_date_sub:     { es:'Enviado: ', en:'Submitted: ', ru:'Отправлен: ', pt:'Enviado: ', fr:'Soumis : ', vi:'Đã gửi: ' },
    profile_recs_pending: { es:'Records en espera ({n})', en:'Pending records ({n})', ru:'Ожидающие рекорды ({n})', pt:'Records em espera ({n})', fr:'Records en attente ({n})', vi:'Records đang chờ ({n})' },
    profile_recs_rejected:{ es:'Records rechazados ({n})', en:'Rejected records ({n})', ru:'Отклонённые рекорды ({n})', pt:'Records rejeitados ({n})', fr:'Records rejetés ({n})', vi:'Records bị từ chối ({n})' },
    profile_diff_title:   { es:'Niveles completados por dificultad', en:'Levels completed by difficulty', ru:'Уровни по сложности', pt:'Níveis completados por dificuldade', fr:'Niveaux complétés par difficulté', vi:'Các màn hoàn thành theo độ khó' },
    profile_role_title:   { es:'Cambiar rol del usuario', en:'Change user role', ru:'Изменить роль пользователя', pt:'Mudar papel do usuário', fr:'Changer le rôle de l\'utilisateur', vi:'Thay đổi vai trò người dùng' },
    profile_role_current: { es:'Rol actual: ', en:'Current role: ', ru:'Текущая роль: ', pt:'Papel atual: ', fr:'Rôle actuel : ', vi:'Vai trò hiện tại: ' },
    profile_upd_title:    { es:'Actualizar: {name}', en:'Update: {name}', ru:'Обновить: {name}', pt:'Atualizar: {name}', fr:'Mettre à jour : {name}', vi:'Cập nhật: {name}' },
    profile_upd_warn:     { es:'Este record ya está aceptado. Editarlo lo mandará de vuelta a revisión.', en:'This record is already accepted. Editing it will send it back for review.', ru:'Этот рекорд уже принят. Редактирование отправит его на повторную проверку.', pt:'Este record já está aceito. Editá-lo o enviará de volta para revisão.', fr:'Ce record est déjà accepté. Le modifier le renverra en révision.', vi:'Record này đã được chấp nhận. Chỉnh sửa sẽ gửi lại để xem xét.' },
    profile_upd_saving:   { es:'Guardando...', en:'Saving...', ru:'Сохранение...', pt:'Salvando...', fr:'Sauvegarde...', vi:'Đang lưu...' },
    profile_upd_save:     { es:'Guardar cambios', en:'Save changes', ru:'Сохранить изменения', pt:'Salvar alterações', fr:'Enregistrer les modifications', vi:'Lưu thay đổi' },
    profile_no_country:   { es:'— Sin país —', en:'— No country —', ru:'— Без страны —', pt:'— Sem país —', fr:'— Sans pays —', vi:'— Không có quốc gia —' },
    profile_country_locked: { es:'País bloqueado — podrás cambiarlo en {d}d {h}h.', en:'Country locked — you can change it in {d}d {h}h.', ru:'Страна заблокирована — можно изменить через {d}д {h}ч.', pt:'País bloqueado — você poderá mudá-lo em {d}d {h}h.', fr:'Pays verrouillé — vous pourrez le modifier dans {d}j {h}h.', vi:'Quốc gia bị khóa — bạn có thể thay đổi sau {d}d {h}h.' },
    profile_name_empty:   { es:'El nombre no puede estar vacío.', en:'Name cannot be empty.', ru:'Имя не может быть пустым.', pt:'O nome não pode estar vazio.', fr:'Le nom ne peut pas être vide.', vi:'Tên không được để trống.' },
    profile_photo_invalid:{ es:'La URL de la foto debe empezar con http(s)://', en:'Photo URL must start with http(s)://', ru:'URL фото должен начинаться с http(s)://', pt:'A URL da foto deve começar com http(s)://', fr:'L\'URL de la photo doit commencer par http(s)://', vi:'URL ảnh phải bắt đầu bằng http(s)://' },
    profile_yt_invalid:   { es:'El link de YouTube debe empezar con https://youtube.com/ o https://youtu.be/', en:'YouTube link must start with https://youtube.com/ or https://youtu.be/', ru:'Ссылка YouTube должна начинаться с https://youtube.com/ или https://youtu.be/', pt:'O link do YouTube deve começar com https://youtube.com/ ou https://youtu.be/', fr:'Le lien YouTube doit commencer par https://youtube.com/ ou https://youtu.be/', vi:'Link YouTube phải bắt đầu bằng https://youtube.com/ hoặc https://youtu.be/' },
    profile_saving_btn:   { es:'Guardando...', en:'Saving...', ru:'Сохранение...', pt:'Salvando...', fr:'Sauvegarde...', vi:'Đang lưu...' },
    profile_saved_ok:     { es:'✓ Perfil guardado', en:'✓ Profile saved', ru:'✓ Профиль сохранён', pt:'✓ Perfil salvo', fr:'✓ Profil enregistré', vi:'✓ Đã lưu hồ sơ' },
    profile_cant_del_acc: { es:'No puedes eliminar un record aceptado.', en:'You cannot delete an accepted record.', ru:'Нельзя удалить принятый рекорд.', pt:'Você não pode excluir um record aceito.', fr:'Vous ne pouvez pas supprimer un record accepté.', vi:'Bạn không thể xóa một record đã được chấp nhận.' },
    profile_max_badges:   { es:'Máximo 2 insignias. Desequipa una primero.', en:'Maximum 2 badges. Unequip one first.', ru:'Максимум 2 значка. Сначала снимите один.', pt:'Máximo 2 insignias. Desequipe uma primeiro.', fr:'Maximum 2 insignes. Déséquipez-en un d\'abord.', vi:'Tối đa 2 huy hiệu. Hãy bỏ trang bị một cái trước.' },
    profile_no_banners_cosm: { es:'No tienes banners desbloqueados aún.', en:'You have no unlocked banners yet.', ru:'У вас ещё нет разблокированных баннеров.', pt:'Você ainda não tem banners desbloqueados.', fr:'Vous n\'avez pas encore de bannières débloquées.', vi:'Bạn chưa có banners nào được mở khóa.' },
    profile_no_badges_cosm:  { es:'No tienes insignias desbloqueadas aún.', en:'You have no unlocked badges yet.', ru:'У вас ещё нет разблокированных значков.', pt:'Você ainda não tem insignias desbloqueadas.', fr:'Vous n\'avez pas encore d\'insignes débloqués.', vi:'Bạn chưa có huy hiệu nào được mở khóa.' },
    profile_cosm_saving:  { es:'Guardando…', en:'Saving…', ru:'Сохранение…', pt:'Salvando…', fr:'Sauvegarde…', vi:'Đang lưu…' },
    profile_cosm_save:    { es:'Guardar', en:'Save', ru:'Сохранить', pt:'Salvar', fr:'Enregistrer', vi:'Lưu' },

    /* ─ Leaderboards (JS strings) ─ */
    lb_cat_points:    { es:'Por Puntos', en:'By Points', ru:'По очкам', pt:'Por Pontos', fr:'Par Points', vi:'Theo Điểm' },
    lb_cat_total:     { es:'Por Demons completados', en:'By Completed Demons', ru:'По пройденным демонам', pt:'Por Demons completados', fr:'Par Demons complétés', vi:'Theo Demons hoàn thành' },
    lb_cat_extreme:   { es:'Por Extreme Demons', en:'By Extreme Demons', ru:'По Extreme Demons', pt:'Por Extreme Demons', fr:'Par Extreme Demons', vi:'Theo Extreme Demons' },
    lb_cat_insane:    { es:'Por Insane Demons', en:'By Insane Demons', ru:'По Insane Demons', pt:'Por Insane Demons', fr:'Par Insane Demons', vi:'Theo Insane Demons' },
    lb_cat_hard:      { es:'Por Hard Demons', en:'By Hard Demons', ru:'По Hard Demons', pt:'Por Hard Demons', fr:'Par Hard Demons', vi:'Theo Hard Demons' },
    lb_cat_medium:    { es:'Por Medium Demons', en:'By Medium Demons', ru:'По Medium Demons', pt:'Por Medium Demons', fr:'Par Medium Demons', vi:'Theo Medium Demons' },
    lb_cat_easy:      { es:'Por Easy Demons', en:'By Easy Demons', ru:'По Easy Demons', pt:'Por Easy Demons', fr:'Par Easy Demons', vi:'Theo Easy Demons' },
    lb_cat_countries: { es:'Países', en:'Countries', ru:'Страны', pt:'Países', fr:'Pays', vi:'Quốc gia' },
    lb_unit_pts:      { es:'Pts', en:'Pts', ru:'Очк', pt:'Pts', fr:'Pts', vi:'Điểm' },
    lb_unit_demons:   { es:'Demons', en:'Demons', ru:'Демоны', pt:'Demons', fr:'Demons', vi:'Demons' },
    lb_err_load:      { es:'Error al cargar leaderboards.', en:'Error loading leaderboards.', ru:'Ошибка загрузки таблицы лидеров.', pt:'Erro ao carregar rankings.', fr:'Erreur de chargement des classements.', vi:'Lỗi tải bảng xếp hạng.' },
    lb_no_countries:  { es:'No hay países que mostrar.', en:'No countries to show.', ru:'Нет стран для отображения.', pt:'Nenhum país para mostrar.', fr:'Aucun pays à afficher.', vi:'Không có quốc gia nào để hiển thị.' },
    lb_no_players_cat:{ es:'No hay jugadores que mostrar en esta categoría.', en:'No players to show in this category.', ru:'Нет игроков для отображения в этой категории.', pt:'Nenhum jogador para mostrar nesta categoria.', fr:'Aucun joueur à afficher dans cette catégorie.', vi:'Không có người chơi nào để hiển thị trong danh mục này.' },
    lb_sin_nombre:    { es:'Sin nombre', en:'No name', ru:'Без имени', pt:'Sem nome', fr:'Sans nom', vi:'Không có tên' },

    /* ─ Panel (HTML + JS) ─ */
    panel_title:          { es:'Panel de Records', en:'Records Panel', ru:'Панель рекордов', pt:'Painel de Records', fr:'Panneau des Records', vi:'Bảng Records' },
    panel_sub:            { es:'Revisa y modera los récords enviados por los jugadores.', en:'Review and moderate records submitted by players.', ru:'Просматривайте и модерируйте рекорды, отправленные игроками.', pt:'Revise e modere os records enviados pelos jogadores.', fr:'Examinez et modérez les records soumis par les joueurs.', vi:'Xem xét và kiểm duyệt các records được gửi bởi người chơi.' },
    panel_loading:        { es:'Cargando sesión...', en:'Loading session...', ru:'Загрузка сессии...', pt:'Carregando sessão...', fr:'Chargement de la session...', vi:'Đang tải phiên...' },
    panel_owner_title:    { es:'Herramientas de Owner', en:'Owner Tools', ru:'Инструменты Owner', pt:'Ferramentas de Owner', fr:'Outils Owner', vi:'Công cụ Owner' },
    panel_recalc_btn:     { es:'Recalcular puntos de todos los niveles', en:'Recalculate points for all levels', ru:'Пересчитать очки всех уровней', pt:'Recalcular pontos de todos os níveis', fr:'Recalculer les points de tous les niveaux', vi:'Tính lại điểm cho tất cả màn chơi' },
    panel_al_title:       { es:'Añadir nivel y aceptar reclamo', en:'Add level and accept claim', ru:'Добавить уровень и принять заявку', pt:'Adicionar nível e aceitar reclamo', fr:'Ajouter un niveau et accepter la réclamation', vi:'Thêm màn chơi và chấp nhận yêu cầu' },
    panel_al_gdid_note:   { es:'Se usa para autogenerar el background y verificar el nivel.', en:'Used to auto-generate the background and verify the level.', ru:'Используется для автогенерации фона и проверки уровня.', pt:'Usado para autogerar o background e verificar o nível.', fr:'Utilisé pour générer automatiquement l\'arrière-plan et vérifier le niveau.', vi:'Dùng để tự động tạo background và xác minh màn chơi.' },
    panel_al_bg_note:     { es:'Se autocompletará con el thumbnail del nivel de GD si hay ID.', en:'Will autocomplete with GD level thumbnail if ID is provided.', ru:'Автоматически заполнится превью уровня GD, если есть ID.', pt:'Será preenchido automaticamente com o thumbnail do nível do GD se houver ID.', fr:'Se complètera automatiquement avec la vignette du niveau GD si un ID est fourni.', vi:'Sẽ tự động điền thumbnail màn GD nếu có ID.' },
    panel_al_pts_auto:    { es:'Puntos automáticos: —', en:'Automatic points: —', ru:'Автоматические очки: —', pt:'Pontos automáticos: —', fr:'Points automatiques : —', vi:'Điểm tự động: —' },
    panel_al_glow_none:   { es:'Sin glow', en:'No glow', ru:'Без свечения', pt:'Sem glow', fr:'Sans lueur', vi:'Không có glow' },
    panel_al_cancel:      { es:'Cancelar', en:'Cancel', ru:'Отмена', pt:'Cancelar', fr:'Annuler', vi:'Hủy' },
    panel_al_confirm:     { es:'+ Añadir nivel y aceptar récord', en:'+ Add level and accept record', ru:'+ Добавить уровень и принять рекорд', pt:'+ Adicionar nível e aceitar record', fr:'+ Ajouter le niveau et accepter le record', vi:'+ Thêm màn chơi và chấp nhận record' },
    panel_al_processing:  { es:'Procesando...', en:'Processing...', ru:'Обработка...', pt:'Processando...', fr:'Traitement...', vi:'Đang xử lý...' },
    panel_mod_accept:     { es:'Aceptar este record', en:'Accept this record', ru:'Принять этот рекорд', pt:'Aceitar este record', fr:'Accepter ce record', vi:'Chấp nhận record này' },
    panel_mod_reject:     { es:'Rechazar este record', en:'Reject this record', ru:'Отклонить этот рекорд', pt:'Rejeitar este record', fr:'Rejeter ce record', vi:'Từ chối record này' },
    panel_mod_accept_btn: { es:'Aceptar record', en:'Accept record', ru:'Принять рекорд', pt:'Aceitar record', fr:'Accepter le record', vi:'Chấp nhận record' },
    panel_mod_reject_btn: { es:'Rechazar record', en:'Reject record', ru:'Отклонить рекорд', pt:'Rejeitar record', fr:'Rejeter le record', vi:'Từ chối record' },
    panel_mod_notes_ph:   { es:'Notas para el jugador (opcionales)...', en:'Notes for the player (optional)...', ru:'Заметки для игрока (необязательно)...', pt:'Notas para o jogador (opcionais)...', fr:'Notes pour le joueur (optionnelles)...', vi:'Ghi chú cho người chơi (tuỳ chọn)...' },
    panel_cid_accepted:   { es:'Aceptada', en:'Accepted', ru:'Принята', pt:'Aceita', fr:'Acceptée', vi:'Đã chấp nhận' },
    panel_cid_rejected:   { es:'Rechazada', en:'Rejected', ru:'Отклонена', pt:'Rejeitada', fr:'Rejetée', vi:'Bị từ chối' },
    panel_empty_cat:      { es:'Sin records en esta categoría.', en:'No records in this category.', ru:'Нет рекордов в этой категории.', pt:'Sem records nesta categoria.', fr:'Aucun record dans cette catégorie.', vi:'Không có records trong danh mục này.' },
    panel_no_cids:        { es:'Sin IDs Custom', en:'No Custom IDs', ru:'Нет пользовательских ID', pt:'Sem IDs Custom', fr:'Aucun ID personnalisé', vi:'Không có ID tùy chỉnh' },
    panel_claim_btn:      { es:'Reclamar revisión', en:'Claim review', ru:'Заявить проверку', pt:'Reivindicar revisão', fr:'Revendiquer la révision', vi:'Nhận xem xét' },
    panel_release_btn:    { es:'Quitar reclamación', en:'Release claim', ru:'Снять заявку', pt:'Liberar reivindicação', fr:'Libérer la réclamation', vi:'Hủy yêu cầu' },
    panel_claimed_you:    { es:'Reclamado por <b>ti</b>', en:'Claimed by <b>you</b>', ru:'Заявлено <b>вами</b>', pt:'Reivindicado por <b>você</b>', fr:'Revendiqué par <b>vous</b>', vi:'Đã nhận bởi <b>bạn</b>' },
    panel_claimed_locked: { es:'Reclamado', en:'Claimed', ru:'Заявлено', pt:'Reivindicado', fr:'Revendiqué', vi:'Đã nhận' },
    panel_claimed_by_name:{ es:'por <b>{name}</b>', en:'by <b>{name}</b>', ru:'<b>{name}</b>', pt:'por <b>{name}</b>', fr:'par <b>{name}</b>', vi:'bởi <b>{name}</b>' },
    panel_accept_btn:     { es:'Aceptar', en:'Accept', ru:'Принять', pt:'Aceitar', fr:'Accepter', vi:'Chấp nhận' },
    panel_reject_btn:     { es:'Rechazar', en:'Reject', ru:'Отклонить', pt:'Rejeitar', fr:'Rejeter', vi:'Từ chối' },
    panel_accept_claim_btn: { es:'+ Aceptar y añadir al lista', en:'+ Accept and add to list', ru:'+ Принять и добавить в список', pt:'+ Aceitar e adicionar à lista', fr:'+ Accepter et ajouter à la liste', vi:'+ Chấp nhận và thêm vào danh sách' },
    panel_only_staff_btn: { es:'Solo Staff', en:'Staff Only', ru:'Только персонал', pt:'Só Staff', fr:'Staff uniquement', vi:'Chỉ Staff' },
    panel_p1_mobile:      { es:'P1 móvil', en:'P1 mobile', ru:'P1 мобильный', pt:'P1 celular', fr:'P1 mobile', vi:'P1 di động' },
    panel_p2_mobile:      { es:'P2 móvil', en:'P2 mobile', ru:'P2 мобильный', pt:'P2 celular', fr:'P2 mobile', vi:'P2 di động' },
    panel_2p:             { es:'2 Players', en:'2 Players', ru:'2 игрока', pt:'2 Jogadores', fr:'2 joueurs', vi:'2 người chơi' },
    panel_new_level_tag:  { es:'🆕 NUEVO NIVEL RECLAMADO', en:'🆕 NEW CLAIMED LEVEL', ru:'🆕 НОВЫЙ ЗАЯВЛЕННЫЙ УРОВЕНЬ', pt:'🆕 NOVO NÍVEL RECLAMADO', fr:'🆕 NOUVEAU NIVEAU REVENDIQUÉ', vi:'🆕 MÀN CHƠI MỚI ĐƯỢC YÊU CẦU' },
    panel_level_deleted:  { es:'⚠️ Nivel eliminado de la lista', en:'⚠️ Level removed from the list', ru:'⚠️ Уровень удалён из списка', pt:'⚠️ Nível removido da lista', fr:'⚠️ Niveau supprimé de la liste', vi:'⚠️ Màn chơi đã bị xóa khỏi danh sách' },
    panel_id_declared:    { es:'ID declarado:', en:'Declared ID:', ru:'Заявленный ID:', pt:'ID declarado:', fr:'ID déclaré :', vi:'ID đã khai:' },
    panel_recalc_reading: { es:'Leyendo niveles...', en:'Reading levels...', ru:'Чтение уровней...', pt:'Lendo níveis...', fr:'Lecture des niveaux...', vi:'Đang đọc màn chơi...' },
    panel_recalc_found:   { es:'{n} niveles encontrados. Calculando...', en:'{n} levels found. Calculating...', ru:'Найдено уровней: {n}. Вычисление...', pt:'{n} níveis encontrados. Calculando...', fr:'{n} niveaux trouvés. Calcul en cours...', vi:'Tìm thấy {n} màn chơi. Đang tính...' },
    panel_recalc_nochange:{ es:'Todos los niveles ya tienen los puntos correctos.', en:'All levels already have correct points.', ru:'Все уровни уже имеют правильные очки.', pt:'Todos os níveis já têm os pontos corretos.', fr:'Tous les niveaux ont déjà les bons points.', vi:'Tất cả màn chơi đã có điểm chính xác.' },
    panel_recalc_updating:{ es:'Actualizando {done} de {total} niveles...', en:'Updating {done} of {total} levels...', ru:'Обновление {done} из {total} уровней...', pt:'Atualizando {done} de {total} níveis...', fr:'Mise à jour de {done} sur {total} niveaux...', vi:'Đang cập nhật {done} trong {total} màn...' },
    panel_recalc_done:    { es:'✔ Listo: {n} niveles actualizados.', en:'✔ Done: {n} levels updated.', ru:'✔ Готово: обновлено уровней: {n}.', pt:'✔ Pronto: {n} níveis atualizados.', fr:'✔ Terminé : {n} niveaux mis à jour.', vi:'✔ Xong: {n} màn đã cập nhật.' },
    panel_pts_preview:    { es:'Puntos automáticos: {pts} (posición #{pos})', en:'Automatic points: {pts} (position #{pos})', ru:'Автоматические очки: {pts} (позиция #{pos})', pt:'Pontos automáticos: {pts} (posição #{pos})', fr:'Points automatiques : {pts} (position #{pos})', vi:'Điểm tự động: {pts} (vị trí #{pos})' },
    panel_toast_first_claim: { es:'⚠️ PRIMERO DEBES RECLAMAR LA REVISIÓN DEL RECORD.', en:'⚠️ YOU MUST FIRST CLAIM THE RECORD REVIEW.', ru:'⚠️ СНАЧАЛА НЕОБХОДИМО ЗАЯВИТЬ ПРОВЕРКУ РЕКОРДА.', pt:'⚠️ PRIMEIRO VOCÊ DEVE REIVINDICAR A REVISÃO DO RECORD.', fr:'⚠️ VOUS DEVEZ D\'ABORD REVENDIQUER LA RÉVISION DU RECORD.', vi:'⚠️ BẠN PHẢI NHẬN QUYỀN XEM XÉT RECORD TRƯỚC.' },
    panel_toast_claimed_by: { es:'❌ La revisión de este record está a cargo de: {name}', en:'❌ This record\'s review is assigned to: {name}', ru:'❌ Проверка этого рекорда поручена: {name}', pt:'❌ A revisão deste record está a cargo de: {name}', fr:'❌ La révision de ce record est attribuée à : {name}', vi:'❌ Việc xem xét record này được giao cho: {name}' },
    panel_toast_claimed_ok: { es:'Revisión reclamada. Otros staff verán que estás revisándolo.', en:'Review claimed. Other staff will see you are reviewing it.', ru:'Проверка заявлена. Другой персонал увидит, что вы её проверяете.', pt:'Revisão reivindicada. Outros staff verão que você está revisando.', fr:'Révision revendiquée. Les autres membres du staff verront que vous l\'examinez.', vi:'Đã nhận xem xét. Staff khác sẽ thấy bạn đang xem xét nó.' },
    panel_toast_released:   { es:'Reclamación quitada. Cualquier staff puede revisarlo.', en:'Claim released. Any staff can review it.', ru:'Заявка снята. Любой персонал может проверить.', pt:'Reivindicação liberada. Qualquer staff pode revisá-lo.', fr:'Réclamation libérée. Tout membre du staff peut l\'examiner.', vi:'Đã hủy yêu cầu. Bất kỳ staff nào cũng có thể xem xét.' },
    panel_only_staff_toast: { es:'Solo el staff puede reclamar revisiones.', en:'Only staff can claim reviews.', ru:'Только персонал может заявлять проверки.', pt:'Apenas o staff pode reivindicar revisões.', fr:'Seul le staff peut revendiquer des révisions.', vi:'Chỉ staff mới có thể nhận xem xét.' },
    panel_claim_max3:       { es:'❌ Ya tienes 3 revisiones reclamadas. Suelta una desde tu Panel de Reclamos antes de reclamar otra.', en:'❌ You already have 3 claimed reviews. Release one from your Claims Panel before claiming another.', ru:'❌ У вас уже 3 заявленные проверки. Снимите одну в Панели заявок перед новой.', pt:'❌ Você já tem 3 revisões reivindicadas. Libere uma no seu Painel de Reclamos antes de reivindicar outra.', fr:'❌ Vous avez déjà 3 révisions revendiquées. Libérez-en une dans votre panneau avant d\'en revendiquer une autre.', vi:'❌ Bạn đã có 3 yêu cầu xem xét. Hãy hủy một yêu cầu trước khi nhận yêu cầu mới.' },
    panel_add_only_staff:   { es:'Solo el staff puede añadir niveles nuevos.', en:'Only staff can add new levels.', ru:'Только персонал может добавлять новые уровни.', pt:'Apenas o staff pode adicionar novos níveis.', fr:'Seul le staff peut ajouter de nouveaux niveaux.', vi:'Chỉ staff mới có thể thêm màn chơi mới.' },
    panel_need_name_author: { es:'Nombre y autor son obligatorios.', en:'Name and author are required.', ru:'Название и автор обязательны.', pt:'Nome e autor são obrigatórios.', fr:'Le nom et l\'auteur sont obligatoires.', vi:'Tên và tác giả là bắt buộc.' },
    panel_need_position:    { es:'Indica la posición del nivel (≥ 1).', en:'Provide the level\'s position (≥ 1).', ru:'Укажите позицию уровня (≥ 1).', pt:'Indique a posição do nível (≥ 1).', fr:'Indiquez la position du niveau (≥ 1).', vi:'Cung cấp vị trí của màn chơi (≥ 1).' },
    panel_enter_cid:        { es:'Ingresa la ID custom.', en:'Enter the custom ID.', ru:'Введите пользовательский ID.', pt:'Insira a ID custom.', fr:'Saisissez l\'ID personnalisée.', vi:'Nhập ID tùy chỉnh.' },
    panel_minpct_locked:    { es:'% mínimo bloqueado para niveles fuera del Top 50.', en:'Minimum % locked for levels outside Top 50.', ru:'Минимальный % заблокирован для уровней за пределами Top 50.', pt:'% mínimo bloqueado para níveis fora do Top 50.', fr:'% minimum verrouillé pour les niveaux hors Top 50.', vi:'% tối thiểu bị khóa cho các màn chơi ngoài Top 50.' },

    /* ─ Admin Dev ─ */
    admin_login_req:   { es:'Debes iniciar sesión para acceder.', en:'You must sign in to access.', ru:'Вы должны войти для доступа.', pt:'Você deve fazer login para acessar.', fr:'Vous devez vous connecter pour accéder.', vi:'Bạn phải đăng nhập để truy cập.' },
    admin_restricted:  { es:'Acceso restringido. Solo Admins y Owners pueden ver esta página.', en:'Restricted access. Only Admins and Owners can view this page.', ru:'Ограниченный доступ. Только администраторы и владельцы могут просматривать эту страницу.', pt:'Acesso restrito. Apenas Admins e Owners podem ver esta página.', fr:'Accès restreint. Seuls les Admins et Owners peuvent voir cette page.', vi:'Truy cập bị hạn chế. Chỉ Admins và Owners mới có thể xem trang này.' },
    admin_no_banners:  { es:'Sin banners aún. ¡Añade el primero!', en:'No banners yet. Add the first one!', ru:'Баннеров пока нет. Добавьте первый!', pt:'Sem banners ainda. Adicione o primeiro!', fr:'Aucune bannière encore. Ajoutez la première !', vi:'Chưa có banners. Thêm cái đầu tiên!' },
    admin_no_badges:   { es:'Sin insignias aún. ¡Añade la primera!', en:'No badges yet. Add the first one!', ru:'Значков пока нет. Добавьте первый!', pt:'Sem insignias ainda. Adicione a primeira!', fr:'Aucun insigne encore. Ajoutez le premier !', vi:'Chưa có huy hiệu. Thêm cái đầu tiên!' },
    admin_banner_add_title: { es:'Añadir Banner', en:'Add Banner', ru:'Добавить баннер', pt:'Adicionar Banner', fr:'Ajouter une bannière', vi:'Thêm Banner' },
    admin_banner_edit_title:{ es:'Editar Banner', en:'Edit Banner', ru:'Редактировать баннер', pt:'Editar Banner', fr:'Modifier la bannière', vi:'Chỉnh sửa Banner' },
    admin_badge_add_title:  { es:'Añadir Insignia', en:'Add Badge', ru:'Добавить значок', pt:'Adicionar Insignia', fr:'Ajouter un insigne', vi:'Thêm Huy hiệu' },
    admin_badge_edit_title: { es:'Editar Insignia', en:'Edit Badge', ru:'Редактировать значок', pt:'Editar Insignia', fr:'Modifier l\'insigne', vi:'Chỉnh sửa Huy hiệu' },
    admin_saving:      { es:'Guardando…', en:'Saving…', ru:'Сохранение…', pt:'Salvando…', fr:'Sauvegarde…', vi:'Đang lưu…' },
    admin_r_common:    { es:'Común', en:'Common', ru:'Обычный', pt:'Comum', fr:'Commun', vi:'Thường' },
    admin_r_rare:      { es:'Raro', en:'Rare', ru:'Редкий', pt:'Raro', fr:'Rare', vi:'Hiếm' },
    admin_r_epic:      { es:'Épico', en:'Epic', ru:'Эпический', pt:'Épico', fr:'Épique', vi:'Sử thi' },
    admin_r_legendary: { es:'Legendario', en:'Legendary', ru:'Легендарный', pt:'Lendário', fr:'Légendaire', vi:'Huyền thoại' },
    admin_r_mythic:    { es:'Mítico', en:'Mythic', ru:'Мифический', pt:'Mítico', fr:'Mythique', vi:'Huyền bí' },
    admin_r_exclusive: { es:'Exclusivo', en:'Exclusive', ru:'Эксклюзивный', pt:'Exclusivo', fr:'Exclusif', vi:'Độc quyền' },
    admin_ft_solid:    { es:'Sólido', en:'Solid', ru:'Сплошной', pt:'Sólido', fr:'Solide', vi:'Đặc' },
    admin_ft_gradient: { es:'Gradiente', en:'Gradient', ru:'Градиент', pt:'Gradiente', fr:'Dégradé', vi:'Gradient' },
    admin_ft_chroma:   { es:'Chroma (arcoíris)', en:'Chroma (rainbow)', ru:'Хрома (радуга)', pt:'Chroma (arco-íris)', fr:'Chroma (arc-en-ciel)', vi:'Chroma (cầu vồng)' },
    admin_ot_manual:   { es:'Manual (admin lo da)', en:'Manual (admin gives)', ru:'Вручную (выдаёт admin)', pt:'Manual (admin concede)', fr:'Manuel (l\'admin le donne)', vi:'Thủ công (admin tặng)' },
    admin_ot_completion:{ es:'Completar niveles', en:'Complete levels', ru:'Пройти уровни', pt:'Completar níveis', fr:'Compléter des niveaux', vi:'Hoàn thành màn chơi' },
    admin_ot_entry:    { es:'Recompensa por Entrada', en:'Entry Reward', ru:'Награда за вход', pt:'Recompensa por Entrada', fr:'Récompense d\'entrée', vi:'Phần thưởng tham gia' },
    admin_ot_annual:   { es:'Recompensa Anual', en:'Annual Reward', ru:'Годовая награда', pt:'Recompensa Anual', fr:'Récompense annuelle', vi:'Phần thưởng hàng năm' },
    admin_ot_booster:  { es:'Server Booster', en:'Server Booster', ru:'Server Booster', pt:'Server Booster', fr:'Boosteur de serveur', vi:'Server Booster' },
    admin_ot_event:    { es:'Evento', en:'Event', ru:'Событие', pt:'Evento', fr:'Événement', vi:'Sự kiện' },
    admin_ot_staff:    { es:'Staff', en:'Staff', ru:'Персонал', pt:'Staff', fr:'Staff', vi:'Staff' },
    admin_ot_leaderboard: { es:'Leaderboard (posición)', en:'Leaderboard (position)', ru:'Таблица лидеров (позиция)', pt:'Leaderboard (posição)', fr:'Classement (position)', vi:'Bảng xếp hạng (vị trí)' },
    admin_name_required: { es:'El nombre es obligatorio.', en:'Name is required.', ru:'Название обязательно.', pt:'O nome é obrigatório.', fr:'Le nom est obligatoire.', vi:'Tên là bắt buộc.' },
    admin_err_save:    { es:'Error al guardar: {msg}', en:'Error saving: {msg}', ru:'Ошибка сохранения: {msg}', pt:'Erro ao salvar: {msg}', fr:'Erreur de sauvegarde : {msg}', vi:'Lỗi khi lưu: {msg}' },
    admin_confirm_del_badge:  { es:'¿Eliminar esta insignia? Esta acción no se puede deshacer.', en:'Delete this badge? This action cannot be undone.', ru:'Удалить этот значок? Это действие нельзя отменить.', pt:'Excluir esta insignia? Esta ação não pode ser desfeita.', fr:'Supprimer cet insigne ? Cette action est irréversible.', vi:'Xóa huy hiệu này? Hành động này không thể hoàn tác.' },
    admin_confirm_del_banner: { es:'¿Eliminar este banner? Esta acción no se puede deshacer.', en:'Delete this banner? This action cannot be undone.', ru:'Удалить этот баннер? Это действие нельзя отменить.', pt:'Excluir este banner? Esta ação não pode ser desfeita.', fr:'Supprimer cette bannière ? Cette action est irréversible.', vi:'Xóa banner này? Hành động này không thể hoàn tác.' },
    admin_err_delete:  { es:'Error al eliminar: {msg}', en:'Error deleting: {msg}', ru:'Ошибка удаления: {msg}', pt:'Erro ao excluir: {msg}', fr:'Erreur de suppression : {msg}', vi:'Lỗi khi xóa: {msg}' },

    /* ─ Country Profile ─ */
    cp_no_players:    { es:'Ningún jugador registrado de {country}', en:'No registered players from {country}', ru:'Нет зарегистрированных игроков из {country}', pt:'Nenhum jogador registrado de {country}', fr:'Aucun joueur enregistré de {country}', vi:'Không có người chơi đã đăng ký từ {country}' },
    cp_err_load:      { es:'Error al cargar: {msg}', en:'Error loading: {msg}', ru:'Ошибка загрузки: {msg}', pt:'Erro ao carregar: {msg}', fr:'Erreur de chargement : {msg}', vi:'Lỗi tải: {msg}' },
    cp_players_lbl:   { es:'Jugadores', en:'Players', ru:'Игроки', pt:'Jogadores', fr:'Joueurs', vi:'Người chơi' },
    cp_total_pts_lbl: { es:'Puntos totales', en:'Total points', ru:'Всего очков', pt:'Pontos totais', fr:'Points totaux', vi:'Tổng điểm' },
    cp_completes_lbl: { es:'Completes', en:'Completes', ru:'Прохождения', pt:'Completes', fr:'Complétions', vi:'Hoàn thành' },
    cp_fv_count:      { es:'First Victor — {n} nivel{s}', en:'First Victor — {n} level{s}', ru:'First Victor — {n} уровн{s}', pt:'First Victor — {n} nível{s}', fr:'First Victor — {n} niveau{s}', vi:'First Victor — {n} màn{s}' },
    cp_back:          { es:'← Volver a Leaderboards', en:'← Back to Leaderboards', ru:'← К таблице лидеров', pt:'← Voltar aos Rankings', fr:'← Retour aux Classements', vi:'← Quay lại Bảng xếp hạng' },
    cp_loading:       { es:'Cargando...', en:'Loading...', ru:'Загрузка...', pt:'Carregando...', fr:'Chargement...', vi:'Đang tải...' },
    cp_top_players:   { es:'Top Jugadores', en:'Top Players', ru:'Топ игроков', pt:'Top Jogadores', fr:'Meilleurs Joueurs', vi:'Top Người chơi' },
    cp_fv_col_num:    { es:'#', en:'#', ru:'#', pt:'#', fr:'#', vi:'#' },
    cp_fv_col_level:  { es:'Nivel', en:'Level', ru:'Уровень', pt:'Nível', fr:'Niveau', vi:'Màn' },
    cp_fv_col_player: { es:'Jugador', en:'Player', ru:'Игрок', pt:'Jogador', fr:'Joueur', vi:'Người chơi' },
    cp_fv_col_date:   { es:'Fecha', en:'Date', ru:'Дата', pt:'Data', fr:'Date', vi:'Ngày' },
  };

  /* ── Mapa href → clave de traducción (para nav automático) ─── */
  const NAV_HREF_MAP = {
    '/':                   'nav_home',
    '/demonlist.html':     'nav_demonlist',
    '/pemonlist.html':     'nav_pemonlist',
    '/submit.html?list=pemon': 'nav_submit_pemon',
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
