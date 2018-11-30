const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const query = `
    select
      'Feature' as type,
      row_to_json(
          (
            select p from (
              select
                stop_name as stop_name,
                stop_id as stop_id
              ) as p
          )
        )as properties,
      st_asGeoJson(geom)::json as geometry
    FROM stops
    WHERE ST_DWithin(geom, ST_GeomFromText('POINT(133.923387 34.673716)', 4326), 1000)
  `
  // WHEREについて
  // ST_DWithin(geom, ST_GeomFromText('POINT(lat lon)', 座標系), 範囲メートル)

  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
