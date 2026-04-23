const fs = require('fs');
const content = fs.readFileSync('d:/portugal-travel/portugal_data.js', 'utf8');
const names = ['글로리아 푸니쿨라', '산타 주스타', '개선문', '상 조르제', '조르제 성', '제로니무스', '발견기념비', '발견 기념비', '벨렝탑', '벨렝 탑', '아주다', '카르무', '마프라', '알코바사', '바탈랴', '토마르'];
names.forEach(n => {
   const match = content.match(new RegExp('name:\\s*\"([^\"]*' + n + '[^\"]*)\"', 'i'));
   if (match) console.log('Found:', match[1]);
   else console.log('Not found:', n);
});
