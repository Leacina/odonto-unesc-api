const fs = require('fs');

module.exports = app => {
    const index = async (req, res) => {
        try {
            const video = await app.src.services.VideoService.index(req.headers, req.query);

            res.send(video);
        } catch (err) {
            res.status(400).send({
                erro: err
            });
        }
    }

    const show = async (req, res) => {
        try {
            const video = await app.src.services.VideoService.show(req.params.id, req.headers);

            res.send(video);
        } catch (err) {
            res.status(400).send({
                erro: err
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
            const video = await app.src.services.VideoService.store(req.body, req.headers);


            //Retorna o json com status de sucesso para o usuário
            return res.send(video);

        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                title: req.body.title,
                description: req.body.description,
                archive: req.body.archive,
                shared: req.body.shared,
                active: req.body.active,
                teacher: req.body.teacher,
                details: err
            });
        }
    }

    const update = async (req, res) => {
        try {
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const video = await app.src.services.VideoService.update(req.body, req.params,req.headers);

            //Retorna o json com status de sucesso para o usuário
            return res.send(video);

        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                title: req.body.title,
                description: req.body.description,
                archive: req.body.archive,
                shared: req.body.shared,
                active: req.body.active,
                teacher: req.body.teacher,
                details: err
            });
        }
    }

    const destroy = async (req, res) => {
        try {
            const video = await app.src.services.VideoService.destroy(req.params.id, req.headers);

            res.send(video);
        } catch (err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                erro: err
            });
        }
    }

    return { index, show, store, update, destroy }
}