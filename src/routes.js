const URL = '/api/'

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

/**
 * Rotas acessando os métodos dos Controllers
 */
module.exports = app => {

    app.post(URL + 'signin',app.src.controllers.LoginController.signin)
    app.post(URL + 'validateToken',app.src.controllers.LoginController.validateToken)

    //Rota para os professores
    app.route(URL + 'teacher')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.TeacherController.store)
        .get(app.src.controllers.TeacherController.index)   
    app.route(URL + 'teacher/:id')
        .all(app.src.config.passport.authenticate())
        .delete(app.src.controllers.TeacherController.destroy)
        .put(app.src.controllers.TeacherController.update)
        .get(app.src.controllers.TeacherController.show)

    //Rota para os estudantes
    app.route(URL + 'student')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.StudentController.store)
        .get(app.src.controllers.StudentController.index)
        .put(app.src.controllers.StudentController.update)
    app.route(URL + 'student/:id')
        .delete(app.src.controllers.StudentController.destroy)
        .get(app.src.controllers.StudentController.show)

    //Rota para os casos
    app.route(URL + 'case')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.CaseController.store)
        .get(app.src.controllers.CaseController.index)
        .put(app.src.controllers.CaseController.update)
    app.route(URL + 'case/:id')
        .delete(app.src.controllers.CaseController.destroy)
        .get(app.src.controllers.CaseController.show)

    //Rota para as atividades
    app.route(URL + 'lesson')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.LessonController.store)
        .get(app.src.controllers.LessonController.index)
        .put(app.src.controllers.LessonController.update)
    app.route(URL + 'lesson/:id')
        .delete(app.src.controllers.LessonController.destroy)
        .get(app.src.controllers.LessonController.show)

    //Rota para os videos
    app.route(URL + 'video')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.VideoController.store)
        .get(app.src.controllers.VideoController.index)
    app.route(URL + 'video/:id')
        .all(app.src.config.passport.authenticate())
        .put(app.src.controllers.VideoController.update)
        .delete(app.src.controllers.VideoController.destroy)
        .get(app.src.controllers.VideoController.show)
        
        //Rota para os videos
    app.route(URL + 'upload/video')
        .all(app.src.config.passport.authenticate())
        .post(app.src.controllers.StreamController.store)
        .get(app.src.controllers.StreamController.index)
    app.route(URL + 'upload/video/:id')
         .all(app.src.config.passport.authenticate())
        .get(app.src.controllers.StreamController.show)
    
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

}