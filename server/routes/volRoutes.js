const router = require('express').Router();
const { secureLog } = require('../controllers/auth');
const controller = require('../controllers/vol');

router.route('/vol').get(secureLog, controller.getListvol);
router.route('/new_vol').get(secureLog, controller.getCreateVol);
router.route('/update_vol/:id').get(secureLog, controller.getUpdateVol);
router.route('/delete_vol/:id').get(secureLog, controller.getdeleteVol);

router.route('/new_vol').post(controller.postCreateVol);
router.route('/update_vol/:id').post(controller.postUpdatevol);


module.exports = router;