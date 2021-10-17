const router = require("express").Router();

const { isAuth } = require("../middlewares/userMiddleware.js");
const hotelService = require("../services/hotelService.js");

const create = async (req, res) => {
  //   console.log(req.body);
  //   return;
  const escapedHotel = {
    name: req.body.name,
    city: req.body.city,
    imageUrl: req.body.imageUrl,
    freeRooms: Number(req.body.freeRooms),
  };

  if (Object.values(escapedHotel).includes("")) {
    console.log("empty detected");
    escapedHotel.error = [{ message: "All fields are mandatory" }];
    res.render("course/create-course", escapedHotel);
    return;
  }

  try {
    escapedHotel.owner = req.user.id;
    await hotelService.create(escapedHotel);
    res.redirect("/");
  } catch (err) {
    const errKeys = Object.keys(err?.errors);
    if (
      errKeys.includes("name") ||
      errKeys.includes("city") ||
      errKeys.includes("imageUrl") ||
      errKeys.includes("freeRooms")
    ) {
      const errMess = [
        err.errors.name?.message,
        err.errors.city?.message,
        err.errors.imageUrl?.message,
        err.errors.freeRooms?.message,
      ]
        .filter((e) => e != undefined)
        .map((e) => ({ message: e }));

      escapedHotel.error = errMess;
      res.render(`hotel/create`, escapedHotel);
    } else {
      console.log(err);
      throw err;
    }
  }
};

const details = async (req, res) => {
  const viewObj = {};
  const course = await hotelService.getOne(req.params.id);
  viewObj.course = course;
  viewObj.isOwner = course.owner == req?.user?.id;
  viewObj.isStudent = course.students.some((x) => x._id == req?.user?.id);
  res.render("hotel/details", viewObj);
};

const loadEdit = async (req, res) => {
  const course = await hotelService.getOne(req.params.id);
  res.render("hotel/edit", course);
};

const edit = async (req, res) => {
  const escapedCourse = {
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isPublic: Boolean(req.body.isPublic),
  };

  if (Object.values(escapedCourse).includes("")) {
    console.log("empty detected");
    escapedCourse.error = [{ message: "All fields are mandatory" }];
    res.render(`hotel/edit`, escapedCourse);
    return;
  }

  try {
    await hotelService.updateOne(req.params.id, escapedCourse);
    res.redirect(`/hotel/details/${req.params.id}`);
  } catch (err) {
    if (
      Object.keys(err.errors).includes("imageUrl") ||
      Object.keys(err.errors).includes("description") ||
      Object.keys(err.errors).includes("title")
    ) {
      const errMess = [
        err.errors.imageUrl?.message,
        err.errors.description?.message,
        err.errors.title?.message,
      ]
        .filter((e) => e != undefined)
        .map((e) => ({ message: e }));

      escapedCourse.error = errMess;
      res.render(`hotel/edit`, escapedCourse);
    } else {
      throw err;
    }
  }
};

const enroll = async (req, res) => {
  try {
    await hotelService.join(req.params.id, req.user);
    res.redirect(`/hotel/details/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
};

const remove = async (req, res) => {
  try {
    await hotelService.deleteOne(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};

router.get("/create", isAuth, (req, res) => res.render("hotel/create"));
router.post("/create", isAuth, create);

router.get("/details/:id", details);
router.get("/edit/:id", isAuth, loadEdit);
router.post("/edit/:id", isAuth, edit);

router.get("/enroll/:id", isAuth, enroll);
router.get("/delete/:id", isAuth, remove);

module.exports = router;
