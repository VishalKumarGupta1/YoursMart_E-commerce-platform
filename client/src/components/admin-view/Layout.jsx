import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <div className="flex min-h-screen w-full ">
        {/* admin sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />{" "}
        <div className=" flex flex-1 flex-col">
          {/* admin header */}
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main className="flex flex-1 flex-col bg-muted/40 md:p-6  ">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
