import EmployeeNavbar from "../components/EmployeeNavbar";
import EmployeeSidebar from "../components/EmployeeSidebar";
import EmployeeMap from "../components/EmployeeMap";

const Main = () => {


  return (
    <div className="h-screen flex flex-col bg-slate-100">
      
      <EmployeeNavbar />

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">

        {/* LEFT → MAP (80%) */}
        <main className="w-4/5 h-full overflow-hidden">
          <div className="w-full h-full p-2">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
              <EmployeeMap />
            </div>
          </div>
        </main>

        {/* RIGHT → SIDEBAR (20%) */}
        <aside className="w-1/5 h-full bg-white border-l border-slate-200">
          <EmployeeSidebar />
        </aside>

      </div>
    </div>
  );
};

export default Main;