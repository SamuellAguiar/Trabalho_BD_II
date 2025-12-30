// Função auxiliar para padronizar GeoJSON
const createPoint = (lat, lng) => {
     return {
          type: "Point",
          coordinates: [
               parseFloat(lng), // Mongo usa Longitude, Latitude
               parseFloat(lat)
          ]
     };
};

module.exports = { createPoint };