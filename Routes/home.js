const router = require("express").Router();
const controller =  require('../controllers/homeController')

const getLastPledge = '/all';


router.get('/all',controller.getAll);

router.post('/create',controller.create);

router.post('/upload',controller.upload);

router.get('/last-doc',controller.getlastDoc);

router.post('/players',controller.insertMany);

router.put('/players',controller.updateMany);


module.exports = router