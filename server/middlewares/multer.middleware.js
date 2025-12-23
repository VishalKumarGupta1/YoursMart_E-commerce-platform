import multer from "multer";

const storage = multer.diskStorage({
  // Set destination folder
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Set custom filename
  filename: function (req, file, cb) {
    const uniqueFieName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFieName + file.originalname);
  },
});
//  Create Upload Middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  //   fileFilter: function (req, file, cb) {
  //      Accept only images (jpg, jpeg, png)
  //     const fileTypes = /jpeg|jpg|png/;
  //     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //     const mimeType = fileTypes.test(file.mimetype);

  //     if (mimeType && extname) {
  //       return cb(null, true);
  //     } else {
  //       cb(new Error('Only images are allowed!'));
  //     }
});
