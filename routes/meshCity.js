const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  // const dataRange = {
  //   lat1: 34.693716,
  //   lng1: 133.823387,
  //   lat2: 34.653716,
  //   lng2: 133.993387
  // };
  // let points = dataRange;

  // // クエリがあればそれを使う
  // if (Object.keys(req.query).length) {
  //   points = req.query;
  // }

  const query = `
    SELECT
      t1.pop2020 AS population,
      ST_AsGeoJSON(t1.geom)
    FROM
      t1 as t1,
      (select * from okayama
      where n03_007 = '33202') as kurashiki
    WHERE ST_Within(t1.geom, kurashiki.geom);
    `
  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
