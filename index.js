const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const { logger, endLogger } = require('./helpers/logger.js')
const { environmentTokens } = require('./config/appConfig')
const { setContext } = require('./helpers/setContext.js')

const { typeDefs } = require('./gql/schemas/index.js')
const { resolvers } = require('./gql/resolvers/index.js')
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core')
const { ApolloServer } = require('apollo-server-express')
const routesHandler = require('./routes/routesHandler.js')

mongoose.connect(environmentTokens.mongoDBUrl)

const db = mongoose.connection

db.on('error', (err) => {
    logger.error(`Connection error with database. ${err}`)
})

db.once('open', () => {
    logger.info(`Connected with database`)
    initApplication()
})

const initApplication = async () => {
    const app = express()
    app.use(cors())
    app.use('', routesHandler)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: setContext,
        introspection: true, // Set to "true" for development mode
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()], // disable in prod
        formatError(error) {
            logger.error(error.message)
        },
    })

    await server.start()

    server.applyMiddleware({ app })

    app.use((req, res) => {
        res.status(404).send('404')
    })

    app.listen(environmentTokens.port, () => {
        logger.info(
            `GraphQL Playground running on port:${environmentTokens.port} & path:${server.graphqlPath}`
        )
    })

    //Application shutdown
    process.on('SIGINT', () => {
        logger.info('Stop application')
        endLogger()
        process.exit()
    })
}
