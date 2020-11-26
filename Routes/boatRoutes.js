const express = require('express')
const router = express.Router()
const {
  getBoats,
  getBoat,
  postBoat,
  putLoad,
  deleteBoat,
  removeLoad,
  getBoatLoads,
} = require('../Controllers/controller')

router.get('/', getBoats)

router.get('/:boat_id', getBoat)

router.get('/:boat_id/loads', getBoatLoads)

router.post('/', postBoat)

router.put('/:boat_id/loads/:load_id', putLoad)

router.delete('/:boat_id/loads/:load_id', removeLoad)

router.delete('/:boat_id', deleteBoat)

module.exports = { router }
