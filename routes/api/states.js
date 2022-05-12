const express = require("express");
const router = express();
const stateController = require("../../controllers/stateController");

router.route("/").get(stateController.getStates);
router.route("/:state").get(stateController.getState);
router.route("/:state/funfact")
    .get(stateController.getFunFact)
    .post(stateController.createNewFunFact)
    .patch(stateController.updateFunFact)
    .delete(stateController.deleteFunFact);
router.route("/:state/capital").get(stateController.getStateCapital);
router.route("/:state/nickname").get(stateController.getStateNickname);
router.route("/:state/population").get(stateController.getStatePopulation);
router.route("/:state/admission").get(stateController.getStateAdmission);


module.exports = router;
