// ═══════════════════════════════════════════════════════════════════════════
// 🇵🇹 PORTUGAL TRAVEL DATA v4 - searchName 필드 추가
// 리스본 26개 맛집 추가 + DAY 2/3 동선 업데이트
// ═══════════════════════════════════════════════════════════════════════════

const APP_CONFIG = {
  country: "Portugal",
  countryKo: "포르투갈",
  flag: "🇵🇹",
  title: "Portugal 2026",
  dates: "May 1–10",
  duration: "9박10일",
  year: 2026,
  tripStart: "2026-05-01",
  tripEnd: "2026-05-10",
  totalDays: 10,
  currency: "€",
  currencyName: "EUR",
  themeColor: "#1a0a00",
  accentColor: "#e8a84a",
  aiContext: "포르투갈 리스본, 신트라, 포르투 등을 여행하는 9박10일 일정"
};

const TYPE_LABELS = {
  cafe: '☕ 카페', dessert: '🍰 디저트', seafood: '🦐 해산물',
  restaurant: '🍽️ 음식점', budget: '💰 가성비', landmark: '🏛️ 랜드마크',
  church: '⛪ 성당', viewpoint: '🌅 전망대', square: '📍 광장/거리', transport: '🚠 교통'
};

const FOOD_TYPES = ['cafe', 'dessert', 'seafood', 'restaurant', 'budget'];
const LANDMARK_TYPES = ['landmark', 'church', 'viewpoint', 'square', 'transport'];

const PLACES = [
  {
    "name": "피게이라 광장",
    "searchName": "Praça da Figueira Lisboa",
    "rating": 4.5,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça da Figueira, 1100-241 Lisboa",
    "description": "바이샤 지구 중심 광장. 트램 15E 출발점",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "호시우 광장",
    "searchName": "Praça Dom Pedro IV Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça Dom Pedro IV, 1100-026 Lisboa",
    "description": "리스본 중심 광장. 물결무늬 바닥이 유명 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "통조림 가게 (Fantastic World)",
    "searchName": "Fantastic World of Portuguese Sardines Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "10:00–20:00",
    "type": "landmark",
    "address": "R. dos Bacalhoeiros 34, 1100-071 Lisboa",
    "description": "포르투갈 정어리 통조림 전문점. 기념품으로 인기",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "상 로케 성당",
    "searchName": "Igreja de São Roque Lisboa",
    "rating": 4.5,
    "price": "무료",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "Largo Trindade Coelho, 1200-470 Lisboa",
    "description": "16세기 예수회 성당. 화려한 바로크 내부",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "글로리아 푸니쿨라",
    "searchName": "Ascensor da Glória Lisboa",
    "rating": 4.4,
    "price": "€3.8",
    "hours": "07:15–23:55",
    "type": "transport",
    "address": "Calçada da Glória, 1250-105 Lisboa",
    "description": "바이샤↔바이루알투 연결. 1885년 개통 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "상 페드로 전망대",
    "searchName": "Miradouro de São Pedro de Alcântara Lisboa",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "R. de São Pedro de Alcântara, 1250-238 Lisboa",
    "description": "바이루알투 최고 전망대. 상 조르즈 성 뷰 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "산타 카타리나 전망대",
    "searchName": "Miradouro de Santa Catarina Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "07:30–23:30",
    "type": "viewpoint",
    "address": "R. de Santa Catarina, 1200-012 Lisboa",
    "description": "아다마스토르 동상. 테주강+4월25일 다리 뷰 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "카르모 수녀원",
    "searchName": "Convento do Carmo Lisboa",
    "rating": 4.6,
    "price": "€5",
    "hours": "10:00–19:00",
    "type": "church",
    "address": "Largo do Carmo, 1200-092 Lisboa",
    "description": "1755년 대지진으로 무너진 고딕 성당. 지붕 없는 유적 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "산타 후스타 엘리베이터",
    "searchName": "Elevador de Santa Justa Lisboa",
    "rating": 4.3,
    "price": "€5.3",
    "hours": "07:00–23:00",
    "type": "transport",
    "address": "R. do Ouro, 1150-060 Lisboa",
    "description": "에펠 제자 작품. 45m 높이 철제 엘리베이터 ⭐",
    "days": [
      "DAY 2",
      "DAY 3"
    ]
  },
  {
    "name": "아우구스타 거리",
    "searchName": "Rua Augusta Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. Augusta, 1100-053 Lisboa",
    "description": "리스본 최대 보행자 쇼핑거리. 거리 공연",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "아우구스타 개선문",
    "searchName": "Arco da Rua Augusta Lisboa",
    "rating": 4.6,
    "price": "€3",
    "hours": "09:00–20:00",
    "type": "viewpoint",
    "address": "R. Augusta 2, 1100-053 Lisboa",
    "description": "코메르시우 광장 입구. 전망대에서 바이샤 뷰 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "코메르시우 광장",
    "searchName": "Praça do Comércio Lisboa",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça do Comércio, 1100-148 Lisboa",
    "description": "테주강변 대형 광장. 주제 1세 기마상 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "리스본 시청",
    "searchName": "Câmara Municipal de Lisboa",
    "rating": 4.3,
    "price": "무료",
    "hours": "외관만",
    "type": "landmark",
    "address": "Praça do Município, 1100-038 Lisboa",
    "description": "코메르시우 광장 옆 시청 건물",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "리스본 대성당",
    "searchName": "Sé de Lisboa Cathedral",
    "rating": 4.5,
    "price": "무료",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "Largo da Sé, 1100-585 Lisboa",
    "description": "12세기 로마네스크 성당. 리스본 최고(最古) 성당 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "상 조르즈 성",
    "searchName": "Castelo de São Jorge Lisboa",
    "rating": 4.5,
    "price": "€15",
    "hours": "09:00–21:00",
    "type": "viewpoint",
    "address": "R. de Santa Cruz do Castelo, 1100-129 Lisboa",
    "description": "무어인 요새. 리스본 최고 일몰 스팟 ⭐⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "포르타스 두 솔 전망대",
    "searchName": "Miradouro das Portas do Sol Lisboa",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Largo Portas do Sol, 1100-411 Lisboa",
    "description": "알파마 최고 전망대. 테주강+붉은 지붕 뷰",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "벨렝 산타 마리아 성당",
    "searchName": "Igreja Santa Maria de Belém Lisboa",
    "rating": 4.5,
    "price": "무료",
    "hours": "10:00–18:00",
    "type": "church",
    "address": "Praça do Império, 1400-206 Lisboa",
    "description": "제로니무스 수도원 내 성당. 바스코 다 가마 묘소",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "제로니무스 수도원",
    "searchName": "Mosteiro dos Jerónimos Lisboa",
    "rating": 4.6,
    "price": "€10",
    "hours": "10:00–18:30",
    "type": "landmark",
    "address": "Praça do Império, 1400-206 Lisboa",
    "description": "유네스코 세계유산. 마누엘 양식 걸작 ⭐⭐",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "국립 해양 박물관",
    "searchName": "Museu de Marinha Lisboa",
    "rating": 4.4,
    "price": "€6.5",
    "hours": "10:00–18:00",
    "type": "landmark",
    "address": "Praça do Império, 1400-206 Lisboa",
    "description": "대항해시대 유물. 배 모형 컬렉션",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "발견기념비",
    "searchName": "Padrão dos Descobrimentos Lisboa",
    "rating": 4.5,
    "price": "€10",
    "hours": "10:00–19:00",
    "type": "landmark",
    "address": "Av. Brasília, 1400-038 Lisboa",
    "description": "엔히크 왕자 500주기 기념. 52m 높이 전망대 ⭐",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "벨렝탑",
    "searchName": "Torre de Belém Lisboa",
    "rating": 4.4,
    "price": "€8",
    "hours": "10:00–18:30",
    "type": "landmark",
    "address": "Av. Brasília, 1400-038 Lisboa",
    "description": "유네스코 세계유산. 테주강 요새 ⭐⭐",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "LX Factory",
    "searchName": "LX Factory Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "06:00–02:00",
    "type": "landmark",
    "address": "R. Rodrigues de Faria 103, 1300-501 Lisboa",
    "description": "힙한 복합문화공간. Ler Devagar 서점 ⭐",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "상벤투 역",
    "searchName": "São Bento Railway Station Porto",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Praça de Almeida Garrett, 4000-069 Porto",
    "description": "2만 개의 아줄레주 타일 벽화 ⭐",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "클레리구스 성당/탑",
    "searchName": "Torre dos Clérigos Porto",
    "rating": 4.6,
    "price": "€8",
    "hours": "09:00–19:00",
    "type": "landmark",
    "address": "R. de São Filipe de Nery, 4050-546 Porto",
    "description": "360도 시내 전경 (225계단) ⭐",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "렐루서점",
    "searchName": "Livraria Lello Porto",
    "rating": 4,
    "price": "€5",
    "hours": "09:30–19:00",
    "type": "landmark",
    "address": "R. das Carmelitas 144, 4050-161 Porto",
    "description": "세계에서 가장 아름다운 서점 ⭐",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "동 루이스 다리",
    "searchName": "Ponte Dom Luís I Porto",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Ponte Luís I, Porto",
    "description": "에펠탑 제자의 철교 ⭐",
    "days": [
      "DAY 7",
      "DAY 8"
    ]
  },
  {
    "name": "볼사궁전",
    "searchName": "Palácio da Bolsa Porto",
    "rating": 4.6,
    "price": "€12",
    "hours": "09:00–18:30",
    "type": "landmark",
    "address": "R. de Ferreira Borges, 4050-253 Porto",
    "description": "화려한 아랍의 방",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "볼량시장",
    "searchName": "Mercado do Bolhão Porto",
    "rating": 4.5,
    "price": "무료",
    "hours": "08:00–20:00",
    "type": "landmark",
    "address": "R. Formosa 322, 4000-248 Porto",
    "description": "전통 시장",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "WOW Porto",
    "searchName": "WOW Porto World of Wine",
    "rating": 4.5,
    "price": "€20~",
    "hours": "10:00–19:00",
    "type": "landmark",
    "address": "Rua do Choupelo 39, 4400-088 Vila Nova de Gaia",
    "description": "와인/문화 복합 테마파크",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "알마스 성당",
    "searchName": "Capela das Almas Porto",
    "rating": 4.7,
    "price": "무료",
    "hours": "08:00–19:00",
    "type": "church",
    "address": "R. de Santa Catarina 428, 4000-124 Porto",
    "description": "1.5만 개 푸른 아줄레주 ⭐",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "카르무 성당",
    "searchName": "Igreja do Carmo Porto",
    "rating": 4.6,
    "price": "무료",
    "hours": "09:00–18:00",
    "type": "church",
    "address": "R. do Carmo, 4050-164 Porto",
    "description": "거대한 아줄레주 벽화",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "포르투 대성당",
    "searchName": "Sé do Porto Cathedral",
    "rating": 4.6,
    "price": "무료",
    "hours": "09:00–18:00",
    "type": "church",
    "address": "Terreiro da Sé, 4050-573 Porto",
    "description": "요새 모양의 대성당",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "상 프란시스쿠 교회",
    "searchName": "Igreja de São Francisco Porto",
    "rating": 4.5,
    "price": "€9",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "R. do Infante D. Henrique, 4050-297 Porto",
    "description": "황금 400kg 내부",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "모루 공원",
    "searchName": "Jardim do Morro Gaia Porto",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Av. da República, Vila Nova de Gaia",
    "description": "최고의 일몰/야경 스팟 ⭐",
    "days": [
      "DAY 7",
      "DAY 8"
    ]
  },
  {
    "name": "세하 두 필라르 전망대",
    "searchName": "Miradouro da Serra do Pilar Porto",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Largo de Aviz, 4430-329 Vila Nova de Gaia",
    "description": "최고의 야경 스팟 ⭐",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "수정궁 정원",
    "searchName": "Jardins do Palácio de Cristal Porto",
    "rating": 4.7,
    "price": "무료",
    "hours": "08:00–21:00",
    "type": "viewpoint",
    "address": "R. de Dom Manuel II, 4050-346 Porto",
    "description": "공작새, 일몰 명소 ⭐",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "비토리아 전망대",
    "searchName": "Miradouro da Vitória Porto",
    "rating": 4.4,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "R. de São Bento da Vitória, 4050-543 Porto",
    "description": "숨겨진 골목 뷰포인트",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "리베이라 광장",
    "searchName": "Praça da Ribeira Porto",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça da Ribeira, 4050-513 Porto",
    "description": "도루 강변 중심지 ⭐",
    "days": [
      "DAY 7",
      "DAY 8"
    ]
  },
  {
    "name": "산타 카타리나 거리",
    "searchName": "Rua Santa Catarina shopping street Porto Portugal",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. de Santa Catarina, Porto",
    "description": "쇼핑 및 버스킹 거리",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "플로레스 거리",
    "searchName": "Rua das Flores Porto",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. das Flores, 4050-262 Porto",
    "description": "낭만적인 카페 거리",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "Avenida dos Aliados",
    "searchName": "Avenida dos Aliados Porto",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Av. dos Aliados, 4000-064 Porto",
    "description": "포르투의 샹젤리제",
    "days": [
      "DAY 7"
    ]
  },
  {
    "name": "긴다이스 푸니쿨라",
    "searchName": "Funicular dos Guindais Porto",
    "rating": 4.3,
    "price": "€2.5",
    "hours": "08:00–22:00",
    "type": "transport",
    "address": "R. dos Guindais, 4000-270 Porto",
    "description": "강변↔바탈랴 언덕 열차",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "가이아 케이블카",
    "searchName": "Teleférico de Gaia Porto",
    "rating": 4.4,
    "price": "€6",
    "hours": "10:00–20:00",
    "type": "transport",
    "address": "R. de Rocha Leão, Vila Nova de Gaia",
    "description": "뷰 좋은 케이블카",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "도루강 유람선",
    "searchName": "Douro River Cruise Porto",
    "rating": 4.5,
    "price": "€15",
    "hours": "10:00–18:00",
    "type": "transport",
    "address": "Praça da Ribeira, Porto",
    "description": "6개 다리 크루즈 (50분)",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "페나궁전",
    "searchName": "Palácio da Pena Sintra",
    "rating": 4.7,
    "price": "€14",
    "hours": "09:30–18:30",
    "type": "landmark",
    "address": "Estrada da Pena, 2710-609 Sintra",
    "description": "동화 같은 알록달록 왕실 여름별궁. 유네스코 세계유산",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "페나궁전 정원",
    "searchName": "Parque da Pena Sintra",
    "rating": 4.6,
    "price": "€8",
    "hours": "09:30–18:30",
    "type": "landmark",
    "address": "Estrada da Pena, 2710-609 Sintra",
    "description": "세계 각국 식물과 호수가 있는 왕실 정원",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "무어성",
    "searchName": "Castelo dos Mouros Sintra",
    "rating": 4.5,
    "price": "€12",
    "hours": "09:30–18:30",
    "type": "landmark",
    "address": "Calçada dos Clérigos, 2710-405 Sintra",
    "description": "8세기 이슬람 요새. 성벽 위 파노라마 뷰",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "헤갈레이라 별장",
    "searchName": "Quinta da Regaleira Sintra",
    "rating": 4.8,
    "price": "€12",
    "hours": "09:30–20:00",
    "type": "landmark",
    "address": "R. Barbosa du Bocage 5, 2710-567 Sintra",
    "description": "9층 지하탑(단테 신곡 모티브), 비밀 동굴과 정원",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "신트라 왕궁",
    "searchName": "Palácio Nacional de Sintra",
    "rating": 4.5,
    "price": "€10",
    "hours": "09:30–18:00",
    "type": "landmark",
    "address": "Largo Rainha Dona Amélia, 2710-616 Sintra",
    "description": "15~19세기 왕실 여름별궁. 쌍둥이 굴뚝이 상징",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "까보다로카",
    "searchName": "Cabo da Roca Portugal",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Estrada do Cabo da Roca, 2705-001 Colares",
    "description": "유라시아 대륙 최서단! 절벽과 대서양 절경",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "후아 다스 파다리아스",
    "searchName": "Rua das Padarias Sintra",
    "rating": 4.4,
    "price": "무료",
    "hours": "상점별 상이",
    "type": "square",
    "address": "R. das Padarias, 2710-505 Sintra",
    "description": "신트라 구시가 쇼핑거리, 기념품샵",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "오비두스 성벽",
    "searchName": "Muralhas de Óbidos Portugal",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "2510-086 Óbidos",
    "description": "중세 성벽 위 산책. 마을 전체 조망",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "오비두스 구시가",
    "searchName": "Óbidos Old Town Portugal",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. Direita, 2510-070 Óbidos",
    "description": "하얀 집과 노란 테두리. 진자(체리술) 시음",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "산타 마리아 성당 (오비두스)",
    "searchName": "Igreja de Santa Maria Óbidos",
    "rating": 4.4,
    "price": "무료",
    "hours": "09:30–12:30, 14:30–17:00",
    "type": "church",
    "address": "Praça de Santa Maria, 2510-089 Óbidos",
    "description": "17세기 아줄레주 타일 장식",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "파티마 대성당",
    "searchName": "Santuário de Fátima Portugal",
    "rating": 4.8,
    "price": "무료",
    "hours": "07:30–21:00",
    "type": "church",
    "address": "Santuário de Fátima, 2495-402 Fátima",
    "description": "세계 3대 성모 발현지. 대형 광장과 바실리카",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "파티마 삼목상 예배당",
    "searchName": "Capelinha das Aparições Fátima",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "church",
    "address": "Cova da Iria, 2495-402 Fátima",
    "description": "1917년 성모 발현 장소. 순례자 필수 코스",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "그리스도 수도원 (토마르)",
    "searchName": "Convento de Cristo Tomar",
    "rating": 4.8,
    "price": "€6",
    "hours": "09:00–17:30",
    "type": "landmark",
    "address": "Convento de Cristo, 2300-000 Tomar",
    "description": "템플기사단 본거지. 마누엘 양식 창문. 유네스코",
    "days": [
      "DAY 5",
      "DAY 6"
    ]
  },
  {
    "name": "레푸블리카 광장 (토마르)",
    "searchName": "Praça da República Tomar",
    "rating": 4.4,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça da República, 2300-550 Tomar",
    "description": "토마르 중심. 17세기 성 주앙 바티스타 교회",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "나바옹 강변",
    "searchName": "Parque do Mouchão Tomar",
    "rating": 4.3,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Parque do Mouchão, 2300-000 Tomar",
    "description": "토마르 강변 공원. 물레방아와 산책로",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "산타크루스 수도원",
    "searchName": "Mosteiro de Santa Cruz Coimbra",
    "rating": 4.6,
    "price": "€3",
    "hours": "09:00–17:00",
    "type": "church",
    "address": "Praça 8 de Maio, 3000-300 Coimbra",
    "description": "1131년 건립. 아폰수 1세 묘소. 마누엘 양식 정면",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "코임브라 구 대성당",
    "searchName": "Sé Velha de Coimbra",
    "rating": 4.5,
    "price": "€2.5",
    "hours": "10:00–18:00",
    "type": "church",
    "address": "Largo da Sé Velha, 3000-383 Coimbra",
    "description": "12세기 로마네스크 양식. 성벽 같은 외관",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "코임브라 대학교",
    "searchName": "Universidade de Coimbra",
    "rating": 4.7,
    "price": "€13",
    "hours": "09:00–19:00",
    "type": "landmark",
    "address": "Paço das Escolas, 3004-531 Coimbra",
    "description": "1290년 설립. 유럽 최고(最古) 대학 중 하나. 유네스코",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "조아니나 도서관",
    "searchName": "Biblioteca Joanina Coimbra",
    "rating": 4.9,
    "price": "€13 (대학 통합)",
    "hours": "09:00–19:00",
    "type": "landmark",
    "address": "Universidade de Coimbra, 3004-531 Coimbra",
    "description": "세계 10대 아름다운 도서관. 금박 바로크, 해리포터 영감",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "상 미겔 예배당",
    "searchName": "Capela de São Miguel Coimbra",
    "rating": 4.5,
    "price": "€13 (대학 통합)",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "Universidade de Coimbra, 3004-531 Coimbra",
    "description": "마누엘 양식 타일 장식. 대학 내 예배당",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "시계탑 (염소탑)",
    "searchName": "Torre da Universidade Coimbra",
    "rating": 4.4,
    "price": "€13 (대학 통합)",
    "hours": "09:00–19:00",
    "type": "viewpoint",
    "address": "Universidade de Coimbra, 3004-531 Coimbra",
    "description": "코임브라 전경 파노라마. '염소' 별명 유래 재미있음",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "철의 문 (포르타 페레아)",
    "searchName": "Porta Férrea Coimbra",
    "rating": 4.3,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Universidade de Coimbra, 3004-531 Coimbra",
    "description": "구대학 정문. 1634년 건립",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "퀘브라 코스타스 계단",
    "searchName": "Escadas Quebra Costas Coimbra",
    "rating": 4.2,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. Quebra Costas, 3000-340 Coimbra",
    "description": "'등 브레이커' 별명. 가파른 언덕 계단",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "기마랑이스 성",
    "searchName": "Castelo de Guimarães Portugal",
    "rating": 4.6,
    "price": "€2",
    "hours": "10:00–18:00",
    "type": "landmark",
    "address": "R. Conde Dom Henrique, 4800-412 Guimarães",
    "description": "10세기 요새. 아폰수 엔히게스 탄생지. 포르투갈 건국의 땅",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "브라간사 공작 궁전",
    "searchName": "Paço dos Duques de Bragança Guimarães",
    "rating": 4.6,
    "price": "€5",
    "hours": "10:00–18:00",
    "type": "landmark",
    "address": "R. Conde Dom Henrique, 4800-412 Guimarães",
    "description": "15세기 궁전. 39개 굴뚝이 인상적",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "올리베이라 광장",
    "searchName": "Largo da Oliveira Guimarães",
    "rating": 4.5,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Largo da Oliveira, 4800-438 Guimarães",
    "description": "'Aqui Nasceu Portugal' 문구. 구시가 중심",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "올리베이라 성당",
    "searchName": "Igreja de Nossa Senhora da Oliveira Guimarães",
    "rating": 4.4,
    "price": "무료",
    "hours": "09:30–12:00, 15:00–17:00",
    "type": "church",
    "address": "Largo da Oliveira, 4800-438 Guimarães",
    "description": "14세기 고딕 양식. 올리브 나무 전설",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "산티아고 광장",
    "searchName": "Praça de Santiago Guimarães",
    "rating": 4.5,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça de Santiago, 4800-432 Guimarães",
    "description": "중세 분위기 광장. 노천 카페",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "브라가 대성당",
    "searchName": "Sé de Braga Cathedral",
    "rating": 4.6,
    "price": "€3",
    "hours": "09:00–18:30",
    "type": "church",
    "address": "R. Dom Paio Mendes, 4700-424 Braga",
    "description": "포르투갈 최고(最古) 대성당. 11세기 건립",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "레푸블리카 광장 (브라가)",
    "searchName": "Praça da República Braga",
    "rating": 4.4,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça da República, 4710-306 Braga",
    "description": "브라가 중심. 아케이드와 분수대",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "봉 제수스 두 몬치",
    "searchName": "Bom Jesus do Monte Braga",
    "rating": 4.8,
    "price": "무료",
    "hours": "08:00–19:00",
    "type": "church",
    "address": "Estrada do Bom Jesus, 4715-056 Braga",
    "description": "바로크 계단 116m. 지그재그 계단이 장관",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "봉 제수스 푸니쿨라",
    "searchName": "Elevador do Bom Jesus Braga",
    "rating": 4.6,
    "price": "€2",
    "hours": "09:00–20:00",
    "type": "transport",
    "address": "Estrada do Bom Jesus, 4715-056 Braga",
    "description": "1882년 개통. 세계 최초 수력 푸니쿨라",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "봉 제수스 전망대",
    "searchName": "Miradouro Bom Jesus Braga",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Bom Jesus do Monte, 4715-056 Braga",
    "description": "브라가 시내 파노라마. 계단 정상",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "Café A Brasileira",
    "searchName": "Café A Brasileira Lisboa",
    "type": "cafe",
    "rating": 4.2,
    "price": "€€",
    "hours": "08:00-00:00",
    "address": "R. Garrett 120, 1200-205 Lisboa",
    "description": "1905년 오픈. 시아두 랜드마크. 페소아 동상 앞",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Fábrica Coffee Roasters",
    "searchName": "Fábrica Coffee Roasters Lisboa",
    "type": "cafe",
    "rating": 4.5,
    "price": "€",
    "hours": "09:00-19:00",
    "address": "R. das Flores 63, 1200-193 Lisboa",
    "description": "스페셜티 커피. 자체 로스팅",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Manteigaria",
    "searchName": "Manteigaria Lisboa Chiado",
    "type": "dessert",
    "rating": 4.6,
    "price": "€",
    "hours": "08:00-00:00",
    "address": "R. do Loreto 2, 1200-108 Lisboa",
    "description": "에그타르트 명소. 따끈하게 제공",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Confeitaria Nacional",
    "searchName": "Confeitaria Nacional Lisboa",
    "type": "dessert",
    "rating": 4.3,
    "price": "€",
    "hours": "08:00-20:00",
    "address": "Praça da Figueira 18B, 1100-241 Lisboa",
    "description": "1829년 창업. 리스본 최고(古) 제과점",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Landeau Chocolate",
    "searchName": "Landeau Chocolate Chiado",
    "type": "dessert",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-19:00",
    "address": "R. das Flores 70, 1200-194 Lisboa",
    "description": "초콜릿 케이크 전문. 시아두 지점",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Gelados Santini",
    "searchName": "Gelados Santini Lisboa Chiado",
    "type": "dessert",
    "rating": 4.4,
    "price": "€",
    "hours": "11:00-00:00",
    "address": "R. do Carmo 9, 1200-093 Lisboa",
    "description": "1949년 창업. 이탈리안 젤라토",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Taberna da Rua das Flores",
    "searchName": "Taberna da Rua das Flores Lisboa",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00,19:00-23:00",
    "address": "R. das Flores 103, 1200-195 Lisboa",
    "description": "예약 불가 인기 맛집. 칠판 메뉴",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Cervejaria Trindade",
    "searchName": "Cervejaria Trindade Lisboa",
    "type": "seafood",
    "rating": 4.2,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "R. Nova da Trindade 20C, 1200-302 Lisboa",
    "description": "1836년 맥주홀. 아름다운 타일",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Solar dos Presuntos",
    "searchName": "Solar dos Presuntos Lisboa",
    "type": "seafood",
    "rating": 4.3,
    "price": "€€€",
    "hours": "12:00-15:30,18:30-23:00",
    "address": "R. das Portas de Santo Antão 150, 1150-269 Lisboa",
    "description": "1974년 오픈. 해산물, 대구 요리",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "O Trevo",
    "searchName": "O Trevo Lisboa",
    "type": "budget",
    "rating": 4.2,
    "price": "€",
    "hours": "07:00-22:00",
    "address": "Largo do Camões 1, 1200-109 Lisboa",
    "description": "Bourdain 추천. 비파나 명소",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Pinóquio",
    "searchName": "Restaurante Pinóquio Lisboa",
    "type": "seafood",
    "rating": 4.1,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "Praça dos Restauradores 79, 1250-188 Lisboa",
    "description": "호시우 광장 해산물",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "A Ginjinha",
    "searchName": "A Ginjinha Espinheira Lisboa",
    "type": "cafe",
    "rating": 4.3,
    "price": "€",
    "hours": "09:00-22:00",
    "address": "Largo de São Domingos 8, 1150-320 Lisboa",
    "description": "1840년 창업. 진지냐 원조",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Beira Gare",
    "searchName": "Beira Gare Lisboa",
    "type": "budget",
    "rating": 4,
    "price": "€",
    "hours": "06:00-00:00",
    "address": "R. 1º de Dezembro 100, 1249-999 Lisboa",
    "description": "24시간 스낵바. 비파나, 프레고",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Dear Breakfast Alfama",
    "searchName": "Dear Breakfast Alfama Lisboa",
    "type": "cafe",
    "rating": 4.5,
    "price": "€€",
    "hours": "08:00-16:00",
    "address": "LG de Santo António da Sé 16, 1100-499 Lisboa",
    "description": "세 대성당 옆 브런치 카페. 에그베네딕트·아보카도토스트 인기",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Breakfast Lovers Alfama",
    "searchName": "Breakfast Lovers Alfama Lisboa",
    "type": "cafe",
    "rating": 4.9,
    "price": "€€",
    "hours": "08:00-16:00",
    "address": "BC da Caridade 1, 1100-119 Lisboa",
    "description": "알파마 최고 인기 브런치. 치즈팬케이크·아사이볼 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Farol de Santa Luzia",
    "searchName": "Restaurante Farol de Santa Luzia Lisboa",
    "type": "seafood",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "Largo Santa Luzia 5, 1100-487 Lisboa",
    "description": "1973년. 해산물 전문",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Clube de Fado",
    "searchName": "Clube de Fado Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€€",
    "hours": "19:30-02:00",
    "address": "R. São João da Praça 94, 1100-521 Lisboa",
    "description": "파두 라이브. 전통 요리",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Pastéis de Belém",
    "searchName": "Pastéis de Belém Lisboa",
    "type": "dessert",
    "rating": 4.5,
    "price": "€",
    "hours": "08:00-23:00",
    "address": "R. de Belém 84-92, 1300-085 Lisboa",
    "description": "1837년 창업. 에그타르트 원조",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Pão Pão Queijo Queijo",
    "searchName": "Pão Pão Queijo Queijo Belém",
    "type": "budget",
    "rating": 4.3,
    "price": "€",
    "hours": "10:00-19:00",
    "address": "R. de Belém 126, 1300-086 Lisboa",
    "description": "샌드위치. 수도원 앞",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Flor dos Jerónimos",
    "searchName": "Flor dos Jerónimos Belém",
    "type": "restaurant",
    "rating": 4.2,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "R. de Belém 148, 1300-086 Lisboa",
    "description": "1974년 오픈. 전통 가정식",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "O Frade",
    "searchName": "O Frade Belém",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-15:00,19:00-22:30",
    "address": "Tv. Paulo Jorge 9, 1300-444 Lisboa",
    "description": "미슐랭 빕구르망. 랍스터밥",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Ponto Final",
    "searchName": "Restaurante Ponto Final Almada",
    "type": "seafood",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "R. do Ginjal 72, 2800-285 Almada",
    "description": "페리 타고 방문. 생선구이",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Landeau Chocolate LX",
    "searchName": "Landeau Chocolate LX Factory",
    "type": "dessert",
    "rating": 4.6,
    "price": "€€",
    "hours": "10:00-20:00",
    "address": "R. Rodrigues de Faria 103, LX Factory, Lisboa",
    "description": "초콜릿 케이크 본점",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Cantina LX",
    "searchName": "Cantina LX Factory",
    "type": "restaurant",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. Rodrigues de Faria 103, LX Factory, Lisboa",
    "description": "전통 포르투갈. 문어",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "1300 Taberna",
    "searchName": "1300 Taberna LX Factory",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€€",
    "hours": "12:00-23:00",
    "address": "R. Rodrigues de Faria 103, LX Factory, Lisboa",
    "description": "해산물, 육류 전문",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Casa Piriquita",
    "searchName": "Casa Piriquita Sintra",
    "type": "dessert",
    "rating": 4.5,
    "price": "€",
    "hours": "08:30-20:00",
    "address": "R. Padarias 1, 2710-603 Sintra",
    "description": "1862년 창업. 케이자다, 트라베세이루",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Café Saudade",
    "searchName": "Café Saudade Sintra",
    "type": "cafe",
    "rating": 4.3,
    "price": "€€",
    "hours": "08:30-20:00",
    "address": "Av. Dr. Miguel Bombarda 6, 2710-590 Sintra",
    "description": "옛 케이자다 공장. 빈티지",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Nata Pura",
    "searchName": "Nata Pura Sintra",
    "type": "dessert",
    "rating": 4.2,
    "price": "€",
    "hours": "09:00-19:00",
    "address": "Praça da República 12, 2710-616 Sintra",
    "description": "신트라 중심. 나타",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Tascantiga",
    "searchName": "Tascantiga Sintra",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:15-16:15,19:00-22:00",
    "address": "Escadinhas da Fonte da Pipa 2, 2710-557 Sintra",
    "description": "포르투갈 타파스. 예약 추천",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Incomum by Luis Santos",
    "searchName": "Incomum by Luis Santos Sintra",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:30-15:00,19:00-22:30",
    "address": "R. Dr. Alfredo da Costa 22, 2710-523 Sintra",
    "description": "창작 포르투갈. 문어구이",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Café Santa Cruz",
    "searchName": "Café Santa Cruz Coimbra",
    "type": "cafe",
    "rating": 4.4,
    "price": "€",
    "hours": "08:00-00:00",
    "address": "Praça 8 de Maio, 3000-300 Coimbra",
    "description": "옛 성당 건물. 고딕 아치",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Zé Manel dos Ossos",
    "searchName": "Zé Manel dos Ossos Coimbra",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00,19:30-22:00",
    "address": "Beco do Forno 12, 3000-001 Coimbra",
    "description": "8석 미니 레스토랑. 예약 필수",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Majestic Café",
    "searchName": "Majestic Café Porto",
    "type": "cafe",
    "rating": 4.3,
    "price": "€€€",
    "hours": "09:30-23:30",
    "address": "R. de Santa Catarina 112, 4000-442 Porto",
    "description": "1921년. 아르누보. 해리포터",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Café Santiago",
    "searchName": "Café Santiago Porto",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. de Passos Manuel 226, 4000-382 Porto",
    "description": "프란세지냐 명소. 1959년",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Manteigaria Porto",
    "searchName": "Manteigaria Porto Bolhão",
    "type": "dessert",
    "rating": 4.5,
    "price": "€",
    "hours": "08:00-00:00",
    "address": "R. de Alexandre Braga 24, 4000-049 Porto",
    "description": "에그타르트 전문",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Confeitaria do Bolhão",
    "searchName": "Confeitaria do Bolhão Porto",
    "type": "dessert",
    "rating": 4.3,
    "price": "€",
    "hours": "06:00-20:00",
    "address": "R. Formosa 339, 4000-252 Porto",
    "description": "1896년 창업. 전통 제과점",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Brasão Aliados",
    "searchName": "Brasão Aliados Porto",
    "type": "restaurant",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "Praça dos Aliados 96, 4000-053 Porto",
    "description": "프란세지냐 전문",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Conga",
    "searchName": "Conga Casa das Bifanas Porto",
    "type": "budget",
    "rating": 4.1,
    "price": "€",
    "hours": "09:00-22:00",
    "address": "R. do Bonjardim 314, 4000-116 Porto",
    "description": "비파나 명소. 현지인 패스트푸드",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Jimão Tapas e Vinhos",
    "searchName": "Jimão Tapas e Vinhos Porto",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "Praça da Ribeira 14, 4050-513 Porto",
    "description": "리베이라 광장. 타파스",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Postigo do Carvão",
    "searchName": "Restaurante Postigo do Carvão Porto",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00,19:00-22:00",
    "address": "R. do Carvalhinho 12, 4050-160 Porto",
    "description": "현지인 맛집. 해산물밥",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Taberna dos Mercadores",
    "searchName": "Taberna dos Mercadores Porto",
    "type": "seafood",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-15:00,19:00-22:30",
    "address": "R. dos Mercadores 36, 4050-374 Porto",
    "description": "숨은 맛집. 해산물. 예약 필수",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Fish Fixe",
    "searchName": "Fish Fixe Porto",
    "type": "seafood",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "Cais da Ribeira 9, 4050-509 Porto",
    "description": "도루강 전망. 정어리, 문어",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Tapabento",
    "searchName": "Tapabento S.Bento",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. da Madeira 222, 4000-332 Porto",
    "description": "상벤투역 근처. 퓨전 타파스",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Vinologia",
    "searchName": "Vinologia Porto",
    "type": "cafe",
    "rating": 4.5,
    "price": "€€",
    "hours": "15:00-00:00",
    "address": "R. de São João 46, 4050-552 Porto",
    "description": "포트와인 테이스팅",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Escondidinho do Barredo",
    "searchName": "Escondidinho do Barredo Porto",
    "type": "budget",
    "rating": 4.2,
    "price": "€",
    "hours": "12:00-22:00",
    "address": "R. de Trás 20, 4050-603 Porto",
    "description": "리베이라 뒷골목. 대구 프리터",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Graham's Port Lodge",
    "searchName": "Graham's Port Lodge Gaia",
    "type": "cafe",
    "rating": 4.5,
    "price": "€€€",
    "hours": "10:00-18:00",
    "address": "R. do Agro 141, 4400-281 Vila Nova de Gaia",
    "description": "프리미엄 포트와인. 테라스",
    "days": [
      "DAY 7",
      "DAY 10"
    ]
  },
  {
    "name": "Cor de Tangerina",
    "searchName": "Cor de Tangerina Guimarães",
    "type": "cafe",
    "rating": 4.4,
    "price": "€",
    "hours": "10:00-19:00",
    "address": "Largo da Oliveira 25, 4800-438 Guimarães",
    "description": "올리베이라 광장. 케이크",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "Histórico by Papaboa",
    "searchName": "Histórico by Papaboa Guimarães",
    "type": "restaurant",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-15:00,19:00-22:30",
    "address": "R. de Val de Donas 4, 4800-537 Guimarães",
    "description": "전통 미뉴 요리",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "A Brasileira Braga",
    "searchName": "Café A Brasileira Braga",
    "type": "cafe",
    "rating": 4.2,
    "price": "€",
    "hours": "08:00-00:00",
    "address": "Largo do Barão de São Martinho 17, 4700-305 Braga",
    "description": "1907년 오픈. 전통 카페",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "Frigideiras do Cantinho",
    "searchName": "Frigideiras do Cantinho Braga",
    "type": "budget",
    "rating": 4.3,
    "price": "€",
    "hours": "08:00-20:00",
    "address": "Largo de São João do Souto 4, 4700-326 Braga",
    "description": "프리지데이라 전문. 전통 간식",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "Can the Can",
    "searchName": "Can the Can Lisboa",
    "type": "restaurant",
    "rating": 4.2,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "Praça do Comércio 82, 1100-148 Lisboa",
    "description": "통조림 컨셉 레스토랑. 광장 테라스",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Café Martinho da Arcada",
    "searchName": "Café Martinho da Arcada Lisboa",
    "type": "cafe",
    "rating": 4.1,
    "price": "€€",
    "hours": "08:00-22:00",
    "address": "Praça do Comércio 3, 1100-148 Lisboa",
    "description": "1782년 오픈. 리스본 가장 오래된 카페. 페소아 단골",
    "days": [
      "DAY 1",
      "DAY 2"
    ]
  },
  {
    "name": "Chapitô à Mesa",
    "searchName": "Chapitô à Mesa Lisboa",
    "type": "restaurant",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:30-00:00",
    "address": "Costa do Castelo 7, 1149-079 Lisboa",
    "description": "성 근처 테라스. 리스본 전망. 현대 포르투갈",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Darwin Café",
    "searchName": "Darwin Café Lisboa",
    "type": "cafe",
    "rating": 4.2,
    "price": "€€",
    "hours": "10:00-19:00",
    "address": "Champalimaud Center, Av. Brasília, 1400-038 Lisboa",
    "description": "벨렝탑 전망. 현대적 인테리어",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Enoteca de Belém",
    "searchName": "Enoteca de Belém Lisboa",
    "type": "cafe",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "Tv. Marta Pinto 12, 1300-390 Lisboa",
    "description": "내추럴 와인바. 치즈, 샤퀴테리",
    "days": [
      "DAY 3"
    ]
  },
  {
    "name": "Arco Das Verdades",
    "searchName": "Arco Das Verdades Porto wine bar",
    "type": "cafe",
    "rating": 5.0,
    "price": "€€",
    "hours": "14:00-22:00",
    "address": "Escadas das Verdades 13, 4050-622 Porto",
    "description": "리베이라 근처 와인바. 재즈+도우루강 뷰 ⭐",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Wine Quay Bar",
    "searchName": "Wine Quay Bar Porto",
    "type": "cafe",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "Cais da Ribeira 38, 4050-509 Porto",
    "description": "도루강 전망. 와인과 타파스",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Mercado do Bolhão Food Court",
    "searchName": "Mercado do Bolhão Porto",
    "type": "budget",
    "rating": 4.1,
    "price": "€",
    "hours": "08:00-20:00",
    "address": "R. Formosa 322, 4000-248 Porto",
    "description": "볼량시장 푸드코트. 다양한 현지 음식",
    "days": [
      "DAY 7",
      "DAY 8",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Bar do Parque",
    "searchName": "Bar do Parque Pena Sintra",
    "type": "cafe",
    "rating": 4,
    "price": "€",
    "hours": "10:00-18:00",
    "address": "Parque da Pena, 2710-609 Sintra",
    "description": "페나궁전 공원 내 카페. 간단한 간식",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "Pena Palace Cafeteria",
    "searchName": "Cafetaria do Palácio da Pena",
    "type": "cafe",
    "rating": 3.8,
    "price": "€",
    "hours": "09:30-18:00",
    "address": "Parque da Pena, 2710-609 Sintra",
    "description": "페나궁전 내부 카페테리아. 테라스 전망",
    "days": [
      "DAY 4"
    ]
  },
  {
    "name": "El Rei Dom Frango",
    "searchName": "El Rei Dom Frango Guimarães",
    "type": "budget",
    "rating": 4.2,
    "price": "€",
    "hours": "11:00-22:00",
    "address": "R. da Rainha 83, 4810-431 Guimarães",
    "description": "치킨 전문점. 가성비 좋음",
    "days": [
      "DAY 8"
    ]
  },
  {
    "name": "Bom Jesus Café",
    "searchName": "Bom Jesus Café Braga",
    "type": "cafe",
    "rating": 4,
    "price": "€",
    "hours": "09:00-18:00",
    "address": "Bom Jesus do Monte, 4715-056 Braga",
    "description": "봉 제수스 근처 카페. 전망 좋음",
    "days": [
      "DAY 9"
    ]
  },
  {
    "name": "Augusto Lisboa",
    "searchName": "Augusto Lisboa brunch Alfama",
    "type": "cafe",
    "rating": 4.8,
    "price": "€€",
    "hours": "09:00-16:00",
    "address": "R. de Santa M.nha 26, 1100-491 Lisboa",
    "description": "알파마 인기 브런치. 팬케이크·에그토스트 추천 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Antù Alfama",
    "searchName": "Antù Alfama Lisboa restaurant",
    "type": "restaurant",
    "rating": 4.6,
    "price": "€€",
    "hours": "09:00-23:30",
    "address": "Beco de São Miguel, 1100-538 Lisboa",
    "description": "알파마 포도넝쿨 파티오. 문어·양고기·브런치 인기",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Antiga Wine Bar",
    "searchName": "Antiga Wine Bar Lisboa Alfama",
    "type": "cafe",
    "rating": 4.7,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "R. de Santo António da Sé 10, 1100-500 Lisboa",
    "description": "세 대성당 옆 와인바. 새우·대구케이크·와인페어링 ⭐",
    "days": [
      "DAY 2"
    ]
  },
  {
    "name": "Bia Lounge Tapas & Cocktails",
    "searchName": "Bia Lounge Tapas Bar Porto",
    "type": "restaurant",
    "rating": 4.8,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. de Saraiva de Carvalho 24, 4000-520 Porto",
    "description": "대성당 근처 타파스. 문어·스테이크·칵테일 추천 ⭐",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Ribeira Square",
    "searchName": "Ribeira Square restaurant Porto",
    "type": "restaurant",
    "rating": 4.7,
    "price": "€€",
    "hours": "18:00-23:00",
    "address": "Praça Ribeira 16, 4050-513 Porto",
    "description": "리베이라 광장. 해산물밥·오리요리 인기 ⭐",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "The Wine Box",
    "searchName": "The Wine Box Porto wine bar tapas",
    "type": "cafe",
    "rating": 4.4,
    "price": "€€",
    "hours": "10:00-00:00",
    "address": "R. dos Mercadores 72-74, 4050-374 Porto",
    "description": "리베이라 와인바. 와인테이스팅+타파스 인기",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Art & Wine",
    "searchName": "Art Wine bar Barredo Porto",
    "type": "cafe",
    "rating": 4.8,
    "price": "€€",
    "hours": "12:00-19:00",
    "address": "Escadas do Barredo 10, 4000 Porto",
    "description": "바헤두 골목 와인바. 포트토닉·치즈 추천",
    "days": [
      "DAY 7",
      "DAY 9",
      "DAY 10"
    ]
  },
  {
    "name": "Tasca10",
    "searchName": "Tasca10 Obidos Portugal",
    "type": "restaurant",
    "rating": 4.9,
    "price": "€€",
    "hours": "13:00-21:00",
    "address": "R. Josefa de Óbidos 10, 2510-001 Óbidos",
    "description": "오비두스 성내 최고 맛집. 상그리아·조개·부라타 ⭐",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "Ja!mon Ja!mon",
    "searchName": "Jamon Jamon Obidos restaurant",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€",
    "hours": "12:30-15:30, 19:00-22:00",
    "address": "Largo do Chafariz, R. da Biquinha, 2510-046 Óbidos",
    "description": "오비두스 타파스. 이베리코 햄·해산물요리",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "A Nova Casa de Ramiro",
    "searchName": "A Nova Casa de Ramiro Obidos",
    "type": "restaurant",
    "rating": 4.6,
    "price": "€€€",
    "hours": "12:00-15:00, 19:00-23:00",
    "address": "R. Porta do Vale 12, 2510-053 Óbidos",
    "description": "오비두스 파인다이닝. 리조또·대구요리·디저트 추천",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "Restaurante A Tasquinha",
    "searchName": "Restaurante A Tasquinha Fatima",
    "type": "restaurant",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-22:00",
    "address": "R. dos Monfortinos, Cova da Iria, 2495-446 Fátima",
    "description": "파티마 로컬 맛집. 이베리코 흑돼지·대구요리 인기",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "Taverna Antiqua",
    "searchName": "Taverna Antiqua Tomar Portugal",
    "type": "restaurant",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-16:00, 19:00-23:30",
    "address": "Praça da República 23, 2300-556 Tomar",
    "description": "토마르 중세테마 레스토랑. 레푸블리카 광장 뷰 ⭐",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "Café Paraiso",
    "searchName": "Café Paraiso Tomar Portugal",
    "type": "cafe",
    "rating": 4.4,
    "price": "€",
    "hours": "08:30-02:00",
    "address": "R. Serpa Pinto 127, 2300 Tomar",
    "description": "토마르 114년 전통 카페. 커피·토스타 추천",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "Hanne Café",
    "searchName": "Hanne Café Tomar brunch",
    "type": "cafe",
    "rating": 4.7,
    "price": "€€",
    "hours": "09:00-19:00",
    "address": "R. Serpa Pinto 57, 2300-592 Tomar",
    "description": "토마르 브런치 카페. 팬케이크·연어 인기 ⭐",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "바탈랴 수도원",
    "searchName": "Mosteiro da Batalha Portugal",
    "rating": 4.8,
    "price": "€10",
    "hours": "09:00–18:00",
    "type": "landmark",
    "address": "Largo Infante Dom Henrique, 2440-109 Batalha",
    "description": "유네스코 세계유산. 포르투갈 고딕과 마누엘 양식의 걸작 ⭐⭐⭐",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "오비두스 성문",
    "searchName": "Porta da Vila Óbidos",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "R. Direita, 2510-001 Óbidos",
    "description": "아줄레주로 장식된 오비두스의 메인 게이트",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "우세이라 수도교",
    "searchName": "Aqueduto de Usseira Óbidos",
    "rating": 4.5,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Estr. do Aqueduto, 2510-135 Usseira",
    "description": "오비두스 주차장 옆 거대 로마식 수도교",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "페고잉스 수도교",
    "searchName": "Aqueduto dos Pegões Tomar",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Aqueduto dos Pegões, Tomar",
    "description": "30m 높이의 아찔한 수도교. 토마르의 숨은 보석 💎",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "성 주앙 바티스타 성당",
    "searchName": "Igreja de São João Baptista Tomar",
    "rating": 4.5,
    "price": "무료",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "Praça da República, 2300-550 Tomar",
    "description": "토마르 헤푸블리카 광장의 중심 성당. 마누엘 양식 종탑",
    "days": [
      "DAY 5"
    ]
  },
  {
    "name": "상 괄테르 성당",
    "searchName": "Igreja de São Gualter Guimarães",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "church",
    "address": "Largo República do Brasil, 4810-446 Guimarães",
    "description": "기마랑이스의 엽서 배경. 뾰족한 첨탑이 아름다운 성당 📸",
    "days": ["DAY 9"]
  },
  {
    "name": "포르타 노바 아치",
    "searchName": "Arco da Porta Nova Braga",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "R. Dom Diogo de Sousa 127, 4700-424 Braga",
    "description": "브라가 구시가지의 서쪽 관문. 바로크 양식 개선문",
    "days": ["DAY 9"]
  },
  {
    "name": "산타 바바라 정원",
    "searchName": "Jardim de Santa Bárbara Braga",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "R. Dr. Justino Cruz, 4700-314 Braga",
    "description": "중세 주교궁 벽을 배경으로 한 화려한 꽃 정원 🌺",
    "days": ["DAY 9"]
  },
  {
    "name": "봉 제수스 계단",
    "searchName": "Escadórios do Bom Jesus Braga",
    "rating": 4.9,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Estrada do Bom Jesus, 4715-056 Braga",
    "description": "지그재그로 이어지는 바로크 양식의 580개 계단",
    "days": ["DAY 9"]
  },
  {
    "name": "CA Downtown",
    "searchName": "CA Downtown Porto",
    "rating": 4.6,
    "price": "€€",
    "hours": "09:00–18:00",
    "type": "cafe",
    "address": "R. de Mouzinho da Silveira 230, 4050-417 Porto",
    "description": "포르투 중심가 브런치 맛집. 에그 베네딕트 추천",
    "days": ["DAY 8"]
  },
  {
    "name": "세뉴르 다 페드라 성당",
    "searchName": "Capela do Senhor da Pedra",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "Alameda do Sr. da Pedra, 4405-712 Gulpilhares",
    "description": "대서양 파도 속 바위 위에 세워진 신비로운 육각형 예배당 ⭐⭐⭐",
    "days": ["DAY 8"]
  },
  {
    "name": "아푸라다 마을",
    "searchName": "São Pedro da Afurada",
    "rating": 4.5,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "São Pedro da Afurada, Vila Nova de Gaia",
    "description": "골목마다 생선 굽는 연기가 피어오르는 전통 어촌 마을",
    "days": ["DAY 8"]
  },
  {
    "name": "Taberna de São Pedro",
    "searchName": "Taberna de São Pedro Afurada",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00–15:00, 19:00–22:00",
    "type": "seafood",
    "address": "R. Agostinho Albano 40, 4400-352 Vila Nova de Gaia",
    "description": "아푸라다 마을 최고의 숯불 생선구이 맛집 ⭐",
    "days": ["DAY 8"]
  },
  {
    "name": "펠게이라스 등대",
    "searchName": "Farolim de Felgueiras",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Jardim do Passeio Alegre, 4150-555 Porto",
    "description": "거친 대서양 파도가 부서지는 붉은 등대. 인생샷 명소 📸",
    "days": ["DAY 8"]
  },
  {
    "name": "포스 페르골라",
    "searchName": "Pérgola da Foz",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Av. do Brasil, 4150-151 Porto",
    "description": "니스(Nice)를 닮은 노란색 해안 산책로",
    "days": ["DAY 8"]
  },
  {
    "name": "하프 래빗",
    "searchName": "Half Rabbit Bordalo II",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "landmark",
    "address": "R. de Guilherme Gomes Fernandes 42, 4400-266 Vila Nova de Gaia",
    "description": "쓰레기로 만든 토끼 반쪽 벽화. 보르달로 2세 작품 💎",
    "days": ["DAY 8"]
  },
  {
    "name": "샤롤라",
    "searchName": "Charola do Convento de Cristo Tomar",
    "rating": 4.9,
    "price": "수도원 포함",
    "hours": "09:00–17:30",
    "type": "landmark",
    "address": "Convento de Cristo, 2300-000 Tomar",
    "description": "템플 기사단의 8각 황금 예배당. 압도적인 장식",
    "days": ["DAY 6"]
  },
  {
    "name": "구대학 광장",
    "searchName": "Paço das Escolas Coimbra",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Paço das Escolas, 3004-531 Coimbra",
    "description": "코임브라 대학의 심장. 3면이 유네스코 유산",
    "days": ["DAY 6"]
  },
  {
    "name": "마샤두 드 카스트루 박물관",
    "searchName": "Museu Nacional de Machado de Castro",
    "rating": 4.7,
    "price": "€6",
    "hours": "10:00–18:00",
    "type": "landmark",
    "address": "Largo Dr. José Rodrigues, 3000-236 Coimbra",
    "description": "로마 시대 지하 회랑(Cryptoporticus)이 압권",
    "days": ["DAY 6"]
  },
  {
    "name": "Café Rynok",
    "searchName": "Café Rynok Coimbra",
    "rating": 5.0,
    "price": "€",
    "hours": "09:00–19:00",
    "type": "cafe",
    "address": "R. da Louça 16, 3000-244 Coimbra",
    "description": "코임브라 평점 5.0 카페. 최고의 커피와 분위기 ⭐",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Restaurante Sete",
    "searchName": "Restaurante Sete Coimbra",
    "type": "restaurant",
    "rating": 4.7,
    "price": "€€",
    "hours": "12:30-22:00",
    "address": "R. Martins de Carvalho 10, 3000-274 Coimbra",
    "description": "코임브라 인기 레스토랑. 양갈비·문어·돼지파이 추천 ⭐",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Solar do Bacalhau",
    "searchName": "Restaurante Solar do Bacalhau Coimbra",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "Rua da Sota 10, 3000-392 Coimbra",
    "description": "코임브라 대구요리 전문. 문어·해산물 인기",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Insensato Café-Livraria",
    "searchName": "Insensato Café Livraria Tomar",
    "type": "cafe",
    "rating": 4.8,
    "price": "€€",
    "hours": "12:00-16:00",
    "address": "R. da Silva Magalhães 25, 2300-593 Tomar",
    "description": "토마르 서점+카페. 파스트라미샌드·포케볼 추천 ⭐",
    "days": [
      "DAY 6"
    ]
  },
  {
    "name": "Noobai Café",
    "searchName": "Noobai Rooftop Bar Restaurante Lisboa",
    "type": "cafe",
    "rating": 4.3,
    "price": "€€",
    "hours": "10:00-00:00",
    "address": "Miradouro de Santa Catarina, 1200-401 Lisboa",
    "description": "산타 카타리나 전망대 루프탑 바. 테주강 뷰 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Time Out Market",
    "searchName": "Time Out Market Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "10:00-00:00",
    "address": "Av. 24 de Julho 49, 1200-479 Lisboa",
    "description": "유명 셰프 요리를 한곳에. 대형 푸드홀 ⭐",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "Ramiro",
    "searchName": "Cervejaria Ramiro Lisboa",
    "type": "seafood",
    "rating": 4.4,
    "price": "€€€",
    "hours": "12:00-00:30",
    "address": "Av. Alm. Reis 1-H, 1150-007 Lisboa",
    "description": "리스본 최고 해산물 식당. 버터새우, 게 필수 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Frade dos Mares",
    "searchName": "Frade dos Mares Lisboa",
    "type": "seafood",
    "rating": 4.6,
    "price": "€€€",
    "hours": "12:00-15:00,19:00-23:00",
    "address": "Av. Dom Carlos I 55A, 1200-647 Lisboa",
    "description": "파인다이닝 해산물. 문어 요리 추천",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "Sacramento do Chiado",
    "searchName": "Sacramento do Chiado Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "Calçada do Sacramento 40-50, 1200-394 Lisboa",
    "description": "동굴 인테리어의 고급 전통 레스토랑",
    "days": ["DAY 2"]
  },
  {
    "name": "Figus",
    "searchName": "Figus Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "Praça da Figueira 18, 1100-241 Lisboa",
    "description": "피게이라 광장. 유러피안 퓨전 다이닝",
    "days": ["DAY 2"]
  },
  {
    "name": "Solar 31 da Calçada",
    "searchName": "Solar 31 da Calçada Lisboa",
    "type": "seafood",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-15:00,19:00-22:30",
    "address": "Calçada Garcia 31, 1150-143 Lisboa",
    "description": "해산물 플레이트, 통문어 구이 숨은 맛집",
    "days": ["DAY 2"]
  },
  {
    "name": "Laurentina",
    "searchName": "Laurentina O Rei do Bacalhau Lisboa",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00,19:00-22:30",
    "address": "Av. Conde Valbom 71A, 1050-067 Lisboa",
    "description": "바칼라우(대구)의 왕. 역사 깊은 정통 맛집",
    "days": ["DAY 2"]
  },
  {
    "name": "Zenith",
    "searchName": "Zenith Brunch Lisboa",
    "type": "cafe",
    "rating": 4.5,
    "price": "€€",
    "hours": "09:00-17:00",
    "address": "R. do Telhal 4A, 1150-346 Lisboa",
    "description": "팬케이크, 에그베네딕트. 트렌디 브런치",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "A Valenciana",
    "searchName": "A Valenciana Lisboa",
    "type": "budget",
    "rating": 4.3,
    "price": "€",
    "hours": "12:00-22:00",
    "address": "R. Marquês de Fronteira 157, 1070-207 Lisboa",
    "description": "가성비 최고 피리피리 숯불 닭구이 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Guilty by Olivier",
    "searchName": "Guilty by Olivier Avenida Lisboa",
    "type": "restaurant",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-00:00",
    "address": "R. Barata Salgueiro 28A, 1250-044 Lisboa",
    "description": "햄버거, 피자, 파스타. 힙한 캐주얼 다이닝",
    "days": ["DAY 2"]
  },
  {
    "name": "Restaurante O Barbas",
    "searchName": "Restaurante O Barbas Costa da Caparica",
    "type": "seafood",
    "rating": 3.9,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "Praia do Tarquínio 2, 2825-491 Costa da Caparica",
    "description": "카파리카 해변 오션뷰 해산물 식당",
    "days": ["DAY 3"]
  },
  {
    "name": "Lucimar",
    "searchName": "Lucimar Lisboa",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00,19:00-22:00",
    "address": "R. Francisco Tomás da Costa 28, 1600-093 Lisboa",
    "description": "프란세지냐와 포르투갈 가정식 노포",
    "days": ["DAY 2"]
  },
  {
    "name": "Adega das Gravatas",
    "searchName": "Adega das Gravatas Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-15:00,19:00-23:00",
    "address": "Tv. Pregoeiro 15, 1600-595 Lisboa",
    "description": "돌판 직화구이. 넥타이 인테리어가 독특",
    "days": ["DAY 2"]
  },
  {
    "name": "Café da Garagem",
    "searchName": "Café da Garagem Lisboa",
    "type": "cafe",
    "rating": 4.4,
    "price": "€",
    "hours": "10:00-23:00",
    "address": "Costa do Castelo 75, 1100-179 Lisboa",
    "description": "상 조르즈 성 근처. 통유리 시내 뷰 카페",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "Portas do Sol Terrace",
    "searchName": "Portas Do Sol Terrace Lisboa",
    "type": "cafe",
    "rating": 4.0,
    "price": "€",
    "hours": "10:00-00:00",
    "address": "Largo Portas do Sol, 1100-411 Lisboa",
    "description": "포르타스 두 솔 전망대 옆 테라스 카페",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "Nannarella",
    "searchName": "Nannarella Gelato Lisboa",
    "type": "dessert",
    "rating": 4.7,
    "price": "€",
    "hours": "13:00-00:00",
    "address": "R. Nova da Piedade 64, 1200-299 Lisboa",
    "description": "리스본 최고 젤라또. 현지인도 줄 서는 곳 ⭐",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "Starbucks Rossio",
    "searchName": "Starbucks Rossio Lisboa",
    "type": "cafe",
    "rating": 4.0,
    "price": "€€",
    "hours": "07:00-21:00",
    "address": "Estação de Caminhos de Ferro do Rossio, 1100-105 Lisboa",
    "description": "호시우 역 지점. 멋진 역사 건물 내 위치",
    "days": ["DAY 2"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 🍽️ 2025-02-22 AI 자동 추가: 포르투 맛집 (DAY 7~9)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "Francesinha Café",
    "searchName": "Francesinha Café Porto Marquês",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. do Campo Alegre 1328, 4150-175 Porto",
    "description": "현지인 추천 프란세지냐. 셰프 페르난도 맛집 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Brasão Aliados",
    "searchName": "Brasão Cervejaria Aliados Porto",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "R. de Ramalho Ortigão 28, 4000-407 Porto",
    "description": "오븐 프란세지냐 + 수제맥주. 시청 근처 ⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "O Afonso",
    "searchName": "Café Restaurante O Afonso Porto",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "restaurant",
    "address": "Rua da Torrinha 219, 4050-610 Porto",
    "description": "안소니 보르뎅이 인정한 프란세지냐. 아이르통 세나 박물관 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Lado B Café",
    "searchName": "Lado B Café Coliseu Porto",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-00:00",
    "type": "restaurant",
    "address": "R. de Passos Manuel 190, 4000-382 Porto",
    "description": "로스트비프 프란세지냐. 비건 옵션 있음",
    "days": ["DAY 7"]
  },
  {
    "name": "O Golfinho",
    "searchName": "Casa de Pasto O Golfinho Porto",
    "rating": 4.7,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Rua de Sá de Noronha 137, 4000-445 Porto",
    "description": "로컬 타스카. 저렴하고 푸짐한 프란세지냐 ⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "Bufete Fase",
    "searchName": "Bufete Fase Porto",
    "rating": 4.5,
    "price": "€",
    "hours": "08:00-22:00",
    "type": "budget",
    "address": "R. Alferes Malheiro 133, 4000-057 Porto",
    "description": "전설의 프란세지냐. 푸짐한 양 ⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "Santa Francesinha",
    "searchName": "Santa Francesinha Ribeira Porto",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "R. do Bonjardim 314, 4000-116 Porto",
    "description": "비건 프란세지냐로 유명. 볼량시장 근처",
    "days": ["DAY 7"]
  },
  {
    "name": "Taberna Londrina",
    "searchName": "Taberna Londrina Porto",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-23:00",
    "type": "restaurant",
    "address": "Rua Capitão Pombeiro 110, 4000-124 Porto",
    "description": "현대적 프란세지냐. 독특한 소스",
    "days": ["DAY 7"]
  },
  {
    "name": "Bacalhau Porto",
    "searchName": "Bacalhau Restaurante Porto Ribeira",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:30",
    "type": "seafood",
    "address": "Cais da Ribeira 21, 4050-511 Porto",
    "description": "도우루강변 바칼랴우 맛집. 테라스 뷰 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Ribeira Square",
    "searchName": "Ribeira Square Restaurante Porto",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:30-14:30, 18:00-22:30",
    "type": "restaurant",
    "address": "Praça Ribeira 16, 4050-513 Porto",
    "description": "가족 운영. 타파스+프란세지냐. 달달한 상그리아",
    "days": ["DAY 7"]
  },
  {
    "name": "Muro do Bacalhau",
    "searchName": "Muro do Bacalhau Porto",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "seafood",
    "address": "Cais da Estiva 122, 4050-080 Porto",
    "description": "강변 숨은 맛집. 아소르다(빵수프) 추천 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "éLeBê Baixa",
    "searchName": "éLeBê Baixa Porto Bolhão",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "R. do Bonjardim 420, 4000-118 Porto",
    "description": "모던 비스트로. 볼량시장 근처 세련된 분위기",
    "days": ["DAY 7"]
  },
  {
    "name": "Tapabento",
    "searchName": "Tapabento Porto São Bento",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-22:30",
    "type": "restaurant",
    "address": "Rua da Madeira 222, 4000-330 Porto",
    "description": "상벤투역 옆 타파스. 현지인 인기 ⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "DOP Restaurante",
    "searchName": "DOP Restaurante Porto Palácio das Artes",
    "rating": 4.6,
    "price": "€€€€",
    "hours": "12:30-15:00, 19:30-23:00",
    "type": "restaurant",
    "address": "Largo de São Domingos 18, 4050-545 Porto",
    "description": "셰프 루이 파울라. 미쉐린급 포르투갈 요리 ⭐",
    "days": ["DAY 8"]
  },
  {
    "name": "Tasquinha Zé Povinho",
    "searchName": "Tasquinha Zé Povinho Porto",
    "rating": 4.7,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Rua Chã 152, 4050-163 Porto",
    "description": "포르투 최고 평점 타스카. 전통 가정식 ⭐⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "Tito I Matosinhos",
    "searchName": "Tito I Matosinhos Porto",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "seafood",
    "address": "R. Heróis de França 452, 4450-163 Matosinhos",
    "description": "마토지뉴스 해산물. 구운 정어리, 오징어 ⭐",
    "days": ["DAY 9"]
  },
  {
    "name": "Time Out Market Porto",
    "searchName": "Time Out Market Porto São Bento",
    "rating": 4.4,
    "price": "€€",
    "hours": "10:00-00:00",
    "type": "restaurant",
    "address": "Praça de Almeida Garrett, 4000-069 Porto",
    "description": "상벤투역 푸드마켓. 11개 맛집 집결 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Do Norte Café",
    "searchName": "Do Norte Café Porto",
    "rating": 4.4,
    "price": "€",
    "hours": "09:00-19:00",
    "type": "cafe",
    "address": "R. de Mouzinho da Silveira 32, 4050-416 Porto",
    "description": "아늑한 카페. 맛있는 커피+브런치",
    "days": ["DAY 7"]
  },
  {
    "name": "Padaria Ribeiro",
    "searchName": "Padaria Ribeiro Porto",
    "rating": 4.6,
    "price": "€",
    "hours": "07:00-20:00",
    "type": "cafe",
    "address": "Praça Guilherme Gomes Fernandes 21, 4050-293 Porto",
    "description": "1880년 전통 베이커리. 에끌레어 추천 ⭐",
    "days": ["DAY 7"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 🍽️ 2025-02-22 AI 자동 추가: 리스본 맛집 (DAY 2~3)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "Cervejaria Ramiro",
    "searchName": "Cervejaria Ramiro Lisboa",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-00:30",
    "type": "seafood",
    "address": "Av. Alm. Reis 1 H, 1150-007 Lisboa",
    "description": "보르뎅 인정 해산물 맛집. 게+새우 필수 ⭐⭐",
    "days": ["DAY 2", "DAY 3"]
  },
  {
    "name": "A Marisqueira do Lis",
    "searchName": "A Marisqueira do Lis Lisboa",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "seafood",
    "address": "Av. Alm. Reis 3, 1150-007 Lisboa",
    "description": "라미로 대안. 대기줄 없이 신선한 해산물",
    "days": ["DAY 2"]
  },
  {
    "name": "A Cevicheria",
    "searchName": "A Cevicheria Lisboa Príncipe Real",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-00:00",
    "type": "seafood",
    "address": "R. Dom Pedro V 129, 1250-096 Lisboa",
    "description": "셰프 키코 마르틴스. 페루+포르투갈 퓨전 ⭐⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "A Casa do Bacalhau",
    "searchName": "A Casa do Bacalhau Lisboa Beato",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00, 19:30-23:00",
    "type": "seafood",
    "address": "Rua do Grilo 54, 1950-144 Lisboa",
    "description": "바칼랴우 전문점. 벽돌 아치 인테리어 ⭐",
    "days": ["DAY 3"]
  },
  {
    "name": "Laurentina",
    "searchName": "Restaurante Laurentina Lisboa",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-16:00, 19:00-23:00",
    "type": "seafood",
    "address": "Av. Conde Valbom 71A, 1050-067 Lisboa",
    "description": "1976년 바칼랴우 전문. 콤 나타스 추천 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "O Beco",
    "searchName": "O Beco Alfama Lisboa",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "seafood",
    "address": "Beco do Arco Escuro 4, 1100-026 Lisboa",
    "description": "알파마 숨은 골목 맛집. 바칼랴우 전문",
    "days": ["DAY 2"]
  },
  {
    "name": "Clube do Bacalhau",
    "searchName": "Clube do Bacalhau Lisboa Cais do Sodré",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "seafood",
    "address": "Travessa do Cotovelo 12, 1200-167 Lisboa",
    "description": "바칼랴우 클럽. 폼발 양식 아치형 내부",
    "days": ["DAY 2"]
  },
  {
    "name": "Cervejaria Ribadouro",
    "searchName": "Cervejaria Ribadouro Lisboa Avenida",
    "rating": 4.4,
    "price": "€€€",
    "hours": "12:00-00:00",
    "type": "seafood",
    "address": "Av. da Liberdade 155, 1250-141 Lisboa",
    "description": "75년 전통. 타이거새우 20kg/일 소비 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Bono Lisboa",
    "searchName": "Bono Lisboa Cais do Sodré",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "seafood",
    "address": "R. do Alecrim 21, 1200-014 Lisboa",
    "description": "숨은 해산물 맛집. 농어+블랙라이스 추천",
    "days": ["DAY 2"]
  },
  {
    "name": "Baía do Peixe",
    "searchName": "Baía do Peixe Lisboa",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:30",
    "type": "seafood",
    "address": "R. Cais de Santarém 59, 1100-104 Lisboa",
    "description": "테주강변 해산물. 신선한 생선 그릴",
    "days": ["DAY 2"]
  },
  {
    "name": "Restaurante Carmo",
    "searchName": "Restaurante Carmo Lisboa",
    "rating": 4.3,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "Largo do Carmo 11, 1200-092 Lisboa",
    "description": "카르모 수녀원 앞. 바칼랴우 아 브라스 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Vida de Tasca",
    "searchName": "Vida de Tasca Lisboa Roma",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-23:00",
    "type": "restaurant",
    "address": "R. Moniz Barreto 7, 1700-306 Lisboa",
    "description": "2024 오픈 타스카. 셰프 레오노르 비토케 추천 ⭐",
    "days": ["DAY 3"]
  },
  {
    "name": "Guelra",
    "searchName": "Guelra Restaurante Lisboa Belém",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-15:00, 19:00-23:00",
    "type": "seafood",
    "address": "R. de Belém 35, 1300-085 Lisboa",
    "description": "벨렘 모던 해산물. 바칼랴우 3종 ⭐",
    "days": ["DAY 3"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 🍽️ 2025-02-22 AI 자동 추가: 신트라 맛집 (DAY 4~5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "Casa Piriquita",
    "searchName": "Casa Piriquita Sintra",
    "rating": 4.4,
    "price": "€",
    "hours": "08:00-20:00",
    "type": "dessert",
    "address": "R. das Padarias 1, 2710-602 Sintra",
    "description": "1862년 전통 베이커리. 트라베세이루+케이자다 ⭐⭐",
    "days": ["DAY 4", "DAY 5"]
  },
  {
    "name": "Café Saudade",
    "searchName": "Café Saudade Sintra",
    "rating": 4.4,
    "price": "€€",
    "hours": "08:30-20:00",
    "type": "cafe",
    "address": "Av. Dr. Miguel Bombarda 6, 2710-590 Sintra",
    "description": "아름다운 인테리어. 브런치+디저트 추천 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Incomum by Luis Santos",
    "searchName": "Incomum Restaurante Sintra",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:30-15:00, 19:30-22:00",
    "type": "restaurant",
    "address": "R. Dr. Alfredo da Costa 22, 2710-523 Sintra",
    "description": "모던 포르투갈 요리. 문어+시금치+고구마 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Tascantiga",
    "searchName": "Tascantiga Sintra",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. Consiglieri Pedroso 18, 2710-550 Sintra",
    "description": "전통 요리 재해석. 아늑한 비스트로",
    "days": ["DAY 4"]
  },
  {
    "name": "Romaria de Baco",
    "searchName": "Romaria de Baco Sintra",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. Gil Vicente 2, 2710-568 Sintra",
    "description": "숨은 맛집. 페티스코스+와인 페어링 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Nau Palatina",
    "searchName": "Nau Palatina Sintra",
    "rating": 4.4,
    "price": "€€€",
    "hours": "12:00-22:00",
    "type": "seafood",
    "address": "R. Visconde de Monserrate 12, 2710-591 Sintra",
    "description": "지중해+포르투갈 퓨전. 해산물 카타플라나",
    "days": ["DAY 4"]
  },
  {
    "name": "Restaurante Regional",
    "searchName": "Restaurante Regional de Sintra",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-16:00, 19:00-22:00",
    "type": "restaurant",
    "address": "Travessa do Município 2, 2710-592 Sintra",
    "description": "전통 스튜 맛집. 현지인 추천 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Bar do Binho",
    "searchName": "Bar do Binho Sintra",
    "rating": 4.3,
    "price": "€€",
    "hours": "11:00-20:00",
    "type": "cafe",
    "address": "Praça da República 8, 2710-616 Sintra",
    "description": "포트와인 테이스팅. 국립궁전 뷰 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Restaurante Azenhas do Mar",
    "searchName": "Restaurante Azenhas do Mar Sintra",
    "rating": 4.3,
    "price": "€€€",
    "hours": "12:30-23:00",
    "type": "seafood",
    "address": "Restaurante Piscina, 2705-104 Azenhas do Mar",
    "description": "절벽 위 해산물. 조개+따개비 필수 ⭐⭐",
    "days": ["DAY 5"]
  },
  {
    "name": "Lawrence's Restaurant",
    "searchName": "Lawrence's Hotel Restaurant Sintra",
    "rating": 4.5,
    "price": "€€€€",
    "hours": "12:30-15:00, 19:30-22:00",
    "type": "restaurant",
    "address": "Rua Consiglieri Pedroso 38-40, 2710-550 Sintra",
    "description": "역사적 호텔 레스토랑. 파인다이닝 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "COMO Restaurante",
    "searchName": "COMO Restaurante Sintra",
    "rating": 4.4,
    "price": "€€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. Guilherme Gomes Fernandes 19, 2710-721 Sintra",
    "description": "국립궁전 뷰. 공유 요리+타이거새우",
    "days": ["DAY 4"]
  },
  {
    "name": "Dona Maria Café",
    "searchName": "Café Dona Maria Sintra",
    "rating": 4.2,
    "price": "€",
    "hours": "09:00-20:00",
    "type": "cafe",
    "address": "Av. do Movimento das Forças Armadas 1, 2710-400 Sintra",
    "description": "페나궁 하산 후 시원한 맥주 스팟",
    "days": ["DAY 4", "DAY 5"]
  },
  {
    "name": "A Margem",
    "searchName": "A Margem Lisboa Belém",
    "rating": 4.4,
    "price": "€€",
    "hours": "10:00-23:00",
    "type": "restaurant",
    "address": "Doca do Bom Sucesso, 1400-038 Lisboa",
    "description": "테주 강변 뷰가 아름다운 모던 레스토랑",
    "days": ["DAY 3"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 🍽️ 2025-02-22 구글 지도 기반 추가 데이터 (관광지 근처 맛집 확장)
  // ═══════════════════════════════════════════════════════════════════════════
  // 리스본 (알파마/대성당/상조르즈성 근처)
  {
    "name": "Alpendre",
    "searchName": "Restaurante Alpendre Lisboa",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "seafood",
    "address": "R. Augusto Rosa 32, 1100-059 Lisboa",
    "description": "대성당 근처. 신선한 해산물과 친절한 서비스 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Pateo 13",
    "searchName": "Pateo 13 Lisboa Alfama",
    "rating": 4.3,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Calçadinha de Santo Estêvão 13, 1100-502 Lisboa",
    "description": "알파마 야외 그릴. 정어리 구이 냄새가 가득한 곳",
    "days": ["DAY 2"]
  },
  {
    "name": "Miss Can",
    "searchName": "Miss Can Lisboa Petiscos",
    "rating": 4.7,
    "price": "€",
    "hours": "11:00-20:00",
    "type": "landmark",
    "address": "Largo do Conde de Henriques 17, 1100-159 Lisboa",
    "description": "상 조르즈 성 근처. 통조림 타파스와 와인",
    "days": ["DAY 2"]
  },
  // 리스본 (시아두/바이샤)
  {
    "name": "Sea Me - Peixaria Moderna",
    "searchName": "Sea Me Peixaria Moderna Lisboa",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:30-23:30",
    "type": "seafood",
    "address": "Rua do Loreto 21, 1200-241 Lisboa",
    "description": "현대적인 해산물 시장 컨셉. 스시와 포르투갈 요리의 만남",
    "days": ["DAY 2"]
  },
  {
    "name": "Bairro do Avillez",
    "searchName": "Bairro do Avillez Lisboa",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00-00:00",
    "type": "restaurant",
    "address": "R. Nova da Trindade 18, 1200-303 Lisboa",
    "description": "스타 셰프 호세 아빌레즈의 미식 타운. 타파스부터 파인다이닝까지 ⭐",
    "days": ["DAY 2"]
  },
  // 리스본 (벨렝)
  {
    "name": "Nunes Real Marisqueira",
    "searchName": "Nunes Real Marisqueira Belém",
    "rating": 4.6,
    "price": "€€€€",
    "hours": "12:00-00:00",
    "type": "seafood",
    "address": "R. Bartolomeu Dias 120, 1400-031 Lisboa",
    "description": "벨렝탑 근처 최고급 해산물. 랍스터와 거북손",
    "days": ["DAY 3"]
  },
  {
    "name": "Taberna dos Ferreiros",
    "searchName": "Taberna dos Ferreiros Belém",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "Tv. dos Ferreiros a Belém 5, 1300-260 Lisboa",
    "description": "제로니무스 수도원 근처. 골목 안 아늑한 포르투갈 식당",
    "days": ["DAY 3"]
  },
  // 신트라
  {
    "name": "Bacalhau na Vila",
    "searchName": "Bacalhau na Vila Sintra",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "seafood",
    "address": "Arco do Terreiro 3, 2710-623 Sintra",
    "description": "신트라 왕궁 바로 앞. 다양한 대구 요리 타파스 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "A Raposa",
    "searchName": "Restaurante A Raposa Sintra",
    "rating": 4.7,
    "price": "€€€",
    "hours": "12:30-15:00, 19:00-22:00",
    "type": "restaurant",
    "address": "R. Dr. Alfredo da Costa 3, 2710-523 Sintra",
    "description": "신트라 역 근처. 훌륭한 서비스와 티룸 분위기",
    "days": ["DAY 4"]
  },
  // 포르투
  {
    "name": "Cantina 32",
    "searchName": "Cantina 32 Porto",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:30-23:00",
    "type": "restaurant",
    "address": "R. das Flores 32, 4050-262 Porto",
    "description": "플로레스 거리 힙한 맛집. 문어 구이와 치즈케이크 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Adega São Nicolau",
    "searchName": "Adega São Nicolau Porto",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "seafood",
    "address": "R. de São Nicolau 1, 4050-561 Porto",
    "description": "리베이라 골목 숨은 맛집. 문어밥과 정어리",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Voltaria",
    "searchName": "Voltaria Petisqueira Porto",
    "rating": 4.8,
    "price": "€",
    "hours": "12:30-16:00, 19:00-22:00",
    "type": "budget",
    "address": "R. Afonso Martins Alho 109, 4050-018 Porto",
    "description": "상벤투 역 근처. 작지만 강한 프란세지냐와 대구 요리 ⭐",
    "days": ["DAY 7"]
  },
  // 코임브라
  {
    "name": "No Tacho",
    "searchName": "No Tacho Coimbra",
    "rating": 4.6,
    "price": "€€",
    "hours": "12:30-15:00, 19:30-22:00",
    "type": "restaurant",
    "address": "R. da Moeda 20, 3000-275 Coimbra",
    "description": "코임브라 슬로우 푸드. 정성스러운 포르투갈 가정식",
    "days": ["DAY 6"]
  },
  {
    "name": "Dux Taberna Urbana",
    "searchName": "Dux Taberna Urbana Coimbra",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-00:00",
    "type": "restaurant",
    "address": "R. Dr. Manuel Rodrigues 39, 3000-258 Coimbra",
    "description": "세련된 타파스 바. 와인과 함께하는 저녁",
    "days": ["DAY 6"]
  },
  // 브라가
  {
    "name": "Taberna Belga",
    "searchName": "Taberna Belga Braga",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-00:00",
    "type": "budget",
    "address": "R. de Conego Luciano Afonso dos Santos 14, 4700-371 Braga",
    "description": "브라가 최고의 프란세지냐. 현지인들의 성지 ⭐",
    "days": ["DAY 9"]
  },
  {
    "name": "Retrokitchen",
    "searchName": "Retrokitchen Braga",
    "rating": 4.7,
    "price": "€",
    "hours": "12:00-14:30, 19:30-22:30",
    "type": "budget",
    "address": "R. do Anjo 96, 4700-305 Braga",
    "description": "가성비 최고의 런치 메뉴. 빈티지한 분위기",
    "days": ["DAY 9"]
  },
  // 기마랑이스
  {
    "name": "Buxa",
    "searchName": "Buxa Restaurante Guimarães",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "type": "restaurant",
    "address": "Largo da Oliveira 23, 4800-438 Guimarães",
    "description": "올리베이라 광장 중심. 야외 테라스에서 즐기는 타파스",
    "days": ["DAY 9"]
  },
  // 오비두스
  {
    "name": "Petrarum Domus",
    "searchName": "Petrarum Domus Bar Restaurante Óbidos",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. Direita, 2510-001 Óbidos",
    "description": "오비두스 메인 거리. 중세 분위기 인테리어",
    "days": ["DAY 5"]
  },
  // 파티마
  {
    "name": "Tia Alice",
    "searchName": "Restaurante Tia Alice Fátima",
    "rating": 4.7,
    "price": "€€€",
    "hours": "12:00-15:00, 19:30-22:00",
    "type": "restaurant",
    "address": "R. do Adro, 2495-401 Fátima",
    "description": "파티마 최고의 미식 경험. 미슐랭 가이드 추천 ⭐",
    "days": ["DAY 5"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 💰 2025-02-22 가성비 맛집(20유로 이하) 대거 추가
  // ═══════════════════════════════════════════════════════════════════════════
  // 리스본 (바이샤/알파마/시아두)
  {
    "name": "Zé dos Cornos",
    "searchName": "Zé dos Cornos Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-22:00",
    "type": "budget",
    "address": "Beco dos Surradores 5, 1100-591 Lisboa",
    "description": "현지인들의 성지. 숯불 등갈비와 정어리 구이 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "O Velho Eurico",
    "searchName": "O Velho Eurico Lisboa",
    "rating": 4.6,
    "price": "€",
    "hours": "12:30-15:00, 20:00-23:00",
    "type": "budget",
    "address": "Largo São Cristóvão 3, 1100-513 Lisboa",
    "description": "젊은 셰프들이 운영하는 힙한 타스카. 예약 필수",
    "days": ["DAY 2"]
  },
  {
    "name": "A Provinciana",
    "searchName": "Restaurante A Provinciana Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Tv. do Forno 23, 1150-193 Lisboa",
    "description": "호시우 광장 옆 숨은 골목 맛집. 가정식 백반",
    "days": ["DAY 2"]
  },
  {
    "name": "Das Flores",
    "searchName": "Restaurante Das Flores Lisboa",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-15:30 (점심만)",
    "type": "budget",
    "address": "R. das Flores 76, 1200-195 Lisboa",
    "description": "시아두 가성비 최고. 매일 바뀌는 오늘의 요리",
    "days": ["DAY 2"]
  },
  {
    "name": "Casa da Índia",
    "searchName": "Casa da Índia Lisboa",
    "rating": 4.2,
    "price": "€",
    "hours": "12:00-00:00",
    "type": "budget",
    "address": "R. do Loreto 49, 1200-086 Lisboa",
    "description": "숯불구이 치킨이 맛있는 활기찬 로컬 식당",
    "days": ["DAY 2"]
  },
  {
    "name": "As Bifanas do Afonso",
    "searchName": "As Bifanas do Afonso Lisboa",
    "rating": 4.6,
    "price": "€",
    "hours": "08:00-19:30",
    "type": "budget",
    "address": "R. da Madalena 146, 1100-340 Lisboa",
    "description": "리스본 최고의 비파나(고기 샌드위치) 맛집 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Floresta das Escadinhas",
    "searchName": "Floresta das Escadinhas Lisboa",
    "rating": 4.7,
    "price": "€",
    "hours": "12:00-15:30",
    "type": "budget",
    "address": "R. de Santa Justa 3, 1100-483 Lisboa",
    "description": "산타 후스타 엘리베이터 근처. 숯불 생선구이",
    "days": ["DAY 2"]
  },
  // 포르투 (시내/리베이라)
  {
    "name": "Casa Guedes",
    "searchName": "Casa Guedes Tradicional Porto",
    "rating": 4.5,
    "price": "€",
    "hours": "10:00-00:00",
    "type": "budget",
    "address": "Praça dos Poveiros 130, 4000-398 Porto",
    "description": "포르투 명물 샌드위치(Sandes de Pernil) ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Gazela",
    "searchName": "Cervejaria Gazela Porto",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-22:30",
    "type": "budget",
    "address": "R. de Entreparedes 8, 4000-197 Porto",
    "description": "매콤한 핫도그 '카초리뉴' 맛집. 맥주 안주로 최고",
    "days": ["DAY 7"]
  },
  {
    "name": "Pedro dos Frangos",
    "searchName": "Pedro dos Frangos Porto",
    "rating": 4.4,
    "price": "€",
    "hours": "12:00-23:00",
    "type": "budget",
    "address": "R. do Bonjardim 223, 4000-124 Porto",
    "description": "가성비 최고의 숯불 치킨. 현지인 바글바글",
    "days": ["DAY 7"]
  },
  {
    "name": "Taxca",
    "searchName": "Taxca A Badalhoca Porto",
    "rating": 4.5,
    "price": "€",
    "hours": "11:00-22:00",
    "type": "budget",
    "address": "R. da Picaria 26, 4050-477 Porto",
    "description": "간단한 타파스와 와인을 즐기기 좋은 스탠딩 바",
    "days": ["DAY 7"]
  },
  {
    "name": "O Buraco",
    "searchName": "Restaurante O Buraco Porto",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "R. do Bolhão 95, 4000-112 Porto",
    "description": "볼량시장 근처 지하 식당. 오리밥과 문어튀김",
    "days": ["DAY 7"]
  },
  // 신트라
  {
    "name": "Apeadeiro",
    "searchName": "Restaurante Apeadeiro Sintra",
    "rating": 4.4,
    "price": "€",
    "hours": "11:30-22:00",
    "type": "budget",
    "address": "Av. Dr. Miguel Bombarda 3, 2710-590 Sintra",
    "description": "신트라 역 근처 가성비 최고 식당. 양이 푸짐함 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Tulhas",
    "searchName": "Tulhas Bar Restaurante Sintra",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-22:00",
    "type": "restaurant",
    "address": "R. Gil Vicente 4, 2710-568 Sintra",
    "description": "구시가 골목 안 창고 개조 식당. 바칼랴우 추천",
    "days": ["DAY 4"]
  },
  {
    "name": "Cantinho de São Pedro",
    "searchName": "Cantinho de São Pedro Sintra",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-22:00",
    "type": "budget",
    "address": "Praça Dom Fernando II 18, 2710-483 Sintra",
    "description": "현지인들이 찾는 숨은 맛집. 돌판 스테이크",
    "days": ["DAY 4"]
  },
  // 코임브라
  {
    "name": "Quim dos Ossos",
    "searchName": "Quim dos Ossos Coimbra",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-22:00",
    "type": "budget",
    "address": "Beco do Forno 12, 3000-177 Coimbra",
    "description": "뼈다귀 고기가 유명한 전설적인 타스카 ⭐",
    "days": ["DAY 6"]
  },
  {
    "name": "A Cozinha da Maria",
    "searchName": "A Cozinha da Maria Coimbra",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-15:00, 19:00-22:30",
    "type": "restaurant",
    "address": "R. das Azeiteiras 65, 3000-065 Coimbra",
    "description": "아늑한 분위기의 가정식. 타일 장식이 예쁨",
    "days": ["DAY 6"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 💰 2025-02-22 가성비 맛집 추가 (총 43개 맞춤)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "A Merendinha do Arco",
    "searchName": "A Merendinha do Arco Lisboa",
    "rating": 4.6,
    "price": "€",
    "hours": "08:00-20:00",
    "type": "budget",
    "address": "R. dos Sapateiros 230, 1100-581 Lisboa",
    "description": "호시우 역 근처. 대구 튀김(Pataniscas)과 해물밥 맛집 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Crisfama",
    "searchName": "Crisfama Lisboa",
    "rating": 4.8,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "R. da Cruz de Santa Apolónia 58, 1100-188 Lisboa",
    "description": "알파마 근처. 친절한 사장님과 집밥 같은 요리",
    "days": ["DAY 2"]
  },
  {
    "name": "Super Mário",
    "searchName": "Restaurante Super Mário Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "09:00-21:00",
    "type": "budget",
    "address": "R. do Duque 9, 1200-158 Lisboa",
    "description": "바이샤 지구 초저렴 맛집. 비파나와 맥주",
    "days": ["DAY 2"]
  },
  {
    "name": "Estrela da Bica",
    "searchName": "Estrela da Bica Lisboa",
    "rating": 4.4,
    "price": "€",
    "hours": "12:00-00:00",
    "type": "budget",
    "address": "Tv. do Cabral 33, 1200-073 Lisboa",
    "description": "비카 푸니쿨라 옆. 퓨전 타파스와 아늑한 분위기",
    "days": ["DAY 2"]
  },
  {
    "name": "Casa Expresso",
    "searchName": "Casa Expresso Porto",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Praça de Carlos Alberto 73, 4050-157 Porto",
    "description": "알리아두스 근처. 전통 포르투갈 간 요리(Iscas)",
    "days": ["DAY 7"]
  },
  {
    "name": "Churrasqueira Lameiras",
    "searchName": "Churrasqueira Lameiras Porto",
    "rating": 4.6,
    "price": "€",
    "hours": "11:30-15:00, 18:30-22:00",
    "type": "budget",
    "address": "R. do Bonjardim 546, 4000-118 Porto",
    "description": "트린다드 역 근처. 숯불 치킨과 립 가성비 최고",
    "days": ["DAY 7"]
  },
  {
    "name": "O Rápido",
    "searchName": "Restaurante O Rápido Porto",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "R. da Madeira 194, 4000-330 Porto",
    "description": "상벤투 역 바로 옆. 빠르고 맛있는 정식",
    "days": ["DAY 7"]
  },
  {
    "name": "Kardoso",
    "searchName": "Kardoso Porto",
    "rating": 4.4,
    "price": "€",
    "hours": "11:00-23:00",
    "type": "budget",
    "address": "R. do Dr. Ricardo Jorge 65, 4050-514 Porto",
    "description": "클레리구스 근처. 저렴한 프란세지냐와 스테이크",
    "days": ["DAY 7"]
  },
  {
    "name": "Cantinho Gourmet",
    "searchName": "Cantinho Gourmet Sintra",
    "rating": 4.7,
    "price": "€",
    "hours": "10:00-19:00",
    "type": "budget",
    "address": "Av. Dr. Miguel Bombarda 49, 2710-590 Sintra",
    "description": "신트라 역 근처. 치즈, 햄, 와인 타파스",
    "days": ["DAY 4"]
  },
  {
    "name": "Pregaria da Sé",
    "searchName": "Pregaria da Sé Braga",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-23:00",
    "type": "budget",
    "address": "R. Dom Paio Mendes 29, 4700-424 Braga",
    "description": "브라가 대성당 앞. 다양한 프레고(고기 샌드위치)",
    "days": ["DAY 9"]
  },
  {
    "name": "Caco, o Original",
    "searchName": "Caco o Original Coimbra",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-23:00",
    "type": "budget",
    "address": "R. do Corpo de Deus 22, 3000-123 Coimbra",
    "description": "코임브라 구시가. 볼루 두 카쿠(마데이라 빵) 버거",
    "days": ["DAY 6"]
  },
  {
    "name": "O Mimo",
    "searchName": "Restaurante O Mimo Coimbra",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "R. de Saragoça 15, 3000-358 Coimbra",
    "description": "현지인들이 줄 서는 가성비 식당. 스테이크와 해산물밥 추천",
    "days": ["DAY 6"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 👑 2025-02-22 아주다 궁전 및 가성비 맛집 추가
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "Palácio Nacional da Ajuda",
    "searchName": "Palácio Nacional da Ajuda Lisboa",
    "rating": 4.6,
    "price": "€5",
    "hours": "10:00–18:00",
    "type": "landmark",
    "address": "Largo da Ajuda, 1349-021 Lisboa",
    "description": "포르투갈 왕실의 마지막 거주지. 화려한 네오클래식 양식",
    "days": ["DAY 3"]
  },
  {
    "name": "Rota dos Petiscos",
    "searchName": "Rota dos Petiscos Lisboa Ajuda",
    "rating": 4.6,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "Calçada da Ajuda 204, 1300-016 Lisboa",
    "description": "아주다 궁전 근처 가성비 타파스. 문어 샐러드 추천 ⭐",
    "days": ["DAY 3"]
  },
  {
    "name": "Tasquinha do Bé",
    "searchName": "Tasquinha do Bé Belém Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "budget",
    "address": "R. de Belém 118, 1300-086 Lisboa",
    "description": "벨렝 지구 숨은 로컬 식당. 오늘의 요리 가성비 최고",
    "days": ["DAY 3"]
  },
  {
    "name": "Cantinho do Aziz",
    "searchName": "Cantinho do Aziz Lisboa",
    "rating": 4.4,
    "price": "€",
    "hours": "11:00-23:00",
    "type": "budget",
    "address": "R. de São Lourenço 5, 1100-530 Lisboa",
    "description": "모라리아 지구의 전설적인 모잠비크 퓨전 식당",
    "days": ["DAY 2"]
  },
  {
    "name": "레스토랑 우마",
    "searchName": "Restaurante Uma Lisboa",
    "type": "seafood",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "R. dos Sapateiros 177, 1100-044 Lisboa",
    "description": "리스본 3대 해물밥 맛집. 단일 메뉴 '해물밥' 전문 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "A Margarida da Belém",
    "searchName": "A Margarida da Belém Lisboa",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "R. de Belém 57, 1300-085 Lisboa",
    "description": "벨렝 지구의 숨은 보석. 전통 포르투갈 가정식",
    "days": ["DAY 3"]
  },
  {
    "name": "Canto da Vila",
    "searchName": "Canto da Vila Lisboa",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. de São João da Praça 2, 1100-521 Lisboa",
    "description": "대성당 근처 아늑한 식당. 문어 요리와 타파스 추천 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Casinha São João",
    "searchName": "Casinha São João Porto",
    "type": "restaurant",
    "rating": 4.7,
    "price": "€€",
    "hours": "12:30-23:00",
    "address": "R. de São João 38, 4050-552 Porto",
    "description": "리베이라 근처 아늑한 식당. 문어 요리와 스테이크 추천 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Zenith Porto",
    "searchName": "Zenith Brunch & Cocktails Bar Porto",
    "type": "cafe",
    "rating": 4.5,
    "price": "€€",
    "hours": "09:00-18:00",
    "address": "Praça de Carlos Alberto 86, 4050-158 Porto",
    "description": "포르투 최고 인기 브런치 카페. 에그베네딕트, 팬케이크 ⭐",
    "days": ["DAY 7", "DAY 8"]
  },
  {
    "name": "Abadia do Porto",
    "searchName": "Restaurante Abadia do Porto",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-23:00",
    "address": "R. de Passos Manuel 161, 4000-382 Porto",
    "description": "1939년 오픈한 전통 맛집. 양고기와 대구 요리 전문 ⭐",
    "days": ["DAY 7"]
  },
  {
    "name": "Metamorphosis",
    "searchName": "Restaurante Metamorphosis Sintra",
    "type": "restaurant",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00-22:00",
    "address": "R. Dr. Alfredo da Costa 7, 2710-523 Sintra",
    "description": "신트라 역 근처 현지인 맛집. 대구 요리와 스테이크",
    "days": ["DAY 4"]
  },
  {
    "name": "Fangas Maior",
    "searchName": "Fangas Maior Coimbra",
    "type": "restaurant",
    "rating": 4.5,
    "price": "€€",
    "hours": "12:30-23:00",
    "address": "R. de Fernandes Tomás 45, 3000-168 Coimbra",
    "description": "코임브라 구시가 타파스 바. 세련된 포르투갈 요리",
    "days": ["DAY 6"]
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 🏛️ 2025-02-22 리스본 2일차 추가 명소 (동선 최적화)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    "name": "카몽이스 광장",
    "searchName": "Praça Luís de Camões Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça Luís de Camões, 1200-243 Lisboa",
    "description": "시아두 지구의 중심. 포르투갈 대문호 카몽이스 동상",
    "days": ["DAY 2"]
  },
  {
    "name": "베르트랑 서점",
    "searchName": "Livraria Bertrand Chiado",
    "rating": 4.5,
    "price": "무료",
    "hours": "09:00–22:00",
    "type": "landmark",
    "address": "R. Garrett 73 75, 1200-203 Lisboa",
    "description": "1732년 개업. 기네스북 등재 '세계에서 가장 오래된 서점'",
    "days": ["DAY 2"]
  },
  {
    "name": "상 도밍구스 성당",
    "searchName": "Igreja de São Domingos Lisboa",
    "rating": 4.7,
    "price": "무료",
    "hours": "07:30–19:00",
    "type": "church",
    "address": "Largo de São Domingos, 1150-320 Lisboa",
    "description": "화재의 흔적이 그대로 남은 붉은 내부가 압도적인 성당 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "산투 안토니우 성당",
    "searchName": "Igreja de Santo António de Lisboa",
    "rating": 4.6,
    "price": "무료",
    "hours": "09:00–19:00",
    "type": "church",
    "address": "Largo de Santo António da Sé, 1100-401 Lisboa",
    "description": "리스본 수호성인 성 안토니오가 태어난 자리에 세워진 성당",
    "days": ["DAY 2"]
  },
  {
    "name": "산타 루지아 전망대",
    "searchName": "Miradouro de Santa Luzia Lisboa",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Largo Santa Luzia, 1100-487 Lisboa",
    "description": "아줄레주와 덩굴이 어우러진 가장 로맨틱한 전망대 ⭐",
    "days": ["DAY 2"]
  },
  {
    "name": "Amorino",
    "searchName": "Amorino Baixa Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "10:30–00:00",
    "type": "dessert",
    "address": "R. Augusta 209, 1100-051 Lisboa",
    "description": "장미 모양 젤라또. 아우구스타 거리의 명물",
    "days": ["DAY 2"]
  },
  {
    "name": "Nata Portuguesa",
    "searchName": "Nata Portuguesa Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "08:00-22:00",
    "type": "dessert",
    "address": "Lisboa",
    "description": "2일차 아침 장소. 에그타르트",
    "days": ["DAY 2"]
  },
  {
    "name": "Indomável",
    "searchName": "Indomável Restaurante Tapas Bar Lisboa",
    "rating": 4.7,
    "price": "€€",
    "hours": "12:00-00:00",
    "type": "restaurant",
    "address": "R. da Rosa 237, 1200-385 Lisboa",
    "description": "타파스 & 바. 점심 식사 장소",
    "days": ["DAY 2"]
  },
  {
    "name": "O Castiço",
    "searchName": "Restaurante O Castiço Lisboa",
    "rating": 4.5,
    "price": "€",
    "hours": "12:00-15:00, 19:00-22:00",
    "type": "restaurant",
    "address": "R. de Santo António da Sé 4, 1100-499 Lisboa",
    "description": "대성당 근처 현지인 맛집. 포르투갈 가정식",
    "days": ["DAY 2"]
  },
  // 2025-02-22 DAY 3 일정 고도화 추가 장소
  {
    "name": "MAAT",
    "searchName": "MAAT Museum of Art Architecture and Technology",
    "rating": 4.5,
    "price": "무료(루프탑)",
    "hours": "10:00–19:00",
    "type": "landmark",
    "address": "Av. Brasília, 1300-598 Lisboa",
    "description": "테주강변 현대 미술관. 루프탑 전망 최고 ⭐",
    "days": ["DAY 3"]
  },
  {
    "name": "핑크 스트리트",
    "searchName": "Pink Street Lisboa",
    "rating": 4.4,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "R. Nova do Carvalho, 1200-370 Lisboa",
    "description": "리스본 핫플레이스. 핑크색 바닥 포토존 📸",
    "days": ["DAY 3"]
  },
  {
    "name": "임페리우 광장",
    "searchName": "Praça do Império Belém",
    "rating": 4.6,
    "price": "무료",
    "hours": "24시간",
    "type": "square",
    "address": "Praça do Império, 1400-206 Lisboa",
    "description": "수도원 앞 대형 정원 광장. 지하도 연결",
    "days": ["DAY 3"]
  },
  // 2025-02-22 DAY 4 신트라 가이드 일정 추가 장소
  {
    "name": "산타 마리아 트레일",
    "searchName": "Caminho de Santa Maria Sintra",
    "rating": 4.8,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Caminho de Santa Maria, Sintra",
    "description": "무어성에서 시내로 내려가는 숲속 비밀길 🌲",
    "days": ["DAY 4"]
  },
  {
    "name": "Lawrence's Hotel",
    "searchName": "Lawrence's Hotel Sintra",
    "rating": 4.6,
    "price": "무료(외관)",
    "hours": "24시간",
    "type": "landmark",
    "address": "R. Consiglieri Pedroso 38, 2710-550 Sintra",
    "description": "바이런 경이 머문 이베리아 최고령 호텔 🏨",
    "days": ["DAY 4"]
  },
  {
    "name": "카스카이스 해변",
    "searchName": "Praia da Ribeira de Cascais",
    "rating": 4.7,
    "price": "무료",
    "hours": "24시간",
    "type": "viewpoint",
    "address": "Praça 5 de Outubro, 2750-340 Cascais",
    "description": "신트라 여행의 완벽한 마무리. 평화로운 해변 🌊",
    "days": ["DAY 4"]
  },
  {
    "name": "Santini Cascais",
    "searchName": "Santini Cascais",
    "rating": 4.6,
    "price": "€",
    "hours": "11:00–00:00",
    "type": "dessert",
    "address": "Av. Valbom 28F, 2750-508 Cascais",
    "description": "포르투갈 젤라또의 전설, 산티니 본점 🍦",
    "days": ["DAY 4"]
  },
  {
    "name": "Mar do Inferno",
    "searchName": "Mar do Inferno Cascais",
    "rating": 4.5,
    "price": "€€€",
    "hours": "12:00–22:00",
    "type": "seafood",
    "address": "Av. Rei Humberto II de Itália, 2750-642 Cascais",
    "description": "지옥의 입(Boca do Inferno) 근처 해산물 맛집. 거북손, 게 요리 ⭐",
    "days": ["DAY 4"]
  },
  {
    "name": "Hifen",
    "searchName": "Hifen Cascais",
    "rating": 4.4,
    "price": "€€",
    "hours": "12:00–02:00",
    "type": "restaurant",
    "address": "Av. Dom Carlos I 48, 2750-310 Cascais",
    "description": "카스카이스 만이 보이는 2층 바 & 레스토랑. 일몰 명소",
    "days": ["DAY 4"]
  },
  {
    "name": "House of Wonders",
    "searchName": "House of Wonders Cascais",
    "rating": 4.6,
    "price": "€€",
    "hours": "10:00–22:00",
    "type": "cafe",
    "address": "R. da Misericórdia 53, 2750-642 Cascais",
    "description": "루프탑이 예쁜 채식 카페. 건강한 메제 플레이트",
    "days": ["DAY 4"]
  }
];

// ─────────────────────────────────────────────
// 📅 일정 데이터 (ITINERARY)
// ─────────────────────────────────────────────
const ITINERARY = [
  {
    day: "DAY 1", date: "5/1 (금)",
    title: "✈️ 인천 → 리스본 도착",
    schedule: [
      { time: "20:40", activity: "✈️ KE921 인천 출발 (직항)" },
      { time: "03:20+1", activity: "리스본 도착, 입국 심사" },
      { time: "도착 후", activity: "택시/우버로 호텔 이동" },
      { time: "저녁", activity: "바이샤 거리 가볍게 산책 + 맥주 한 잔 🍺" }
    ],
    tips: ["⚠️ 5월 1일은 포르투갈 노동절(공휴일)"],
    transport: "🏨 My Story Hotel Tejo (1/4박)"
  },
  {
    day: "DAY 2", date: "5/2 (토)",
    title: "🏛️ 리스본 ① — 바이샤·시아두·알파마 (최종 확정 동선)",
    schedule: [
      { time: "09:00", activity: "피게이라 광장 → 호시우 광장 → 상 도밍구스 성당" },
      { time: "09:45", activity: "Nata Portuguesa → 글로리아 푸니쿨라 → 상 페드로 전망대" },
      { time: "10:30", activity: "상 로케 성당 → 카몽이스 광장 → Indomável" },
      { time: "11:30", activity: "A Brasileira → Manteigaria → 베르트랑 서점" },
      { time: "12:15", activity: "카르모 수녀원 → 산타 후스타 엘리베이터" },
      { time: "13:00", activity: "🍽️ 점심: 레스토랑 우마 (해물밥)" },
      { time: "14:30", activity: "통조림 가게 → 아우구스타 거리 → Amorino" },
      { time: "15:30", activity: "리스본 시청 → 개선문 → 코메르시우 광장" },
      { time: "16:30", activity: "리스본 대성당 → 산투 안토니우 성당" },
      { time: "17:15", activity: "🚕 Café da Garagem (이동/휴식) → 상 조르즈 성 (일몰)" },
      { time: "19:30", activity: "포르타스 두 솔 전망대 → 🍽️ 저녁: O Castiço 또는 우마" }
    ],
    tips: ["💡 글로리아 푸니쿨라: 리스보아 카드 무료", "💡 산타 후스타 엘리베이터: €5.3 (카드 무료)", "🦐 Ramiro: 택시 10분, 예약 추천"],
    transport: "🏨 My Story Hotel Tejo (2/4박) 🚶 도보 + 트램 + 푸니쿨라"
  },
  {
    day: "DAY 3", date: "5/3 (일)",
    title: "🏰 리스본 ② — 벨렝 ➡️ 시내 복귀 (구글맵 정밀 튜닝 완결판)",
    schedule: [
      { time: "09:00", activity: "🚋 피게이라 광장(숙소 앞)에서 트램 15E 탑승 → 벨렝 이동" },
      { time: "09:30", activity: "수도원 오픈런 대기 & 🥧 Pastéis de Belém (포장 후 대기 줄에서 취식) ⭐⭐" },
      { time: "10:00", activity: "제로니무스 수도원 ⭐⭐ & 산타 마리아 성당" },
      { time: "11:30", activity: "국립 해양 박물관 (또는 마차 박물관) 관람" },
      { time: "12:45", activity: "임페리우 광장 📸 → ⚠️ 광장 앞 '지하도'를 이용해 기찻길 건너 강변 이동" },
      { time: "13:00", activity: "발견기념비 ⭐ — 관람 후 서쪽(벨렝탑 방향)으로 강변 산책" },
      { time: "13:45", activity: "🍽️ 늦은 점심 (강변 일직선 동선) — A Margem (테주강 뷰 식사)" },
      { time: "15:15", activity: "벨렝탑 ⭐⭐ — 계속 서쪽으로 이동하여 관람 (외부 감상 위주 추천)" },
      { time: "16:15", activity: "벨렝탑 근처 🚕 우버 탑승 → 동쪽 MAAT(미술관) 이동" },
      { time: "16:30", activity: "MAAT 루프탑 산책 ⭐⭐⭐ — 테주강 & 4월 25일 다리 배경 인생샷" },
      { time: "17:15", activity: "MAAT 앞에서 🚕 우버 재호출 → LX Factory 이동" },
      { time: "17:30", activity: "LX Factory ⭐ — 힙한 상점, Ler Devagar 서점, 골목 그래피티 감상" },
      { time: "19:30", activity: "🚕 우버 시내 복귀 → 🍽️ 저녁: Frade dos Mares (문어 요리 / ⚠️ 일요일 예약 필수)" },
      { time: "21:00", activity: "🍻 Time Out Market — 일요일 밤 야시장 분위기 즐기기 (도보 5분)" },
      { time: "21:45", activity: "🎵 핑크 스트리트 (Pink Street) — 타임아웃 마켓 바로 옆! 주말 밤거리 구경 📸" },
      { time: "22:15", activity: "🛏️ 숙소 복귀 (도보 15분 or 우버 5분)" }
    ],
    tips: [
      "💡 물리지형 주의: 수도원에서 강변으로 넘어갈 때는 반드시 '임페리우 광장 앞 지하도' 이용",
      "💡 도보 동선: 발견기념비(동) ➡️ A Margem(중앙) ➡️ 벨렝탑(서) 순서로 걸어야 다리가 안 아픔",
      "⚠️ 일요일 팁: 제로니무스 오픈런 필수 / 저녁 식당 사전예약 필수"
    ],
    transport: "🏨 My Story Hotel Tejo (3/4박) 🚋 트램 15E + 🚕 우버(볼트) 적극 활용"
  },
  {
    day: "DAY 4", date: "5/4 (월)",
    title: "🚂 신트라 당일치기 — 동화 속 궁전과 유라시아 최서단 (가이드 숨은 명소 추가판)",
    schedule: [
      { time: "08:30", activity: "🚂 호시우역 → 신트라역 (40분, €2.4 / 진행 방향 오른쪽 창가 추천)" },
      { time: "09:15", activity: "☕ Café Saudade — 커피 한 잔 후 역 앞에서 툭툭/우버 탑승 (버스 대기열 회피)" },
      { time: "09:30", activity: "🚕 툭툭/우버 → 페나 궁전 매표소 직행 (산길 드라이브)" },
      { time: "10:00", activity: "🌳 페나 궁전 정문 통과 (궁전 입구까지 도보 15분 언덕길)" },
      { time: "10:30", activity: "🏰 페나 궁전 내부 입장 ⭐⭐ — 알록달록 동화 궁전 (사전예약 시간 칼같이 엄수!)" },
      { time: "11:45", activity: "🏯 무어성 ⭐ — 페나 궁전에서 내리막 도보 10분, 8세기 이슬람 요새 뷰" },
      { time: "12:45", activity: "🚶 산타 마리아 트레일 숲길 하산 (숨은 보석💎) → 구시가지 (약 35분, 버스보다 빠름)" },
      { time: "13:30", activity: "🍽️ 점심 — Tasco do Strauss (예약 필수) 등 구시가지 골목 맛집" },
      { time: "14:30", activity: "🥐 Casa Piriquita ⭐ — 150년 원조! 트라베세이루 & 케이자다 당 충전" },
      { time: "15:00", activity: "🚶 헤갈레이라로 걷는 길 → Lawrence's Hotel 외관 감상📸 (바이런이 머문 이베리아 최고령 호텔)" },
      { time: "15:15", activity: "🏛️ 헤갈레이라 별장 ⭐⭐ — 9층 지하 나선형 우물(가장 먼저 줄 서기!), 비밀 동굴" },
      { time: "16:45", activity: "🚕 치트키: 별장 앞 우버/볼트 호출 → 까보다로카 직행 (버스 타러 역으로 돌아가지 마세요!)" },
      { time: "17:15", activity: "🌅 까보다로카 ⭐⭐ — 십자가 기념비 인증샷 & 해안 절벽 산책 (강풍 주의)" },
      { time: "18:15", activity: "🚌 1624번 버스(구 403번) 탑승 → 카스카이스(Cascais) 역으로 이동 (우측 창가 대서양 뷰)" },
      { time: "19:00", activity: "🌊 카스카이스 해변 산책 & Santini 본점 젤라또🍦 (숨은 보석💎)" },
      { time: "20:00", activity: "🚂 카스카이스역 → 리스본(Cais do Sodré) 귀환 (환상의 루프 코스 완성)" }
    ],
    tips: [
      "💡 이동 꿀팁 1: 역에서 페나 궁전 올라갈 때는 툭툭 흥정(약 10~15유로)이 정신건강에 좋습니다.",
      "💡 이동 꿀팁 2: 무어성에서 구시가지 하산 시 '도보(Caminho de Santa Maria)'가 풍경도 좋고 대기 시간도 없습니다.",
      "💡 동선 치트키: 헤갈레이라 ➡️ 까보다로카 구간은 무조건 우버(볼트), 까보다로카 ➡️ 카스카이스 구간은 버스(1624번)가 진리!",
      "🧥 신트라 산꼭대기와 까보다로카 절벽은 리스본 시내보다 5도 이상 춥고 바람이 셉니다. 바람막이 필수!"
    ],
    transport: "🏨 My Story Hotel Tejo (4/4박) 🚂 기차(리스본 왕복 다른 노선) + 🚕 우버 + 🚌 버스"
  },
  {
    day: "DAY 5", date: "5/5 (화)",
    title: "🚗 중부 드라이브 — 오비두스 ➡️ 바탈랴 ➡️ 파티마 ➡️ 토마르 (히든 스팟 완결판)",
    schedule: [
      { time: "09:30", activity: "🚗 렌트카 픽업 수속 — 리스본 공항 (서류 확인 및 대기)" },
      { time: "10:15", activity: "🚗 리스본 출발 → 오비두스 이동 (80km, 약 1시간)" },
      { time: "11:15", activity: "🅿️ 주차: [Obidos parking] 검색 후 주차 (가장 넓은 메인 공영 주차장)" },
      { time: "11:20", activity: "📸 [Aqueduto de Usseira] (우세이라 수도교) — 주차장 앞 로마식 수도교 감상" },
      { time: "11:30", activity: "🏰 [Porta da Vila] (오비두스 성문) 진입 → 성벽 위 산책 ⭐" },
      { time: "12:00", activity: "🍒 진자(Ginjinha) 시음 — 초콜릿 잔에 담긴 체리술 마시기 (운전자 주의!)" },
      { time: "12:15", activity: "📍 [Igreja de Santa Maria] (산타 마리아 성당) — 구시가 골목 및 아줄레주 감상" },
      { time: "12:45", activity: "🍽️ 오비두스 점심 — 성벽 내 식당 (또는 이동 중 바탈랴 근처 식사)" },
      { time: "14:00", activity: "🚗 바탈랴 이동 (드라이브 치트키! / 50km, 약 40분)" },
      { time: "14:40", activity: "⛪ [Mosteiro da Batalha] (바탈랴 수도원) ⭐⭐⭐ — 미완성 예배당의 압도적 뷰 📸" },
      { time: "15:25", activity: "🚗 파티마 이동 (20km, 약 20분)" },
      { time: "15:45", activity: "🅿️ 주차: [Parque 1] 검색 (파티마 구 성당 바로 뒤편 명당 주차장)" },
      { time: "16:00", activity: "⛪ [Santuário de Fátima] (파티마 성모 발현지) ⭐⭐ — 거대한 순례자 광장 감상" },
      { time: "16:30", activity: "⛪ [Capelinha das Aparições] (성모 발현 예배당) — 1917년 성모 발현 떡갈나무 위치 참배" },
      { time: "17:00", activity: "🚗 토마르 방향으로 출발 (35km, 약 35분)" },
      { time: "17:35", activity: "💎 히든 스팟: [Aqueduto dos Pegões] 도착 — 30m 높이의 아찔한 수도교 위 걷기 📸" },
      { time: "18:00", activity: "🏨 토마르 시내 진입 (5분 소요) → 숙소 주차 및 체크인" },
      { time: "18:40", activity: "🌅 [Parque do Mouchão] (무샤웅 공원) & 나바옹 강변 산책 — 거대 물레방아 구경" },
      { time: "19:10", activity: "📍 [Praça da República] (헤푸블리카 광장) — 토마르 구시가 중심 (세례 요한 성당 외관)" },
      { time: "19:30", activity: "🍽️ 저녁 — [Taverna Antiqua] (중세 테마 식당, ⚠️사전예약 필수) 또는 Paço D'Alma" }
    ],
    tips: [
      "💡 구글맵 검색 팁: 대괄호 [ ] 안의 단어를 구글 지도에 그대로 검색하시면 100% 정확합니다.",
      "🚗 주차 꿀팁: 오비두스는 'Obidos parking', 파티마는 'Parque 1'을 찍고 가세요.",
      "📸 페고잉스 수도교(Aqueduto dos Pegões)는 렌트카 여행객만 누릴 수 있는 특권입니다. 꼭 들러보세요!",
      "⚠️ Taverna Antiqua는 토마르 최고의 인기 식당이므로 방문 전 구글맵을 통해 예약해 두세요."
    ],
    transport: "🏨 토마르 에어비앤비 🚗 렌트카 (총 이동거리 약 200km)"
  },
  {
    day: "DAY 6", date: "5/6 (수)",
    title: "🏰 토마르 → 코임브라 → 포르투 — 대학도시와 중세의 비밀",
    schedule: [
      { time: "09:00", activity: "🏰 [Convento de Cristo] (그리스도 수도원) ⭐⭐ — 마누엘 양식 창문 📸" },
      { time: "09:45", activity: "💎 [Charola do Convento de Cristo] — 템플 기사단의 8각 황금 예배당 필수 관람!" },
      { time: "10:30", activity: "🚗 토마르 관람 종료 → 코임브라로 바로 출발 (80km, 약 1시간 10분)" },
      { time: "11:45", activity: "🅿️ 코임브라 주차: [Parque de Estacionamento do Mercado Municipal D. Pedro V]" },
      { time: "12:00", activity: "🏃‍♂️ 점심 오픈런 대기: [Zé Manel dos Ossos] ⭐ — (12:30 오픈 전 1빠로 줄 서기!)" },
      { time: "12:30", activity: "🍽️ 점심 식사 — 코임브라 최고의 뼈 있는 돼지고기 구이 만끽" },
      { time: "13:30", activity: "🚕 치트키 발동: 식당 앞에서 우버/볼트 호출 → [Porta Férrea] 직행 (언덕 회피)" },
      { time: "13:45", activity: "🏛️ [Paço das Escolas] (구대학 광장) 진입 및 파노라마 뷰 감상" },
      { time: "14:00", activity: "📚 [Biblioteca Joanina] (조아니나 도서관) ⭐⭐ — ⚠️예약 시간 엄수 입장 (내부 촬영 금지)" },
      { time: "14:30", activity: "⛪ [Capela de São Miguel] (상 미겔 예배당) & [Torre da Universidade de Coimbra] (염소탑) 구경" },
      { time: "15:00", activity: "🚶‍♂️ 내리막 하산 시작 → 💎 [Museu Nacional de Machado de Castro] 로마 지하 통로(Cryptoporticus) 관람" },
      { time: "15:45", activity: "⛪ [Sé Velha de Coimbra] (코임브라 구 대성당) ⭐ — 로마네스크 양식 감상 후 계속 하산" },
      { time: "16:15", activity: "⛪ [Mosteiro de Santa Cruz] (산타크루스 수도원) & ☕ [Café Santa Cruz] 고딕 아치 아래서 커피 휴식" },
      { time: "16:45", activity: "🚗 주차장 복귀 후 포르투로 이동 (120km, 약 1시간 15분. 고속도로 A1 이용)" },
      { time: "18:00", activity: "🏨 포르투 숙소 도착 및 체크인" },
      { time: "18:30", activity: "📍 [Ponte Luís I] (동루이스 1세 다리) — 다리 상층부를 걸어서 도루강 건너기" },
      { time: "18:45", activity: "🌅 💎 [Jardim do Morro] (모루 정원) ⭐⭐⭐ — 잔디밭에 앉아 포르투 최고의 구시가지 일몰 감상" },
      { time: "19:30", activity: "🍽️ 저녁 — 가이아 지구 강변(Cais de Gaia) 또는 다리 아래로 내려와 리베이라 광장에서 식사" }
    ],
    tips: [
      "🎫 조아니나 도서관: 정해진 슬롯 시간에 지각하면 입장이 불가하니 10분 전 광장 대기 필수!",
      "🏛️ 마샤두 드 카스트루 박물관: 시간이 촉박하다면 1층과 2층 전시는 패스하고 '로마 지하 통로'만 보셔도 훌륭합니다.",
      "📸 동루이스 다리를 건널 때는 윗길(상층부)로 가야 뷰가 폭발합니다. 고소공포증이 있다면 주의하세요!",
      "🍽️ 맛집 팁: 'Zé Manel dos Ossos'는 대기가 매우 깁니다. 실패 시 근처 'Solar do Bacalhau'나 'Restaurante Sete'를 추천합니다."
    ],
    transport: "🏨 포르투 에어비앤비 (1/4박) 🚗 렌트카"
  },
  {
    day: "DAY 7", date: "5/7 (목)",
    title: "🏛️ 포르투 시내 완전 정복 (가이드 & QA 검증 디버깅 완료)",
    schedule: [
      { time: "09:00", activity: "🍳 조식 — [Balta Brunch] ⭐" },
      { time: "10:00", activity: "⛪ [Capela das Almas] (알마스 성당) — 외벽 전체가 푸른 아줄레주인 포토스팟" },
      { time: "10:15", activity: "📍 [Rua de Santa Catarina] 산책 → ☕ [Majestic Café] 외관 구경" },
      { time: "10:45", activity: "⛪ [Igreja de Santo Ildefonso] (산투 일데폰수 성당) 외관 인생샷 📸" },
      { time: "11:00", activity: "🛒 [Mercado do Bolhão] (볼량 시장) — 새단장한 포르투 전통 시장 구경" },
      { time: "11:45", activity: "🏃‍♂️ 점심 병목 방어: [Café Santiago] ⭐ (12시 전 입장하여 '프란세지냐' 흡입)" },
      { time: "13:00", activity: "🏛️ [Estação de São Bento] (상벤투 역) ⭐ — 세계에서 가장 아름다운 기차역" },
      { time: "13:30", activity: "⛪ 크리티컬 버그 패치💎: [Sé do Porto] (포르투 대성당) — 낮에 방문하여 화려한 아줄레주 '회랑(Claustros)' 필수 관람!" },
      { time: "14:15", activity: "📍 [Avenida dos Aliados] 산책 및 [McDonald's Imperial] 내부 구경" },
      { time: "14:45", activity: "📚 [Livraria Lello] (렐루 서점) ⭐ — 해리포터 모티브 (⚠️사전 예약 시간 엄수)" },
      { time: "15:30", activity: "⛪ [Igreja do Carmo] (카르무 성당) — 거대 아줄레주 외벽 & 1m '숨겨진 집' 찾기" },
      { time: "16:00", activity: "🏛️ [Torre dos Clérigos] (클레리구스 탑) ⭐ — 225계단 등반 (포르투 360도 전경)" },
      { time: "16:45", activity: "🌅 [Miradouro da Vitória] (비토리아 전망대) — 포르투 최고의 무료 파노라마 뷰" },
      { time: "17:00", activity: "🚶‍♂️ 하산: [Rua das Flores] (플로레스 거리) — 낭만적인 카페와 버스킹 감상" },
      { time: "17:15", activity: "🏛️ [Palácio da Bolsa] (볼사 궁전) — 화려한 아랍의 방 (⚠️가이드 투어 사전 예약)" },
      { time: "18:15", activity: "⛪ [Igreja Monumento de São Francisco] (상 프란시스쿠 교회) — 황금 400kg 내부" },
      { time: "18:45", activity: "📍 [Praça da Ribeira] (리베이라 광장) ⭐ — 강변 노천카페에서 샹그리아/맥주 한 잔" },
      { time: "19:30", activity: "🌉 [Ponte Luís I] (동 루이스 1세 다리) — 다리 1층(하층부)을 도보로 건너기" },
      { time: "19:45", activity: "🚠 체력 세이브 치트키: [Teleférico de Gaia] (가이아 케이블카) 탑승 → 공중 뷰 감상하며 상층부 이동" },
      { time: "20:00", activity: "🌅 [Jardim do Morro] (모루 정원) ⭐⭐⭐ — 잔디밭에 앉아 황금빛 일몰과 버스킹 감상" },
      { time: "21:00", activity: "🌃 [Mosteiro da Serra do Pilar] (세하 두 필라르 수도원) ⭐ — 완벽한 야경 감상" },
      { time: "21:30", activity: "🌉 다리 2층 도보 횡단 → 상벤투 역 방향으로 야경 산책하며 숙소 복귀" }
    ],
    tips: [
      "⚠️ 렐루 서점과 볼사 궁전은 시간 지정 예약 필수입니다. 동선에 맞춰 14:45 / 17:15 슬롯을 노려보세요.",
      "💡 대성당 회랑(Claustros do Sé) 입장료는 약 3유로이며, 절대 돈이 아깝지 않은 포르투 최고의 포토스팟입니다.",
      "🚠 가이아 케이블카는 보통 일몰 시간 전후로 줄이 생길 수 있으니 편도 티켓을 미리 사두시는 것도 좋습니다."
    ],
    transport: "🏨 포르투 에어비앤비 (2/4박) 🚶 도보 + 🚠 가이아 케이블카"
  },
  {
    day: "DAY 8", date: "5/8 (금)",
    title: "🌊 대서양 해안 드라이브 & 포스(Foz) 낭만 투어 (무결점 최종판)",
    schedule: [
      { time: "09:00", activity: "🍳 조식 — [CA Downtown] (든든하게 먹고 렌트카 탑승)" },
      { time: "10:00", activity: "🚗 포르투 도심 탈출! 해안 도로를 따라 남쪽 대서양 드라이브 (약 15km, 20분)" },
      { time: "10:30", activity: "🌊 [Capela do Senhor da Pedra] (세뉴르 다 페드라 성당) ⭐⭐⭐ — 대서양 바다 위 바위 예배당 감상" },
      { time: "11:30", activity: "🚗 북쪽으로 다시 이동하여 현지인 어촌 마을 진입 (약 15분 소요)" },
      { time: "11:45", activity: "🐟 [São Pedro da Afurada] (아푸라다 마을) — 골목마다 숯불 연기가 피어오르는 어촌 마을 구경" },
      { time: "12:15", activity: "🍽️ 로컬 점심 — [Taberna de São Pedro] 등 길거리 숯불 해산물 전문점 (농어/정어리 숯불구이)" },
      { time: "13:30", activity: "🚗 해안 드라이브: 아라비다 다리를 건너 포르투 서쪽 바닷가 '포스(Foz)' 지역으로 이동" },
      { time: "14:00", activity: "🌊 [Farolim de Felgueiras] (펠게이라스 등대) — 강과 바다가 만나는 방파제, 거친 파도 배경 인생샷 📸" },
      { time: "14:45", activity: "📍 [Pérgola da Foz] (포스 페르골라) — 노란색 낭만 산책로 구경 (해안 도로변 평행주차 이용)" },
      { time: "15:30", activity: "🚗 주차 치트키: 강변 도로(아라비다 다리)를 타고 다시 건너와 [Parque de Estacionamento WOW] 에 안전하게 실내 주차" },
      { time: "15:45", activity: "🏛️ [WOW Porto] — 복합문화공간 중앙 광장에서 포르투 시내 파노라마 뷰 감상" },
      { time: "16:15", activity: "🚠 중력 순응 하강: [Teleférico de Gaia] (가이아 케이블카) 탑승 → 공중 뷰 감상하며 강변으로 쾌적하게 수직 하강" },
      { time: "16:25", activity: "📸 1분 컷 보석💎: 케이블카 하차 후 골목 모퉁이의 유명 정크아트 [Half Rabbit] (하프 래빗) 벽화 감상" },
      { time: "16:40", activity: "🚶‍♂️ 강변 횡단: 가이아 강변 구경 후, [Ponte Luís I] (동 루이스 1세 다리) '1층(하층부)'을 도보로 건너 포르투 시내 진입" },
      { time: "17:00", activity: "🚕 동선 치트키: 다리 건너자마자 우버/볼트 호출 → 언덕 위의 [Jardins do Palácio de Cristal] 직행 (등산 완벽 차단)" },
      { time: "17:15", activity: "🌅 [Jardins do Palácio de Cristal] (수정궁 정원) ⭐ — 공작새들과 함께 도루강의 환상적인 늦은 오후 감상" },
      { time: "18:30", activity: "🍽️ 저녁 — [Brasão Aliados] ⭐ (포르투 최고의 프란세지냐 & 스테이크 / ⚠️구글맵 사전예약 필수!)" },
      { time: "20:00", activity: "🌉 식사 후 낭만 도보: 상벤투 역을 지나 동 루이스 1세 다리 2층 상층부 도보 횡단" },
      { time: "20:30", activity: "🌃 [Jardim do Morro] (모루 공원) ⭐⭐⭐ — 일몰 매직 아워 적중! 잔디밭에 앉아 버스킹과 함께 포르투 야경 감상" },
      { time: "21:30", activity: "🚶‍♂️ 야경 감상 후 도보 5분 만에 WOW 주차장으로 복귀하여 렌트카 픽업 후 숙소 귀가" }
    ],
    tips: [
      "🌊 날씨 팁: 대서양을 마주하는 펠게이라스 등대와 포스 지역은 바람이 강할 수 있으니 가벼운 겉옷을 챙기세요.",
      "📸 하프 래빗: 쓰레기로 만들어진 토끼 반쪽 벽화입니다. 가이아 케이블카 하차장 바로 뒤 골목에 숨어 있습니다.",
      "🚗 동선 요약: 차로 포르투 외곽 링(Ring)을 크게 한 바퀴 돌고, 시내는 우버와 도보로 정복하는 가장 스마트한 하루입니다."
    ],
    transport: "🏨 포르투 에어비앤비 (3/4박) 🚗 렌트카 + 🚠 케이블카 + 🚕 우버"
  },
  {
    day: "DAY 9", date: "5/9 (토)",
    title: "🚗 포르투갈의 기원과 바로크의 절정 — 기마랑이스 & 브라가 (QA 무결점 패치)",
    schedule: [
      { time: "09:00", activity: "🚗 포르투 출발 → 기마랑이스 이동 (55km, 50분 / 고속도로 A3, A7 이용)" },
      { time: "09:50", activity: "🅿️ 주차: [Parque de Estacionamento do Castelo] — 기마랑이스 성 바로 옆 대형 주차장 진입" },
      { time: "10:00", activity: "🏰 [Castelo de Guimarães] (기마랑이스 성) ⭐ — 포르투갈 초대 국왕 아폰수 엔히게스의 탄생지" },
      { time: "10:30", activity: "🏛️ [Paço dos Duques de Bragança] (브라간사 공작 궁전) ⭐ — 39개의 특이한 굴뚝과 15세기 건축물" },
      { time: "11:15", activity: "🚶‍♂️ 내리막 도보: 성에서 구시가지 중심 광장으로 낭만적인 중세 골목 산책" },
      { time: "11:30", activity: "📍 [Largo da Oliveira] & [Praça de S. Tiago] — 고딕 양식의 살라도 기념비(Padrão do Salado)와 중세 광장 구경" },
      { time: "11:50", activity: "📸 지도 스캔 보석💎: [Largo República do Brasil] 꽃길 정원 산책 및 [Igreja de São Gualter] (상 괄테르 성당) 배경으로 엽서 사진 남기기" },
      { time: "12:15", activity: "🚗 렌트카 탑승 → 브라가로 이동 (25km, 25분)" },
      { time: "12:40", activity: "🅿️ 주차: [Parque de Estacionamento Campo da Vinha] — 브라가 시내 중심 대형 지하 주차장" },
      { time: "12:45", activity: "🍽️ 점심 — [Ó Brunch Café] ⭐ (브라가 최고 평점 브런치 4.9) 또는 인근 로컬 식당" },
      { time: "13:50", activity: "🏛️ 지도 스캔 보석💎: [Arco da Porta Nova] (포르타 노바 아치) — 브라가의 옛 출입구인 아름다운 개선문 통과" },
      { time: "14:00", activity: "⛪ [Sé de Braga] (브라가 대성당) ⭐ — 11세기에 지어진 포르투갈 최고(最古)의 대성당" },
      { time: "14:30", activity: "🌺 지도 스캔 보석💎: [Jardim de Santa Bárbara] (산타 바바라 정원) — 옛 주교궁 벽면을 배경으로 한 브라가 최고의 꽃 정원 산책" },
      { time: "14:45", activity: "📍 [Praça da República] (레푸블리카 광장) — 브라가의 중심 아케이드와 탁 트인 분수대 산책" },
      { time: "15:20", activity: "🚗 브라가 외곽 이동 → [Estacionamento Elevador Bom Jesus] (푸니쿨라 하부 주차장) 도착" },
      { time: "15:30", activity: "🚠 궁극의 치트키: [Elevador do Bom Jesus] ⭐ — 세계 최초 수력 푸니쿨라 타고 산 정상 '편하게' 올라가기" },
      { time: "15:45", activity: "🌅 [Santuário do Bom Jesus do Monte] (봉 제수스 두 몬치) ⭐⭐ — 브라가 시내 파노라마 뷰 감상" },
      { time: "16:15", activity: "🚶‍♂️ 하산 산책: [Escadórios do Bom Jesus] — 화려한 바로크 양식의 지그재그 계단을 '걸어 내려오며' 인생샷 📸" },
      { time: "16:45", activity: "🚗 주차장 복귀 후 포르투 귀환 (55km, 1시간 / 고속도로 A3)" },
      { time: "18:00", activity: "🏨 포르투 도착 — 숙소 휴식 또는 렌트카 사전 반납 (일정에 맞춰 유동적 진행)" },
      { time: "18:45", activity: "🍽️ 포르투 마지막 저녁 — 리베이라 광장 인근 또는 가이아 강변 레스토랑" },
      { time: "20:15", activity: "🌅 일몰 타임 적중: [Jardim do Morro] (모루 정원) — 20:40 일몰 시간에 맞춰 포르투의 붉은 노을 감상" },
      { time: "21:15", activity: "🌃 도루 강변을 따라 야경을 눈에 담으며 아쉬운 마지막 밤 산책 마무리" }
    ],
    tips: [
      "📸 기마랑이스 사진 팁: 성과 궁전은 웅장하지만, 진짜 예쁜 인생샷은 '상 괄테르 성당(Igreja de São Gualter)' 앞 정원 벤치에서 나옵니다.",
      "💡 봉 제수스 동선: 무조건 밑에 차를 대고 푸니쿨라로 '올라가서' 계단으로 '내려오는' 것이 체력과 뷰를 모두 잡는 정답입니다.",
      "🚗 톨게이트 팁: 북부 고속도로는 하이패스 격인 전자 톨게이트(Via Verde)가 많으니 렌트카 단말기 장착을 꼭 확인하세요."
    ],
    transport: "🏨 포르투 에어비앤비 (4/4박) 🚗 렌트카"
  },
  {
    day: "DAY 10", date: "5/10 (일)",
    title: "🚗 포르투 → 리스본 공항 → ✈️ 출발",
    schedule: [
      { time: "오전", activity: "포르투 마지막 아침 — 카페에서 여유롭게" },
      { time: "14:00", activity: "🚗 포르투 출발 → 리스본 공항" },
      { time: "17:00", activity: "리스본 공항 도착, 렌트카 반납" },
      { time: "22:10", activity: "✈️ KE922 리스본 출발 → 5/11 인천 19:10 도착" }
    ],
    tips: ["🚗 포르투→리스본 공항: 약 3시간"],
    transport: "✈️ KE922 22:10 🚗 ~300km"
  }
];

// ─────────────────────────────────────────────
// 🗺️ 동선 데이터 (ROUTES)
// ─────────────────────────────────────────────
const ROUTES = {
  "DAY 2": {
    title: "🏛️ 바이샤·시아두·알파마 완전 정복",
    subtitle: "바이샤(시작) → 바이루알투(상승) → 시아두 → 바이샤(하강) → 알파마(상승)",
    sections: [
      {
        icon: "🚋", title: "오전: 바이샤 & 바이루알투", time: "09:00~11:30",
        places: ["피게이라 광장", "호시우 광장", "상 도밍구스 성당", "Nata Portuguesa", "글로리아 푸니쿨라", "상 페드로 전망대", "상 로케 성당", "카몽이스 광장", "Indomável"],
        highlights: ["호시우 광장", "상 페드로 전망대"]
      },
      {
        icon: "🛍️", title: "점심: 시아두 & 쇼핑", time: "11:30~14:30",
        places: ["Café A Brasileira", "Manteigaria", "베르트랑 서점", "카르모 수녀원", "산타 후스타 엘리베이터", "레스토랑 우마"],
        highlights: ["산타 후스타 엘리베이터", "레스토랑 우마"]
      },
      {
        icon: "🌊", title: "오후: 바이샤 강변", time: "14:30~16:30",
        places: ["통조림 가게 (Fantastic World)", "아우구스타 거리", "Amorino", "리스본 시청", "아우구스타 개선문", "코메르시우 광장"],
        highlights: ["아우구스타 거리", "코메르시우 광장"]
      },
      {
        icon: "🌅", title: "저녁: 알파마 & 일몰", time: "16:30~",
        places: ["리스본 대성당", "산투 안토니우 성당", "Café da Garagem", "상 조르즈 성", "포르타스 두 솔 전망대", "O Castiço"],
        highlights: ["상 조르즈 성", "포르타스 두 솔 전망대", "O Castiço"]
      }
    ],
    tips: [
      "🥪 Beira Gare: 비파나(고기샌드위치) 아침 추천",
      "🍸 Noobai: 산타 카타리나 전망대 뷰 맛집",
      "🥧 Manteigaria: 리스본 최고 에그타르트",
      "🍦 Gelados Santini: 포르투갈 국민 젤라또",
      "☕ Café da Garagem: 상 조르즈 성 근처 뷰 카페",
      "🦐 Ramiro: 리스본 최고 해산물 (택시 10분)"
    ]
  },
  "DAY 3": {
    title: "🏰 리스본 ② — 벨렝 ➡️ 시내 복귀 (구글맵 정밀 튜닝)",
    subtitle: "벨렝(서쪽) → MAAT → LX Factory → 시내(동쪽) 완벽 동선",
    sections: [
      {
        icon: "🥧", title: "벨렝 아침 (서쪽 이동)", time: "09:00~13:00",
        places: ["Pastéis de Belém", "제로니무스 수도원", "벨렝 산타 마리아 성당", "국립 해양 박물관"],
        highlights: ["Pastéis de Belém", "제로니무스 수도원"]
      },
      {
        icon: "🌊", title: "점심 & 강변 산책", time: "12:45~16:15",
        places: ["임페리우 광장", "발견기념비", "A Margem", "벨렝탑"],
        highlights: ["발견기념비", "벨렝탑"]
      },
      {
        icon: "🎨", title: "오후: 문화 & 힙스터", time: "16:30~19:00",
        places: ["MAAT", "LX Factory"],
        highlights: ["MAAT", "LX Factory"]
      },
      {
        icon: "🍷", title: "저녁 & 밤거리", time: "19:30~22:15",
        places: ["Frade dos Mares", "Time Out Market", "핑크 스트리트"],
        highlights: ["Frade dos Mares", "핑크 스트리트"]
      }
    ],
    tips: [
      "🚋 이동: 갈 땐 트램 15E, 올 땐 우버 추천 (시간 절약)",
      "🚶 도보: 발견기념비 → 벨렝탑 방향으로 걸어야 효율적",
      "🐙 저녁: Frade dos Mares 예약 필수 (토요일 만석 주의)",
      "📸 MAAT 루프탑: 인생샷 명소 (무료 입장)"
    ]
  },
  "DAY 7": {
    title: "🏛️ 포르투 시내 완전 정복 (가이드 & QA 검증 디버깅 완료)",
    subtitle: "북부(쇼핑) → 중앙(역사) → 남부(강변) → 가이아(야경)",
    sections: [
      {
        icon: "🌅", title: "시내 북부 (09:00~11:45)", time: "09:00~11:45",
        places: ["Balta Brunch", "알마스 성당", "산타 카타리나 거리", "Majestic Café", "산투 일데폰수 성당", "볼량시장"],
        highlights: ["알마스 성당", "산투 일데폰수 성당"]
      },
      {
        icon: "🍽️", title: "점심 & 중앙 (11:45~16:45)", time: "11:45~16:45",
        places: ["Café Santiago", "상벤투 역", "포르투 대성당", "Avenida dos Aliados", "McDonald's Imperial", "렐루서점", "카르무 성당", "클레리구스 성당/탑", "비토리아 전망대"],
        highlights: ["상벤투 역", "포르투 대성당", "렐루서점"]
      },
      {
        icon: "🌊", title: "강변 & 가이아 (17:00~)", time: "17:00~",
        places: ["플로레스 거리", "볼사궁전", "상 프란시스쿠 교회", "리베이라 광장", "동 루이스 다리", "가이아 케이블카", "모루 공원", "세하 두 필라르 수도원"],
        highlights: ["리베이라 광장", "동 루이스 다리", "모루 공원"]
      },
    ],
    tips: ["렐루서점/볼사궁전 예약 필수", "대성당 회랑 필수 관람", "가이아 케이블카로 체력 안배"]
  },
  "DAY 8": {
    title: "🌊 대서양 해안 드라이브 & 포스(Foz) 낭만 투어 (무결점 최종판)",
    subtitle: "대서양(남) → 어촌마을 → 포스(서) → 가이아(동) → 시내(야경)",
    sections: [
      {
        icon: "🌊", title: "대서양 드라이브 (10:00~13:30)", time: "10:00~13:30",
        places: ["CA Downtown", "세뉴르 다 페드라 성당", "아푸라다 마을", "Taberna de São Pedro"],
        highlights: ["세뉴르 다 페드라 성당", "아푸라다 마을"]
      },
      {
        icon: "📸", title: "포스 & 가이아 (14:00~16:40)", time: "14:00~16:40",
        places: ["펠게이라스 등대", "포스 페르골라", "WOW Porto", "가이아 케이블카", "하프 래빗"],
        highlights: ["펠게이라스 등대", "하프 래빗"]
      },
      {
        icon: "🌅", title: "시내 & 일몰 (17:00~21:30)", time: "17:00~21:30",
        places: ["동 루이스 다리", "수정궁 정원", "Brasão Aliados", "모루 공원"],
        highlights: ["수정궁 정원", "모루 공원"]
      },
      {
        icon: "🚗", title: "복귀", time: "21:30~",
        places: ["WOW Porto"],
        highlights: []
      }
    ],
    tips: ["렌트카 주차: WOW 주차장 추천", "하프 래빗: 케이블카 하차장 뒤", "수정궁 정원: 우버로 이동"]
  },
  "DAY 4": {
    title: "🏰 신트라 & 카스카이스 루프 코스",
    subtitle: "신트라 정상 → 숲길 하산 → 까보다로카 → 카스카이스(해변) 완벽 루프",
    sections: [
      {
        icon: "🚂", title: "신트라 도착 & 정상 이동", time: "08:30~10:00",
        places: ["Café Saudade"],
        highlights: ["Café Saudade"]
      },
      {
        icon: "🏰", title: "동화 속 궁전 & 숲길 하산", time: "10:00~13:30",
        places: ["페나궁전", "무어성", "산타 마리아 트레일"],
        highlights: ["페나궁전", "무어성"]
      },
      {
        icon: "🍽️", title: "구시가지 & 헤갈레이라", time: "13:30~16:45",
        places: ["Tasco do Strauss", "Casa Piriquita", "Lawrence's Hotel", "헤갈레이라 별장"],
        highlights: ["Casa Piriquita", "헤갈레이라 별장"]
      },
      {
        icon: "🌊", title: "대서양 & 카스카이스", time: "17:15~20:00",
        places: ["까보다로카", "카스카이스 해변", "Santini Cascais"],
        highlights: ["까보다로카", "카스카이스 해변"]
      }
    ],
    tips: ["페나궁전 예약 시간 엄수!", "헤갈레이라→까보다로카 우버 추천", "카스카이스에서 젤라또 먹고 기차로 귀환"]
  },
  "DAY 5": {
    title: "🚗 중부 드라이브 (오비두스/바탈랴/파티마/토마르)",
    subtitle: "리스본→오비두스→바탈랴→파티마→토마르 (북쪽으로 이동)",
    sections: [
      {
        icon: "🏰", title: "오비두스 (80km, 1시간)", time: "10:30~13:00",
        places: ["우세이라 수도교", "오비두스 성문", "오비두스 성벽", "오비두스 구시가", "산타 마리아 성당 (오비두스)"],
        highlights: ["우세이라 수도교", "오비두스 성문"]
      },
      {
        icon: "⛪", title: "바탈랴 (50km, 40분)", time: "14:45~15:30",
        places: ["바탈랴 수도원"],
        highlights: ["바탈랴 수도원"]
      },
      {
        icon: "⛪", title: "파티마 (60km, 50분)", time: "15:00~16:30",
        places: ["파티마 대성당", "파티마 삼목상 예배당"],
        highlights: ["파티마 대성당"]
      },
      {
        icon: "💎", title: "토마르 히든 스팟 (35km, 35분)", time: "17:35~18:00",
        places: ["페고잉스 수도교"],
        highlights: ["페고잉스 수도교"]
      },
      {
        icon: "🏨", title: "토마르 시내 (5분)", time: "18:00~19:30",
        places: ["나바옹 강변", "레푸블리카 광장 (토마르)", "성 주앙 바티스타 성당", "Taverna Antiqua"],
        highlights: ["나바옹 강변", "성 주앙 바티스타 성당"]
      }
    ],
    tips: ["오비두스 주차: Obidos parking", "파티마 주차: Parque 1", "페고잉스 수도교: 렌트카 필수 코스"]
  },
  "DAY 6": {
    title: "🏰 토마르 → 코임브라 → 포르투",
    subtitle: "토마르(오전) → 코임브라(점심/대학/하산) → 포르투(일몰)",
    sections: [
      {
        icon: "🏰", title: "토마르 (09:00~10:30)", time: "09:00~10:30",
        places: ["그리스도 수도원 (토마르)", "샤롤라"],
        highlights: ["그리스도 수도원 (토마르)", "샤롤라"]
      },
      {
        icon: "🍽️", title: "코임브라 점심 (12:00~13:30)", time: "12:00~13:30",
        places: ["Zé Manel dos Ossos"],
        highlights: ["Zé Manel dos Ossos"]
      },
      {
        icon: "🏛️", title: "코임브라 대학 (13:30~15:00)", time: "13:30~15:00",
        places: ["철의 문 (포르타 페레아)", "구대학 광장", "조아니나 도서관", "상 미겔 예배당", "시계탑 (염소탑)"],
        highlights: ["조아니나 도서관", "구대학 광장"]
      },
      {
        icon: "🚶", title: "코임브라 하산 (15:00~16:45)", time: "15:00~16:45",
        places: ["마샤두 드 카스트루 박물관", "코임브라 구 대성당", "산타크루스 수도원", "Café Santa Cruz"],
        highlights: ["마샤두 드 카스트루 박물관", "코임브라 구 대성당"]
      },
      {
        icon: "🌅", title: "포르투 저녁 (18:30~)", time: "18:30~",
        places: ["동 루이스 다리", "모루 공원"],
        highlights: ["동 루이스 다리", "모루 공원"]
      }
    ],
    tips: ["조아니나 도서관 예약 시간 엄수!", "마샤두 박물관 지하 회랑 필수", "동 루이스 다리 상층부 뷰 추천"]
  },
  "DAY 9": {
    title: "🚗 포르투갈의 기원과 바로크의 절정 — 기마랑이스 & 브라가",
    subtitle: "삼각형 루트: 포르투→기마랑이스→브라가→포르투 (같은 길 반복 ❌)",
    sections: [
      {
        icon: "🏰", title: "기마랑이스 (55km, 50분)", time: "10:00~12:15",
        places: ["기마랑이스 성", "브라간사 공작 궁전", "올리베이라 광장", "산티아고 광장", "상 괄테르 성당"],
        highlights: ["기마랑이스 성", "상 괄테르 성당"]
      },
      {
        icon: "🍽️", title: "브라가 시내 (25km, 25분)", time: "12:45~15:00",
        places: ["Ó Brunch Café (Braga)", "포르타 노바 아치", "브라가 대성당", "산타 바바라 정원", "레푸블리카 광장 (브라가)"],
        highlights: ["브라가 대성당", "산타 바바라 정원"]
      },
      {
        icon: "⛪", title: "봉 제수스 성지 (15:30~16:45)", time: "15:30~16:45",
        places: ["봉 제수스 푸니쿨라", "봉 제수스 두 몬치", "봉 제수스 계단"],
        highlights: ["봉 제수스 두 몬치", "봉 제수스 계단"]
      },
      {
        icon: "🌅", title: "포르투 귀환 (55km, 1시간)", time: "17:30~",
        places: ["모루 공원"],
        highlights: ["모루 공원"]
      }
    ],
    tips: ["기마랑이스 인생샷: 상 괄테르 성당 앞", "봉 제수스: 푸니쿨라 상행 + 계단 하행", "포르투 귀환 후 모루 공원 일몰 필수"]
  }
};
const NEARBY_LANDMARKS = {
  "Café A Brasileira": [
    "카르모 수녀원",
    "산타 후스타 엘리베이터",
    "통조림 가게 (Fantastic World)",
    "상 로케 성당",
    "호시우 광장"
  ],
  "Fábrica Coffee Roasters": [
    "카르모 수녀원",
    "상 로케 성당",
    "산타 후스타 엘리베이터",
    "통조림 가게 (Fantastic World)",
    "호시우 광장"
  ],
  "Manteigaria": [
    "카르모 수녀원",
    "상 로케 성당",
    "산타 후스타 엘리베이터",
    "상 페드로 전망대",
    "글로리아 푸니쿨라"
  ],
  "Confeitaria Nacional": [
    "피게이라 광장",
    "산타 후스타 엘리베이터",
    "호시우 광장",
    "통조림 가게 (Fantastic World)",
    "아우구스타 거리"
  ],
  "Landeau Chocolate": [
    "카르모 수녀원",
    "상 로케 성당",
    "산타 후스타 엘리베이터",
    "글로리아 푸니쿨라",
    "호시우 광장"
  ],
  "Gelados Santini": [
    "카르모 수녀원",
    "산타 후스타 엘리베이터",
    "통조림 가게 (Fantastic World)",
    "호시우 광장",
    "피게이라 광장"
  ],
  "Taberna da Rua das Flores": [
    "카르모 수녀원",
    "산타 후스타 엘리베이터",
    "상 로케 성당",
    "통조림 가게 (Fantastic World)",
    "호시우 광장"
  ],
  "Cervejaria Trindade": [
    "카르모 수녀원",
    "상 로케 성당",
    "호시우 광장",
    "산타 후스타 엘리베이터",
    "글로리아 푸니쿨라"
  ],
  "Solar dos Presuntos": [
    "글로리아 푸니쿨라",
    "상 로케 성당",
    "호시우 광장",
    "피게이라 광장",
    "카르모 수녀원"
  ],
  "O Trevo": [
    "카르모 수녀원",
    "산타 후스타 엘리베이터",
    "통조림 가게 (Fantastic World)",
    "상 로케 성당",
    "호시우 광장"
  ],
  "Pinóquio": [
    "글로리아 푸니쿨라",
    "상 로케 성당",
    "호시우 광장",
    "피게이라 광장",
    "산타 후스타 엘리베이터"
  ],
  "A Ginjinha": [
    "호시우 광장",
    "피게이라 광장",
    "산타 후스타 엘리베이터",
    "글로리아 푸니쿨라",
    "통조림 가게 (Fantastic World)"
  ],
  "Beira Gare": [
    "호시우 광장",
    "피게이라 광장",
    "글로리아 푸니쿨라",
    "상 로케 성당",
    "산타 후스타 엘리베이터"
  ],
  "Cruzes Credo": [
    "리스본 대성당",
    "포르타스 두 솔 전망대",
    "아우구스타 개선문",
    "아우구스타 거리",
    "리스본 시청"
  ],
  "Pois Café": [
    "포르타스 두 솔 전망대",
    "리스본 대성당",
    "상 조르즈 성",
    "아우구스타 거리",
    "아우구스타 개선문"
  ],
  "Farol de Santa Luzia": [
    "포르타스 두 솔 전망대",
    "리스본 대성당",
    "상 조르즈 성",
    "아우구스타 거리",
    "아우구스타 개선문"
  ],
  "Clube de Fado": [
    "포르타스 두 솔 전망대",
    "리스본 대성당",
    "상 조르즈 성",
    "아우구스타 거리",
    "아우구스타 개선문"
  ],
  "Pastéis de Belém": [
    "벨렝 산타 마리아 성당",
    "제로니무스 수도원",
    "국립 해양 박물관",
    "발견기념비"
  ],
  "Pão Pão Queijo Queijo": [
    "벨렝 산타 마리아 성당",
    "제로니무스 수도원",
    "국립 해양 박물관",
    "발견기념비"
  ],
  "Flor dos Jerónimos": [
    "벨렝 산타 마리아 성당",
    "제로니무스 수도원",
    "국립 해양 박물관",
    "발견기념비"
  ],
  "O Frade": [
    "벨렝 산타 마리아 성당",
    "제로니무스 수도원",
    "국립 해양 박물관",
    "발견기념비"
  ],
  "Figus": [
    "피게이라 광장",
    "호시우 광장",
    "산타 후스타 엘리베이터",
    "Confeitaria Nacional",
    "아우구스타 거리"
  ],
  "Landeau Chocolate LX": [
    "LX Factory"
  ],
  "Cantina LX": [
    "LX Factory"
  ],
  "1300 Taberna": [
    "LX Factory"
  ],
  "Casa Piriquita": [
    "후아 다스 파다리아스",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Café Saudade": [
    "후아 다스 파다리아스",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Nata Pura": [
    "후아 다스 파다리아스",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Tascantiga": [
    "후아 다스 파다리아스",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Incomum by Luis Santos": [
    "후아 다스 파다리아스",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Café Santa Cruz": [
    "산타크루스 수도원",
    "퀘브라 코스타스 계단",
    "조아니나 도서관",
    "철의 문 (포르타 페레아)",
    "상 미겔 예배당"
  ],
  "Zé Manel dos Ossos": [
    "퀘브라 코스타스 계단",
    "산타크루스 수도원",
    "조아니나 도서관",
    "철의 문 (포르타 페레아)",
    "상 미겔 예배당"
  ],
  "Majestic Café": [
    "알마스 성당",
    "산타 카타리나 거리",
    "볼량시장",
    "상벤투 역",
    "긴다이스 푸니쿨라"
  ],
  "Café Santiago": [
    "볼량시장",
    "알마스 성당",
    "산타 카타리나 거리",
    "수정궁 정원",
    "상벤투 역"
  ],
  "Manteigaria Porto": [
    "클레리구스 성당/탑",
    "렐루서점",
    "플로레스 거리",
    "카르무 성당",
    "비토리아 전망대"
  ],
  "Confeitaria do Bolhão": [
    "볼량시장",
    "알마스 성당",
    "산타 카타리나 거리",
    "상벤투 역",
    "수정궁 정원"
  ],
  "Brasão Aliados": [
    "산타 카타리나 거리",
    "알마스 성당",
    "볼량시장",
    "상벤투 역",
    "렐루서점"
  ],
  "Conga": [
    "볼량시장",
    "알마스 성당",
    "산타 카타리나 거리",
    "상벤투 역",
    "렐루서점"
  ],
  "Jimão Tapas e Vinhos": [
    "리베이라 광장",
    "도루강 유람선",
    "볼사궁전",
    "상 프란시스쿠 교회",
    "포르투 대성당"
  ],
  "Postigo do Carvão": [
    "볼사궁전",
    "상 프란시스쿠 교회",
    "리베이라 광장",
    "비토리아 전망대",
    "도루강 유람선"
  ],
  "Taberna dos Mercadores": [
    "리베이라 광장",
    "볼사궁전",
    "상 프란시스쿠 교회",
    "도루강 유람선",
    "포르투 대성당"
  ],
  "Fish Fixe": [
    "리베이라 광장",
    "도루강 유람선",
    "볼사궁전",
    "상 프란시스쿠 교회",
    "포르투 대성당"
  ],
  "Tapabento": [
    "상벤투 역",
    "긴다이스 푸니쿨라",
    "산타 카타리나 거리",
    "클레리구스 성당/탑",
    "포르투 대성당"
  ],
  "Vinologia": [
    "리베이라 광장",
    "도루강 유람선",
    "포르투 대성당",
    "볼사궁전",
    "동 루이스 다리"
  ],
  "Escondidinho do Barredo": [
    "리베이라 광장",
    "볼사궁전",
    "포르투 대성당",
    "상 프란시스쿠 교회",
    "비토리아 전망대"
  ],
  "Graham's Port Lodge": [
    "가이아 케이블카",
    "세하 두 필라르 전망대",
    "WOW Porto",
    "동 루이스 다리",
    "도루강 유람선"
  ],
  "Cor de Tangerina": [
    "올리베이라 광장",
    "올리베이라 성당",
    "산티아고 광장",
    "브라간사 공작 궁전",
    "기마랑이스 성"
  ],
  "Histórico by Papaboa": [
    "산티아고 광장",
    "올리베이라 성당",
    "올리베이라 광장",
    "브라간사 공작 궁전",
    "기마랑이스 성"
  ],
  "A Brasileira Braga": [
    "브라가 대성당",
    "레푸블리카 광장 (브라가)"
  ],
  "Frigideiras do Cantinho": [
    "브라가 대성당",
    "레푸블리카 광장 (브라가)"
  ],
  "Can the Can": [
    "코메르시우 광장",
    "아우구스타 개선문",
    "리스본 시청",
    "아우구스타 거리",
    "리스본 대성당"
  ],
  "Café Martinho da Arcada": [
    "코메르시우 광장",
    "아우구스타 개선문",
    "리스본 시청",
    "아우구스타 거리",
    "통조림 가게 (Fantastic World)"
  ],
  "Chapitô à Mesa": [
    "포르타스 두 솔 전망대",
    "상 조르즈 성",
    "리스본 대성당",
    "아우구스타 거리",
    "피게이라 광장"
  ],
  "Darwin Café": [
    "벨렝탑",
    "발견기념비"
  ],
  "Enoteca de Belém": [
    "벨렝 산타 마리아 성당",
    "제로니무스 수도원",
    "국립 해양 박물관",
    "발견기념비"
  ],
  "Café Macarena": [
    "리베이라 광장",
    "도루강 유람선",
    "볼사궁전",
    "상 프란시스쿠 교회",
    "동 루이스 다리"
  ],
  "Wine Quay Bar": [
    "리베이라 광장",
    "도루강 유람선",
    "볼사궁전",
    "상 프란시스쿠 교회",
    "포르투 대성당"
  ],
  "Mercado do Bolhão Food Court": [
    "볼량시장",
    "알마스 성당",
    "산타 카타리나 거리",
    "상벤투 역",
    "수정궁 정원"
  ],
  "Bar do Parque": [
    "페나궁전",
    "페나궁전 정원",
    "무어성"
  ],
  "Pena Palace Cafeteria": [
    "페나궁전",
    "페나궁전 정원",
    "무어성"
  ],
  "El Rei Dom Frango": [
    "올리베이라 광장",
    "올리베이라 성당",
    "산티아고 광장",
    "브라간사 공작 궁전",
    "기마랑이스 성"
  ],
  "Bom Jesus Café": [
    "봉 제수스 두 몬치",
    "봉 제수스 전망대",
    "봉 제수스 푸니쿨라"
  ],
  "레스토랑 우마": [
    "호시우 광장",
    "산타 후스타 엘리베이터",
    "피게이라 광장"
  ],
  "A Margarida da Belém": [
    "제로니무스 수도원",
    "벨렝 산타 마리아 성당",
    "발견기념비"
  ],
  "Canto da Vila": [
    "리스본 대성당",
    "포르타스 두 솔 전망대",
    "상 조르즈 성"
  ],
  "Casinha São João": [
    "리베이라 광장",
    "동 루이스 다리",
    "볼사궁전"
  ],
  "Zenith Porto": [
    "카르무 성당",
    "렐루서점",
    "클레리구스 성당/탑"
  ],
  "Abadia do Porto": [
    "볼량시장",
    "산타 카타리나 거리",
    "알마스 성당"
  ],
  "Metamorphosis": [
    "신트라 왕궁",
    "무어성",
    "헤갈레이라 별장"
  ],
  "Fangas Maior": [
    "코임브라 구 대성당",
    "퀘브라 코스타스 계단",
    "코임브라 대학교"
  ]
};


// ═══════════════════════════════════════════════════════════════
// LX Factory 내부 맛집 추가 (v7.1)
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// 관광지 상세 정보 (역사, 포토스팟, 방문팁, 주의사항 등)
// ═══════════════════════════════════════════════════════════════
const LANDMARK_DETAILS = {
  "클레리구스 성당/탑": {
    icon: "⛪",
    subtitle: "225계단 끝 포르투 최고의 전망",
    history: "1763년 완공된 바로크 양식 성당으로, 이탈리아 건축가 니콜라우 나소니가 설계했습니다. 76m 높이의 종탑은 포르투에서 가장 높은 건물로, 도시 어디서든 보이는 랜드마크입니다. 225개 계단을 올라가면 360도 파노라마 전망을 즐길 수 있습니다.",
    photoSpots: [
      "탑 전망대에서 도루강 방향",
      "성당 정면과 탑",
      "내부 바로크 장식"
    ],
    duration: "1시간",
    tips: "계단이 좁고 가파름. 심장 약하신 분 주의! 일몰 시간대 추천",
    nearbyNote: "렐루서점 인근 카페"
  },
  "제로니무스 수도원": {
    icon: "🏛️",
    subtitle: "마누엘 양식의 걸작, 유네스코 세계문화유산",
    history: "1502년 마누엘 1세의 명으로 건설을 시작해 약 100년에 걸쳐 완공된 수도원입니다. 대항해시대 포르투갈의 영광을 상징하며, 바스코 다 가마와 카몽이스의 묘소가 있습니다. 정교한 마누엘 양식 조각이 특징입니다.",
    photoSpots: [
      "회랑의 아치와 기둥",
      "성당 내부 천장",
      "남쪽 정문 조각"
    ],
    duration: "1시간 30분",
    tips: "오전 일찍 방문 권장. 온라인 티켓 예매 필수! 벨렝탑 콤보 티켓 추천",
    nearbyNote: "Pastéis de Belém 도보 3분"
  },
  "벨렝탑": {
    icon: "🏰",
    subtitle: "대항해시대의 상징, 테주강의 수호자",
    history: "1515~1521년 건설된 방어 요새로, 마누엘 양식의 걸작입니다. 선원들의 출항과 귀환을 지켜보던 곳으로, '테주강의 귀부인'이라 불립니다. 유네스코 세계문화유산으로 지정되어 있습니다.",
    photoSpots: [
      "강변에서 탑 전체 샷",
      "발코니에서 테주강 전망",
      "석양 배경 실루엣"
    ],
    duration: "30분~1시간",
    tips: "내부 입장 줄이 길어요. 외부 사진만 원하면 패스해도 OK",
    nearbyNote: "발견기념비까지 도보 10분"
  },
  "페나궁전": {
    icon: "🏰",
    subtitle: "동화 속 궁전, 신트라의 하이라이트",
    history: "1842~1854년 페르난두 2세가 건설한 낭만주의 궁전입니다. 다양한 건축 양식(무어, 고딕, 르네상스, 마누엘)이 혼합되어 독특한 외관을 자랑합니다. 신트라 산 정상에 위치해 탁 트인 전망을 제공합니다.",
    photoSpots: [
      "테라스에서 궁전 전경",
      "빨간색 & 노란색 탑",
      "아치 밑에서 위로"
    ],
    duration: "2~3시간",
    tips: "오전 9시 첫 입장 추천. 안개가 자주 끼니 날씨 확인! 편한 신발 필수",
    nearbyNote: "Casa Piriquita (신트라 구시가)"
  },
  "상 조르즈 성": {
    icon: "🏰",
    subtitle: "리스본을 한눈에, 천년의 역사",
    history: "무어인이 건설하고 기독교 세력이 재건한 성으로, 리스본의 역사가 담긴 곳입니다. 성벽을 따라 걸으면 알파마와 테주강의 탁 트인 전망을 감상할 수 있습니다.",
    photoSpots: [
      "성벽 위에서 시내 전경",
      "산타 크루즈 전망대",
      "일몰 시간대 테주강"
    ],
    duration: "1~2시간",
    tips: "일몰 1시간 전 입장 추천. 성벽 계단 주의!",
    nearbyNote: "알파마 맛집 도보 이동 가능"
  },
  "리스본 대성당": {
    icon: "⛪",
    subtitle: "리스본에서 가장 오래된 성당",
    history: "1147년 아폰수 1세가 무어인을 몰아낸 후 건설을 시작한 로마네스크 양식 성당입니다. 지진과 재건을 거쳐 다양한 건축 양식이 혼합되어 있습니다.",
    photoSpots: [
      "28번 트램과 성당",
      "회랑과 중정",
      "로마네스크 정문"
    ],
    duration: "30분~1시간",
    tips: "28번 트램 정류장 바로 앞. 회랑 입장은 별도 요금",
    nearbyNote: "알파마 지구 탐방 시작점"
  },
  "LX Factory": {
    icon: "🏭",
    subtitle: "힙한 감성의 복합문화공간",
    history: "19세기 직물 공장을 개조한 복합문화공간으로, 카페, 레스토랑, 서점, 빈티지샵, 갤러리가 모여 있습니다. 주말에는 마켓이 열리며 젊은 예술가들의 작품을 만날 수 있습니다.",
    photoSpots: [
      "Ler Devagar 서점 내부",
      "그래피티 벽화",
      "루프탑 바 전망"
    ],
    duration: "2~3시간",
    tips: "일요일 마켓 추천. Landeau Chocolate 필수!",
    nearbyNote: "4월 25일 다리 전망"
  },
  "동 루이스 다리": {
    icon: "🌉",
    subtitle: "포르투의 아이콘, 에펠의 제자 작품",
    history: "1886년 완공된 철제 아치 다리로, 구스타브 에펠의 제자 테오필 세이리그가 설계했습니다. 상층은 메트로, 하층은 차량과 보행자가 이용합니다. 포르투와 가이아를 연결하는 상징적인 다리입니다.",
    photoSpots: [
      "가이아 쪽에서 다리 전체",
      "다리 위에서 도루강",
      "리베이라에서 야경"
    ],
    duration: "30분",
    tips: "상층 도보 횡단 추천. 바람 주의! 석양 시간대 최고",
    nearbyNote: "리베이라 광장 맛집들"
  },
  "볼량시장": {
    icon: "🏪",
    subtitle: "포르투의 전통시장, 현지 식재료 천국",
    history: "1914년 오픈한 포르투 최대의 전통시장입니다. 2022년 리뉴얼을 거쳐 전통과 현대가 조화를 이룬 공간으로 재탄생했습니다. 신선한 해산물, 과일, 치즈, 와인을 만날 수 있습니다.",
    photoSpots: [
      "시장 파사드",
      "해산물 코너",
      "2층 푸드코트"
    ],
    duration: "1~2시간",
    tips: "토요일 오전이 가장 활기참. 일요일 휴무!",
    nearbyNote: "Confeitaria do Bolhão 바로 옆"
  },
  "리베이라 광장": {
    icon: "🏛️",
    subtitle: "도루강변의 유네스코 세계문화유산",
    history: "중세부터 상업의 중심지였던 광장으로, 다채로운 색상의 건물들이 도루강을 따라 늘어서 있습니다. 유네스코 세계문화유산으로 지정된 포르투 역사지구의 핵심입니다.",
    photoSpots: [
      "강변 카페 테라스",
      "다리와 건물들",
      "야경 리플렉션"
    ],
    duration: "1시간",
    tips: "점심~저녁 시간대 추천. 호객꾼 주의!",
    nearbyNote: "해산물 맛집 밀집"
  },
  "렐루서점": {
    icon: "📚",
    subtitle: "세계에서 가장 아름다운 서점",
    history: "1906년 오픈한 네오고딕 양식의 서점으로, 해리포터 시리즈에 영감을 준 것으로 유명합니다. 붉은 나선형 계단과 스테인드글라스 천장이 특징입니다.",
    photoSpots: [
      "붉은 계단 정면",
      "2층에서 아래로",
      "스테인드글라스"
    ],
    duration: "30분",
    tips: "온라인 티켓 필수 (€8, 책 구매 시 차감). 사진 찍으려면 일찍!",
    nearbyNote: "클레리구스 탑 바로 옆"
  },
  "신트라 왕궁": {
    icon: "🏰",
    subtitle: "독특한 쌍둥이 굴뚝의 왕궁",
    history: "14~15세기에 건설된 포르투갈 왕실의 여름 궁전입니다. 두 개의 거대한 원뿔형 굴뚝이 특징이며, 내부에는 아름다운 아줄레주 타일이 장식되어 있습니다.",
    photoSpots: [
      "광장에서 쌍둥이 굴뚝",
      "백조의 방",
      "아줄레주 장식"
    ],
    duration: "1~1.5시간",
    tips: "페나궁전보다 덜 붐빔. 신트라 구시가 중심에 위치",
    nearbyNote: "Casa Piriquita 광장 앞"
  },
  "포르투 대성당": {
    icon: "⛪",
    subtitle: "포르투에서 가장 오래된 성당",
    history: "12세기 로마네스크 양식으로 건설된 포르투 최초의 성당입니다. 여러 번의 개축을 거쳐 바로크 양식이 추가되었습니다. 테라스에서 도루강 전망이 훌륭합니다.",
    photoSpots: [
      "광장에서 파사드",
      "회랑 아줄레주",
      "테라스 전망"
    ],
    duration: "30분~1시간",
    tips: "회랑과 테라스 입장은 별도 티켓",
    nearbyNote: "상벤투역까지 내리막길"
  },
  "상벤투 역": {
    icon: "🚂",
    subtitle: "2만 개 아줄레주의 예술역",
    history: "1916년 완공된 기차역으로, 내부 홀에 2만 개 이상의 아줄레주 타일이 포르투갈 역사를 묘사하고 있습니다. 호르헤 콜라수가 11년간 작업한 걸작입니다.",
    photoSpots: [
      "대형 벽화 전체",
      "천장 디테일",
      "플랫폼 방향"
    ],
    duration: "30분",
    tips: "무료 입장. 아침 일찍 또는 저녁에 한산함",
    nearbyNote: "Café Santiago 도보 5분"
  },
  "봉 제수스 두 몬치": {
    icon: "⛪",
    subtitle: "600계단 성스러운 순례길",
    history: "18세기에 건설된 바로크 양식의 성지로, 지그재그 계단을 따라 올라가며 그리스도의 수난을 묵상하도록 설계되었습니다. 2019년 유네스코 세계문화유산으로 등재되었습니다.",
    photoSpots: [
      "계단 아래에서 위로",
      "분수와 계단",
      "정상에서 브라가 전경"
    ],
    duration: "1~2시간",
    tips: "계단이 힘들면 푸니쿨라 이용 가능 (편도 €2)",
    nearbyNote: "정상 카페테리아"
  },
  "기마랑이스 성": {
    icon: "🏰",
    subtitle: "포르투갈 탄생의 땅",
    history: "10세기 건설된 성으로, 포르투갈 초대 왕 아폰수 1세의 출생지로 알려져 있습니다. '포르투갈은 여기서 탄생했다'는 문구가 성벽에 새겨져 있습니다.",
    photoSpots: [
      "성 입구와 탑",
      "성벽 위 전망",
      "브라간사 궁전 방향"
    ],
    duration: "1시간",
    tips: "브라간사 궁전과 함께 방문. 무료 입장!",
    nearbyNote: "구시가지 맛집 도보 이동"
  },
  "코임브라 대학교": {
    icon: "🎓",
    subtitle: "세계에서 가장 오래된 대학 중 하나",
    history: "1290년 설립된 유럽에서 가장 오래된 대학 중 하나입니다. 바로크 양식의 조아니나 도서관이 특히 유명하며, 2013년 유네스코 세계문화유산으로 등재되었습니다.",
    photoSpots: [
      "조아니나 도서관",
      "종탑과 광장",
      "코임브라 시내 전망"
    ],
    duration: "2~3시간",
    tips: "조아니나 도서관은 사전 예약 필수! 입장 인원 제한",
    nearbyNote: "Café Santa Cruz 광장 앞"
  },
  "발견기념비": {
    icon: "🗿",
    subtitle: "대항해시대 영웅들의 기념비",
    history: "1960년 엔리케 왕자 서거 500주년을 기념해 건립되었습니다. 카라벨선 형태의 기념비에 엔리케 왕자를 필두로 33인의 대항해시대 영웅들이 조각되어 있습니다.",
    photoSpots: [
      "정면 전체샷",
      "전망대에서 테주강",
      "바닥 세계지도 모자이크"
    ],
    duration: "30분~1시간",
    tips: "전망대 입장 €10. 바닥 모자이크도 놓치지 마세요!",
    nearbyNote: "벨렝탑까지 강변 산책"
  },
  "아우구스타 개선문": {
    icon: "🏛️",
    subtitle: "리스본 대지진 후 부흥의 상징",
    history: "1755년 대지진 후 도시 재건을 기념해 건설되었습니다. 개선문 위 조각상들은 영광, 가치, 천재성을 상징하며, 전망대에서 코메르시우 광장과 시내를 조망할 수 있습니다.",
    photoSpots: [
      "아우구스타 거리에서",
      "코메르시우 광장에서",
      "전망대 야경"
    ],
    duration: "30분",
    tips: "전망대 입장 €3. 일몰 시간대 추천",
    nearbyNote: "코메르시우 광장 레스토랑"
  },
  "코메르시우 광장": {
    icon: "🏛️",
    subtitle: "유럽에서 가장 아름다운 광장 중 하나",
    history: "1755년 대지진 이전 왕궁이 있던 자리로, 재건 후 상업 광장이 되었습니다. 테주강을 향해 열린 U자형 광장으로, 노란 건물들이 인상적입니다.",
    photoSpots: [
      "개선문 프레임 샷",
      "강변 석양",
      "조세 1세 동상"
    ],
    duration: "30분",
    tips: "강변 계단에서 석양 감상 추천",
    nearbyNote: "Can the Can, Martinho da Arcada"
  }
};

// 추가 관광지 상세 정보
Object.assign(LANDMARK_DETAILS, {
  "상 로케 성당": {
    icon: "⛪",
    subtitle: "16세기 예수회 성당, 화려한 바로크 내부",
    history: "1566년 완공된 예수회 성당으로, 외관은 단순하지만 내부는 포르투갈에서 가장 화려한 바로크 장식을 자랑합니다. 상 주앙 바티스타 예배당은 로마에서 제작되어 배로 운송된 것으로 유명합니다.",
    photoSpots: ["황금빛 천장과 제단", "상 주앙 바티스타 예배당", "아줄레주 장식"],
    duration: "30분~1시간",
    tips: "박물관 포함 방문 추천. 플래시 촬영 금지",
    nearbyNote: "시아두 지구 카페들"
  },
  "피게이라 광장": {
    icon: "🏛️",
    subtitle: "리스본 다운타운의 중심 광장",
    history: "1755년 대지진 후 재건된 광장으로, 중앙에 주앙 1세 동상이 있습니다. 호시우 광장과 함께 바이샤 지구의 중심을 이룹니다.",
    photoSpots: ["주앙 1세 동상", "광장 전체 파노라마", "주변 건물 파사드"],
    duration: "15분",
    tips: "호시우 광장과 함께 둘러보기 좋음",
    nearbyNote: "Confeitaria Nacional 인근"
  },
  "호시우 광장": {
    icon: "🏛️",
    subtitle: "리스본의 심장, 물결무늬 바닥이 상징",
    history: "중세부터 리스본의 중심이었던 광장으로, 검은색과 흰색 석회암으로 만든 물결무늬 바닥이 특징입니다. 국립극장과 페드로 4세 동상이 있습니다.",
    photoSpots: ["물결무늬 바닥 패턴", "페드로 4세 동상", "국립극장 파사드"],
    duration: "20분",
    tips: "저녁에 조명이 예쁨. A Ginjinha 진자 바 추천",
    nearbyNote: "A Ginjinha, Confeitaria Nacional"
  },
  "글로리아 푸니쿨라": {
    icon: "🚃",
    subtitle: "1885년부터 운행, 바이루 알투로 가는 길",
    history: "1885년 개통된 리스본에서 가장 유명한 푸니쿨라입니다. 가파른 글로리아 언덕을 올라 상 페드로 전망대로 연결됩니다.",
    photoSpots: ["푸니쿨라 전면", "오르는 중 창문 밖", "그래피티 벽"],
    duration: "5분 (탑승)",
    tips: "비바 비아젬 카드 사용 가능. 줄이 길면 도보 추천",
    nearbyNote: "상 페드로 전망대 카페"
  },
  "상 페드로 전망대": {
    icon: "🌅",
    subtitle: "리스본 최고의 석양 포인트",
    history: "바이루 알투 지구 끝에 위치한 전망대로, 테주강과 4월 25일 다리의 석양을 감상하기 최고의 장소입니다. 아담스 패밀리 동상으로도 유명합니다.",
    photoSpots: ["석양과 4월 25일 다리", "테주강 파노라마", "아담스 패밀리 동상"],
    duration: "30분",
    tips: "일몰 1시간 전 도착 추천. 키오스크 바에서 음료 가능",
    nearbyNote: "Noobai Café 바로 옆"
  },
  "카르모 수녀원": {
    icon: "⛪",
    subtitle: "1755년 지진의 흔적이 남은 고딕 폐허",
    history: "14세기 건설된 고딕 양식 수녀원으로, 1755년 대지진으로 지붕이 무너졌습니다. 현재 고고학 박물관으로 사용되며, 지붕 없는 내부가 독특한 분위기를 연출합니다.",
    photoSpots: ["지붕 없는 본당", "고딕 아치", "하늘이 보이는 내부"],
    duration: "30분~1시간",
    tips: "박물관 입장료 €5. 산타 후스타 엘리베이터와 가까움",
    nearbyNote: "시아두 카페 거리"
  },
  "산타 후스타 엘리베이터": {
    icon: "🛗",
    subtitle: "에펠 제자가 만든 네오고딕 철제 엘리베이터",
    history: "1902년 완공된 45m 높이의 엘리베이터로, 구스타브 에펠의 제자 하울 메스니에르가 설계했습니다. 바이샤와 카르모 광장을 연결합니다.",
    photoSpots: ["엘리베이터 외관 전체", "전망대에서 시내", "철제 구조물 디테일"],
    duration: "15분",
    tips: "줄이 매우 김! 비바 비아젬 카드로 무료. 전망대는 추가 €1.5",
    nearbyNote: "카르모 수녀원 연결"
  },
  "아우구스타 거리": {
    icon: "🛍️",
    subtitle: "리스본 최대 보행자 거리, 쇼핑 천국",
    history: "1755년 대지진 후 재건된 바이샤 지구의 중심 거리입니다. 코메르시우 광장에서 호시우 광장까지 이어지며, 양쪽에 상점과 카페가 늘어서 있습니다.",
    photoSpots: ["개선문 프레임 샷", "거리 전체 풍경", "버스킹 공연"],
    duration: "30분~1시간",
    tips: "좀도둑 주의! 상점보다 분위기 즐기기",
    nearbyNote: "양쪽에 카페와 레스토랑"
  },
  "포르타스 두 솔 전망대": {
    icon: "🌅",
    subtitle: "알파마 최고 전망대, 테주강+붉은 지붕",
    history: "알파마 지구 언덕 위에 위치한 전망대로, 테주강과 알파마의 붉은 지붕 풍경을 한눈에 볼 수 있습니다. 산타 루지아 전망대와 이웃해 있습니다.",
    photoSpots: ["알파마 붉은 지붕", "테주강 파노라마", "산타 루지아 성당"],
    duration: "20분",
    tips: "아침이나 석양 시간대 추천",
    nearbyNote: "Portas Do Sol Terrace 바로 옆"
  },
  "벨렝 산타 마리아 성당": {
    icon: "⛪",
    subtitle: "제로니무스 수도원 내 성당, 바스코 다 가마 묘소",
    history: "제로니무스 수도원의 일부로, 바스코 다 가마와 시인 카몽이스의 묘소가 있습니다. 마누엘 양식의 정교한 석조 조각이 특징입니다.",
    photoSpots: ["바스코 다 가마 석관", "높은 천장과 기둥", "스테인드글라스"],
    duration: "30분",
    tips: "수도원과 별도 입장 가능 (무료)",
    nearbyNote: "Pastéis de Belém 도보 3분"
  },
  "국립 해양 박물관": {
    icon: "⚓",
    subtitle: "대항해시대 포르투갈의 해양 역사",
    history: "제로니무스 수도원 서쪽 별관에 위치한 해양 박물관으로, 포르투갈 해양 탐험의 역사를 보여줍니다. 선박 모형, 항해 도구, 지도 등이 전시되어 있습니다.",
    photoSpots: ["대형 선박 모형", "항해 도구 전시", "왕실 바지선"],
    duration: "1~2시간",
    tips: "제로니무스 콤보 티켓 가능",
    nearbyNote: "제로니무스 수도원 옆"
  },
  "렐루서점": {
    icon: "📚",
    subtitle: "세계에서 가장 아름다운 서점",
    history: "1906년 오픈한 네오고딕 양식 서점으로, 해리포터 시리즈에 영감을 준 것으로 유명합니다. 붉은 나선형 계단과 스테인드글라스 천장이 특징입니다.",
    photoSpots: ["붉은 나선형 계단", "2층에서 아래로", "스테인드글라스 천장"],
    duration: "30분",
    tips: "온라인 예약 필수 (€8, 책 구매 시 차감)",
    nearbyNote: "클레리구스 탑 바로 옆"
  },
  "볼사궁전": {
    icon: "🏛️",
    subtitle: "아랍의 방이 있는 신고전주의 궁전",
    history: "19세기 포르투 상공회의소 건물로, 내부의 '아랍의 방'은 알함브라 궁전에서 영감을 받은 화려한 무어 양식입니다.",
    photoSpots: ["아랍의 방", "대계단", "네이션스 홀"],
    duration: "1시간 (가이드 투어)",
    tips: "가이드 투어만 가능. 예약 추천",
    nearbyNote: "리베이라 광장 도보 3분"
  },
  "WOW Porto": {
    icon: "🍷",
    subtitle: "포르투 와인과 문화의 복합 공간",
    history: "가이아 강변의 포트와인 창고를 개조한 복합문화공간입니다. 와인 박물관, 초콜릿 박물관, 코르크 박물관 등 7개 테마 박물관과 레스토랑이 있습니다.",
    photoSpots: ["도루강 전망 테라스", "와인 박물관 내부", "야경 포르투 전경"],
    duration: "2~4시간",
    tips: "콤보 티켓 추천. 레스토랑 예약 필수",
    nearbyNote: "포트와인 셀러들 인접"
  },
  "알마스 성당": {
    icon: "⛪",
    subtitle: "2만 개 아줄레주로 덮인 파란 성당",
    history: "18세기 바로크 성당으로, 외벽 전체가 파란색과 흰색 아줄레주 타일로 장식되어 있습니다. 포르투에서 가장 포토제닉한 성당입니다.",
    photoSpots: ["파란 외벽 전체", "정문 클로즈업", "산타 카타리나 거리에서"],
    duration: "15분 (외부), 30분 (내부 포함)",
    tips: "내부 입장 €2. 사진은 외부가 더 인상적",
    nearbyNote: "산타 카타리나 거리 맛집들"
  },
  "카르무 성당": {
    icon: "⛪",
    subtitle: "측면 아줄레주 벽화가 유명한 성당",
    history: "18세기 바로크-로코코 양식 성당으로, 측면의 거대한 아줄레주 벽화가 유명합니다. 옆의 카르멜리타스 성당과 붙어 있지만 다른 건물입니다.",
    photoSpots: ["측면 아줄레주 벽화", "정면 파사드", "두 성당 사이 좁은 집"],
    duration: "30분",
    tips: "지하 납골당 입장 가능 (€7)",
    nearbyNote: "렐루서점 바로 옆"
  },
  "상 프란시스쿠 교회": {
    icon: "⛪",
    subtitle: "300kg 금으로 장식된 바로크의 극치",
    history: "14세기 고딕 양식으로 시작해 17~18세기에 바로크 양식으로 개조되었습니다. 내부 장식에 300kg 이상의 금이 사용되었습니다.",
    photoSpots: ["황금빛 제단", "바로크 나무 조각", "납골당"],
    duration: "30분~1시간",
    tips: "입장료 €9. 납골당 포함. 사진 촬영 불가",
    nearbyNote: "볼사궁전 바로 옆"
  },
  "모루 공원": {
    icon: "🌳",
    subtitle: "포르투 시내가 한눈에 보이는 공원",
    history: "포르투 도심 언덕 위에 위치한 공원으로, 클레리구스 탑과 도루강까지 파노라마 전망을 제공합니다.",
    photoSpots: ["포르투 시내 파노라마", "석양 시간대", "클레리구스 탑 방향"],
    duration: "30분",
    tips: "피크닉 가능. 석양 시간대 추천",
    nearbyNote: "도심 맛집들 도보 이동"
  },
  "세하 두 필라르 수도원": {
    icon: "🌅",
    subtitle: "가이아에서 포르투를 바라보는 최고 전망",
    history: "가이아 쪽 언덕 위 전망대로, 동 루이스 다리와 포르투 구시가지의 전경을 감상할 수 있습니다.",
    photoSpots: ["다리와 리베이라 전경", "야경 파노라마", "포트와인 셀러들"],
    duration: "30분",
    tips: "케이블카 정류장 근처. 석양~야경 추천",
    nearbyNote: "포트와인 셀러 투어"
  },
  "수정궁 정원": {
    icon: "🌳",
    subtitle: "도루강이 내려다보이는 아름다운 정원",
    history: "1865년 조성된 낭만주의 정원으로, 이국적인 식물과 분수, 조각상이 있습니다. 수정궁(현재 스포츠관)과 함께 있습니다.",
    photoSpots: ["분수와 정원", "도루강 전망", "낭만주의 조각상"],
    duration: "1시간",
    tips: "무료 입장. 피크닉 가능",
    nearbyNote: "포르투 도심 근처"
  },
  "비토리아 전망대": {
    icon: "🌅",
    subtitle: "포르투 대성당 근처 숨은 전망대",
    history: "포르투 대성당 뒤편에 위치한 전망대로, 도루강과 가이아의 전경을 볼 수 있습니다.",
    photoSpots: ["도루강 전경", "가이아 포트와인 셀러", "다리들"],
    duration: "15분",
    tips: "관광객이 적어 한적함",
    nearbyNote: "포르투 대성당 바로 뒤"
  },
  "플로레스 거리": {
    icon: "🛍️",
    subtitle: "포르투의 힙한 카페와 레스토랑 거리",
    history: "최근 재개발된 포르투의 트렌디한 거리로, 카페, 레스토랑, 부티크 상점들이 늘어서 있습니다.",
    photoSpots: ["거리 전경", "카페 테라스", "꽃 장식"],
    duration: "30분~1시간",
    tips: "점심 또는 저녁 식사 추천",
    nearbyNote: "Taberna da Rua das Flores 등"
  },
  "긴다이스 푸니쿨라": {
    icon: "🚃",
    subtitle: "가이아 강변에서 언덕 위로",
    history: "가이아 강변에서 세하 두 필라르 전망대 근처까지 운행하는 푸니쿨라입니다.",
    photoSpots: ["푸니쿨라 외관", "오르는 중 전망", "도착역 전망"],
    duration: "5분",
    tips: "왕복 €6. 케이블카와 연결 가능",
    nearbyNote: "포트와인 셀러 투어"
  },
  "가이아 케이블카": {
    icon: "🚡",
    subtitle: "도루강 위를 나는 케이블카",
    history: "가이아 강변을 따라 운행하는 케이블카로, 도루강과 동 루이스 다리의 전망을 즐길 수 있습니다.",
    photoSpots: ["케이블카에서 다리", "도루강 전망", "포르투 리베이라"],
    duration: "10분 (편도)",
    tips: "왕복 €9. 단방향 이용 후 도보 귀환 추천",
    nearbyNote: "WOW Porto, 포트와인 셀러"
  },
  "도루강 유람선": {
    icon: "⛵",
    subtitle: "6개 다리를 지나는 도루강 크루즈",
    history: "포르투의 6개 다리를 지나는 50분짜리 유람선 투어입니다. 리베이라에서 출발합니다.",
    photoSpots: ["다리 아래 지나는 순간", "양쪽 강변 풍경", "석양 크루즈"],
    duration: "50분",
    tips: "€15~18. 석양 크루즈 추천",
    nearbyNote: "리베이라 광장 맛집"
  },
  "페나궁전 정원": {
    icon: "🌳",
    subtitle: "페나궁전을 둘러싼 낭만주의 정원",
    history: "200헥타르에 달하는 광대한 정원으로, 세계 각지에서 가져온 이국적인 식물들이 심어져 있습니다.",
    photoSpots: ["궁전과 정원 전경", "이국적 식물", "연못과 분수"],
    duration: "1~2시간",
    tips: "궁전 입장과 별도 티켓 가능. 편한 신발 필수",
    nearbyNote: "페나궁전 카페테리아"
  },
  "무어성": {
    icon: "🏰",
    subtitle: "8세기 무어인이 지은 산성",
    history: "8~9세기 무어인이 건설한 성으로, 신트라 산을 따라 성벽이 이어집니다. 성벽을 따라 걸으며 신트라 전경을 감상할 수 있습니다.",
    photoSpots: ["성벽 위에서 전경", "페나궁전 방향", "신트라 마을"],
    duration: "1~1.5시간",
    tips: "페나궁전과 콤보 티켓 추천. 경사 주의",
    nearbyNote: "신트라 구시가 맛집"
  },
  "헤갈레이라 별장": {
    icon: "🏰",
    subtitle: "비밀 지하 터널과 우물이 있는 신비로운 별장",
    history: "20세기 초 백만장자 몬테이루가 지은 별장으로, 프리메이슨 상징과 신비주의적 요소가 가득합니다. 27m 깊이의 '이니시에이션 우물'이 유명합니다.",
    photoSpots: ["이니시에이션 우물", "지하 터널", "고딕 탑"],
    duration: "1.5~2시간",
    tips: "온라인 예약 필수! 미끄러운 곳 주의",
    nearbyNote: "신트라 구시가 도보 이동"
  },
  "까보다로카": {
    icon: "🌊",
    subtitle: "유라시아 대륙 최서단, 땅끝마을",
    history: "유라시아 대륙의 최서단 지점으로, '땅이 끝나고 바다가 시작되는 곳'이라는 포르투갈 시인 카몽이스의 시구로 유명합니다.",
    photoSpots: ["절벽과 대서양", "땅끝 기념비", "석양"],
    duration: "30분~1시간",
    tips: "바람이 매우 강함! 따뜻한 옷 필수. 신트라에서 버스 연결",
    nearbyNote: "근처 식당 한정적"
  },
  "후아 다스 파다리아스": {
    icon: "🛍️",
    subtitle: "신트라 구시가 메인 거리",
    history: "신트라 왕궁으로 이어지는 좁은 골목으로, 전통 상점과 카페가 늘어서 있습니다. Casa Piriquita가 이 거리에 있습니다.",
    photoSpots: ["좁은 골목 풍경", "전통 상점들", "왕궁 방향"],
    duration: "30분",
    tips: "케이자다, 트라베세이루 꼭 맛보기",
    nearbyNote: "Casa Piriquita, Café Saudade"
  },
  "오비두스 성벽": {
    icon: "🏰",
    subtitle: "중세 성벽 위를 걷는 특별한 경험",
    history: "12세기 무어인 시대부터 이어진 성벽으로, 현재 약 1.5km가 보존되어 있습니다. 성벽 위를 걸으며 마을 전체를 조망할 수 있습니다.",
    photoSpots: ["성벽 위에서 마을", "포르타 다 빌라 문", "성벽 전경"],
    duration: "1시간",
    tips: "난간이 없어 주의 필요! 편한 신발 필수",
    nearbyNote: "구시가 레스토랑"
  },
  "오비두스 구시가": {
    icon: "🏘️",
    subtitle: "흰 벽과 파란 테두리의 동화 마을",
    history: "13세기부터 왕비의 마을로 불린 중세 마을입니다. 좁은 골목, 흰 벽에 파란색 또는 노란색 테두리가 특징입니다.",
    photoSpots: ["흰 벽 골목", "꽃으로 장식된 집", "성벽에서 내려다본 전경"],
    duration: "1~2시간",
    tips: "진자(체리 리큐어) 꼭 맛보기. 초콜릿 잔에 담김",
    nearbyNote: "구시가 내 식당들"
  },
  "산타 마리아 성당 (오비두스)": {
    icon: "⛪",
    subtitle: "17세기 아줄레주가 아름다운 성당",
    history: "12세기 건설되어 르네상스 시대에 재건된 성당으로, 내부의 17세기 아줄레주 타일이 유명합니다.",
    photoSpots: ["아줄레주 내부", "제단", "외관"],
    duration: "15분",
    tips: "무료 입장",
    nearbyNote: "구시가 중심"
  },
  "파티마 대성당": {
    icon: "⛪",
    subtitle: "세계적인 가톨릭 성지",
    history: "1917년 성모 발현지로, 매년 수백만 명의 순례자가 방문합니다. 거대한 광장과 현대적인 삼위일체 대성당이 있습니다.",
    photoSpots: ["광장과 대성당", "삼위일체 대성당 내부", "촛불 봉헌소"],
    duration: "1~2시간",
    tips: "미사 시간 확인. 경건한 복장 권장",
    nearbyNote: "주변 레스토랑"
  },
  "그리스도 수도원 (토마르)": {
    icon: "🏰",
    subtitle: "템플 기사단의 본거지, 마누엘 양식의 창",
    history: "12세기 템플 기사단이 건설한 수도원으로, 마누엘 양식의 '창문'이 포르투갈 대항해시대의 상징입니다.",
    photoSpots: ["마누엘 양식 창문", "원형 성당", "회랑"],
    duration: "1.5~2시간",
    tips: "토마르 도심에서 도보 또는 택시",
    nearbyNote: "토마르 구시가 레스토랑"
  },
  "산타크루스 수도원": {
    icon: "⛪",
    subtitle: "포르투갈 초대 왕들의 묘소",
    history: "1131년 설립된 수도원으로, 포르투갈 초대 왕 아폰수 1세와 산슈 1세의 묘소가 있습니다. 마누엘 양식의 정교한 조각이 특징입니다.",
    photoSpots: ["마누엘 양식 정문", "왕들의 묘소", "아줄레주 회랑"],
    duration: "30분~1시간",
    tips: "Café Santa Cruz와 연결",
    nearbyNote: "Café Santa Cruz 바로 옆"
  },
  "코임브라 구 대성당": {
    icon: "⛪",
    subtitle: "포르투갈에서 가장 잘 보존된 로마네스크 성당",
    history: "12세기 건설된 로마네스크 양식 대성당으로, 요새 같은 외관이 특징입니다. 포르투갈에서 가장 잘 보존된 로마네스크 건축물입니다.",
    photoSpots: ["요새 같은 외관", "로마네스크 정문", "회랑"],
    duration: "30분",
    tips: "대학교 방문 시 함께 둘러보기",
    nearbyNote: "Café Santa Cruz 인근"
  },
  "조아니나 도서관": {
    icon: "📚",
    subtitle: "세계에서 가장 아름다운 바로크 도서관",
    history: "1717년 주앙 5세 시대에 완공된 도서관으로, 화려한 바로크 양식의 내부와 30만 권의 고서가 있습니다. 밤에 책을 갉아먹는 벌레를 잡는 박쥐들이 살고 있습니다.",
    photoSpots: ["3개 층의 책장", "바로크 천장", "금박 장식"],
    duration: "20분 (제한)",
    tips: "대학교 티켓에 포함. 사전 예약 필수! 입장 인원 제한",
    nearbyNote: "대학교 내 카페테리아"
  },
  "브라간사 공작 궁전": {
    icon: "🏰",
    subtitle: "15세기 공작의 궁전, 포르투갈 대통령 관저",
    history: "15세기 브라간사 공작이 건설한 궁전으로, 현재 포르투갈 대통령의 북부 관저로 사용됩니다. 중세 무기, 태피스트리 컬렉션이 유명합니다.",
    photoSpots: ["외관 전체", "연회장", "무기 컬렉션"],
    duration: "1시간",
    tips: "기마랑이스 성과 함께 방문",
    nearbyNote: "구시가 맛집 도보 이동"
  },
  "올리베이라 광장": {
    icon: "🏛️",
    subtitle: "기마랑이스 구시가의 중심",
    history: "기마랑이스 역사 지구의 중심 광장으로, 중세 건물들과 올리베이라 성당이 둘러싸고 있습니다.",
    photoSpots: ["광장 전경", "올리베이라 성당", "중세 건물들"],
    duration: "20분",
    tips: "카페 테라스에서 휴식 추천",
    nearbyNote: "Cor de Tangerina 인근"
  },
  "올리베이라 성당": {
    icon: "⛪",
    subtitle: "살라도 전투 승리 기념 성당",
    history: "14세기 살라도 전투 승리를 기념해 건설된 성당으로, 고딕 양식의 종탑이 특징입니다.",
    photoSpots: ["고딕 종탑", "정문", "내부 제단"],
    duration: "15분",
    tips: "올리베이라 광장 바로 옆",
    nearbyNote: "광장 주변 카페"
  },
  "산티아고 광장": {
    icon: "🏛️",
    subtitle: "기마랑이스에서 가장 아름다운 광장",
    history: "중세 순례자들이 산티아고 순례길에서 쉬어가던 광장으로, 아늑한 분위기의 카페와 레스토랑이 있습니다.",
    photoSpots: ["중세 건물들", "광장 야경", "테라스 카페"],
    duration: "20분",
    tips: "저녁 식사나 음료 추천",
    nearbyNote: "Histórico by Papaboa 인근"
  },
  "브라가 대성당": {
    icon: "⛪",
    subtitle: "포르투갈에서 가장 오래된 대성당",
    history: "11세기에 건설을 시작한 포르투갈 최초의 대성당으로, 로마네스크, 고딕, 바로크 양식이 혼합되어 있습니다.",
    photoSpots: ["로마네스크 정문", "바로크 오르간", "보물관"],
    duration: "30분~1시간",
    tips: "보물관, 성가대석 별도 입장료",
    nearbyNote: "레푸블리카 광장 인근"
  },
  "레푸블리카 광장 (브라가)": {
    icon: "🏛️",
    subtitle: "브라가 도심의 활기찬 중심",
    history: "브라가 시청이 있는 중심 광장으로, 분수와 카페 테라스가 있습니다.",
    photoSpots: ["분수와 시청", "아케이드 건물", "야경"],
    duration: "15분",
    tips: "A Brasileira Braga가 이 광장에 있음",
    nearbyNote: "A Brasileira Braga"
  },
  "봉 제수스 푸니쿨라": {
    icon: "🚃",
    subtitle: "세계에서 가장 오래된 수력 푸니쿨라",
    history: "1882년 개통된 세계에서 가장 오래된 수력 푸니쿨라로, 물의 무게로 운행됩니다.",
    photoSpots: ["푸니쿨라 외관", "탑승 중", "도착역"],
    duration: "3분",
    tips: "편도 €2. 올라갈 때 타고 내려올 때 계단 추천",
    nearbyNote: "봉 제수스 성지"
  },
  "봉 제수스 전망대": {
    icon: "🌅",
    subtitle: "브라가 시내가 한눈에 보이는 전망대",
    history: "봉 제수스 성지 정상에 위치한 전망대로, 브라가 시내와 주변 풍경을 조망할 수 있습니다.",
    photoSpots: ["브라가 파노라마", "성지 전경", "석양"],
    duration: "15분",
    tips: "봉 제수스 방문 시 함께",
    nearbyNote: "정상 카페"
  },
  "통조림 가게 (Fantastic World)": {
    icon: "🐟",
    subtitle: "포르투갈 통조림의 환상적인 세계",
    history: "2016년 오픈한 포르투갈 통조림 전문점으로, 화려한 빈티지 패키지의 정어리, 참치, 문어 등 다양한 통조림을 판매합니다.",
    photoSpots: ["화려한 통조림 진열", "빈티지 인테리어", "기념품 코너"],
    duration: "15~30분",
    tips: "기념품으로 인기! 시식 가능",
    nearbyNote: "시아두 지구 중심"
  },
  "리스본 시청": {
    icon: "🏛️",
    subtitle: "코메르시우 광장의 노란 건물",
    history: "코메르시우 광장 서쪽에 위치한 리스본 시청 건물입니다. 1755년 대지진 후 재건되었습니다.",
    photoSpots: ["노란 파사드", "광장에서 전체", "아치 디테일"],
    duration: "10분 (외부)",
    tips: "내부 투어는 제한적",
    nearbyNote: "코메르시우 광장 레스토랑"
  },
  "바탈랴 수도원": {
    icon: "⛪",
    subtitle: "포르투갈 독립의 상징, 미완성 예배당의 미학",
    history: "1385년 알주바호타 전투 승리를 기념하여 주앙 1세가 건설했습니다. 포르투갈 고딕 양식과 마누엘 양식이 결합된 걸작으로, 특히 지붕이 없는 '미완성 예배당'은 압도적인 아름다움을 자랑합니다. 유네스코 세계문화유산입니다.",
    photoSpots: ["미완성 예배당 하늘 뷰", "왕의 회랑", "수도원 정면 파사드"],
    duration: "1시간",
    tips: "미완성 예배당은 별도 입구가 있음. 파티마 가는 길에 들르기 좋음",
    nearbyNote: "수도원 앞 광장 카페"
  }
});
