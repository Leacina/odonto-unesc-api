module.exports = app => {

    /**
     * Comando executado para buscar um dado
     * @param {request} req 
     * @param {response} res 
     */
    const index = async (req, res) => {
        try {
            const teacher = await app.src.services.TeacherService.index();

            res.send(teacher);
        } catch(err) {
            res.status(400).send({
                erro:err
            });
        }
    }

    /**
     * Comado executado para listar os dados
     * @param {request} req 
     * @param {response} res 
     */
    const show = async (req, res) => {
        try {
            const teacher = await app.src.services.TeacherService.show(req.params.id);

            res.send(teacher);
        } catch(err) {
            res.status(400).send({
                erro:err
            });
        }
    }
    
    /**
    * Comando executado para inserir dado
    * @param {request} req 
    * @param {response} res 
    */
    const store = async (req, res) => {
        try {
    
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const teacher = await app.src.services.TeacherService.store(req.body);

            teacher.password = ''

            //Retorna o json com status de sucesso para o usuário
            return res.send(teacher);

        } catch(err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                name: req.body.name,
                code: req.body.code,
                password: '',
                erro: err 
            });
        }
    }
    
    /**
    * Função executada para atualizar os dados
    * @param {request} req 
    * @param {response} res 
    */
    const update = async (req, res) => {
        try {
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const teacher = await app.src.services.TeacherService.update(req.body);

            //Retorna o json com status de sucesso para o usuário
            return res.send(teacher);

        } catch(err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                name: req.body.name,
                code: req.body.code,
                password: '',
                erro: err 
            });
        }
    }
    
    /**
    * Comando executado para deletar dado
    * @param {request} req 
    * @param {response} res 
    */
    const destroy = async (req, res) => {

        try {
            const teacher = await app.src.services.TeacherService.destroy(req.params.id);

            res.send(teacher);
        } catch(err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                erro: err 
            });
        }
    }

    return {index, show, store, update, destroy};
}