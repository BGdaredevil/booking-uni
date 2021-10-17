const CourseModel = require("../models/course.js");
const userService = require("./userService.js");

const getAllPublic = () => {
  return CourseModel.find({ isPublic: true }).sort({ addedOn: -1 }).lean();
};

const create = (data) => {
  return CourseModel.create(data);
};

const getAll = () => {
  return CourseModel.find({}).lean();
};

const getOne = (id) => {
  return CourseModel.findById(id).populate("students").lean();
};

const updateOne = (id, data) => {
  return CourseModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = (id) => {
  return CourseModel.findByIdAndDelete(id);
};

const join = async (courseId, user) => {
  const course = await CourseModel.findById(courseId);
  console.log(user.id);
  course.students.push(user.id);
  await userService.enrollInCourse(courseId, user.id);
  return course.updateOne({ $set: { students: course.students } });
};

const search = async (typeStr) => {
  console.log(typeStr);
  const searchObj = { type: new RegExp(typeStr, "i") };
  return CourseModel.find(searchObj).lean();
};

const houseService = { getAllPublic, create, getAll, getOne, updateOne, deleteOne, join, search };

module.exports = houseService;
