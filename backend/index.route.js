const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const scheduleRoutes = require('./server/schedule/schedule.route');
const { valitateJwt } = require('./server/middleware/jwt');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/new/users', userRoutes);

// aqui comeca a validacao do JWT
router.use('/', valitateJwt);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /schedule
router.use('/schedule', scheduleRoutes);

module.exports = router;
