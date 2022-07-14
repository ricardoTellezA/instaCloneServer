const User = require("../models/user");
const brcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");
const bcryptjs = require("bcryptjs");


function createToken(user, SECRET_KEY, expiresIn) {
  const { id, name, email, username } = user;
  const payload = {
    id,
    name,
    email,
    username,
  };

  return jwt.sign(payload, SECRET_KEY);
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

async function getUser(id, username) {
  let user = null;
  if (id) user = await User.findById(id);
  if (username) user = await User.findOne({ username });
  if (!user) throw new Error("No existe el usuario");
  return user;
}

async function updateAvatar(file, ctx) {
  const { id } = ctx.user;
  const { createReadStream, mimetype } = await file;
  const extencion = mimetype.split("/")[1];
  const imageName = `avatar/${id}.${extencion}`;
  const fileData = createReadStream();
  try {
    const result = await awsUploadImage(fileData, imageName);
    await User.findByIdAndUpdate(id, { avatar: result });
    return {
      status: true,
      urlAvatar: result,
    };
  } catch (error) {
    return {
      status: false,
      urlAvatar: null,
    };
  }
}

async function deleteAvatar(ctx) {
  const { id } = ctx.user;

  try {
    await User.findByIdAndUpdate(id, { avatar: "" });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUser(input, ctx) {
  const { id } = ctx.user;
  try {
    if (input.currentPassword && input.newPassword) {
      // CAMBIAR CONTRASEÑA
      const userFound = await User.findById(id);
      const passwordSuccess = await bcryptjs.compare(
        input.currentPassword,
        userFound.password
      );

      if (!passwordSuccess)
        throw new Error("La contraseña actual no es correcta");

      const salt = await bcryptjs.genSaltSync(10);
      const newPasswordCrypt = await bcryptjs.hashSync(input.newPassword, salt);

      await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
    } else {
      await User.findByIdAndUpdate(id, input);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function search(search) {
 const users = await User.find({
   name:{$regex:search,$options:'i'},
 });

 return users;
}

module.exports = {
  register,
  getUser,
  loginUser,
  updateAvatar,
  deleteAvatar,
  updateUser,
  search,
};
