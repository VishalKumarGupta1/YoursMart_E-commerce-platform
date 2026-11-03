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
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import CartDrawer from "./CartDrawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems } from "../../store/shop/cart-slice";
import { logoutUser } from "../../store/auth-slice";
import { toast } from "react-toastify";

export default function ShoppingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const loaction = useLocation();
  const [, setsearchParams] = useSearchParams();

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

  const handlelogout = () => {
    dispatch(logoutUser()).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleNavigateToListingPage = (text, type) => {
    const currentFilters = {
      category: [],
      brand: [],
    };
    // Set the clicked filter
    currentFilters[type] = [text];
    sessionStorage.setItem("filters", JSON.stringify(currentFilters));
    loaction.pathname.includes("listing")
      ? setsearchParams(new URLSearchParams(`?category=${text}`))
      : navigate("/shop/listing");
  };

  return (
    <>
      {/* Top Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#141210",
          borderBottom: "1px solid rgba(217,196,156,0.16)",
          px: { xs: 1, md: 2 },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: 64, md: 76 },
          }}
        >
          {/* Left Side - Brand Name */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              color: "#f6f1e8",
              flexShrink: 0,
              cursor: "pointer",
              textDecoration: "none",
              fontFamily: '"Bodoni Moda", serif',
              letterSpacing: "0.14em",
              fontSize: { xs: "1.35rem", md: "1.6rem" },
            }}
            component={Link}
            to="/shop/home"
          >
            YOURSMART
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
              sx={{
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(246,241,232,0.72)",
                  px: 1.4,
                  "&:hover": { color: "#d9c49c", backgroundColor: "transparent" },
                }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/shop/listing"
              sx={{
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(246,241,232,0.72)",
                  px: 1.4,
                  "&:hover": { color: "#d9c49c", backgroundColor: "transparent" },
                }}
            >
              Products
            </Button>
            {["Men", "Women", "Kids", "Footwear", "Accessories"].map(
              (text, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={() => handleNavigateToListingPage(text, "category")}
                  sx={{
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(246,241,232,0.72)",
                  px: 1.4,
                  "&:hover": { color: "#d9c49c", backgroundColor: "transparent" },
                }}
                >
                  {text}
                </Button>
              )
            )}
            <Button
              color="inherit"
              component={Link}
              to="/shop/search"
              sx={{
                  textTransform: "uppercase",
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "rgba(246,241,232,0.72)",
                  px: 1.4,
                  "&:hover": { color: "#d9c49c", backgroundColor: "transparent" },
                }}
            >
              Search
            </Button>
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
              <Badge
                badgeContent={cartItems?.items?.length || 0}
                overlap="circular"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#b9985a",
                    color: "#141210",
                    border: "1px solid #141210",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    minWidth: "16px",
                    height: "16px",
                    top: -2,
                    right: -6,
                  },
                }}
              >
                <CartIcon />
              </Badge>
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
          to="/shop/view-profile"
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
        <MenuItem onClick={() => handlelogout()} component={Link}>
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
          sx: {
            backgroundColor: "#141210",
            color: "#f6f1e8",
            width: "78%",
            borderRight: "1px solid rgba(217,196,156,0.16)",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Bodoni Moda", serif',
              letterSpacing: "0.14em",
              fontWeight: 500,
              mb: 3,
              textAlign: "center",
              color: "#f6f1e8",
              textDecoration: "none",
            }}
            component={Link}
            to="/shop/home"
            onClick={toggleMobileMenu}
          >
            YOURSMART
          </Typography>

          {/* Mobile nav links */}
          <List>
            {["Home", "Men", "Women", "Kids", "Footwear", "Accessories", "Search"].map(
              (text) => (
                <ListItem key={text} disablePadding>
                  {text === "Home" || text === "Search" ? (
                    <ListItemText
                      component={Link}
                      to={text === "Home" ? "/shop/home" : "/shop/search"}
                      onClick={toggleMobileMenu}
                      primary={text}
                      sx={{
                        textAlign: "center",
                        py: 1.5,
                        borderBottom: "1px solid rgba(246,241,232,0.08)",
                        "& .MuiListItemText-primary": {
                          fontSize: 11,
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                        },
                      }}
                    />
                  ) : (
                    <ListItemText
                      onClick={() => {
                        handleNavigateToListingPage(text, "category");
                        toggleMobileMenu();
                      }}
                      primary={text}
                      sx={{
                        textAlign: "center",
                        py: 1.5,
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(246,241,232,0.08)",
                        "& .MuiListItemText-primary": {
                          fontSize: 11,
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                        },
                      }}
                    />
                  )}
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
