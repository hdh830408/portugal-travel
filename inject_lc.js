const fs = require('fs');

let content = fs.readFileSync('d:/portugal-travel/portugal_data.js', 'utf8');

const targets = [
  '글로리아 푸니쿨라',
  '산타 주스타 엘리베이터', // Check what name it is
  '아우구스타 개선문',
  '상 조르제 성',
  '제로니무스 수도원',
  '발견기념비',
  '벨렝탑',
  '아주다 궁전',
  '카르무 성당',
  '마프라 국립 궁전',
  '알코바사 수도원',
  '바탈랴 수도원',
  '그리스도 수도원 (토마르)',
  // ITINERARY
  '글로리아 푸니쿨라',
  '카르무 수녀원',
  '비판사 아침 후 글로리아', // wait, we can just render the badge dynamically via JS in UI if name matches!
];

// Wait, doing this via dynamic JS in ui-components is much cleaner than mutating portugal_data.js everywhere!
