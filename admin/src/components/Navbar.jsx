import { Link } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const admin = useSelector((state)=>state.user.admin)
  
  return (
    <nav className="w-full h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">

      {/* ================= LEFT: LOGO ================= */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
          WM
        </div>

        <div className="hidden sm:block">
          <h1 className="font-bold text-sm leading-tight">
            WorkForce Monitor
          </h1>
          <p className="text-[11px] text-slate-500">
            Admin Dashboard
          </p>
        </div>
      </div>

     

      {/* ================= RIGHT: NOTIFICATION + PROFILE ================= */}
      <div className="flex items-center gap-4">

    

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer group">
          
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
            {admin?.fullName ? admin.fullName[0] : "U"}
          </div>

          {/* Dropdown icon */}
          <ChevronDown size={16} className="text-slate-600 group-hover:rotate-180 transition" />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;