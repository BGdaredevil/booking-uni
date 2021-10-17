const HotelModel = require("../models/hotel.js");
const userService = require("./userService.js");

const create = async (data) => {
  const newHotel = await HotelModel.create(data);
  await userService.createHotel(newHotel);
  return newHotel;
};

const getAll = () => {
  return HotelModel.find({}).lean();
};

const getOne = (id) => {
  return HotelModel.findById(id).populate("bookedList").lean();
};

const updateOne = (id, data) => {
  return HotelModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = (id) => {
  return HotelModel.findByIdAndDelete(id);
};

const join = async (hotelId, user) => {
  const hotel = await HotelModel.findById(hotelId);
  //   console.log(user.id);
  hotel.bookedList.push(user.id);
  await userService.bookHotel(hotelId, user.id);
  return hotel.updateOne({ $set: { bookedList: hotel.bookedList } });
};

const search = async (typeStr) => {
  //   console.log(typeStr);
  const searchObj = { type: new RegExp(typeStr, "i") };
  return HotelModel.find(searchObj).lean();
};

const hotelService = { create, getAll, getOne, updateOne, deleteOne, join, search };

module.exports = hotelService;
