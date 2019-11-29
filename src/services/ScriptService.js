const { Script, Case, Teacher, Script_Case } = require('../models');
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const Sequelize = require('sequelize')

module.exports = app => {
    const { existsOrError } = app.src.services.ValidationService;

    /**
     * Valida os dados que serão inseridos
     * @param {Valor que será validado} value 
     */
    const store = async (body, headers) => {
        try {
            const { title, description, cases } = body;

            //Validações de campo null
            const shared = body.shared == null ? false : body.shared
            const active = body.active == null ? false : body.active

            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se possui todos os dados foram passados
            existsOrError(title, 'Título não informado!');
            existsOrError(description, 'Descrição não informada!');

            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Insere o dado no banco de dados, caso de algum problema, lança uma exceção
            var script = await Script.create({
                title,
                description,
                shared,
                active,
                teacher: _token.id
            });

            if (cases) {
                // Percorre todos os casos para cadastro
                for (let i = 0; i < cases.length; i++) {
                    const currentCase = await Case.findOne({
                        where: {
                            id: cases[i].case.id,
                        }
                    });                    

                    if (!currentCase) throw {
                        erro: "Caso '" + cases[i] + "' não encontrado",
                        status: 403
                    }

                    // Se não tem permissão
                    if ((_token.id != currentCase.teacher && !currentCase.shared)) {
                        throw {
                            erro: "Usuário não possui permissão para utilizar o caso",
                            status: 403
                        }
                    }

                    // Insere o caso
                    await Script_Case.create({
                        id_script: script.id,
                        id_case: cases[i].case.id,
                        position: cases[i].position
                    })
                }
            }

            return script;
        } catch (err) {
            //Se houver algum dado incorreto, lança exceção para o controller
            //com a mensagem de erro ja tratada.
            throw err
        }
    }

    /**
     * Valida os dados que serão deletados
     * @param {Valor que será validado} value 
     */
    const destroy = async (id, headers) => {
        try {
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Verifica se pode alterar... Somente o criador do script pode altera-lo
            creatorCheck(headers.id, _token.id);

            //Deleta o roteiro
            const rowsDeleted = Script.destroy({
                where: {
                    id
                }
            });

            //Caso não encontrar o roteiro, gera uma exceção
            existsOrError(rowsDeleted, 'Roteiro não encontrado.');

            await Script_Case.destroy({
                where: {
                    id_script: id
                }
            });
        } catch (err) {
            throw err
        }

    }

    /**
     * Valida os dados que serão alterados
     * @param {Valor que será validado} value 
     */
    const update = async (body, headers, params) => {
        try {
            const { title, description, cases } = body;
            const { id } = params

            //Validações de campo null
            const shared = body.shared == null ? false : body.shared
            const active = body.active == null ? false : body.active

            //Verifica se o objeto passado esta correto
            existsOrError(body, 'Formato dos dados inválido');

            //Verifica se todos os dados foram passados
            existsOrError(id, 'Campo ID não informado!');

            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);
        
            const script = await Script.findOne({
                where: {
                    id,
                }
            });

            //Verifica se pode alterar... Somente o criador do script pode altera-lo
            creatorCheck(script.teacher, _token.id);

            if (cases) {
                const _cases = await Script_Case.findAll({
                    where: {
                        id_script: id
                    }
                });
                
                
                for (let i = 0; i < _cases.length; i++) {
                    var isUpdate = false
                    
                    //Verifico se possui esse video na requisição, caso possuir edita
                    for (let j = 0; j < cases.length; j++) {
                        //Caso possuir um com mesmo video, faz o update
                        if (_cases[i].id_case == cases[j].case.id) {                            
                            await Script_Case.update({
                                position: cases[j].position
                            }, {
                                where: {
                                    id_script: id,
                                    id_case: cases[j].case.id
                                }
                            });

                            isUpdate = true
                        }
                    }
                    
                    if (!isUpdate) {
                        await Script_Case.destroy({                            
                            where: {
                                id_script: id,
                                id_case: _cases[i].id_case
                            }
                        })
                    }
                }

                //Verifica para inserir na tabela
                for (let i = 0; i < cases.length; i++) {
                    var isInsert = true
                    for (let j = 0; j < _cases.length; j++) {
                        if (cases[i].case.id == _cases[j].id_case) {
                            isInsert = false
                        }
                    }

                    if (isInsert) {                        
                        await Script_Case.create({
                            id_script: id,
                            id_case: cases[i].case.id,
                            position: cases[i].position
                        })
                    }
                }
            }

            return await Script.update({ title, description, shared, active },
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
    * @param {Valor que será validado} query 
    */
    const index = async (query) => {
        try {
            //Pega os dados para filtros 
            const { sort, order, page, limit, search } = query

            //Utilizado nos filtros
            const Op = Sequelize.Op

            //Faz o split para pegar todos os order e sort
            var sortArray = sort ? sort.split(',') : []
            var orderArray = order ? order.split(',') : []

            //Variavel para armezar o array de order e sort
            let _order = [];

            //Percorre todos os orders
            for (let i = 0; i < sortArray.length - 1; i++) {
                //Acumulador do order by
                _order[i] = [(sortArray[i] || 'id'), (orderArray[i] || 'ASC')]
            }

            //Retorna todos os scripts
            const items = await Script.findAll({
                //Busca os dados com todos os filtros
                where: {
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
                            teacher: {
                                [Op.like]: `%${search || ''}%`
                            }
                        }
                    ]
                },
                limit: parseInt(limit) || null,
                offset: ((parseInt(page) - 1) * limit) || null,
                order: _order
            });

            var _items = [];
            for (let i = 0; i < items.length; i++) {
                const { id, title, description, shared, active, teacher, createdAt, updatedAt } = items[i]

                //variaveis para controle da query expand
                var { expand } = query
                var objectTeacher;

                //Monta o Objeto professor de acordo com o expand passado na query
                if (expand) {
                    expand = expand.split(',')

                    //Se possuir expand para teacher, busca o cara
                    if (expand.indexOf('teacher') > -1) {
                        objectTeacher = await Teacher.findOne({
                            where: {
                                id: teacher
                            },
                            attributes: { exclude: ['password'] }
                        });
                    }
                }

                // Busca os casos relacionados ao roteiro
                const _script_case = await Script_Case.findAll({
                    where: {
                        id_script: id,
                    },
                    order: [['position', 'ASC']],
                    attributes: ['id_case', 'position']
                })

                // Monta os casos com suas informações
                var _case = []
                var caseWithPosition = []
                for (let i = 0; i < _script_case.length; i++) {
                    _case[_case.length] = await Case.findOne({
                        where: {
                            id: _script_case[i].id_case
                        },
                        attributes: (expand && (expand.indexOf('case') > - 1) ?
                            ['id', 'title', 'description', 'teacher', 'active', 'shared'] : ['id'])
                    })

                    caseWithPosition[caseWithPosition.length] = {
                        position: _script_case[i].position,
                        _case: _case[i]
                    };

                    if (expand && expand.indexOf('teacher') > - 1 && expand.indexOf('case') > - 1) {
                        caseTeacher = await Teacher.findOne({
                            where: {
                                id: _case[i]['teacher']
                            },
                            attributes: { exclude: ['password'] }
                        });

                        _case[i]['teacher'] = caseTeacher;
                    }
                }

                //Atribui a variavel final de retorno
                _items[i] = {
                    id,
                    title,
                    description,
                    shared,
                    active,
                    createdAt,
                    updatedAt,
                    cases: caseWithPosition,
                    teacher:
                        objectTeacher ? objectTeacher : { id: teacher }
                }

            };

            return {
                items: _items,
                page,
                limit,
                total: _items.length
            }
        } catch (err) {
            throw err
        }
    }

    /**
    * Valida os dados que serão retornados
    * @param {Valor que será validado} value 
    */
    const show = async (value, headers, query) => {
        try {
            const _token = jwt.decode(headers.authorization.replace('Bearer', '').trim(), authSecret);

            //Retorna o roteiro pelo id
            const script = await Script.findOne({
                where: {
                    id: value,
                    teacher: _token.id
                }
            });


            if (!script) {
                throw {
                    erro: 'Roteiro não encontrado!',
                    status: 400
                }
            }

            const { id, title, description, teacher, shared, active, createdAt, updatedAt } = script;

            //variaveis para controle da query expand
            var { expand } = query
            var objectTeacher;

            //Monta o Objeto professor de acordo com o expand passado na query
            if (expand) {
                expand = expand.split(',')

                //Se possuir expand para teacher, busca o cara
                if (expand.indexOf('teacher') > -1) {
                    objectTeacher = await Teacher.findOne({
                        where: {
                            id: teacher
                        },
                        attributes: { exclude: ['password'] }
                    })
                }
            }

            // Busca os casos relacionados ao roteiro
            const _script_case = await Script_Case.findAll({
                where: {
                    id_script: id,
                },
                order: [['position', 'ASC']],
                attributes: ['id_case', 'position']
            })

            // Monta os casos com suas informações
            var _case = []
            var caseWithPosition = []
            for (let i = 0; i < _script_case.length; i++) {
                _case[_case.length] = await Case.findOne({
                    where: {
                        id: _script_case[i].id_case
                    },
                    attributes: (expand && (expand.indexOf('case') > - 1) ?
                        ['id', 'title', 'description', 'teacher', 'active', 'shared'] : ['id'])
                })

                caseWithPosition[caseWithPosition.length] = {
                    position: _script_case[i].position,
                    _case: _case[i]
                };

                if (expand && expand.indexOf('teacher') > - 1 && expand.indexOf('case') > - 1) {
                    caseTeacher = await Teacher.findOne({
                        where: {
                            id: _case[i]['teacher']
                        },
                        attributes: { exclude: ['password'] }
                    });

                    _case[i]['teacher'] = caseTeacher;
                }
            }

            //Atribui a variavel final de retorno
            return {
                id,
                title,
                description,
                shared,
                active,
                createdAt,
                updatedAt,
                cases: caseWithPosition,
                teacher:
                    objectTeacher ? objectTeacher : { id: teacher }
            }
        } catch (err) {
            throw err
        }
    }

    function creatorCheck(id, tokenId) {
        //Verifica se pode alterar... Somente o criador do script pode altera-lo
        if (id) {
            if (tokenId != id) {
                throw {
                    erro: 'Usuário não possui permissão para alterar o registro',
                    status: 403
                }
            }
        }

        return true;
    }

    return { store, destroy, show, index, update }
}