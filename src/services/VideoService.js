const { authSecret } = require('../.env')
const { Video } = require('../models');
const jwt = require('jwt-simple')
const Sequelize = require('sequelize')

module.exports = app => {
    const { existsOrError } = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (value, headers) => {
        try {
            const { title, description, archive, shared, active, teacher } = value;

            //Verifica se o objeto passado esta correto
            existsOrError(value, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');
            existsOrError(archive, 'Nome do arquivo não informado!');
            
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            return Video.create({
                title,
                description,
                archive,
                shared,
                active,
                teacher:_token.id
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
    const destroy = async (value, headers) => {
        try {
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
            const teacherVideo = await show(value)

            if(_token.id != teacherVideo.teacher){
                throw {
                    erro:"Usuário não possui permissão para deletar o video",
                    status:403
                }
            }

            //Deletar video
            const rowsDeleted = await Video.destroy({
                where: {
                    id: value
                }
            });

            //Caso não encontrar o professor, gera uma exceção
            existsOrError(rowsDeleted, 'Vídeo não encontrado.');

        } catch (err) {
            throw err;
        }
    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (body, params,headers) => {
        try {
            const { title, description, archive, shared, active, teacher } = body;
            const { id } = params
         
            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');
            existsOrError(archive, 'Nome do arquivo não informado!');
           
            if(teacher){
                throw {
                    erro:"Não é possível alterar o professor",
                    status:403
                }
            }
    
            const teacherVideo = await show(id)

            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            if(_token.id != teacherVideo.teacher) {
                throw {
                        erro:'Usuário não possui permissão para alterar os dados do video!',
                        status:403
                }
            }
          
            return Video.update({ title, description, archive, shared, active },
                {
                    where: {
                        id
                    }
                });
           
        } catch (err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const show = async (value, headers) => {
        try {
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Retorna o video pelo id
            return Video.findOne({
                where: {
                    id: value,
                    teacher:_token.id
                }
            });
        } catch (err) {
            throw err;
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const index = async (headers, query) => {
        try {
            //Pega os dados para filtros
            const { sort, order, page, limit, search } = query   
       
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Utilizado nos filtros
            const Op = Sequelize.Op

            //Retorna todos os videos
            return await Video.findAll({
                where:{
                    [Op.and]:[
                        {
                            [Op.or]:[
                                {
                                    teacher: _token.id
                                },
                                {
                                    shared: true
                                }
                            ]
                        },
                        {
                            [Op.or]: [
                                {
                                    title: {
                                        [Op.like]: `%${search || ''}%`
                                    }
                                },
                                {
                                    description: {
                                        [Op.like]: `%${search || ''}%`
                                    }
                                },
                                {
                                    archive:{
                                        [Op.like]: `%${search || ''}%`  
                                    }
                                }
                            ]
                        }
                    ]
                },
                limit: parseInt(limit) || null,
                offset: parseInt(page) || null,
                order: [[sort || 'id',order || 'ASC']]
            });
        } catch (err) {
            throw err;
        }
    }

    return { index, store, destroy, show, update }
}