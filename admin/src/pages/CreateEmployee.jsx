import { useEffect, useEffectEvent, useState } from "react";
import Navbar from "../components/Navbar";
import { useCreateEmployeeMutation } from "../redux/api/authApi";
import Success from "../components/Success";
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";

const CreateEmployee = () => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    designation: "",
    department: "",
    employeeId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await createEmployee(formData).unwrap();

      if (res.success) {
        setSuccess(res.message);

        setFormData({
          fullName: "",
          phone: "",
          password: "",
          designation: "",
          department: "",
          employeeId: "",
        });

              setTimeout(() => {
        navigate("/main");
      }, 1200);

      

      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to create employee");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Success / Error */}
      {success && (
        <Success title="Employee Created" message={success} />
      )}

      {error && (
        <Error title="Creation Failed" message={error} />
      )}

      {/* Page */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Employee
          </h1>
          <p className="text-slate-500 mt-1">
            Add a new employee to the workforce tracking system
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Employee ID
              </label>
              <input
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                placeholder="EMP-001"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Designation
              </label>
              <input
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Department
              </label>
              <input
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="IT Department"
                className="w-full mt-2 h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 mt-4">
              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-12 bg-black text-white rounded-xl font-semibold hover:bg-slate-800 transition"
              >
                {isLoading ? "Creating Employee..." : "Create Employee"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;