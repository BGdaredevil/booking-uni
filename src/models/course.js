const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: [4, "Title is too short"] },
  description: { type: String, required: true, minlength: [20, "Description is too short"] },
  imageUrl: {
    type: String,
    required: true,
    validate: [/^https?:\/{2}/, "Please enter a valid URL"],
  },
  isPublic: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

CourseSchema.pre("deleteOne", function () {
  //todo fix references on delete with the user
});

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
