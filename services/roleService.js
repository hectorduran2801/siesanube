const Role = require("../models/role");
const { Sequelize, Op } = require("sequelize");

const RoleService = {
  async addRole(name) {
    try {
      const existingRole = await Role.findOne({ where: { name } });

      if (existingRole) {
        throw new Error("This role already exists.");
      }

      const newRole = await Role.create({ name });

      return {
        message: "Role registered successfully.",
        role: newRole,
      };
    } catch (error) {
      throw new Error("Error registering role: " + error.message);
    }
  },

  async updateRole(id, updatedData) {
    try {
      const role = await Role.findByPk(id);

      if (!role) {
        throw new Error("Role not found.");
      }

      const { name } = updatedData;

      if (name) {
        const existingRole = await Role.findOne({
          where: { name, id: { [Op.not]: id } },
        });
        if (existingRole) {
          throw new Error("A role with this name already exists.");
        }
        role.name = name;
      }

      await role.save();

      return {
        message: "Role updated successfully.",
        role,
      };
    } catch (error) {
      throw new Error("Error updating role: " + error.message);
    }
  },

  async deleteRole(id) {
    try {
      const role = await Role.findByPk(id);

      if (!role) {
        throw new Error("Role not found.");
      }

      await role.destroy();

      return {
        message: "Role deleted successfully.",
        role,
      };
    } catch (error) {
      throw new Error("Error deleting role: " + error.message);
    }
  },

  async getAllRoles() {
    try {
      const roles = await Role.findAll({
        order: [["id", "ASC"]],
      });
      return roles;
    } catch (error) {
      throw new Error("Error getting roles: " + error.message);
    }
  },
};

module.exports = RoleService;
