const { User, UserRole, Role, UserStatus } = require('../models');
const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/response');
async function authRequired(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return fail(res, 401, 'Token de acceso requerido');
  try {
    const payload = verifyToken(token);
    const user = await User.findByPk(payload.user_id, { include: [{ model: UserStatus, as: 'status' }] });
    const userRole = await UserRole.findOne({ where: { id: payload.user_role_id, userId: payload.user_id, statusId: 1 }, include: [{ model: Role, as: 'role' }] });
    if (!user || user.status?.name !== 'active' || !userRole || !userRole.role?.isActive) return fail(res, 401, 'Sesión inválida o inactiva');
    req.auth = { user_id: user.id, user_role_id: userRole.id, role_id: userRole.roleId, role: userRole.role.name, username: user.username };
    next();
  } catch (error) {
    return fail(res, 401, 'Token inválido o vencido');
  }
}
module.exports = { authRequired };
