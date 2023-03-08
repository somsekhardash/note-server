const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server-core');
// const { skip } = require('graphql-resolvers');

const isAuthenticated = async (resolve, root, context, args, info) => {
  if (context.token) {
    const result = await jwt.verify(context.token, 'shhhhh');
    // if (result?.error instanceof ApolloError) {
    //     throw result.error
    // }
  }
};

module.exports = {
  isAuthenticated,
};
