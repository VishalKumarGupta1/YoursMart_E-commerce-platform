import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Control and monitor your store from one place
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            🚧 Dashboard Under Development
          </h2>

          <p className="text-gray-700 leading-relaxed">
            This dashboard is currently in progress. Once completed, you will be
            able to view complete store insights including product availability,
            stock management, sales, user activity, and order tracking such as
            confirmed, shipped, and delivered orders.
          </p>
          <p className="text-gray-700 leading-relaxed">
            {" "}
            Access detailed analytics and reports...
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Orders */}
          <Link to="/admin/orders">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📦 Orders
              </h3>
              <p className="text-gray-600 text-sm">
                View and manage confirmed, shipped, and delivered orders.
              </p>
            </div>
          </Link>

          {/* Products */}
          <Link to="/admin/products">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🛍 Products
              </h3>
              <p className="text-gray-600 text-sm">
                Manage product listings, pricing, and stock availability.
              </p>
            </div>
          </Link>

          {/* Users */}
          <Link to="/admin/users">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                👤 Users
              </h3>
              <p className="text-gray-600 text-sm">
                View registered users and manage customer accounts.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
