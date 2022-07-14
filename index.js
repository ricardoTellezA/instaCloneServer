const jwt = require("jsonwebtoken");
const moongose = require("mongoose");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const typeDefs = require("./gql/shema");
const resolvers = require("./gql/resolver");
require("dotenv").config({ path: ".env" });

//Conectar a la base de datos
moongose.connect(
  process.env.BBDD,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, _) => {
    if (err) {
      console.log(err);
    } else {
      server();
    }
  }
);

//Crear servidor
async function server() {
  const serverApollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization;

      if (token) {
        try {
          const user = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY );
          return {
            user,
          }
        } catch (error) {
          
        

           
          console.log(error);
          throw new Error("Error al autenticar");
        }
      }
    },
  });
  await serverApollo.start();
  const app = express();
  app.use(graphqlUploadExpress());
  serverApollo.applyMiddleware({ app });
  await new Promise((r) => app.listen({ port: process.env.PORT || 4000 }, r));
  console.log("#############################################################");
  console.log(`Servidor corriendo en el puerto ${serverApollo.graphqlPath}`);

  console.log("#############################################################");
}
