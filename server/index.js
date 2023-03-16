const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
// const helmet = require("helmet");
const { Nuxt, Builder } = require('nuxt')
const app = express()
const { node_env, host, port } = require('../config')

app.set('port', port)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(node_env === 'production')

// a security middleware that handles several kinds of attacks in the HTTP/HTTPS protocols
// app.use(helmet());

// CORS config
app.use(
    cors({
        origin: true,
        optionsSuccessStatus: 200,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)

// Connect DBs
require('./models')

// request body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// import all routes
require('./routes')(app)

// Compacting requests using GZIP middleware
app.use(compression())

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true,
    })
}
start()
