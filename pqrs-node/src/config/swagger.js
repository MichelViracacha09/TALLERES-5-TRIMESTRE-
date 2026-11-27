const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');
const tags = ['Auth', 'Catálogos', 'Roles', 'Usuarios', 'Perfiles', 'Módulos', 'PQRS', 'Respuestas'];
const routes = [
  ['post','/auth/login','Inicia sesión','Auth',false],['get','/auth/me','Consulta el usuario autenticado','Auth'],['get','/auth/roles','Lista los roles del usuario','Auth'],['post','/auth/select-role','Selecciona el rol activo','Auth'],['get','/auth/permissions','Consulta los permisos del rol activo','Auth'],['get','/health','Comprueba la API y MySQL','Auth',false],
  ['get','/catalogs/permissions','Lista permisos','Catálogos'],['get','/catalogs/modules','Lista módulos de catálogo','Catálogos'],['get','/catalogs/user-status','Lista estados de usuario','Catálogos'],['get','/catalogs/document-types','Lista tipos de documento','Catálogos'],['get','/catalogs/pqrs-types','Lista tipos de PQRS','Catálogos'],['get','/catalogs/pqrs-status','Lista estados de PQRS','Catálogos'],
  ['get','/roles','Lista roles','Roles'],['post','/roles','Crea un rol','Roles'],['get','/roles/{id}','Consulta un rol','Roles'],['put','/roles/{id}','Actualiza un rol','Roles'],['delete','/roles/{id}','Elimina un rol','Roles'],['get','/roles/{id}/permissions','Consulta la matriz de permisos','Roles'],['post','/roles/{id}/permissions','Asigna un permiso al rol','Roles'],['delete','/roles/{id}/permissions/{rmpId}','Revoca un permiso del rol','Roles'],
  ['get','/users','Lista usuarios','Usuarios'],['post','/users','Crea usuario, perfil y rol inicial','Usuarios'],['get','/users/{id}','Consulta un usuario','Usuarios'],['put','/users/{id}','Actualiza usuario','Usuarios'],['patch','/users/{id}/status','Actualiza estado de usuario','Usuarios'],['patch','/users/{id}/password','Restablece contraseña','Usuarios'],['delete','/users/{id}','Elimina usuario','Usuarios'],['get','/users/{id}/roles','Lista roles de usuario','Usuarios'],['post','/users/{id}/roles','Asigna un rol al usuario','Usuarios'],['delete','/users/{id}/roles/{urId}','Desactiva un rol del usuario','Usuarios'],
  ['get','/users/{id}/profile','Consulta el perfil de un usuario','Perfiles'],['put','/users/{id}/profile','Actualiza el perfil de un usuario','Perfiles'],['get','/profiles','Lista perfiles','Perfiles'],['get','/profiles/{id}','Consulta un perfil','Perfiles'],['get','/profiles/me','Consulta mi perfil','Perfiles'],['put','/profiles/me','Actualiza mi perfil','Perfiles'],
  ['get','/modules','Lista módulos','Módulos'],['post','/modules','Crea un módulo','Módulos'],['get','/modules/{id}','Consulta un módulo','Módulos'],['put','/modules/{id}','Actualiza un módulo','Módulos'],['delete','/modules/{id}','Elimina un módulo','Módulos'],
  ['get','/pqrs','Lista PQRS','PQRS'],['post','/pqrs','Radica un PQRS','PQRS'],['get','/pqrs/{id}','Consulta un PQRS','PQRS'],['patch','/pqrs/{id}/status','Actualiza estado de PQRS','PQRS'],['patch','/pqrs/{id}/assign','Asigna un PQRS','PQRS'],['delete','/pqrs/{id}','Elimina un PQRS','PQRS'],['get','/pqrs/stats','Consulta estadísticas PQRS','PQRS'],['get','/pqrs/{id}/responses','Lista respuestas visibles','Respuestas'],['post','/pqrs/{id}/responses','Crea respuesta o nota interna','Respuestas'],
];
const paths = {};
for (const [method,path,summary,tag,publicRoute] of routes) {
  paths[path] ||= {};
  paths[path][method] = { tags:[tag], summary, responses:{ '200':{ description:'Operación exitosa' }, '400':{ description:'Datos inválidos' }, '401':{ description:'Autenticación requerida' }, '403':{ description:'Permiso insuficiente' }, '404':{ description:'Registro no encontrado' }, '409':{ description:'Conflicto de estado o datos' } }, ...(publicRoute ? {} : { security:[{ bearerAuth:[] }] }) };
}
module.exports = swaggerJsdoc({
  definition:{ openapi:'3.0.3', info:{ title:'PQRS API', version:'1.0.0', description:'API del taller PQRS: autenticación, seguridad por roles, usuarios, perfiles, módulos, PQRS y respuestas.' }, servers:[{ url:`${env.SWAGGER_SERVER_URL}${env.API_PREFIX}`, description:'Servidor local' }], tags:tags.map((name)=>({ name })), components:{ securitySchemes:{ bearerAuth:{ type:'http', scheme:'bearer', bearerFormat:'JWT' } } }, paths },
  apis:[],
});

