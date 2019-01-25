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
  let year = 2015;
  if ('year' in req.query) { // 二回目以降のGETと判断する．geomを除いた人工データのみを送る．
    year = parseInt(req.query.year);

    // yearのバリデーション
    if (isNaN(year) || year < 2015 || 2040 < year) {
      year = 2015;
    }
  }

  // ${selectQuery}
  const query = `
    SELECT
      pop.population,
      ST_AsGeoJSON(pop.geom)
    FROM
      population as pop,
      (
        SELECT * FROM okayama
        WHERE ${filter4city}
        ) AS targetCity
        WHERE ST_Within(pop.geom, targetCity.geom) AND pop.year = '${year}';
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
