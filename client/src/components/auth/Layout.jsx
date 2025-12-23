import React from "react";
// Layout.jsx
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="flex min-h-screen w-full ">
        <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12 text-primary-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight text-amber-50">
            Welcome to Yoursmart
          </h1>
        </div>
        <div className=" flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
