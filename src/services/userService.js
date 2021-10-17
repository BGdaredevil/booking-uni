const UserModel = require("../models/user.js");

const register = async (user) => {
  return UserModel.create({
    email: user.email,
    username: user.username,
    password: user.password,
  });
};

const login = async (user) => {
  try {
    const item = await UserModel.findOne({ username: user.username });
    if (!item) {
      return null;
    }
    const validPass = await item.verifyPass(user.password);
    // console.log("pass is ", validPass);
    if (validPass) {
      return item;
    } else {
      return null;
    }
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

const getUser = (id) => {
  return UserModel.findById(id).populate("bookedHotels", "name").lean();
};

const bookHotel = async (hotelId, userId) => {
  const user = await UserModel.findById(userId);
  user.bookedHotels.push(hotelId);
  return user.updateOne({ $set: { bookedHotels: user.bookedHotels } });
};

const createHotel = async (hotel) => {
  const user = await UserModel.findById(hotel.owner);
  user.offeredHotels.push(hotel._id);
  return user.updateOne({ $set: { offeredHotels: user.offeredHotels } });
};

const checkUsername = async (str) => {
  let temp = await UserModel.findOne({ username: str }).lean();
  return temp != null;
};

const checkEmail = async (str) => {
  let temp = await UserModel.findOne({ email: str }).lean();
  return temp != null;
};

const userService = { register, login, getUser, bookHotel, checkUsername, checkEmail, createHotel };

module.exports = userService;
