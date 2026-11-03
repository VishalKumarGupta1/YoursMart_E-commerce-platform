import React, { useEffect, useState } from "react";
import image1 from "../../../public/Assests/image1.png";
import image2 from "../../../public/Assests/image2.png";
import image3 from "../../../public/Assests/image3.png";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { categoriesWithIcon, topBrands } from "../../Utility/Constant";
import usePageMeta from "../../Utility/usePageMeta";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "../../store/shop/product-slice";
import ProductCard from "../../components/shopping-view/ProductCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";

const slides = [image1, image2, image3];

const slideAlts = [
  "The YoursMart autumn edit — curated fashion and lifestyle essentials",
  "Considered everyday style from the YoursMart collection",
  "YoursMart lookbook — modern luxury pieces worth keeping",
];

const promises = [
  {
    icon: LocalShippingIcon,
    title: "Complimentary shipping",
    copy: "Delivered with care on orders over ₹999.",
  },
  {
    icon: AutorenewIcon,
    title: "Thirty-day returns",
    copy: "Change your mind, we will make it effortless.",
  },
  {
    icon: VerifiedUserIcon,
    title: "Authenticity assured",
    copy: "Every piece sourced from trusted houses.",
  },
  {
    icon: SupportAgentIcon,
    title: "A human to help",
    copy: "Our stylists are here seven days a week.",
  },
];

const SectionHeading = ({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  align = "left",
}) => {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-6 ${
        action ? "md:flex-row md:items-end md:justify-between" : ""
      }`}
    >
      <div className={centered ? "mx-auto text-center" : ""}>
        <div
          className={`flex items-center gap-3 ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-champagne" />
          <span
            className={`text-[10px] uppercase tracking-[0.35em] ${
              dark ? "text-champagne-light" : "text-stone"
            }`}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className={`mt-4 font-display text-4xl leading-[1.05] sm:text-5xl ${
            dark ? "text-ivory" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-4 max-w-xl text-sm leading-relaxed ${
              dark ? "text-ivory/60" : "text-stone"
            } ${centered ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
};

const Home = () => {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();

  usePageMeta({
    title: "YoursMart — Modern Luxury, Considered",
    description:
      "Shop curated fashion, electronics, beauty and home essentials at YoursMart. Considered design and enduring style, delivered with complimentary shipping over ₹999.",
  });
  const navigate = useNavigate();
  const { productList } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

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
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Hero */}
      <section className="relative isolate w-full overflow-hidden bg-ink">
        <div className="relative h-[86vh] min-h-[580px] w-full sm:h-[78vh] sm:max-h-[820px]">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={slideAlts[index]}
              aria-hidden={index !== current}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/65 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />

          {/* Hero copy */}
          <div className="relative z-10 flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
              <div key={current} className="animate-hero-rise max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-champagne" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-champagne-light">
                    The Autumn Edit — Vol. 01
                  </span>
                </div>

                <h1 className="mt-7 font-display text-5xl leading-[0.95] text-ivory sm:text-6xl lg:text-7xl">
                  Quiet luxury,
                  <span className="mt-1 block italic text-champagne-light">
                    made everyday.
                  </span>
                </h1>

                <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/70 sm:text-base">
                  A curated house of enduring style and considered design.
                  Discover the season&apos;s most quietly confident pieces —
                  chosen to be kept, not replaced.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => navigate("/shop/listing")}
                    className="group inline-flex items-center justify-center gap-3 bg-ivory px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.28em] text-ink transition-colors duration-300 hover:bg-champagne"
                  >
                    Shop the collection
                    <ArrowForwardIcon
                      sx={{ fontSize: 16 }}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                  <a
                    href="#categories"
                    className="inline-flex items-center justify-center border border-ivory/30 px-8 py-3.5 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne-light"
                  >
                    Browse categories
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical slide rail */}
          <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex">
            <span
              className="text-[9px] uppercase tracking-[0.3em] text-ivory/50"
              style={{ writingMode: "vertical-rl" }}
            >
              Est. 2024
            </span>
            <span className="h-14 w-px bg-ivory/20" />
            <span className="font-display text-sm text-champagne-light">
              0{current + 1}
            </span>
          </div>

          {/* Hero footer */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pb-6 lg:px-10">
              <div className="flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setCurrent(index)}
                    className={`h-px transition-all duration-500 ${
                      index === current
                        ? "w-10 bg-champagne"
                        : "w-5 bg-ivory/40 hover:bg-ivory/70"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-5">
                <span className="hidden text-[9px] uppercase tracking-[0.3em] text-ivory/60 sm:block">
                  Free express shipping over ₹999
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:border-champagne hover:text-champagne-light"
                  >
                    <KeyboardArrowLeftIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 text-ivory transition-colors hover:border-champagne hover:text-champagne-light"
                  >
                    <KeyboardArrowRightIcon fontSize="small" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service strip */}
      <div className="border-b border-line bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-3.5 text-[9px] uppercase tracking-[0.28em] text-stone lg:px-10">
          <span>Complimentary shipping over ₹999</span>
          <span className="hidden h-1 w-1 rounded-full bg-champagne sm:block" />
          <span>Thirty-day returns</span>
          <span className="hidden h-1 w-1 rounded-full bg-champagne sm:block" />
          <span>Authenticity assured</span>
          <span className="hidden h-1 w-1 rounded-full bg-champagne sm:block" />
          <span>Stylist support, seven days</span>
        </div>
      </div>

      {/* Categories */}
      <section id="categories" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Browse the house"
            title="Shop by category"
            description="Twelve departments, one considered point of view. Find the pieces that belong in your everyday."
            action={
              <button
                onClick={() => navigate("/shop/listing")}
                className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ink"
              >
                View all products
                <ArrowForwardIcon
                  sx={{ fontSize: 15 }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            }
          />

          <div className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
            {categoriesWithIcon.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateToListingPage(item, "category")}
                  className="group flex flex-col items-center justify-center gap-4 bg-paper px-4 py-10 text-center transition-colors duration-300 hover:bg-ink"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-champagne/60">
                    <Icon
                      sx={{ fontSize: 24 }}
                      className="text-ink transition-colors duration-300 group-hover:text-champagne-light"
                    />
                  </span>
                  <span className="text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink transition-colors duration-300 group-hover:text-ivory">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-ink py-20 text-ivory lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="The houses we keep"
            title="Shop by brand"
            description="A selection of the labels worth knowing — chosen for craft, character, and the long view."
            tone="dark"
          />

          <div className="mt-12 grid grid-cols-2 gap-px border border-ivory/10 bg-ivory/10 sm:grid-cols-3 lg:grid-cols-6">
            {topBrands.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigateToListingPage(item, "brand")}
                  className="group flex flex-col items-center justify-center gap-3 bg-ink px-4 py-10 transition-colors duration-300 hover:bg-ink-soft"
                >
                  <Icon
                    sx={{ fontSize: 26 }}
                    className="text-champagne-light/70 transition-colors duration-300 group-hover:text-champagne-light"
                  />
                  <span className="font-display text-xl tracking-wide text-ivory">
                    {item.name}
                  </span>
                  <span className="h-px w-0 bg-champagne transition-all duration-500 group-hover:w-8" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured edit */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Curated for the season"
            title="The Edit"
            description="Our most considered pieces of the moment, gathered in one place."
            action={
              <button
                onClick={() => navigate("/shop/listing")}
                className="group inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px] uppercase tracking-[0.28em] text-ink"
              >
                View all products
                <ArrowForwardIcon
                  sx={{ fontSize: 15 }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            }
          />

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {productList?.slice(0, 8).map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {!productList?.length && (
            <div className="mt-12 border border-line bg-paper px-6 py-16 text-center">
              <p className="font-display text-2xl text-ink">
                The edit is being prepared.
              </p>
              <p className="mt-2 text-sm text-stone">
                New pieces arrive soon. In the meantime, browse the full
                collection.
              </p>
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <button
              onClick={() => navigate("/shop/listing")}
              className="group inline-flex items-center gap-3 border border-ink px-9 py-3.5 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory"
            >
              Show the full collection
              <ArrowForwardIcon
                sx={{ fontSize: 16 }}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Editorial banner */}
      <section className="overflow-hidden bg-ink">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px] lg:min-h-[520px]">
            <img
              src={image2}
              alt="The everyday icon lookbook"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/15" />
            <div className="absolute bottom-6 left-6 bg-paper/95 px-5 py-3 backdrop-blur">
              <span className="text-[9px] uppercase tracking-[0.3em] text-stone">
                Lookbook No. 01
              </span>
              <p className="font-display text-lg text-ink">
                The everyday icon
              </p>
            </div>
          </div>

          <div className="flex items-center px-6 py-16 sm:px-14 lg:py-20">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-champagne" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-champagne-light">
                  Designed to outlast trends
                </span>
              </div>
              <h2 className="mt-5 font-display text-4xl leading-tight text-ivory sm:text-5xl">
                Considered pieces,
                <span className="block italic text-champagne-light">
                  collected slowly.
                </span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ivory/60">
                We believe the best wardrobe is a small one. Every piece in our
                edit is chosen for the way it wears, the way it feels, and the
                way it stays with you.
              </p>
              <button
                onClick={() => navigate("/shop/listing")}
                className="group mt-8 inline-flex items-center gap-3 border border-ivory/30 px-8 py-3.5 text-[10px] uppercase tracking-[0.28em] text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne-light"
              >
                Explore the collection
                <ArrowForwardIcon
                  sx={{ fontSize: 16 }}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="border-t border-line bg-paper py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => {
              const Icon = promise.icon;
              return (
                <div
                  key={promise.title}
                  className="flex flex-col gap-3 bg-paper px-6 py-8"
                >
                  <Icon
                    sx={{ fontSize: 22 }}
                    className="text-champagne"
                  />
                  <h3 className="font-display text-lg text-ink">
                    {promise.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-stone">
                    {promise.copy}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
