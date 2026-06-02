import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  Users,
  Route,
  ClipboardCheck,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";

const LeftSidebar = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Live Map", icon: Map },
    { name: "Users", icon: Users },
    { name: "Routes", icon: Route },
    { name: "Attendance", icon: ClipboardCheck },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Bar Toggle */}
      <div className="md:hidden flex items-center p-3 bg-white border-b">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
        <span className="ml-3 font-semibold text-slate-700">
          Workforce Panel
        </span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full bg-white border-r border-slate-200
          w-72 md:w-full md:translate-x-0 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-bold text-slate-800">
            Workforce Track
          </h1>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <div className="p-3 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer
                hover:bg-slate-100 transition"
              >
                <Icon size={20} className="text-slate-600" />
                <span className="text-slate-700 font-medium">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="text-xs text-slate-400">
            Workforce Monitoring System
          </div>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;