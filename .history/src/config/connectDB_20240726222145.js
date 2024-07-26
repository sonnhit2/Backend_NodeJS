const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('test', 'root', 'Vnpt@123', {
  host: 'localhost',
  dialect: 'mysql'
});