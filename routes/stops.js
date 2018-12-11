const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const points = req.query;

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
    WHERE
    	ST_Intersects(
        ST_SetSRID(Box2D(ST_GeomFromText('LINESTRING(${points.lng1} ${points.lat1}, ${points.lng2} ${points.lat2})')), 4326),
        geom
        )
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
