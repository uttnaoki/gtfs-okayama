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
    from
      stops
  `

  db.task(async t => {
    const rtn = await t.any(query);
    res.json(rtn);
  })
});

module.exports = router;
