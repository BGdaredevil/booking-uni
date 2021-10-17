const router = require("express").Router();

const { isAuth } = require("../middlewares/userMiddleware.js");
const hotelService = require("../services/hotelService.js");

const create = async (req, res) => {
  const escapedHotel = {
    name: req.body.name,
    city: req.body.city,
    imageUrl: req.body.imageUrl,
    freeRooms: Number(req.body.freeRooms),
  };

  if (Object.values(escapedHotel).includes("")) {
    // console.log("empty detected");
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
  const hotel = await hotelService.getOne(req.params.id);
  viewObj.hotel = hotel;
  viewObj.isOwner = hotel.owner == req?.user?.id;
  viewObj.isBooked = hotel.bookedList.some((x) => x._id == req?.user?.id);
  viewObj.freeRooms = hotel.freeRooms - hotel.bookedList.length;
  // console.log(viewObj);
  res.render("hotel/details", viewObj);
};

const loadEdit = async (req, res) => {
  const hotel = await hotelService.getOne(req.params.id);
  // console.log(hotel);
  res.render("hotel/edit", hotel);
};

const edit = async (req, res) => {
  const escapedHotel = {
    _id: req.params.id,
    name: req.body.name,
    city: req.body.city,
    freeRooms: req.body.freeRooms,
    imageUrl: req.body.imageUrl,
  };

  if (Object.values(escapedHotel).includes("")) {
    // console.log("empty detected");
    escapedHotel.error = [{ message: "All fields are mandatory" }];
    res.render(`hotel/edit`, escapedHotel);
    return;
  }

  try {
    await hotelService.updateOne(req.params.id, escapedHotel);
    res.redirect(`/hotel/details/${req.params.id}`);
  } catch (err) {
    if (
      Object.keys(err.errors).includes("imageUrl") ||
      Object.keys(err.errors).includes("name") ||
      Object.keys(err.errors).includes("city") ||
      Object.keys(err.errors).includes("freeRooms")
    ) {
      const errMess = [
        err.errors.imageUrl?.message,
        err.errors.name?.message,
        err.errors.city?.message,
        err.errors.freeRooms?.message,
      ]
        .filter((e) => e != undefined)
        .map((e) => ({ message: e }));

      escapedHotel.error = errMess;
      res.render(`hotel/edit`, escapedHotel);
    } else {
      throw err;
    }
  }
};

const book = async (req, res) => {
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

router.get("/details/:id", isAuth, details);
router.get("/edit/:id", isAuth, loadEdit);
router.post("/edit/:id", isAuth, edit);

router.get("/book/:id", isAuth, book);
router.get("/delete/:id", isAuth, remove);

module.exports = router;
