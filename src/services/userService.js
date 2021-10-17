const UserModel = require("../models/user.js");

const register = async (user) => {
  return UserModel.create({
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
    console.log("pass is ", validPass);
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
  return UserModel.findById(id).populate("enrolledList", "title").lean();
};

const enrollInCourse = async (courseId, userId) => {
  const user = await UserModel.findById(userId);
  user.enrolledList.push(courseId);
  return user.updateOne({ $set: { enrolledList: user.enrolledList } });
};

const checkUsername = async (name) => {
  let temp = await UserModel.findOne({ username: name }).lean();
  return temp != null;
};

const userService = { register, login, getUser, enrollInCourse, checkUsername };

module.exports = userService;
