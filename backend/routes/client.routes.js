const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/client.controller');

router.post('/', ctrl.createClient);
router.get('/', ctrl.getClients);
router.get('/:id', ctrl.getClientById);
router.put('/:id', ctrl.updateClient);
router.delete('/:id', ctrl.deleteClient);
router.get('/test', (req, res) => {
  res.send("Client route working");
});
module.exports = router;
