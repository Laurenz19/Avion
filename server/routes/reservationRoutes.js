/* All Routes needed about order */
const router = require("express").Router();
const controller = require("../controllers/reservation");
const { secureLog } = require("../controllers/auth");

router.route("/reservation").get(secureLog, controller.getReservations);
router.route("/new_res_1of3").get(secureLog, controller.getCreateRes1of3);
router.route("/update_res_1of2/:id").get(secureLog, controller.getUpdateRes1of2);
router.route("/delete_res/:id").get(secureLog, controller.getDeleteRes);
router.route("/detail_res/:id").get(secureLog, controller.getResDetails);


router.route("/new_res_1of3").post(controller.postCreateRes1of3);
router.route("/new_res_2of3").post(controller.postCreateRes2of3);
router.route("/new_res_3of3").post(controller.postCreateRes3of3);
router.route("/update_res_1of2/:id").post(controller.postUpdateRes1of2);
router.route("/update_res_2of2/:id").post(controller.postUpdateRes2of2);

module.exports = router;