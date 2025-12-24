import React, { useEffect, useState } from "react";
import image1 from "../../../public/Assests/image1.png";
import image2 from "../../../public/Assests/image2.png";
import image3 from "../../../public/Assests/image3.png";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import DevicesIcon from "@mui/icons-material/Devices";
import WatchIcon from "@mui/icons-material/Watch";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import KitchenIcon from "@mui/icons-material/Kitchen";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ToysIcon from "@mui/icons-material/Toys";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { categoriesWithIcon, topBrands } from "../../Utility/Constant";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "../../store/shop/product-slice";
import ProductCard from "../../components/shopping-view/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";

const Home = () => {
  const slides = [image1, image2, image3];
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  // Auto slide every 5 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handleNavigateToListingPage = (item, type) => {
    const currentFilters = {
      category: [],
      brand: [],
    };
    // Set the clicked filter
    currentFilters[type] = [item.name];
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/shop/listing");
  };

  const handleAddToCart = (id) => {
    dispatch(addToCart({ userId: user?._id, productId: id, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user?._id));
          toast.success(res?.payload?.message);
        } else {
          toast.error(res?.payload?.message);
        }
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Slider */}
      <div className="relative w-full h-[300px] sm:h-[450px] lg:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt="slider"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white cursor-pointer"
        >
          <KeyboardArrowLeftIcon size={28} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white cursor-pointer"
        >
          <KeyboardArrowRightIcon size={28} />
        </button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className=" container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoriesWithIcon.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="cursor-pointer  hover:shadow-lg transition-shadow"
                  onClick={() => handleNavigateToListingPage(item, "category")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon
                      sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }}
                      className=" w-12 h-12 mb-4 text-primary"
                    />
                    <span className="text-center font-bold"> {item.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className=" container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topBrands.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="cursor-pointer  hover:shadow-lg transition-shadow"
                  onClick={() => handleNavigateToListingPage(item, "brand")}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon
                      sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }}
                      className=" w-12 h-12 mb-4 text-primary"
                    />
                    <span className="text-center font-bold"> {item.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 ">
        <div className=" container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.slice(0, 4).map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/shop/listing")}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
            >
              Show More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
