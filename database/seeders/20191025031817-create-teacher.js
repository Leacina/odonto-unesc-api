module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Teacher', 
    [
      {
        name: 'Giovane Santiago Leacina',
        code: 99497,
        password: 'xadrezgrande',
        createdAt:new Date(),
        updatedAt:new Date()
      },
      {
        name: 'Edvaldo Rosa',
        code: 123456,
        password: 'black',
        createdAt:new Date(),
        updatedAt:new Date(),
      }
    ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Teacher', null, {}),
};