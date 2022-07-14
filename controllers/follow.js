const Follow = require("../models/follow");
const User = require("../models/user");

async function follow(username, ctx) {
  const userFound = await User.findOne({ username });
  if (!userFound) {
    throw new Error("El usuario no existe");
  }

  try {
    const follow = new Follow({
      idUser: ctx.user.id,
      follow: userFound._id,
    });
    follow.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isFollow(username, ctx) {
  const userFound = await User.findOne({ username });

  if (!userFound) {
    throw new Error("El usuario no existe");
  }

  const follow = await Follow.findOne({
    idUser: ctx.user.id,
  })
    .where("follow")
    .equals(userFound._id);
  if (follow !== null) {
    return true;
  }

  return false;
}

async function unFollow(username, ctx) {
  const useFound = await User.findOne({ username });
  const follow = await Follow.deleteOne({
    idUser: ctx.user.id,
  })
    .where("follow")
    .equals(useFound._id);
  if (follow.deletedCount > 0) {
    return true;
  }
  return false;
}

async function getFollowers(username) {
  const user = await User.findOne({ username });
  const followes = await Follow.find({ follow: user._id }).populate("idUser");

  const followersList = [];
  for await (const data of followes) {
    followersList.push(data.idUser);
  }
  return followersList;
}

async function getFollowing(username) {
  const user = await User.findOne({ username });
  const followeres = await Follow.find({ idUser: user._id }).populate("follow");
  const followeresList = [];
  for await (const data of followeres) {
    followeresList.push(data.follow);
  }
  return followeresList;
}

async function getNotFollowers(ctx) {
  const users = await User.find().limit(50);

  const arrayUsers = [];

  for await (const user of users) {
    const isFind = await Follow.findOne({ idUser: ctx.user.id })
      .where("follow")
      .equals(user._id);

    if (!isFind) {
      if (user._id.toString() !== ctx.user.id.toString()) {
        arrayUsers.push(user);
      }
    }
  }

  return arrayUsers;
}
module.exports = {
  follow,
  isFollow,
  unFollow,
  getFollowers,
  getFollowing,
  getNotFollowers,
};
