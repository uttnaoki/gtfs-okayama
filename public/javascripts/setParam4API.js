// URL解析して、クエリ文字列を返す
const getUrlVars = () => {
  var queryJson = {}, max = 0, hash = "", array = "";
  var url = window.location.search;
  
  //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
  queryArray = url.slice(1).split('&');
  for (const query of queryArray) {
    const querySplited = query.split('=');
    queryJson[querySplited[0]] = querySplited[1];
  }
  max = hash.length;

  return queryJson;
}

const queryJson = getUrlVars();
const queryLen = Object.keys(queryJson).length;

let param4API = {
  cityCode: [33202]
};

const cityCodeTable = {
  okayama: [33100, 33101, 33102, 33103, 33104],
  kurashiki: [33202],
  tsuyama: [33203],
  tamano: [33204],
  kasaoka: [33205],
  ibara: [33207],
  souja: [33208],
  takahashi: [33209],
  niimi: [33210],
  bizen: [33211],
  setouchi: [33212],
  akaiwa: [33213],
  maniwa: [33214],
  mimasaka: [33215],
  asaguchi: [33216],
  waki: [33346],
  hayashima: [33423],
  satosyo: [33445],
  yakage: [33461],
  shinjo: [33586],
  kagamino: [33606],
  syouou: [33622],
  nagi: [33623],
  nishiawakura: [33643],
  kumenan: [33663],
  misaki: [33666],
  kibichuou: [33681]
};

if ('city' in queryJson) {
  if (queryJson.city in cityCodeTable) {
    param4API.cityCode = cityCodeTable[queryJson.city];
  } else {
    console.log('クエリで指定した市区町村名が誤っています。')
  }
} else {
  console.log('クエリでcityが指定されていません。')
}
