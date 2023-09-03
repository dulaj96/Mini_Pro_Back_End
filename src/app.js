import express from 'express'
import bodyParser from 'body-parser'


const app = express()

// Connect Databse
import connect from './configs/db.js'
await connect()

import cors from 'cors'
app.use(cors())


//body parser for parsing request body
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
        // parameterLimit: 100000,
        // limit: "20mb",
        // type: "application/json"
    })
)


app.get('/check', (req, res) => {
    res.send('Success 1')
})

// docs
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swaggerJsdoc.js'
app.use('/api/doc', swaggerUi.serve)
app.get('/api/doc', swaggerUi.setup(swaggerSpec))
app.get('/api/doc/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
})



// HEalth check route //TODO change it
import expressHealthcheck from 'express-healthcheck'
app.use('/healthcheck', expressHealthcheck())



import v1Routes from './v1/routes/index.js'
app.use('/api/v1/', v1Routes)


import passport from 'passport'
app.use(passport.initialize())
import passportConfig from './configs/passport.js'
passportConfig()


export default app
