const fs = require('fs');

module.exports = app => {
    const index = (req, res) => {
        try {
            const video = await app.src.services.VideoService.index();

            res.send(video);
        } catch (err) {
            res.status(400).send({
                erro: err
            });
        }
    }

    const show = (req, res) => {
        try {
            const video = await app.src.services.VideoService.show(req.params.id);

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
            const video = await app.src.services.VideoService.store(req.body);


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
                erro: err
            });
        }
    }

    const update = (req, res) => {
        try {
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const video = await app.src.services.VideoService.update(req);

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
                erro: err
            });
        }
    }

    const destroy = (req, res) => {
        try {
            const video = await app.src.services.VideoService.destroy(req.params.id);

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