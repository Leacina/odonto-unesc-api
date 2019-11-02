const { Video } = require('../models');

module.exports = app => {
    const { existsOrError } = app.src.services.ValidationService;

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const index = async () => {
        try {
            //Retorna todos os videos
            return Video.findAll({
                attributes: ['id', 'title', 'description', 'archive', 'shared', 'active', 'teacher']
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (value) => {
        try {
            const { name, email, code, manager, password, active } = value;

            //Verifica se o objeto passado esta correto
            existsOrError(value, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');
            existsOrError(archive, 'Nome do arquivo não informado!');
            existsOrError(shared, 'Compartilhamento não informado!');
            existsOrError(active, 'Status não informado!');
            existsOrError(teacher, 'Professor não informado!');

            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Video.create({
                title,
                description,
                archive,
                shared,
                active,
                teacher
            });

        } catch (err) {
            //Se houver algum dado incorreto, lança exceção para o controller
            //com a mensagem de erro ja tratada.
            throw err;
        }
    }

    /**
     * Valida os dados que serão deletados
     * @param {Valor que será validado} value 
     */
    const destroy = async (value) => {
        try {
            //Deletar video
            const rowsDeleted = Video.destroy({
                where: {
                    id: value
                }
            });

            //Caso não encontrar o professor, gera uma exceção
            existsOrError(rowsDeleted, 'Vídeo não encontrado.');

            return rowsDeleted;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (value) => {
        try {
            const { id, title, description, archive, shared, active, teacher } = value.body;

            //Verifica se o objeto passado esta correto
            existsOrError(value, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');
            existsOrError(archive, 'Nome do arquivo não informado!');
            existsOrError(shared, 'Compartilhamento não informado!');
            existsOrError(active, 'Status não informado!');
            existsOrError(teacher, 'Professor não informado!');

            const _token = jwt.decode(value.headers.authorization.replace('Bearer', '').trim(), authSecret);

            if (_token.id == id || _token.manager == 'admin') {
                return Video.update({ title, description, archive, shared, active, teacher },
                    {
                        where: {
                            id
                        }
                    });
            } else {
                throw 'Usuário não possui permissão para alterar os dados!'
            }
        } catch (err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const show = async (value) => {
        try {
            //Retorna o video pelo id
            return Video.findAll({
                where: {
                    id: value
                },
                attributes: ['id', 'title', 'description', 'archive', 'shared', 'active', 'teacher']
            });
        } catch (err) {
            throw err;
        }
    }

    return { index, store, destroy, show, update }
}