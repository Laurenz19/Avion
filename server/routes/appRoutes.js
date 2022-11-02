/*App Routes*/
const router = require('express').Router();
const auth = require('../controllers/auth');

router.get('/login', auth.getlogin);
router.get('/', auth.getlogin);
router.get('/register', auth.getRegister);
router.get('/logout', auth.logout);
router.get('/home', auth.secureLog, auth.test)

router.post('/login', auth.postLogin);
router.post('/register', auth.postRegister);


module.exports = router;