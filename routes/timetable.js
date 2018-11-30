const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const stop_id = req.query.stop_id;

  const query = `
    SELECT
      departure_time,
      stop_headsign,
      tp.service_id,
      tp.shape_id,
      tp.trip_headsign,
      rt.route_long_name,
      ag.agency_name,
      rt.geom
    FROM
      stop_times as st
      inner join trips as tp on st.trip_id = tp.trip_id
      inner join routes as rt on tp.route_id = rt.route_id
      inner join agency as ag on rt.agency_id =ag.agency_id
    WHERE
      stop_id = '${stop_id}'
    LIMIT
      10
  `

  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
