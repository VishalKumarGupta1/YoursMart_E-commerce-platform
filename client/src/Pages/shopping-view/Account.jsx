import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import accImg from "../../../public/Assests/accountpage.png";
import ShoppingOrders from "../../components/shopping-view/ShoppingOrders";
import Address from "../../components/shopping-view/Address";

const Account = () => {
  const [tabValue, setTabValue] = useState("orders");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className=" mx-auto grid grid-cols-1 gap-8 py-8  w-11/12  ">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Orders" value="orders" />
            <Tab label="Address" value="address" />
            {/* Tab Content */}
          </Tabs>
          {tabValue === "orders" && <ShoppingOrders />}
          {tabValue === "address" && <Address isCheckout={false} />}
        </div>
      </div>
    </div>
  );
};

export default Account;
