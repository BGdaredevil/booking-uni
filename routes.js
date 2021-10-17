const router = require("express").Router();
const homeController = require("./src/controllers/homeController.js");

const userController = require("./src/controllers/userController.js");
// const courseController = require("./src/controllers/courseController.js");

//debug
// function logger(req, res, next) {
//   console.log(req.path);
//   next();
// }
// router.use(logger);

router.use("/", homeController);
router.use("/user", userController);
// router.use("/course", courseController);
router.use("*", (req, res) => {
  console.log("called 404");
  res.status(404).render("404");
});

module.exports = router;
