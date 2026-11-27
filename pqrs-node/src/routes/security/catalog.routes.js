const express = require('express');
const { authRequired } = require('../../middlewares/auth.middleware');
const { permissionRequired } = require('../../middlewares/permission.middleware');
const controller = require('../../controllers/security/catalog.controller');
const router = express.Router();
router.get('/permissions', authRequired, permissionRequired('Roles', 'view'), controller.list('permissions'));
router.get('/modules', authRequired, permissionRequired('Roles', 'view'), controller.list('modules'));
router.get('/user-status', authRequired, permissionRequired('Usuarios', 'view'), controller.list('user-status'));
router.get('/document-types', authRequired, permissionRequired('Perfiles', 'view'), controller.list('document-types'));
router.get('/pqrs-types', authRequired, permissionRequired('PQRS', 'view'), controller.list('pqrs-types'));
router.get('/pqrs-status', authRequired, permissionRequired('PQRS', 'view'), controller.list('pqrs-status'));
module.exports = router;

