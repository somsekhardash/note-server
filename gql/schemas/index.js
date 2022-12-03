const path = require('path')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')

const typesArray = loadFilesSync(`${__dirname}/**/*.graphql`, { recursive: true }, { extensions: ['graphql'] })
exports.typeDefs = mergeTypeDefs(typesArray)