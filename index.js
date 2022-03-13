const moongose = require("mongoose");
const { ApolloServer } = require("apollo-server");
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
function server() {
  const serverApollo = new ApolloServer({
    typeDefs,
    resolvers,
  });

  serverApollo.listen().then((response) => {
    console.log(`Servidor corriendo en el puerto ${response.url}`);
  });
}
