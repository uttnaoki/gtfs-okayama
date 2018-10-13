var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json([{
    "type": "Feature",
    "properties": {
      "stop_name": "岡山バスセンター"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [133.933387, 34.683716]
    }
  }, {
    "type": "Feature",
    "properties": {
      "stop_name": "大都会岡山バス停"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [133.924387, 34.663716]
    }
  }])
});

module.exports = router;
