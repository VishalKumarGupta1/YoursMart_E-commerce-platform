import React from "react";

const Features = () => {
  const featuresList = [
    {
      title: "Manage Products",
      description:
        "Add, edit, and remove products from your store easily. Keep your inventory up-to-date and organized.",
      icon: "🛍",
    },
    {
      title: "Track Orders",
      description:
        "Monitor confirmed, shipped, and delivered orders all in one place with detailed order information.",
      icon: "📦",
    },
    {
      title: "User Management",
      description:
        "View and manage registered users, track activity, and ensure smooth customer support.",
      icon: "👤",
    },
    {
      title: "Analytics & Reports",
      description:
        "Get insights on sales, stock, and customer behavior to make data-driven decisions.",
      icon: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Features</h1>
        <p className="text-gray-600 mb-10">
          Explore the core features of your admin dashboard. Manage products, orders, users, and much more.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Info / In Progress */}
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6 text-gray-700">
          <p>
            This dashboard is <span className="font-semibold">currently in progress</span>.
            More advanced features, analytics, and detailed reports will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
