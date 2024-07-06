const Multer = require("multer");
const fs = require("fs");
exports.saveFile = Multer({
  storage: Multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(`/tmp`)) {
        fs.mkdirSync(`/tmp`, { recursive: true });
      }
      cb(null, `/tmp`);
    },
    filename: (req, file, cb) => {
      console.log("filenya dapet slur", file.fieldname);
      cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

exports.deleteFile = (filePath) => {
  if (!fs.existsSync(filePath))
    return "Image File not found, but data was deleted!";
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
      return `Internal Error when deleting file: ${err}`;
    } else {
      console.log("File deleted");
      return "Image File deleted succesfully";
    }
  });
};
