const getJSON = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

let mymap;
// バス停オブジェクトを保存するために宣言（バス停削除用）
let spots;

const renderMap = (coords) => {
  // mymap = L.map('mapid').setView([coords.latitude, coords.longitude], 15);
  mymap = L.map('mapid').setView([coords.latitude, coords.longitude], 18);
  
  L.tileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
  ).addTo(mymap);
  
  return mymap;
};

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

  spots = L.geoJSON(json, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  }).addTo(mymap);
};

// const box = mymap.getBounds();
// const corners = [
//   [box.getWest(), box.getSouth()],
//   [box.getEast(), box.getSouth()],
//   [box.getEast(), box.getNorth()],
//   [box.getWest(), box.getNorth()]
//   ];
// console.log(mymap.getCenter())
// console.log(corners)

const Error4getCurrentPosition = (error) => {
  const coords = {
    latitude: 34.673716,
    longitude: 133.99
  };
  main(coords);

  // エラーコード(error.code)の番号
  // 0:UNKNOWN_ERROR				原因不明のエラー
  // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
  // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
  // 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…

  // エラー番号に対応したメッセージ
  const errorInfo = [
    "原因不明のエラーが発生しました…。",
    "位置情報の取得が許可されませんでした…。",
    "電波状況などで位置情報が取得できませんでした…。",
    "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
  ];

  // エラー番号
  const errorNo = error.code;

  // エラーメッセージ
  const errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[errorNo];

  // アラート表示
  alert(errorMessage);
};

navigator.geolocation.getCurrentPosition(

  // [第1引数] 取得に成功した場合の関数
  (position) => {
    // 取得したデータの整理
    const data = position.coords;

    // データの整理
    const lat = data.latitude;
    const lng = data.longitude;
    // const alt = data.altitude;
    // const accLatlng = data.accuracy;
    // const accAlt = data.altitudeAccuracy;
    // const heading = data.heading;			//0=北,90=東,180=南,270=西
    // const speed = data.speed;
    main(data);
  },

  // [第2引数] 取得に失敗した場合の関数
  (error) => Error4getCurrentPosition(error),

  // [第3引数] オプション
  {
    "enableHighAccuracy": false,
    "timeout": 8000,
    "maximumAge": 2000,
  }
);

const main = (coords) => {
  console.log(coords);

  renderMap(coords);

  getStops(`stops?lat=${mymap.getCenter().lat}&lng=${mymap.getCenter().lng}`);

  mymap.on('moveend', (e) => {
    // 現在表示しているバス停のマーカーを削除
    mymap.removeLayer(spots)
    // 移動先の中心座標から特定の距離のバス停を表示
    getStops(`stops?lat=${mymap.getCenter().lat}&lng=${mymap.getCenter().lng}`);
  });
};