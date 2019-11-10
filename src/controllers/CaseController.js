module.exports = app => {

    /**
     * Comando executado para buscar um dado
     * @param {request} req 
     * @param {response} res 
     */
    const index = async (req, res) => {
        try{
            const Case = await app.src.services.CaseService.index(req.headers, req.query);

            res.send(Case)
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
            const Case = await app.src.services.CaseService.show(req.params.id, req.query, req.headers);

            res.send(Case)
        }catch(err){
            res.status(400).send({
                details:err
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
            const Case = await app.src.services.CaseService.store(req.body, req.headers);

            //Retorna o json com status de sucesso para o usuário
            return res.send(Case)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    title: req.body.title,
                    description: req.body.description,
                    teacher: req.body.teacher,
                    details: err  
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
            const Case = await app.src.services.CaseService.update(req.body, req.params,req.headers);

            //Retorna o json com status de sucesso para o usuário
            return res.send(Case)

        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    name: req.body.name,
                    description: req.body.description,
                    id_teacher: req.body.id_teacher,
                    details: err 
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
            const Case = await app.src.services.CaseService.destroy(req.params.id, req.headers); 

            res.send(Case)
        }catch(err){
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send(
                {
                    status: 400,
                    details: err 
                }
            )
        }

    }

    return {index, show, store, update, destroy}
}