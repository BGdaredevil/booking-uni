const HotelModel = require("../models/hotel.js");
const userService = require("./userService.js");

const create = (data) => {
  return HotelModel.create(data);
};

const getAll = () => {
  return HotelModel.find({}).lean();
};

const getOne = (id) => {
  return HotelModel.findById(id).populate("students").lean();
};

const updateOne = (id, data) => {
  return HotelModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = (id) => {
  return HotelModel.findByIdAndDelete(id);
};

const join = async (courseId, user) => {
  const course = await HotelModel.findById(courseId);
  console.log(user.id);
  course.students.push(user.id);
  await userService.enrollInCourse(courseId, user.id);
  return course.updateOne({ $set: { students: course.students } });
};

const search = async (typeStr) => {
  console.log(typeStr);
  const searchObj = { type: new RegExp(typeStr, "i") };
  return HotelModel.find(searchObj).lean();
};

const hotelService = { create, getAll, getOne, updateOne, deleteOne, join, search };

module.exports = hotelService;
