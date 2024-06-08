const UserService = require("../services/userService");
const bcrypt = require("bcrypt");

/* 
POST -> http://localhost:8081/api/v1/users/register -> 
{
  "firstname": "user name",
  "lastname": "user lastname",
  "email": "example@mail.com",
  "password": "12345",
  "idStatus": 1,
  "idRole": 2
}
*/
const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, StatusId, RoleId } = req.body;

  try {
    const result = await UserService.registerUser(
      firstname,
      lastname,
      email,
      password,
      StatusId,
      RoleId
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* POST -> http://localhost:8081/api/v1/users/login -> 
{
  "email": "example@mail.com",
  "password": "12345"
} */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/users/user-details */
const getUserDetails = async (req, res) => {
  try {
    const userDetails = await UserService.getUserDetails();
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* PUT -> http://localhost:8081/api/v1/users/update/id */
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedFields = req.body;

  try {
    const updatedUser = await UserService.updateUser(userId, updatedFields);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* DELETE -> http://localhost:8081/api/v1/users/delete/id */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await UserService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/users/user-emails-details */
const getUserEmailsDetails = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Correo electrónico no proporcionado" });
    }

    const user = await UserService.getUserEmailsDetails(email);

    if (user) {
      return res.json({ message: "OK" });
    } else {
      return res.status(404).json({ error: "El correo electrónico no existe" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET -> http://localhost:8081/api/v1/users/user-details/:id */
const getUserDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de usuario no proporcionado." });
    }

    const userDetails = await UserService.getUserDetailsById(id);

    if (userDetails) {
      return res.json(userDetails);
    } else {
      return res
        .status(404)
        .json({ error: "Detalles del usuario no encontrados" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  registerUser,
  getUserDetails,
  updateUser,
  deleteUser,
  getUserEmailsDetails,
  getUserDetailsById,
};
