const URL = '/api/v1.0/'

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

/**
 * Rotas acessando os métodos dos Controllers
 */
module.exports = app => {

    //app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    //Rota para os casos
    app.route(URL + 'case')
        .get(app.src.controllers.CaseController.store)
}