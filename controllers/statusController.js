const StatusService = require("../services/statusService");

/* 
POST -> http://localhost:8081/api/v1/statuses/addStatus -> 
{
  "name": "status name",
}
*/
const addStatus = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await StatusService.addStatus(name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* PUT -> http://localhost:8081/api/v1/statuses/updateStatus/id -> 
{
  "name": "status name",
}
*/
const updateStatus = async (req, res) => {
  const statusId = req.params.id;
  const updatedData = req.body;

  try {
    const result = await StatusService.updateStatus(statusId, updatedData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* DELETE -> http://localhost:8081/api/v1/statuses/deleteStatus/id ->
 */
const deleteStatus = async (req, res) => {
  const statusId = req.params.id;

  try {
    const result = await StatusService.deleteStatus(statusId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/statuses/getAllStatuses ->
 */
const getAllStatuses = async (req, res) => {
  try {
    const statuses = await StatusService.getAllStatuses();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addStatus, updateStatus, deleteStatus, getAllStatuses };
