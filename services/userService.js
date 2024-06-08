const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const User = require("../models/user");
const Status = require("../models/status");
const Role = require("../models/role");
const { Sequelize } = require("sequelize");

const UserService = {
  async loginUser(email, password) {
    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log(passwordMatch);

      user.lastLogin = new Date();
      await user.save();

      return { user, passwordMatch };
    } catch (error) {
      throw new Error("Error al iniciar sesión: " + error.message);
    }
  },

  async registerUser(firstname, lastname, email, password, StatusId, RoleId) {
    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        throw new Error("Este usuario ya existe.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const status = await Status.findByPk(StatusId);
      const role = await Role.findByPk(RoleId);

      if (!status || !role) {
        throw new Error(
          "Uno de los datos asociados no encontrado (estatus y rol)."
        );
      }

      const newUser = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        StatusId: StatusId,
        RoleId: RoleId,
      });

      // Generar el token usanado jwt
      const token = await generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.RoleId,
      });

      newUser.authToken = token;
      await newUser.save();

      return {
        message: "Usuario registrado exitosamente.",
        user: newUser,
        token,
      };
    } catch (error) {
      throw new Error("Error al registrar usuario: " + error.message);
    }
  },

  async getUserDetails() {
    try {
      const userDetails = await User.findAll({
        attributes: [
          "id",
          [Sequelize.literal("CONCAT(firstname, ' ', lastname)"), "name"],
          "email",
          "password",
          "lastLogin",
        ],
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
            as: "Role",
          },
        ],
        order: [["id", "DESC"]],
      });

      return userDetails;
    } catch (error) {
      throw new Error(
        "Error al recuperar los datos del usuario: " + error.message
      );
    }
  },

  async updateUser(userId, updatedFields) {
    try {
      const user = await User.findByPk(userId, {
        include: [Status, Role],
      });

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      // Verificar y encriptar la nueva contraseña si se está actualizando
      if (updatedFields.password) {
        updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
      }

      // Actualizar campos
      await user.update(updatedFields);

      console.log(updatedFields);

      if (updatedFields.statusId) {
        const status = await Status.findByPk(updatedFields.statusId);
        if (!status) {
          throw new Error("Estado no encontrado.");
        }
        user.StatusId = status.id;
      }

      if (updatedFields.roleId) {
        const role = await Role.findByPk(updatedFields.roleId);
        if (!role) {
          throw new Error("Rol no encontrado.");
        }
        user.RoleId = role.id;
      }

      // Generar un nuevo token para el usuario autenticado
      const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.RoleId,
      });

      // Actualiza el token
      user.auth_token = token;

      await user.save();

      return { message: "Usuario actualizada con éxito ", user };
    } catch (error) {
      throw new Error("Error al actualizar usuario: " + error.message);
    }
  },

  async deleteUser(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("Usuario no encontrado.");
      }

      await user.destroy();

      return { message: "Usuario eliminado exitosamente", user };
    } catch (error) {
      throw new Error("Error al eliminar usuario: " + error.message);
    }
  },

  async getUserEmailsDetails(email) {
    try {
      const user = await User.findOne({ where: { email: email } });
      return user;
    } catch (error) {
      throw new Error(
        "Error al recuperar el usuario por correo electrónico: " + error.message
      );
    }
  },

  async getUserDetailsById(userId) {
    try {
      const user = await User.findOne({
        where: { id: userId },
        include: [
          {
            model: Role,
            attributes: ["id", "name"],
            as: "Role",
          },
        ],
      });

      return user;
    } catch (error) {
      throw new Error(
        "Error al recuperar los detalles del usuario por ID: " + error.message
      );
    }
  },
};

module.exports = UserService;
