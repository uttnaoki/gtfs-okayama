const getJSON = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const mymap = L.map('mapid').setView([34.673716, 133.923387], 15);

L.tileLayer(
  'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
).addTo(mymap);

const geojsonMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

const onEachFeature = async (feature, layer) => {
  const spot = feature.properties;
  if (feature.properties && feature.properties.stop_name) {
    const timetable = await getJSON(`timetable?stop_id=${spot.stop_id}`)
    let tooltip = '';
    for (const service of timetable) {
      tooltip += `<div>${service.departure_time}${service.agency_name}
        ${service.route_long_name}${service.trip_headsign}</div>`
    }
    layer.bindPopup(tooltip);
  }
}

const getStops = async (url) => {
  const response = await fetch(url);
  const json = await response.json();

  L.geoJSON(json, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  }).addTo(mymap);
}

getStops(`stops?lat=${mymap.getCenter().lat}&lng=${mymap.getCenter().lng}`);

// const box = mymap.getBounds();
// const corners = [
//   [box.getWest(), box.getSouth()],
//   [box.getEast(), box.getSouth()],
//   [box.getEast(), box.getNorth()],
//   [box.getWest(), box.getNorth()]
//   ];
// console.log(mymap.getCenter())
// console.log(corners)
