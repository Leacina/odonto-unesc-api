const app = require('express')()
const consign = require('consign')

consign()
    .then('./src/config/middlewares.js')
    .then('./src/controllers')
    .then('./src/routes.js')
    .into(app)

app.listen(4000, () => {
    console.log('Backend executando...')
})