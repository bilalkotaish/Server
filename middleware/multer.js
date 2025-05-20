// import multer from "multer";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "Uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}+${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

// export default upload;

import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure 'tempUploads' folder exists
const uploadPath = path.join(process.cwd(), "tempUploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Use a temporary folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
