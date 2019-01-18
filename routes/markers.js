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

  const query = `
    SELECT
      place.name,
      place.category,
      place.address,
      place.lat,
      place.lng
    FROM
      place AS place,
      (
        SELECT * FROM okayama
        WHERE ${filter4city}
      ) AS targetCity
    WHERE ST_Within(place.geom, targetCity.geom);
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
