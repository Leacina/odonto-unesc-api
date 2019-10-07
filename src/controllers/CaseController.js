const CaseService = require('../services/CaseService')

module.exports = app => {
    const index = (req, res) => {
        res.send(await CaseService.valide(req.body))
    }
    const show = (req, res) => {}
    const store = (req, res) => {}
    const update = (req, res) => {}
    const destroy = (req, res) => {}

    return {index, show, store, update, destroy}
}