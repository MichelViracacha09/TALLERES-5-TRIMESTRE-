const { Sequelize } = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: env.DB_LOGGING ? console.log : false,
  timezone: '+00:00',
  define: { underscored: true, freezeTableName: true, timestamps: true },
});
module.exports = { sequelize };
