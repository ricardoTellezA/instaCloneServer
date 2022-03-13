const User = require("../models/user");
const brcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payload = {
    id,
    name,
    email,
    username,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

async function register(input) {
  const newUser = input;
  newUser.email = newUser.email.toLowerCase();
  newUser.username = newUser.username.toLowerCase();

  const { username, email, password } = newUser;

  //REVISAR SI EL EMAIL YA EXISTE
  const foundEmail = await User.findOne({ email });

  if (foundEmail) {
    throw new Error("El email ya existe");
  }
  //REVISAMOS SI EL USERNAME YA EXISTE
  const foundUsername = await User.findOne({ username });
  if (foundUsername) {
    throw new Error("El username ya existe");
  }

  //ENCRIPTAR PASSWORD
  const salt = await brcryptjs.genSaltSync(10);
  newUser.password = await brcryptjs.hashSync(password, salt);

  try {
    const user = new User(newUser);
    user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
}

async function loginUser(input) {
  const { email, password } = input;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Error el email o contraseña no son correctos");

  const validPassword = await brcryptjs.compare(password, user.password);
  if (!validPassword)
    throw new Error("Error el email o contraseña no son correctos");

  return {
    token: createToken(user, process.env.SECRET_KEY, "24h"),
  };
}

function getUser() {
  console.log("obteniendo user");
  return null;
}

module.exports = {
  register,
  getUser,
  loginUser,
};
