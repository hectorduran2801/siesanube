const Role = require("./role");
const Status = require("./status");
const User = require("./user");
const File = require("./file");
const UserFile = require("./userfile");
const Discipline = require("./discipline");
const Email = require("./email");
const Folder = require("./folder");

User.hasMany(UserFile, { foreignKey: "UserId" });
UserFile.belongsTo(User, { foreignKey: "UserId" });

File.hasMany(UserFile, { foreignKey: "FileId" });
UserFile.belongsTo(File, { foreignKey: "FileId" });

Folder.hasMany(UserFile, { foreignKey: "FolderId" });
UserFile.belongsTo(Folder, { foreignKey: "FolderId" });

User.belongsTo(Status, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Status.hasMany(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

User.belongsTo(Role, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Role.hasMany(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

File.belongsTo(Discipline, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Discipline.hasMany(File, { onDelete: "CASCADE", onUpdate: "CASCADE" });

module.exports = {
  Role,
  Status,
  User,
  File,
  UserFile,
  Discipline,
  Email,
};
