import React, { useEffect } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser, makeAdmin } from "../../store/admin/User-slice";
import { toast } from "react-toastify";

const User = () => {
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.adminUser);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleMakeAdmin = (id) => {
    dispatch(makeAdmin(id)).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        dispatch(getAllUser());
      } else {
        toast.error(res?.payload?.message);
      }
    });

    console.log("Make admin clicked for user ID:", id);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 shadow-md rounded-xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 px-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Users Management
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View all users, their roles, and manage admin access.
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {userList?.map((user) => (
                <tr key={user?.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap font-medium text-gray-900">
                    {user?.name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-700">
                    {user?.email}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-gray-700">
                    {user?.phone}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        user?.role === "Admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-center">
                    {user?.role !== "Admin" && (
                      <Tooltip title="Make Admin">
                        <button
                          onClick={() => handleMakeAdmin(user?._id)}
                          className="text-black hover:text-gray-600 transition"
                        >
                          <PersonAddIcon
                            fontSize="small"
                            className="cursor-pointer"
                          />
                        </button>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
