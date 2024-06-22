const RoleService = require("../services/roleService");

/* 
POST -> https://api-siesa.in/api/v1/roles/addRole -> 
{
  "name": "role name"
}
*/
const addRole = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await RoleService.addRole(name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* PUT -> https://api-siesa.in/api/v1/roles/updateRole/id -> 
{
  "name": "role name"
}
*/
const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const updatedData = req.body;

  try {
    const result = await RoleService.updateRole(roleId, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* DELETE -> https://api-siesa.in/api/v1/roles/deleteRole/id ->
 */
const deleteRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    const result = await RoleService.deleteRole(roleId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> https://api-siesa.in/api/v1/roles/getAllRoles ->
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addRole, updateRole, deleteRole, getAllRoles };
