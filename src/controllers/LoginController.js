const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const {Teacher} = require('../models')

module.exports = app => {

    const signin = async (req, res) => {

        if (!req.body.code || !req.body.password) {
            return res.status(400).send('Informe seu código e senha!')
        }
        
        const teacher = await Teacher.findOne({
            where : {
                code:req.body.code
            }
        })
        
        if (!teacher) return res.status(400).send('Professor não encontrado!')
        
        const isMatch = bcrypt.compareSync(req.body.password, teacher.password)
        if (!isMatch) return res.status(401).send('Código/Senha inválidos!') 
        
        const now = Math.floor(Date.now() / 1000)
        
        const payload = {
            id: teacher.id,
            name: teacher.name,
            code: teacher.code,
            type: 'admin',
            issued_at: now,
            expires_at: now + (60 * 60 * 24 * 3)
        }

        return res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { signin, validateToken }

}