// Função auxiliar para padronizar GeoJSON
const createPoint = (lat, lng) => {
     return {
          type: "Point",
          coordinates: [
               parseFloat(lng), //Longitude, Latitude
               parseFloat(lat)
          ]
     };
};

module.exports = { createPoint };