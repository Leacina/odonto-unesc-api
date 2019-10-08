const CaseService = require('../services/CaseService')
const Case = require('../models/Case')

module.exports = app => {
    const index = (req, res) => {
        res.send('Hello world')
    }
    const show = (req, res) => {}
    const store = (req, res) => {
        res.send('Hello world')
    }
    const update = (req, res) => {}
    const destroy = (req, res) => {}

    return {index, show, store, update, destroy}
}