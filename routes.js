const router = require("express").Router();
const homeController = require("./src/controllers/homeController.js");

const userController = require("./src/controllers/userController.js");
const hotelController = require("./src/controllers/hotelController.js");

//debug
function logger(req, res, next) {
  console.log(req.path);
  next();
}
router.use(logger);

router.use("/", homeController);
router.use("/user", userController);
router.use("/hotel", hotelController);
router.use("*", (req, res) => {
  console.log("called 404");
  res.status(404).render("404");
});

module.exports = router;
