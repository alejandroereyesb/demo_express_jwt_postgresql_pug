const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');
const passport = require('passport');

router.get('/register', (req, res) => res.render('register'));
router.post('/register', register);

// Redirigir de / a /login
router.get('/', (req, res) => res.redirect('/login'));

router.get('/login', (req, res) => res.render('login'));
router.post('/login', login);

// Ruta para iniciar sesión con Google
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'], prompt: 'select_account' }));

// Callback de Google
router.get("/google/callBack?",
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.cookie('token', req.user.token, { httpOnly: true });
        const redirectUrl = req.user.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        res.redirect(redirectUrl);
    }
);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
            res.clearCookie('token'); // Eliminar el token JWT
            res.redirect('/login');
        });
    });
});

router.get('/user/dashboard', authMiddleware, authorizeRole('user'), (req, res) => {
    res.render('userDashboard', { role: 'user' });
});

router.get('/admin/dashboard', authMiddleware, authorizeRole('admin'), (req, res) => {
    res.render('adminDashboard', { role: 'admin' });
});

module.exports = router;
