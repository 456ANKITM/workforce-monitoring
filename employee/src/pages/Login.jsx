import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Users, MapPinned } from "lucide-react";
import { useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import Success from "../components/Success";
import Error from "../components/Error";

const Login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
      const res = await login(formData).unwrap();
      console.log(res)

      if (res.success) {
        setSuccess(res.message);

        setTimeout(() => {
          // employee goes to employee dashboard (change if needed)
          navigate("/main");
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Success / Error */}
      {success && (
        <Success title="Login Successful" message={success} />
      )}

      {error && (
        <Error title="Login Failed" message={error} />
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              WM
            </div>

            <div>
              <h1 className="font-bold text-lg">WorkForce Monitor</h1>
              <p className="text-xs text-slate-500">
                Employee Access Portal
              </p>
            </div>
          </div>

        
        </div>
      </nav>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div className="hidden lg:block">
            <span className="inline-flex px-4 py-2 rounded-full bg-slate-100 text-sm font-medium">
              Workforce Monitoring System
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
              Employee Portal,
              <br />
              Track Your Work
              <br />
              Stay Connected
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Login to mark attendance, share live location, and stay synced with your organization.
            </p>

            <div className="mt-10 grid gap-5">

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm border">
                  <MapPinned size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">Live Location</h3>
                  <p className="text-slate-500 text-sm">
                    Share real-time GPS updates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm border">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">Attendance System</h3>
                  <p className="text-slate-500 text-sm">
                    Check in and check out easily.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm border">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-slate-500 text-sm">
                    Protected employee authentication.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Login Card */}
          <div className="flex justify-center">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

              <div className="text-center">
                <div className="h-14 w-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto font-bold text-lg">
                  WM
                </div>

                <h2 className="mt-4 text-3xl font-bold">
                  Employee Login
                </h2>

                <p className="mt-2 text-slate-500">
                  Sign in to access your workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="98XXXXXXXX"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter password"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-12 bg-black text-white rounded-xl font-semibold hover:bg-slate-800 transition"
                >
                  {isLoading ? "Logging in..." : "Employee Login"}
                </button>

              </form>

            

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;