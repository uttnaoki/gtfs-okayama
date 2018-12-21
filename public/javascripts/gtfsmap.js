const map = L.map('mapid').setView([34.673716, 133.923387], 13);

L.tileLayer(
  'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
).addTo(map);

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

// function onEachFeature (feature, layer) {
//   if (feature.properties && feature.properties.stop_name) {
//     layer.bindPopup(`${feature.properties.stop_name}(${feature.properties.stop_id})`);
//   }
// }

const THRESHOLD256 = [
  { value: 0, color: 'rgba(42, 0, 255, 0.5)' },
  { value: 8, color: 'rgba(0, 102, 255, 0.5)' },
  { value: 16, color: 'rgba(0, 240, 255, 0.5)' },
  { value: 32, color: 'rgba(114, 255, 0, 0.5)' },
  { value: 64, color: 'rgba(255, 222, 0, 0.5)' },
  { value: 128, color: 'rgba(255, 131, 20, 0.5)' },
  { value: 256, color: 'rgba(255, 0, 66, 0.5)' },
];

async function renderMesh (url) {
  const response = await fetch(url);
  const json = await response.json();

  // console.log(json)
  // console.log(json[0].st_asgeojson)
  for (const meshZip of json) {
    const mesh = JSON.parse(meshZip.st_asgeojson);
    const pop = meshZip.population;
    let color;
    if (pop > 100) {
      color = THRESHOLD256[2].color;
    } 
    else {
      color = THRESHOLD256[4].color;
    }
    L.geoJSON(mesh, {
      // onEachFeature: onEachFeature,
      style: function (feature) {
        return { 
      stroke: false,
      color: "#000",
      fillColor: color,
      weight: 2,
      fillOpacity: 1
        };
      }
    }).bindPopup(function (layer) {
      return '<h1>hello</h1>';
    }).addTo(map);
  }
}

let dataRange = [
  {
    lat: 34.693716,
    lng: 133.823387
  },
  {
    lat: 34.653716,
    lng: 133.993387
  }
];

const dataRangeQuery = (points) => {
  return `lat1=${points[0].lat}&lng1=${points[0].lng}&lat2=${points[1].lat}&lng2=${points[1].lng}`;
};
console.log(dataRangeQuery(dataRange));
renderMesh(`mesh?${dataRangeQuery(dataRange)}`);