module.exports = app => {

    /**
     * Comando executado para buscar um dado
     * @param {request} req 
     * @param {response} res 
     */
    const index = async (req, res) => {
        try{
            const Lesson = await app.src.services.LessonService.index()

            res.send(Lesson)
        }catch(err){
            res.status(400).send({
                erro:err
            })
        }
    }

    /**
     * Comado executado para listar os dados
     * @param {request} req 
     * @param {response} res 
     */
    const show = async (req, res) => {
        try{
            const Lesson = await app.src.services.LessonService.show(req.params.id)

            res.send(Lesson)
        }catch(err){
            res.status(400).send({
                erro:err
            })
        }
    }
    
    /**
    * Comando executado para inserir dado
    * @param {request} req 
    * @param {response} res 
    */
    const store = async (req, res) => {
        try{
            
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const Lesson = await app.src.services.LessonService.store(req.body)

            //Retorna o json com status de sucesso para o usuário
            return res.send(Lesson)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    name: req.body.name,
                    code: req.body.code,
                    expiration_date : req.body.expiration_date,
                    start_date : req.body.start_date,
                    id_teacher : req.body.id_teacher,
                    Erro: err  
                }
            )
        }
    }
    
    /**
    * Função executada para atualizar os dados
    * @param {request} req 
    * @param {response} res 
    */
    const update = async (req, res) => {
        try{
            
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const Lesson = await app.src.services.LessonService.update(req.body)

            //Retorna o json com status de sucesso para o usuário
            return res.send(Lesson)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    name: req.body.name,
                    code: req.body.code,
                    expiration_date : req.body.expiration_date,
                    start_date : req.body.start_date,
                    id_teacher : req.body.id_teacher,
                    Erro: err 
                }
            )
        }
    }
    
    /**
    * Comando executado para deletar dado
    * @param {request} req 
    * @param {response} res 
    */
    const destroy = async (req, res) => {

        try{
            const Lesson = await app.src.services.LessonService.destroy(req.params.id) 

            res.send(Lesson)
        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    Erro: err 
                }
            )
        }

    }

    return {index, show, store, update, destroy}
}