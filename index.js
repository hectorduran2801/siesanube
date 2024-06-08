const express = require("express");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const statusRoutes = require("./routes/statusRoutes");
const fileRoutes = require("./routes/fileRoutes");
const disciplineRoutes = require("./routes/disciplineRoute");
const userFileRoutes = require("./routes/userfileRoutes");
const emailRoutes = require("./routes/emailRoutes");
const upload = require("./middleware/uploadMiddleware");
const sequelize = require("./config/database");
const cors = require("cors");

require("dotenv").config();

const RoleModel = require("./models/role");
const StatusModel = require("./models/status");
const UserModel = require("./models/user");
const FileModel = require("./models/file");
const UserFileModel = require("./models/userfile");
const DisciplineModel = require("./models/discipline");
const EmailModel = require("./models/email");
const Index = require("./models/index");
const path = require("path");

const app = express();

const corsOptions = {
  origin: ["*"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: "*",
  exposedHeaders: ["Content-Length", "Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/statuses", statusRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/usersfiles", userFileRoutes);
app.use("/api/v1/disciplines", disciplineRoutes);
app.use("/api/v1/emails", emailRoutes);


// Conexion a la BD
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Conexión de base de datos establecida.");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos: ", err);
  });

// Ruta estatica para servir archivos subidos
app.use("/archivos", express.static(path.join(__dirname, "public/files")));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
