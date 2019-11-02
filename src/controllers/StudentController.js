module.exports = app => {

    /**
     * Comando executado para buscar um dado
     * @param {request} req 
     * @param {response} res 
     */
    const index = async (req, res) => {
        try{
            const Student = await app.src.services.StudentService.index()

            res.send(Student)
        }catch(err){
            res.status(err.status || 400).send({
                status:err.status || 400,
                detalhes:err
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
            const Student = await app.src.services.StudentService.show(req.params.id)

            res.send(Student)
        }catch(err){
            res.status(err.status || 400).send({
                status:err.status || 400,
                detalhes:err
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
            const Student = await app.src.services.StudentService.store(req.body)

            //Retorna o json com status de sucesso para o usuário
            return res.send(Student)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send(
                {
                    status: 400,
                    name: req.body.name,
                    code: req.body.code,
                    detalhes: err.status || 400, 
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
            const Student = await app.src.services.StudentService.update(req.body)

            //Retorna o json com status de sucesso para o usuário
            return res.send(Student)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send(
                {
                    status: err.status || 400,
                    name: req.body.name,
                    code: req.body.code,
                    detalhes: err 
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
            const Student = await app.src.services.StudentService.destroy(req.params.id) 

            res.send(Student)
        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send(
                {
                    status: err.status || 400,
                    detalhes: err 
                }
            )
        }

    }

    return {index, show, store, update, destroy}
}