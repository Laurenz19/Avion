const router = require('express').Router();
const { secureLog } = require('../controllers/auth');
const controller = require('../controllers/avion');

router.route('/avion').get(secureLog, controller.getAvionList);
router.route('/new_avion').get(secureLog, controller.getCreateAvion);
router.route('/update_avion/:id').get(secureLog, controller.getUpdateAvion);
router.route('/delete_avion/:id').get(secureLog, controller.getDeleteAvion);
router.route('/detail_avion/:id').get(secureLog, controller.getAvionDetails);
router.route('/recette').get(secureLog, controller.getRecette);


router.route('/new_avion').post(controller.postCreateAvion);
router.route('/update_avion/:id').post(controller.postUpdateAvion);

module.exports = router;