const app = require('express')()
const consign = require('consign')

consign()
.include('./src/config/passport.js')
    .then('./src/config/middlewares.js')
    .then('./src/services/ValidationService.js')
    .then('./src/services')
    .then('./src/controllers')
    .then('./src/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando...')
})