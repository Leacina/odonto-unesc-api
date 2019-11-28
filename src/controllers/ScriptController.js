module.exports = app => {

    /**
     * Comando executado para buscar um dado
     * @param {request} req 
     * @param {response} res 
     */
    const index = async (req, res) => {
        try {
            const script = await app.src.services.ScriptService.index(req.query);

            res.send(script);
        } catch (err) {
            res.status(err.status || 400).send({
                status: err.status || 400,
                details: err
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
            const script = await app.src.services.ScriptService.show(req.params.id, req.headers, req.query);

            res.send(script);
        } catch (err) {
            res.status(err.status || 400).send({
                status: err.status || 400,
                details: err
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
            const script = await app.src.services.ScriptService.store(req.body, req.headers);

            //Retorna o json com status de sucesso para o usuário
            return res.send(script);
        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send({
                status: err.status || 400,
                title: req.body.title,
                description: req.body.description,
                shared: req.body.shared,
                active: req.body.active,
                teacher: req.body.teacher,
                cases: req.body.cases,
                details: err
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
            const script = await app.src.services.ScriptService.update(req.body, req.headers, req.params);

            //Retorna o json com status de sucesso para o usuário
            return res.send(script);

        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send({
                status: err.status || 400,
                title: req.body.title,
                description: req.body.description,
                shared: req.body.shared,
                active: req.body.active,
                teacher: req.body.teacher,
                cases: req.body.cases,
                details: err
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
            const script = await app.src.services.ScriptService.destroy(req.params.id, req.headers);

            res.send(script);
        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(err.status || 400).send({
                status: err.status || 400,
                details: err
            });
        }
    }

    return { index, show, store, update, destroy };
}