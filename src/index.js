const app = require('express')()
const consign = require('consign')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

consign()
    .then('./src/config/middlewares.js')
  //.then('./api')
    .then('./src/config/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando...')
})