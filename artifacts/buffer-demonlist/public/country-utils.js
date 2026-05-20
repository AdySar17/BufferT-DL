/* country-utils.js — ISO 3166-1 alpha-2 → nombre en español + helpers de bandera */

export const COUNTRY_NAMES = {
  'ad':'Andorra','ae':'Emiratos Árabes Unidos','af':'Afganistán','ag':'Antigua y Barbuda',
  'al':'Albania','am':'Armenia','ao':'Angola','ar':'Argentina','at':'Austria',
  'au':'Australia','az':'Azerbaiyán','ba':'Bosnia y Herzegovina','bb':'Barbados',
  'bd':'Bangladesh','be':'Bélgica','bf':'Burkina Faso','bg':'Bulgaria','bh':'Baréin',
  'bi':'Burundi','bj':'Benín','bn':'Brunéi','bo':'Bolivia','br':'Brasil',
  'bs':'Bahamas','bt':'Bután','bw':'Botsuana','by':'Bielorrusia','bz':'Belice',
  'ca':'Canadá','cd':'Rep. Dem. del Congo','cf':'Rep. Centroafricana','cg':'Congo',
  'ch':'Suiza','ci':'Costa de Marfil','cl':'Chile','cm':'Camerún','cn':'China',
  'co':'Colombia','cr':'Costa Rica','cu':'Cuba','cv':'Cabo Verde','cy':'Chipre',
  'cz':'República Checa','de':'Alemania','dj':'Yibuti','dk':'Dinamarca',
  'dm':'Dominica','do':'Rep. Dominicana','dz':'Argelia','ec':'Ecuador','ee':'Estonia',
  'eg':'Egipto','er':'Eritrea','es':'España','et':'Etiopía','fi':'Finlandia',
  'fj':'Fiyi','fm':'Micronesia','fr':'Francia','ga':'Gabón','gb':'Reino Unido',
  'gd':'Granada','ge':'Georgia','gh':'Ghana','gm':'Gambia','gn':'Guinea',
  'gq':'Guinea Ecuatorial','gr':'Grecia','gt':'Guatemala','gw':'Guinea-Bisáu',
  'gy':'Guyana','hn':'Honduras','hr':'Croacia','ht':'Haití','hu':'Hungría',
  'id':'Indonesia','ie':'Irlanda','il':'Israel','in':'India','iq':'Irak',
  'ir':'Irán','is':'Islandia','it':'Italia','jm':'Jamaica','jo':'Jordania',
  'jp':'Japón','ke':'Kenia','kg':'Kirguistán','kh':'Camboya','ki':'Kiribati',
  'km':'Comoras','kn':'San Cristóbal y Nieves','kp':'Corea del Norte',
  'kr':'Corea del Sur','kw':'Kuwait','kz':'Kazajistán','la':'Laos','lb':'Líbano',
  'lc':'Santa Lucía','li':'Liechtenstein','lk':'Sri Lanka','lr':'Liberia',
  'ls':'Lesoto','lt':'Lituania','lu':'Luxemburgo','lv':'Letonia','ly':'Libia',
  'ma':'Marruecos','mc':'Mónaco','md':'Moldavia','me':'Montenegro',
  'mg':'Madagascar','mh':'Islas Marshall','mk':'Macedonia del Norte','ml':'Malí',
  'mm':'Myanmar','mn':'Mongolia','mr':'Mauritania','mt':'Malta','mu':'Mauricio',
  'mv':'Maldivas','mw':'Malaui','mx':'México','my':'Malasia','mz':'Mozambique',
  'na':'Namibia','ne':'Níger','ng':'Nigeria','ni':'Nicaragua','nl':'Países Bajos',
  'no':'Noruega','np':'Nepal','nr':'Nauru','nz':'Nueva Zelanda','om':'Omán',
  'pa':'Panamá','pe':'Perú','pg':'Papúa Nueva Guinea','ph':'Filipinas',
  'pk':'Pakistán','pl':'Polonia','pt':'Portugal','pw':'Palaos','py':'Paraguay',
  'qa':'Catar','ro':'Rumanía','rs':'Serbia','ru':'Rusia','rw':'Ruanda',
  'sa':'Arabia Saudí','sb':'Islas Salomón','sc':'Seychelles','sd':'Sudán',
  'se':'Suecia','sg':'Singapur','si':'Eslovenia','sk':'Eslovaquia',
  'sl':'Sierra Leona','sm':'San Marino','sn':'Senegal','so':'Somalia',
  'sr':'Surinam','ss':'Sudán del Sur','st':'Santo Tomé y Príncipe',
  'sv':'El Salvador','sy':'Siria','sz':'Esuatini','td':'Chad','tg':'Togo',
  'th':'Tailandia','tj':'Tayikistán','tl':'Timor Oriental','tm':'Turkmenistán',
  'tn':'Túnez','to':'Tonga','tr':'Turquía','tt':'Trinidad y Tobago','tv':'Tuvalu',
  'tz':'Tanzania','ua':'Ucrania','ug':'Uganda','us':'Estados Unidos','uy':'Uruguay',
  'uz':'Uzbekistán','vc':'San Vicente y las Granadinas','ve':'Venezuela',
  'vn':'Vietnam','vu':'Vanuatu','ws':'Samoa','xk':'Kosovo','ye':'Yemen',
  'za':'Sudáfrica','zm':'Zambia','zw':'Zimbabue'
};

export function flagUrl(code) {
  if (!code) return "";
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

export function countryName(code) {
  if (!code) return "";
  return COUNTRY_NAMES[code.toLowerCase()] || code.toUpperCase();
}

/* Lista ordenada alfabéticamente en español para selects */
export const COUNTRY_LIST = Object.entries(COUNTRY_NAMES)
  .sort((a, b) => a[1].localeCompare(b[1], 'es'));
