const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const Sequelize = require('sequelize')
const { Case, Video_Case, Video, Teacher } = require('../models');

module.exports = app => {
    const {existsOrError} = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (body, headers) => {
        
        try{
            const { title, description, videos} = body;
          
            const shared = body.shared == null ? false : body.shared
            const active = body.active == null ? true : body.active

            //Busca o token para poder pegar o id do professor
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
         
            //Verifica se o objeto passado esta correto
            existsOrError(body,'Formato dos dados invalido')

            //Verifica se possui todos os dados foram passados
            existsOrError(title,'Titulo não informado!')
            //existsOrError(description,'Descrição não informada!')
           
            var _case
            _case = await Case.findOne({ 
                where:{
                    title
                }
            })

            if(_case) throw {
                erro:"Ja possui um titulo com esse nome!",
                status : 403
            }
         
            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            _case = await Case.create({
                title,
                description,
                active,
                shared,
                teacher:_token.id
            })
            
            if(videos){
                //Percorre todos os videos para cadastro
                for(let i = 0; i < videos.length; i++){
                    //Busca o professor do video para verificar se possui permissão
                
                    const teacherVideo =  await Video.findOne({
                        where: {
                            id: videos[i],
                        }
                    })
                
                    if(!teacherVideo) throw {
                        erro:"Video '"+videos[1]+"' não encontrado",
                        status:403
                    }

                    //Se não tem permissão
                    if((_token.id != teacherVideo.teacher)){
                    
                        throw {
                            erro:"Usuário não possui permissão para deletar o video",
                            status:403
                        }
                    }
                
                    //Insere o video
                    await Video_Case.create({
                        id_video : videos[i],
                        id_case : _case.id
                    })
                }
            }
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
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
           
            const teacherCase =  await Case.findOne({
                where: {
                    id: value,
                }})

            if(!teacherCase) throw {
                erro:"Caso não encontrado",
                status:403
            }

            if((_token.id != teacherCase.teacher)){
                throw {
                    erro:"Usuário não possui permissão para deletar o caso",
                    status:403
                }
            }

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
        try {
            const { title, description, videos} = body;
            const { id } = params
            
            const active = body.active == null ? true : body.active
            const shared = body.shared == null ? false : body.shared

            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');
            //existsOrError(title, 'Título não informado!');
            //existsOrError(description, 'Descrição não informada!');
            //existsOrError(archive, 'Nome do arquivo não informado!');
          
            const _case = await Case.findOne({
                where: {
                    id,
                }
            })  

            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            if(_token.id != _case.teacher) {
                throw {
                        erro:'Usuário não possui permissão para alterar os dados desse caso!',
                        status:403
                }
            }
          
            await Video_Case.destroy({
                where:{
                    id_case:id
                }
            })
       
            if(videos){
                //Percorre todos os videos para cadastro
                for(let i = 0; i < videos.length; i++){
                    //Busca o professor do video para verificar se possui permissão
                
                    const teacherVideo =  await Video.findOne({
                        where: {
                            id: videos[i],
                        }
                    })
                
                    if(!teacherVideo) throw {
                        erro:"Video '"+videos[1]+"' não encontrado",
                        status:403
                    }
                
                    //Insere o video
                    await Video_Case.create({
                        id_video : videos[i],
                        id_case : _case.id
                    })
                }
            }
        
            return await Case.update({ title, description, shared, active },
                {
                    where: {
                        id
                    }
                });
           
        } catch (err) {
            throw err
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
            const itemsCount = await Case.findAll({
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
                                }
                            ]
                        }
                    ]
                }
            });

            //Retorna todos os videos
            const items = await Case.findAll({
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
                                }
                            ]
                        }
                    ]
                },
                limit: parseInt(limit) || null,
                offset: ((parseInt(page) - 1) * limit) || null,
                order: _order || ['id','ASC']
            });

            //TODO: Uma gambi provisória... Ajustar modo para poderem utilizar o expand
            //Tentar utilizar isso no proprio sequelize
            var _items = [];
            for(let i = 0; i < items.length ; i++){
                const { id, title, description, teacher, shared,active, createdAt, updatedAt} = items[i]
              
                //variaveis para controle da query expand
                var {expand} = query
                var objectTeacher;
               
                //Monta o Objeto professor de acordo com o expand passado na query
                if(expand){
                    expand = expand.split(',')

                    //Se possuir expand para teacher, busca o cara
                    if(expand.indexOf('teacher') > -1){
                        objectTeacher = await Teacher.findOne({
                            where:{
                                id : teacher
                            },
                            attributes: { exclude: ['password'] }
                        })
                    }
                }
                
                //Busca os videos relacionados aos casos
                const _video_case = await Video_Case.findAll({
                    where:{
                        id_case:id,
                    },
                    attributes: ['id_video'] 
                })

                //Monta os videos com suas info
                var video = []
                for(let i = 0;i < _video_case.length; i++){
                    //Busca o video referente ao id_video
                    video[video.length] = await Video.findOne({
                        where:{
                            id:_video_case[i].id_video
                        },
                        //Seleciona o atributo de acordo com os expand
                        attributes:(expand && (expand.indexOf('video') > - 1) ? 
                            ['id','title','description','archive'] : ['id'])
                    })
                }

                //Atribui a variavel final de retorno
                _items[i] = { id,
                    title,
                    description,
                    shared,
                    active,
                    createdAt,
                    updatedAt,
                    videos:video,
                    teacher:
                        objectTeacher ? objectTeacher : { id: teacher }} 
                        
            };
           
            return {
                items : _items,
                page,
                limit,
                total: itemsCount.length - 1
            }

        } catch (err) {
            throw err  
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
   const show = async (value, query, headers) => {
        try {
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
            
            //Retorna o video pelo id
            const _case  = await Case.findOne({
                where: {
                    id: value,
                    teacher:_token.id
                }
            });
        
            if(!_case){
                throw{
                    erro:'Caso não encontrado!',
                    status:400
                }
            }

            const { id, title, description, teacher, shared,active, createdAt, updatedAt} = _case

            //variaveis para controle da query expand
            var {expand} = query
            var objectTeacher;

            //Monta o Objeto professor de acordo com o expand passado na query
            if(expand){
                expand = expand.split(',')

                //Se possuir expand para teacher, busca o cara
                if(expand.indexOf('teacher') > -1){
                    objectTeacher = await Teacher.findOne({
                        where:{
                            id : teacher
                        },
                        attributes: { exclude: ['password'] }
                    })
                }
            }
   
            //Busca os videos relacionados aos casos
            const video_case = await Video_Case.findAll({
                where:{
                    id_case:id,
                },
                attributes: ['id_video'] 
            })

            //Monta os videos com suas info
            var video = []
            for(let i = 0;i < video_case.length; i++){
                //Busca o video referente ao id_video
                video[video.length] = await Video.findOne({
                    where:{
                        id:video_case[i].id_video
                    },
                    //Seleciona o atributo de acordo com os expand
                    attributes:(expand && (expand.indexOf('video') > - 1) ? 
                        ['id','title','description','archive'] : ['id'])
                })
            }

            //Retorna o JSON separado para controlar os dados do professor
            return {
                    id,
                    title,
                    description,
                    shared,
                    active,
                    createdAt,
                    updatedAt,
                    videos:video,
                    teacher:
                        objectTeacher ? objectTeacher : { id: teacher }
            }
        } catch (err) {
            throw err
        }
    }

    return {store, destroy, show, index, update}
}