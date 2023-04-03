const { expressjwt: expressJwt } = require('express-jwt');
const db = require('../utils/db');

module.exports = authorizer;

function authorizer(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User') 
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === 'string') {
      roles = [roles];
  }

  return [
      // authenticate JWT token and attach user to request object (req.user)
      expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),

      // authorize based on user role
      async (req, res, next) => {
          const user = await db.User.findById(req.auth.id);
          if (!user || (roles.length && !roles.includes(user.role.toLocaleLowerCase()))) {
              // account no longer exists or role not authorized
              return res.status(401).json({ message: 'Unauthorized' });
          }
          // authentication and authorization successful
          req.auth.role = user.role;
          next();
      }
  ];
}