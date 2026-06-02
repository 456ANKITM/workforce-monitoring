import User from "../models/User.js";

export const enableLocation = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  user.locationEnabled = true;
  user.isTracking = true;
  user.isOnline = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Location Enabled",
  });
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const disableLocation = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  user.locationEnabled = false;
  user.isTracking = false;
  user.isOnline = false;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Location disabled",
  });
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateLiveLocation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { latitude, longitude, accuracy } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.locationEnabled) {
      return res.status(403).json({
        success: false,
        message: "Location is disabled",
      });
    }

    user.currentLocation = {
      latitude,
      longitude,
      accuracy: accuracy || null,
      updatedAt: new Date(),
    };

    user.lastSeen = new Date();
    user.isOnline = true;
    user.isTracking = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Location updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const enableCamera = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cameraEnabled = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Camera Enabled",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const disableCamera = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.cameraEnabled = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Camera disabled",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const employees = await User.find({ role: "employee" }).select("-password");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const onlineEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
      isOnline: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteEmployees = async (req, res) => {
  try {
    const admin = req.user;

    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getSingleEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const startCameraSession = async (req, res) => {
  try {
    const admin = req.user;
    const {employeeId} = req.body;

    if(admin.role !== "admin") {
      return res.status(403).json({message:"Only admin allowed"})
    }

    const employee = await User.findById(employeeId);

    if(!employee || !employee.cameraEnabled) {
      return res.status(404).json({
        success:false, 
        message:"Employee not available or camera disabled"
      })
    }

    return res.status(200).json({
      success:true, 
      message:"Camera Session ready", 
      employeeSocketId: employee.socketId, 
      adminId: admin._id
    })
  } catch (error) {
    return res.status(500).json({
      success:false, 
      message: error.message
    })
  }
}