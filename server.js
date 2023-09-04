const { loadFiles, loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const path = require('path');
const app = express();

const port = 4000;

const loadedFiles = loadFilesSync('**/*', {
  extensions: ['graphql'],
});

const loadedResolvers = loadFilesSync(path.join(__dirname, "**/*.resolvers.js"));

const schema = makeExecutableSchema({
  typeDefs: loadedFiles,
  resolvers: loadedResolvers
});

// const root = {
//   posts: require('./posts/posts.model'),
//   comments: require('./comments/comments.model'),
// };

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log('Running a GraphQL server');
});
