const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: { type: String, unique: true, minlength: [4, "Name is too short"] },
  city: { type: String, minlength: [4, "City is too short"] },
  imageUrl: {
    type: String,
    required: true,
    validate: [/^https?:\/{2}/, "Please enter a valid URL"],
  },
  freeRooms: {
    type: Number,
    required: true,
    min: [1, "Free rooms must be more than 0"],
    max: [100, "Free rooms must be less than 100"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bookedList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

HotelSchema.pre("deleteOne", function () {
  //todo fix references on delete with the user
});

const HotelModel = mongoose.model("Hotel", HotelSchema);

module.exports = HotelModel;
