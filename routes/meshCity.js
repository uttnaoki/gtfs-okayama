const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const cityCodes = ('cityCodes' in req.query) ? req.query.cityCodes : ['33202'];

  // 以下2行で
  // n03_007 = '33202' OR n03_007 = '33203'
  // といった市区町村コードのフィルター(WHERE文)を作成する
  const filter4cityList = cityCodes.map((d) => { return `n03_007 = '${d}'`; });
  const filter4city = filter4cityList.join(' OR ');

  /** 
   * 人工データのみを送るか，人工データとgeomのセットを送るかを分類するSELECT文を作成する．
   * クエリにyearがある場合，二回目以降のGETと見なし，人工データのみを送る．
   * クエリにyearがない場合，一回目のGETと見なし，初期年次の人工データとgeomのセットを送る．
  */
  let selectQuery = '';
  if ('year' in req.query) { // 二回目以降のGETと判断する．geomを除いた人工データのみを送る．
    let year = parseInt(req.query.year);
    // TODO: yearのバリデーション
    // とりあえず，この中の数字じゃなかったら2020に固定
    if (!(year in [2010, 2020, 2025, 2030, 2035, 2040])) { 
      year = 2020;
    }
    // selectQuery = `mesh.pop${year} AS population`
    selectQuery = `
      mesh.pop${year} AS population,
      ST_AsGeoJSON(mesh.geom)
    `
  } else { // 一回目のGETと判断する．人工データとgeomのセットを送る．
    selectQuery = `
      mesh.pop2020 AS population,
      ST_AsGeoJSON(mesh.geom)
    `;
  }

  const query = `
    SELECT
      ${selectQuery}
    FROM
      mesh as mesh,
      (
        SELECT * FROM okayama
        WHERE ${filter4city}
        ) AS targetCity
        WHERE ST_Within(mesh.geom, targetCity.geom);
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
