import { useState } from "react";
import Map from "../components/Map";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";

const Main = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-hidden">
          <section className="flex-1 p-4 bg-slate-200 overflow-hidden">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
              <Map selectedUser={selectedUser} />
            </div>
          </section>
        </main>

        <aside className="w-1/5 bg-white border-l border-slate-200 p-4">
          <RightSidebar setSelectedUser={setSelectedUser} />
        </aside>
      </div>
    </div>
  );
};

export default Main;