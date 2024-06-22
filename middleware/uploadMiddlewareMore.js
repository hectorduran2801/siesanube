const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destino = "public/files";
    cb(null, destino);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    cb(null, formattedDate + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // No hay filtro, todos los archivos son aceptados
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  field: "files",
});

module.exports = upload;
