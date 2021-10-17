const router = require("express").Router();

const courseService = require("../services/courseServise.js");

const home = async (req, res) => {
  const viewObj = {};
  const courses = await courseService.getAllPublic();
  if (courses.length > 0) {
    viewObj.courses = courses.map((c) => {
      c.createdAt = c.createdAt.toUTCString();
      return c;
    });
  }
  res.render("home", viewObj);
};

router.get("/", home);

module.exports = router;
