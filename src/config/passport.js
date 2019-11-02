const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt
const {Teacher} = require('../models')

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
   
    const strategy = new Strategy(params, (payload, done) => {
        try{
            const teacher = Teacher.findOne({
                where: {
                    id:payload.id
                }
            })
            done(null, teacher ? { ...payload } : false)
        }catch(err){
            done(err, false)
        }
    })

    passport.use(strategy)

    return {authenticate: () => passport.authenticate('jwt', { session: false })}
}