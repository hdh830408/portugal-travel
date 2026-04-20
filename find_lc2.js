const fs = require('fs');
eval(fs.readFileSync('d:/portugal-travel/portugal_data.js', 'utf8').replace(/const /g, 'var '));

const keywords = ['글로리아', '주스타', '개선문', '조르제', '제로니무스', '발견', '벨렝', '아주다', '카르무', '마프라', '알코바사', '바탈랴', '토마르'];
const lcFreeNames = [];

keywords.forEach(kw => {
  PLACES.forEach(p => {
    if (p.name.includes(kw)) {
      console.log('LC Place Candidade:', p.name);
      lcFreeNames.push(p.name);
    }
  });
});
console.log('Total found:', new Set(lcFreeNames));
