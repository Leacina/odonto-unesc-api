const { authSecret } = require('../.env')
const { Video } = require('../models');
const jwt = require('jwt-simple')
const Sequelize = require('sequelize')

module.exports = app => {
    const { existsOrError } = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} body 
     */
    const store = async (body, headers) => {
        try {
            const { title, description, archive, active} = body;
            
            const shared = body.shared == null ? false : body.shared
        
            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');
            existsOrError(archive, 'Nome do arquivo não informado!');
            
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            const _video = await Video.findOne({
                where:{
                    archive
                }
            })

            if(_video){
                throw {
                    erro:"Já possui um arquivo com esse nome!",
                    status:403
                }
            }

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
           
            const teacherVideo =  await Video.findOne({
                where: {
                    id: value,
                }})

            if((_token.id != teacherVideo.teacher) || !teacherVideo){
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
            const { title, description, archive, active, teacher } = body;
            const { id } = params
            const shared = body.shared == null ? false : body.shared

            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            //existsOrError(title, 'Título não informado!');
            //existsOrError(description, 'Descrição não informada!');
            //existsOrError(archive, 'Nome do arquivo não informado!');
           
            if(teacher){
                throw {
                    erro:"Não é possível alterar o professor",
                    status:403
                }
            }
            
            const teacherVideo = await Video.findOne({
                where: {
                    id,
                }
            })  

            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            if(_token.id != teacherVideo.teacher) {
                throw {
                        erro:'Usuário não possui permissão para alterar os dados do video!',
                        status:403
                }
            }
          
            return await Video.update({ title, description, archive, shared, active },
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
            return await Video.findOne({
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
            
            //Faz o split para pegar todos os order e sort
            var sortArray = sort ? sort.split(',') : ['id']
            var orderArray = order ? order.split(',') : ['ASC']
     
            //Variavel para armezar o array de order e sort
            let _order = []; 
            
            //Percorre todos os 'order'
            for(let i = 0; i < sortArray.length - 1; i++){
                 //Acumulador do order by
                 _order[i] =  [(sortArray[i] || 'id') , (orderArray[i] || 'ASC')] 
            }
       
        

            //Retorna todos os videos
            const items = await Video.findAll({
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
                offset: ((parseInt(page) - 1) * limit) || null,
                order: _order || ['id','ASC']
            });
            
            return {
                items,
                page,
                limit,
                total: items.length
            }

        } catch (err) {
            throw err;
        }
    }

    return { index, store, destroy, show, update }
}