const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const Sequelize = require('sequelize')
const { Case, VideoCase, Video } = require('../models');

module.exports = app => {
    const {existsOrError} = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (body, headers) => {
        
        try{
            const { title, description, active, videos} = body;
          
            const shared = body.shared == null ? false : body.shared
        
            //Busca o token para poder pegar o id do professor
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
         
            //Verifica se o objeto passado esta correto
            existsOrError(body,'Formato dos dados invalido')

            //Verifica se possui todos os dados foram passados
            existsOrError(title,'Titulo não informado!')
            existsOrError(description,'Descrição não informada!')
           
            var _case
            _case = await Case.findOne({
                where:{
                    title
                }
            })

            if(_case) throw {
                erro:"Ja possui um titulo com esse nome!",
                status : 401
            }
         
            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            _case = await Case.create({
                title,
                description,
                active,
                shared,
                teacher:_token.id
            })

            //Insere na tabela de video
            videos.forEach(async video => {
                const teacherVideo =  await Video.findOne({
                    where: {
                        id: video,
                    }})
                  
                if((_token.id != teacherVideo.teacher) || !teacherVideo){
                    throw {
                        erro:"Usuário não possui permissão para deletar o video",
                        status:403
                    }
                }
               
                VideoCase.create({
                    id_video : video,
                    id_case : _case.id
                })
            });

            return _case
           
        }catch(err){
            //Se houver algum dado incorreto, lança exceção para o controller
            //com a mensagem de erro ja tratada.
            throw err
        }

    }

    /**
     * Valida os dados que serão deletados
     * @param {Valor que será validado} value 
     */
    const destroy = async (value, headers) => {

        try{
            //Delete o caso
            const rowsDeleted = Case.destroy({
                where:{
                    id: value
                }
            })
          
            //Caso não encontrar o caso, gera uma exceção
            existsOrError(rowsDeleted, 'Caso não foi encontrada.')
            
            return rowsDeleted
        }catch(err){
            throw err
        }

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (body, params,headers) => {

        try{
            //Verifica se o objeto passado esta correto
            existsOrError(body,'Formato dos dados invalido')

            //Update nos dados de acordo com o id
            return await Case.update({ 
                                name: body.name,
                                description: body.description,
                                teacher: body.teacher,
                           }, 
            {
                where: {
                  id: body.id
                }
            })

        }catch(err){
            throw err
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const index = async (headers, query) => {

        try{
           //Retorna todos os casos
           return await Case.findAll()
        }catch(err){
            throw err
        }

    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
   const show = async (value, query, headers) => {
        try{
            //Retorna o caso pelo id
            return await Case.findOne({
                where:{
                    id:value
                }
            })
        }catch(err){
            throw err
        }
    }

    return {store, destroy, show, index, update}
}