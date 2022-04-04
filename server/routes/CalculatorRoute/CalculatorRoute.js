const { Router } = require('express');
const CalculatorController = require('../../controllers/CalculatorController');

const router = Router();

router.get('/main', CalculatorController.calcMain);
router.get('/inverse', CalculatorController.calcInverse);
router.get('/percent', CalculatorController.calcPercent);

module.exports = router;