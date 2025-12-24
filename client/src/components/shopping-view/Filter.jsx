import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { brands, categories } from "../../Utility/Constant";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, category, theme) {
  return {
    fontWeight: category.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const ProductFilter = ({ filter, setFilter }) => {
  const theme = useTheme();

  const location = useLocation();

  React.useEffect(() => {
    sessionStorage.setItem("filters", JSON.stringify(filter));
  }, [filter]);

  // React.useEffect(() => {
  //   const storedFilters = sessionStorage.getItem("filters");
  //   if (storedFilters) {
  //     setFilter(JSON.parse(storedFilters));
  //   }
  // }, [location.pathname]);

  const handleFilterChange = (key) => (event) => {
    const {
      target: { value },
    } = event;

    setFilter((prev) => ({
      ...prev,
      [key]: typeof value === "string" ? value.split(",") : value,
    }));
    // sessionStorage.setItem("filters", JSON.stringify(filter));
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-400 rounded-md ">
      <div className="flex justify-center h-30 w-full items-center">
        <h2 className="text-3xl underline-offset-auto font-semibold text-gray-800l">
          Filter
        </h2>
      </div>
      <Divider sx={{ width: "100%" }} />
      <FormControl sx={{ m: 1, width: 250, mt: 5 }}>
        <InputLabel
          id="demo-multiple-chip-label"
          sx={{
            "&.Mui-focused": {
              color: "#2d2d2d", // label color on focus
            },
          }}
        >
          Category
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          rows={4}
          value={filter.category}
          onChange={handleFilterChange("category")}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Category"
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2d2d2d", // border color on focus
                },
              }}
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {categories.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, filter.category, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 250, mt: 5 }}>
        <InputLabel
          id="demo-multiple-chip-label"
          sx={{
            "&.Mui-focused": {
              color: "#2d2d2d", // label color on focus
            },
          }}
        >
          Brand
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          rows={4}
          value={filter.brand}
          onChange={handleFilterChange("brand")}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Brand"
              sx={{
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2d2d2d", // border color on focus
                },
              }}
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {brands.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, filter.brand, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ProductFilter;
