const { loadFiles, loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
// const { ApolloServer } = require('apollo-server-express');
const { ApolloServer } = require('@apollo/server');
const cors = require('cors');
const { json } = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');

const express = require('express');
// const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const path = require('path');

const port = 4000;

const loadedFiles = loadFilesSync('**/*', {
  extensions: ['graphql'],
});

const loadedResolvers = loadFilesSync(
  path.join(__dirname, '**/*.resolvers.js')
);

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: loadedFiles,
    resolvers: loadedResolvers,
  });

  const server = new ApolloServer({ schema });

  await server.start();

  //! V3
  // server.applyMiddleware({ app, path: '/graphql' });

  //! V4
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.listen(port, () => {
    console.log('Running a GraphQL API Server');
  });
}

startApolloServer();

// const root = {
//   posts: require('./posts/posts.model'),
//   comments: require('./comments/comments.model'),
// };

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     // rootValue: root,
//     graphiql: true,
//   })
// );

// app.listen(port, () => {
//   console.log('Running a GraphQL server');
// });
