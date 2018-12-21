const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const dataRange = {
    lat1: 34.693716,
    lng1: 133.823387,
    lat2: 34.653716,
    lng2: 133.993387
  };
  let points = dataRange;

  // クエリがあればそれを使う
  if (req.query.length) {
    points = req.query;
  }

  const query = `
    SELECT
      *
    FROM
      t1
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
