const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload
  type User {
    id: ID!
    name: String
    username: String
    email: String
    avatar: String
    siteWeb: String
    description: String
    password: String
    createAdd: String
  }

  type Token {
    token: String
  }

  type UpdateAvatar {
    status: Boolean
    urlAvatar: String
  }

  type Publish {
    status: Boolean
    urlFile: String
  }

  type Publication {
    id: ID
    idUser: ID
    file: String
    typeFile: String
    createAt: String
  }

  type Comment {
    idPublication: ID
    idUser: User
    comment: String
    createAt: String
  }

  type FeedPublication {
    id: ID
    idUser: User
    file: String
    typeFile: String
    createAt: String
  }

  input UserInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UserUpdateInput {
    name: String
    email: String
    currentPassword: String
    newPassword: String
    siteWeb: String
    description: String
  }

  input CommentInput {
    idPublication: ID
    comment: String
  }

  type Query {
    #user
    getUser(id: ID, username: String): User
    search(search: String): [User]

    #follow
    isFollow(username: String): Boolean
    getFollowers(username: String!): [User]
    getFollowing(username: String!): [User]
    getNotFollowers:[User]

    #publish
    getPublication(username: String!): [Publication]
    getPublicationsFollowers: [FeedPublication]

    #comment
    getComment(idPublication: ID): [Comment]

    #likes
    isLike(idPublication: ID!): Boolean
    countLikes(idPublication: ID!): Int
  }

  type Mutation {
    #user
    register(input: UserInput): User
    login(input: LoginInput): Token
    updateAvatar(file: Upload): UpdateAvatar
    deleteAvatar: Boolean
    updateUser(input: UserUpdateInput): Boolean

    #Follow
    follow(username: String!): Boolean
    unFollow(username: String!): Boolean

    #PUBLICATION
    publish(file: Upload): Publish

    #COMMENTS
    addComment(input: CommentInput): Comment

    #LIKES
    addLike(idPublication: ID!): Boolean
    deleteLike(idPublication: ID!): Boolean
  }
`;

module.exports = typeDefs;
