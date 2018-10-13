const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  const query = `
    select
      departure_time,
      stop_headsign,
      tp.service_id,
      tp.shape_id,
      tp.trip_headsign,
      rt.route_long_name,
      ag.agency_name,
      rt.geom
    from
      stop_times as st
      inner join trips as tp on st.trip_id = tp.trip_id
      inner join routes as rt on tp.route_id = rt.route_id
      inner join agency as ag on rt.agency_id =ag.agency_id
    where
      stop_id = '151_2'
    limit
      100
  `

  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
