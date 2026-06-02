import express from "express"
import { protect } from "../middleware/authMiddleware.js";
import { deleteEmployees, disableCamera, disableLocation, enableCamera, enableLocation, getAllEmployees, getSingleEmployeeById, onlineEmployees, startCameraSession, updateLiveLocation } from "../controllers/userController.js";
import { uploadFields } from "../middleware/upload.js";

const router = express.Router();

router.post("/location/live", protect, updateLiveLocation);
router.put("/location/enable", protect, enableLocation)
router.put("/location/disable", protect, disableLocation)
router.put("/camera/enable", protect, enableCamera)
router.put("/camera/disable", protect, disableCamera)
router.get("/all", protect, getAllEmployees);
router.get("/online-employees", protect, onlineEmployees)
router.post("/startCamera", protect, startCameraSession)
router.delete("/:id", protect, deleteEmployees);
router.get("/:id", protect, getSingleEmployeeById)

export default router;

