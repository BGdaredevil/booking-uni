const router = require("express").Router();

const hotelService = require("../services/hotelService.js");

const home = async (req, res) => {
  const viewObj = {};
  const hotels = await hotelService.getAll();
  if (hotels.length > 0) {
    viewObj.hotels = hotels;
  }
  res.render("home", viewObj);
};

router.get("/", home);

module.exports = router;
