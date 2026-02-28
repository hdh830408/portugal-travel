function getLandmarkToFoods() {
  const mapping = {};
  if (typeof NEARBY_LANDMARKS !== 'undefined') {
    Object.entries(NEARBY_LANDMARKS).forEach(([food, landmarks]) => {
      landmarks.forEach(lm => {
        if (!mapping[lm]) mapping[lm] = [];
        if (!mapping[lm].includes(food)) mapping[lm].push(food);
      });
    });
  }
  return mapping;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getNearbyFoodsByGPS(landmarkName, radiusMeters = 500) {
  const landmarkCoords = PLACE_COORDS[landmarkName];
  if (!landmarkCoords) return [];
  
  const nearbyFoods = [];
  PLACES.forEach(p => {
    if (!FOOD_TYPES.includes(p.type)) return;
    const foodCoords = PLACE_COORDS[p.name];
    if (!foodCoords) return;
    
    const distance = getDistance(landmarkCoords.lat, landmarkCoords.lng, foodCoords.lat, foodCoords.lng);
    if (distance <= radiusMeters) {
      nearbyFoods.push({ name: p.name, distance: Math.round(distance) });
    }
  });
  return nearbyFoods.sort((a, b) => a.distance - b.distance);
}

function hasNearbyFoods(landmarkName) {
  if (PLACE_COORDS[landmarkName]) {
    const nearby = getNearbyFoodsByGPS(landmarkName, 500);
    if (nearby.length > 0) return true;
  }
  const mapping = getLandmarkToFoods();
  return mapping[landmarkName] && mapping[landmarkName].length > 0;
}

function getNearbyFoodsList(landmarkName) {
  const result = [];
  const lmCoords = PLACE_COORDS[landmarkName];
  if (!lmCoords) return result;
  const foods = PLACES.filter(p => FOOD_TYPES.includes(p.type));
  foods.forEach(food => {
    const coords = PLACE_COORDS[food.name];
    if (!coords) return;
    const dist = getDistance(lmCoords.lat, lmCoords.lng, coords.lat, coords.lng);
    if (dist <= 500) result.push({ ...food, distance: dist });
  });
  result.sort((a, b) => a.distance - b.distance);
  return result;
}