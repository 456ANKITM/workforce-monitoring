import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },

    designation: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },

    socketId: {
      type: String,
      default: null,
    },

    isTracking: {
      type: Boolean,
      default: false,
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      updatedAt: Date,
    },

    locationEnabled: {
      type: Boolean,
      default: false,
    },

    cameraEnabled: {
      type: Boolean,
      default: false,
    },
    cameraSession:{
      isActive:{type:Boolean, default:false},
      startedBy:{type:String, default:null},
      startedAt:{type:Date}
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;