import { useState } from "react";
import { UserPlus, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOnlineEmployeesQuery } from "../redux/api/userApi";
import { useAdminCamera } from "../hooks/useAdminCamera";

const RightSidebar = ({ setSelectedUser }) => {
  const { data } = useOnlineEmployeesQuery();
  const navigate = useNavigate();

  const { videoRef, startViewing, stopViewing, error } = useAdminCamera();

  const [activeEmployee, setActiveEmployee] = useState(null);

  const employees = data?.employees || [];

  const handleClick = (employee) => {
    if (!employee.locationEnabled || !employee.currentLocation) {
      alert("❌ This user has not enabled location tracking");
      return;
    }

    setSelectedUser({
      userId: employee._id,
      fullName: employee.fullName,
      latitude: employee.currentLocation.latitude,
      longitude: employee.currentLocation.longitude,
    });
  };

  const handleViewCamera = (employee) => {
    if (!employee.cameraEnabled) {
      alert("❌ Employee has disabled camera");
      return;
    }

    setActiveEmployee(employee);

    startViewing(employee._id);
  };

  const handleStopViewing = () => {
    stopViewing();
    setActiveEmployee(null);
  };

  return (
    <aside className="h-full bg-white border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={() => navigate("/create-employee")}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white py-3 rounded-xl font-medium transition"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {employees.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-4">
            No online employees
          </p>
        ) : (
          employees.map((employee) => (
            <div
              key={employee._id}
              onClick={() => handleClick(employee)}
              className="p-3 rounded-xl border hover:bg-slate-50 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold uppercase">
                    {employee?.fullName?.charAt(0) || "U"}
                  </div>

                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full bg-green-500" />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">
                    {employee.fullName}
                  </h4>

                  <p className="text-xs text-blue-600">
                    Click to track location
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        employee.cameraEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {employee.cameraEnabled
                        ? "Camera Enabled"
                        : "Camera Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Camera Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCamera(employee);
                }}
                disabled={!employee.cameraEnabled}
                className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
                  employee.cameraEnabled
                    ? "bg-black text-white hover:bg-black/80"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Camera size={16} />
                View Camera
              </button>
            </div>
          ))
        )}
      </div>

      {/* Live Camera Viewer */}
      {activeEmployee && (
        <div className="border-t bg-white p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">
              Live Camera
            </h3>

            <span className="text-xs text-slate-500">
              {activeEmployee.fullName}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover"
            />
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            onClick={handleStopViewing}
            className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Stop Viewing
          </button>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;