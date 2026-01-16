// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
//   Typography,
//   Rating,
//   Divider,
//   Avatar,
//   Button,
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";

// const ProductDetailDialog = ({ open, onClose, product, onAddToCart }) => {
//   return (
//     <div>
//       {/* onclick  product dialog open */}
//       <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//         <DialogTitle>Product</DialogTitle>
//         <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "1fr",
//                 md: "1fr 1fr",
//               },
//               gap: 3,
//             }}
//           >
//             {/* LEFT COLUMN — IMAGE */}
//             <Box
//               sx={{
//                 backgroundColor: "#fff",
//                 borderRadius: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 p: 2,
//               }}
//             >
//               <img
//                 src={product?.image}
//                 alt={product?.title}
//                 style={{
//                   width: "100%",
//                   maxHeight: 300,
//                   objectFit: "contain",
//                 }}
//               />
//             </Box>

//             {/* RIGHT COLUMN — DETAILS */}
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
//               {/* Title */}
//               <Typography variant="h6" sx={{ fontWeight: 600, color: "#111" }}>
//                 {product?.title}
//               </Typography>

//               {/* Rating */}
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Rating value={4} readOnly size="small" />
//                 <Typography variant="body2" sx={{ color: "#666" }}>
//                   (124 reviews)
//                 </Typography>
//               </Box>

//               {/* Description */}
//               <Typography variant="body2" sx={{ color: "#555" }}>
//                 {product?.description}
//               </Typography>

//               {/* Category & Brand */}
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     backgroundColor: "#e0e0e0",
//                     px: 1.5,
//                     py: 0.5,
//                     borderRadius: 1,
//                   }}
//                 >
//                   {product?.category}
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     backgroundColor: "#e0e0e0",
//                     px: 1.5,
//                     py: 0.5,
//                     borderRadius: 1,
//                   }}
//                 >
//                   {product?.brand}
//                 </Typography>
//               </Box>

//               {/* Price */}
//               <Box
//                 sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
//               >
//                 <Typography variant="h6" sx={{ fontWeight: 700 }}>
//                   ₹{product?.salePrice}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{ textDecoration: "line-through", color: "#888" }}
//                 >
//                   ₹{product?.price}
//                 </Typography>
//               </Box>

//               {/* Stock */}
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: product?.totalStock > 0 ? "#2e7d32" : "#c62828",
//                   fontWeight: 500,
//                 }}
//               >
//                 {product?.totalStock > 0
//                   ? `In Stock (${product?.totalStock})`
//                   : "Out of Stock"}
//               </Typography>
//             </Box>
//           </Box>

//           {/* REVIEWS SECTION */}
//           <Divider sx={{ my: 3 }} />

//           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
//             Reviews
//           </Typography>

//           {/* Dummy Review */}
//           <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//             <Avatar sx={{ bgcolor: "#000" }}>
//               <PersonIcon />
//             </Avatar>

//             <Box>
//               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                 John Doe
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#555" }}>
//                 Great quality product, totally worth the price!
//               </Typography>
//             </Box>
//           </Box>
//         </DialogContent>
//         {/* ACTIONS */}
//         <DialogActions sx={{ px: 0, pt: 3 }}>
//           <Button onClick={onClose} color="inherit">
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             sx={{
//               backgroundColor: "#000",
//               "&:hover": { backgroundColor: "#333" },
//             }}
//             disabled={product?.totalStock === 0}
//             onClick={() => onAddToCart(product?._id, product?.totalStock)}
//           >
//             Add to Cart
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductDetailDialog;

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Rating,
  Divider,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { addReview, getReview } from "../../store/shop/review-slice";
import { toast } from "react-toastify";

const ProductDetailDialog = ({ open, onClose, product, onAddToCart }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (product?._id && open) {
      dispatch(getReview(product._id));
    }
  }, [dispatch, product?._id, open]);

  const handleAddReview = () => {
    if (!rating || !reviewText.trim()) return;
    dispatch(
      addReview({
        productId: product._id,
        userId: user._id,
        userName: user.name,
        reviewMessage: reviewText,
        reviewvalue: rating,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast.success(res?.payload?.message);
        dispatch(getReview(product._id));
      } else {
        toast.error(res?.payload?.message);
      }
    });

    setRating(0);
    setReviewText("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="font-semibold">Product Details</DialogTitle>

      <DialogContent className="bg-gray-100">
        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IMAGE */}
          <div className="bg-white rounded-lg flex items-center justify-center p-4">
            <img
              src={product?.image}
              alt={product?.title}
              className="max-h-[300px] object-contain"
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-3">
            <Typography variant="h6" className="font-semibold">
              {product?.title}
            </Typography>

            <div className="flex items-center gap-2">
              <Rating value={product?.averageReview} precision={0.5} readOnly />
              <span className="text-sm text-gray-500">
                ({reviews.length} reviews)
              </span>
            </div>

            <Typography variant="body2" className="text-gray-600">
              {product?.description}
            </Typography>

            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-200 rounded text-xs">
                {product?.category}
              </span>
              <span className="px-3 py-1 bg-gray-200 rounded text-xs">
                {product?.brand}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold">₹{product?.salePrice}</span>
              <span className="line-through text-gray-500">
                ₹{product?.price}
              </span>
            </div>

            <span
              className={`text-sm font-medium mb-4 ${
                product?.totalStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product?.totalStock > 0
                ? `In Stock (${product?.totalStock})`
                : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* REVIEWS */}
        <Divider className="mb-6" />

        <p className="font-semibold mb-3 mt-4 text-2xl">Customer Reviews</p>

        {/* WRITE REVIEW */}
        <div className="bg-white rounded-lg p-4 mb-5 shadow-sm">
          <Typography variant="body2" className="font-medium mb-2">
            Write a review
          </Typography>

          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            className="mb-2"
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your experience..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#1f2937", // gray-800
              },
              marginTop: 1,
              alignContent: "right",
            }}
            onClick={handleAddReview}
            disabled={!rating || !reviewText.trim()}
          >
            Submit Review
          </Button>
        </div>

        {/* REVIEW LIST */}

        <div className="space-y-4">
          {reviews?.map((review) => (
            <div
              key={review?._id}
              className="bg-white rounded-xl p-4 shadow-md flex gap-4"
            >
              <Avatar className="bg-black w-10 h-10">
                {review?.userName.charAt(0)}
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography className="font-semibold text-sm">
                    {review?.userName}
                  </Typography>

                  <Rating value={review?.reviewvalue} readOnly size="small" />
                </div>

                <Typography className="text-gray-700 text-sm mt-1">
                  {review?.reviewMessage}
                </Typography>

                <span className="text-xs text-gray-400 mt-2 block">
                  {review?.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>

      {/* ACTIONS */}
      <DialogActions className="px-4 pb-4">
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          className="bg-black hover:bg-gray-800"
          disabled={product?.totalStock === 0}
          onClick={() => onAddToCart(product?._id, product?.totalStock)}
        >
          Add to Cart
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailDialog;

{
  /* */
}

{
  /* REVIEW LIST */
}
