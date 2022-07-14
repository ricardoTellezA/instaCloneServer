const userController = require("../controllers/user");
const followController = require("../controllers/follow");
const publicationController = require("../controllers/publication");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like");
const { GraphQLUpload } = require("graphql-upload");

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    // USER
    getUser: (_, { id, username }) => userController.getUser(id, username),
    search: (_, { search }) => userController.search(search),
    // FOLLOW
    isFollow: (_, { username }, ctx) =>
      followController.isFollow(username, ctx),
    getFollowers: (_, { username }) => followController.getFollowers(username),
    getFollowing: (_, { username }) => followController.getFollowing(username),
    getNotFollowers: (_, {}, ctx) => followController.getNotFollowers(ctx),

    // PUBLICATION
    getPublication: (_, { username }) =>
      publicationController.getPublication(username),
    getPublicationsFollowers: (_, {}, ctx) =>
      publicationController.getPublicationsFollowers(ctx),

    // COMMENT
    getComment: (_, { idPublication }) =>
      commentController.getComment(idPublication),

    // LIKES
    isLike: (_, { idPublication }, ctx) =>
      likeController.isLike(idPublication, ctx),
    countLikes: (_, { idPublication }) =>
      likeController.countLikes(idPublication),
  },

  Mutation: {
    // USER
    register: (_, { input }) => userController.register(input),
    login: (_, { input }) => userController.loginUser(input),
    updateAvatar: (_, { file }, ctx) => userController.updateAvatar(file, ctx),
    deleteAvatar: (_, {}, ctx) => userController.deleteAvatar(ctx),
    updateUser: (_, { input }, ctx) => userController.updateUser(input, ctx),

    // FOLLOW
    follow: (_, { username }, ctx) => followController.follow(username, ctx),
    unFollow: (_, { username }, ctx) =>
      followController.unFollow(username, ctx),

    // Publish
    publish: (_, { file }, ctx) => publicationController.publish(file, ctx),

    // COMMENT
    addComment: (_, { input }, ctx) => commentController.addComment(input, ctx),

    // LIKE
    addLike: (_, { idPublication }, ctx) =>
      likeController.addLike(idPublication, ctx),
    deleteLike: (_, { idPublication }, ctx) =>
      likeController.deleteLike(idPublication, ctx),
  },
};

module.exports = resolvers;
