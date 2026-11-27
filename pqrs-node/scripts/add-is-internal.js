const { sequelize } = require('../src/config/database');

async function addInternalFlag() {
  const [columns] = await sequelize.query("SHOW COLUMNS FROM `pqrs_response` LIKE 'is_internal'");
  if (columns.length) {
    console.log('pqrs_response.is_internal ya existe.');
    return;
  }
  await sequelize.query('ALTER TABLE `pqrs_response` ADD COLUMN `is_internal` TINYINT(1) NOT NULL DEFAULT 0 AFTER `message`');
  console.log('Se agregó pqrs_response.is_internal.');
}
addInternalFlag().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => sequelize.close());
