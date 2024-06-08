const Status = require("../models/status");
const { Sequelize, Op } = require("sequelize");

const StatusService = {
  async addStatus(name) {
    try {
      const existingStatus = await Status.findOne({ where: { name } });

      if (existingStatus) {
        throw new Error("This status already exists.");
      }

      const newStatus = await Status.create({ name });

      return {
        message: "Status registered successfully.",
        status: newStatus,
      };
    } catch (error) {
      throw new Error("Error registering status: " + error.message);
    }
  },

  async updateStatus(id, updatedData) {
    try {
      const status = await Status.findByPk(id);

      if (!status) {
        throw new Error("Status not found.");
      }

      const { name } = updatedData;

      if (name) {
        const existingStatus = await Status.findOne({
          where: { name, id: { [Op.not]: id } },
        });

        if (existingStatus) {
          throw new Error("A status with this name already exists.");
        }

        status.name = name;
      }

      await status.save();

      return {
        message: "Status updated successfully.",
        status,
      };
    } catch (error) {
      throw new Error("Error updating status: " + error.message);
    }
  },
  async deleteStatus(id) {
    try {
      const status = await Status.findByPk(id);

      if (!status) {
        throw new Error("Status not found.");
      }

      await status.destroy();

      return {
        message: "Status deleted successfully.",
        status,
      };
    } catch (error) {
      throw new Error("Error deleting status: " + error.message);
    }
  },

  async getAllStatuses() {
    try {
      const statuses = await Status.findAll({
        order: [["id", "ASC"]],
      });
      return statuses;
    } catch (error) {
      throw new Error("Error getting statuses: " + error.message);
    }
  },
};

module.exports = StatusService;
