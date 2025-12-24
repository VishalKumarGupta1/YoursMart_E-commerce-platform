import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  capitalize,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import CartDrawer from "./CartDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../store/shop/cart-slice";

export default function ShoppingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCartItems(user?._id));
  }, [dispatch]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
    setIsProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setIsProfileMenuOpen(false);
    setProfileMenuAnchor(null);
  };

  const [CartDrawerOpen, setCartDrawerOpen] = useState(false);

  const toggleDrawer = (isOpen) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setCartDrawerOpen(isOpen);
  };

  const handleNavigateToListingPage = (text, type) => {
    const currentFilters = {
      category: [],
      brand: [],
    };
    // Set the clicked filter
    currentFilters[type] = [text];
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    navigate("/shop/listing");
  };

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#2d2d2d", p: 1 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left Side - Brand Name */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              flexShrink: 0,
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: "cursive",
            }}
            component={Link}
            to="/shop/home"
          >
            YoursMart
          </Typography>

          {/* Middle - Search Bar (visible on all devices) */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              mx: { xs: 2, md: 5 },
              gap: 3,
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/shop/home"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Home
            </Button>
            {["Men", "Women", "Kids", "Footwear", "Accessories"].map((text) => (
              <Button
                color="inherit"
                onClick={() => handleNavigateToListingPage(text, "category")}
                sx={{ textTransform: "capitalize", fontSize: "17px" }}
              >
                {text}
              </Button>
            ))}

            {/* <Button
              color="inherit"
              component={Link}
              to="/shop/home"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/Products"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Men
            </Button>

            <Button
              color="inherit"
              component={Link}
              to="/Login"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Women
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/Signup"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Kids
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/Login"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Footwear
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/Signup"
              sx={{ textTransform: "capitalize", fontSize: "17px" }}
            >
              Accessories
            </Button> */}
          </Box>

          {/* Right Side - Nav Links + Icons (desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <CartIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountIcon />
            </IconButton>
          </Box>

          {/* Hamburger Icon (mobile only) */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu Dropdown (Desktop and Mobile) */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <MenuItem
          onClick={handleProfileMenuClose}
          component={Link}
          to="/myProfile"
        >
          View Profile
        </MenuItem>
        <MenuItem
          onClick={handleProfileMenuClose}
          component={Link}
          to="/shop/account"
        >
          View Account
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose} component={Link}>
          Logout
        </MenuItem>
      </Menu>

      <CartDrawer
        cartItems={cartItems}
        open={CartDrawerOpen}
        toggleDrawer={toggleDrawer}
      />

      {/* Drawer for Mobile Menu */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: { backgroundColor: "#2d2d2d", color: "#fff", width: "70%" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
            component={Link}
            to="/shop/home"
          >
            YourSmart
          </Typography>

          {/* Mobile nav links */}
          <List>
            {["Home", "Men", "Women", "Kids", "Footwear", "Accessories"].map(
              (text) => (
                <ListItem button key={text}>
                  <ListItemText
                    component={Link}
                    to={text}
                    primary={text}
                    sx={{ textAlign: "center" }}
                  />
                </ListItem>
              )
            )}
          </List>

          {/* Profile and Cart icons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 3,
            }}
          >
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <CartIcon sx={{ color: "#fff" }} />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <AccountIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
