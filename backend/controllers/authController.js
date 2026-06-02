import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupAdmin = async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      fullName,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 SEND TOKEN AS COOKIE
    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        phone: admin.phone,
        role: admin.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
    try {
        const admin = req.user;
        if(admin.role !== "admin") {
            return res.status(403).json({
                success:false, 
                message:"Access Dennie, admin only"
            })
        }
        const {
            fullName, 
            phone, 
            password, 
            designation, 
            department,
            employeeId, 
        } = req.body

     if(!fullName || !phone ||!password ||!employeeId ||!designation ||!department) {
        return res.status(400).json({
            success:false, 
            message:"All Fields are required"
        })
     }

     const existingUser = await User.findOne({phone});

     if(existingUser) {
        return res.status(400).json({
            success:false, 
            message:"Employee already exists with this phone"
        })
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const employee = await User.create({
        fullName,
        phone, 
        password: hashedPassword,
        role:"employee", 
        employeeId, 
        designation, 
        department
     })

     return res.status(201).json({
        success:true, 
        message:"Employee created successfully", 
        employee: {
            id: employee._id, 
            fullName: employee.fullName, 
            phone: employee.phone, 
            role: employee.role,
            employeeId: employee.employeeId,
            designation: employee.designation,
            department: employee.department
        }
     })
        
    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
    }
}

export const login = async (req, res) => {
    try {
        const {phone, password} = req.body;
        if(!phone || !password) {
            return res.status(400).json({
                success:false, 
                message:"Phone and Password are required"
            })
        }

        const user = await User.findOne({phone})

        if(!user) {
            return res.status(400).json({
                success:false, 
                message:"Invalid Credentials"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({
                success:false, 
                message:"Invalid Credentials"
            })
        }

          const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 SEND TOKEN AS COOKIE
    res.cookie("token", token, {
      httpOnly: true, // prevents JS access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save()

     return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        employeeId: user.employeeId,
      },
    });

    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
    }
}


export const logout = async (req, res) => {
    try {
        const user = req.user;
        if(user) {
            user.isOnline = false, 
            user.lastSeen = new Date();
            await user.save()
        }

           res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

        return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
        
    } catch (error) {
         return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
    }
}

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success:true, 
      user
    })
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}