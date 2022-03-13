const userController = require("../controllers/user");
const resolvers = {
  Query: {
    // USER
    // getUser: () => getUserController(),
  },

  Mutation: {
    // USER
    register: (_, { input }) => userController.register(input),
    login: (_, { input }) => userController.loginUser(input),
  },
};

module.exports = resolvers;
