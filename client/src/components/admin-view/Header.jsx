import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth-slice";
import { toast } from "react-toastify";

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handlelogout = () => {
    dispatch(logoutUser()).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <div className="h-16 w-full flex justify-between items-center border-b-1 border-gray-300">
      <Toolbar>
        {!isDesktop && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              px: 1.5,
              py: 1,
              bgcolor: "black",
              color: "white",
              borderRadius: 5,
              "&:hover": {
                bgcolor: "grey.800", // lighter than black
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          fontFamily={"cursive"}
          noWrap
          sx={{
            display: { xs: "block", md: "none" },
            fontWeight: 600,
          }}
        >
          Admin Dashboard
        </Typography>
      </Toolbar>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          padding: "10px",
          borderRadius: "10px",
          marginRight: "20px",
        }}
        onClick={() => handlelogout()}
        className=" flex items-centerbg-black text-white bg-black "
      >
        <LogoutIcon />
        <Typography>Logout</Typography>
      </Box>
    </div>
  );
};

export default Header;
