const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const cityCodes = ('cityCodes' in req.query) ? req.query.cityCodes : ['33202'];

  // 以下2行で
  // n03_007 = '33202' OR n03_007 = '33203'
  // といった市区町村コードのフィルター(WHERE文)を作成する
  const filter4city_list = cityCodes.map((d) => { return `n03_007 = '${d}'`; });
  const filter4city = filter4city_list.join(' OR ');

  const query = `
    SELECT
      mesh.pop2020 AS population,
      ST_AsGeoJSON(mesh.geom)
    FROM
      mesh as mesh,
      (
        SELECT * FROM okayama
        WHERE ${filter4city}
        ) AS kurashiki
        WHERE ST_Within(mesh.geom, kurashiki.geom);
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
