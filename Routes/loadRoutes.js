const express = require('express')
const router = express.Router()
const {
  postLoad,
  getLoads,
  deleteLoad,
  getLoad,
} = require('../Controllers/controller')

router.get('/', getLoads)

router.get('/:load_id', getLoad)

router.post('/', postLoad)

router.delete('/:load_id', deleteLoad)

module.exports = { router }
