function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRadians = (deg) => deg * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1); 
    const dLon = toRadians(lon2 - lon1); 
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c;

    return distance;
}

module.exports = {calculateDistance};