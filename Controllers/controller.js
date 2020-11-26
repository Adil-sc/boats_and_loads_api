const datastore = require('../Datastore/datastore')
const { get_boats, get_boat } = require('../Models/boatModels')
const boatModel = require('../Models/boatModels')
const loadModel = require('../Models/loadModels')

/* ------------- Begin Controller Functions ------------- */

exports.getBoats = async (req, res) => {
  let boats = await boatModel.get_boats(req)

  const appURL = `${req.protocol}://${req.get('host')}/boats`

  boats.boats.forEach((boat) => {
    boat['self'] = `${appURL}/${boat.id}`
  })

  res.status(200).json(boats)
}

exports.getBoat = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)

    if (typeof boat[0] === 'undefined') {
      res.status(404).send({ Error: 'No boat with this boat_id exists' })
    } else {
      const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      boat[0]['id'] = req.params.boat_id
      boat[0]['self'] = `${appURL}`
      res.json(boat[0])
    }
  } catch (e) {
    console.log('Error getting boat: ')
  }
}

exports.getBoatLoads = async (req, res) => {
  const boat = await boatModel.get_boat(req.params.boat_id)

  if (typeof boat[0] === 'undefined') {
    res.status(404).send({ Error: 'No boat with this boat_id exists' })
    return
  } else {
    for (let load of boat[0].loads) {
      load.self = `${req.protocol}://${req.get('host')}/loads/${load.id}`
    }

    res.status(200).send(boat[0].loads)
  }
}

exports.postBoat = async (req, res, next) => {
  if (!req.body.name || !req.body.type || !req.body.length) {
    res.status(400).send({
      Error:
        'The request object is missing at least one of the required attributes',
    })
    return
  }

  const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  try {
    const new_boat = await boatModel.post_boat(
      req.body.name,
      req.body.type,
      req.body.length
    )

    res.status(201).send({
      id: new_boat.id,
      name: req.body.name,
      type: req.body.type,
      length: req.body.length,
      loads: [],
      self: `${appURL}/${new_boat.id}`,
    })
  } catch (e) {
    console.log('Error posting boat: ', e)
  }
}

exports.deleteBoat = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)

    if (typeof boat[0] === 'undefined') {
      res.status(404).send({ Error: 'No boat with this boat_id exists' })
      return
    } else {
      //If the boat has any loads, remove the boat reference in each loads carrier propertty
      if (boat[0].loads.length >= 1) {
        for (let load of boat[0].loads) {
          const loadToUpdate = await loadModel.get_load(load.id)
          loadToUpdate[0].carrier = null
          const removeBoatFromLoad = await loadModel.assign_boat_to_load(
            loadToUpdate
          )
          const deleted_boat = await boatModel.delete_boat(req.params.boat_id)
        }
      }

      res.status(204).end()
    }
  } catch (e) {
    console.log('Error deleting boat: ', e)
  }
}

exports.putLoad = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)
    let load = await loadModel.get_load(req.params.load_id)

    let boatExists = true
    let loadExists = true

    if (typeof boat[0] === 'undefined') {
      boatExists = false
    }

    if (typeof load[0] === 'undefined') {
      loadExists = false
    }

    if (boatExists && loadExists) {
      if (load[0].carrier) {
        res
          .status(403)
          .send({ Error: 'The load is already assigned to another boat' })
        return
      } else {
        //ADD LOAD TO BOAT
        const load_info = {
          id: req.params.load_id,
          self: `${req.protocol}://${req.get('host')}/loads/${
            req.params.load_id
          }`,
        }

        boat[0].loads.push(load_info)

        //Add BOAT to LOAD
        const carrier_info = {
          id: req.params.boat_id,
          name: boat[0].name,
          self: `${req.protocol}://${req.get('host')}/boats/${
            req.params.boat_id
          }`,
        }

        load[0].carrier = carrier_info

        const assignLoadToBoat = await loadModel.assign_load_to_boat(boat)
        const assignBoatToLoad = await loadModel.assign_boat_to_load(load)
        res.status(204).end()
      }
    } else if (!boatExists || !loadExists) {
      res
        .status(404)
        .send({ Error: 'The specified boat and/or load does not exist' })
    }
  } catch (e) {
    console.log('The specified boat and/or load does not exist:', e)
  }
}

exports.removeLoad = async (req, res) => {
  try {
    let boat = await boatModel.get_boat(req.params.boat_id)
    let load = await loadModel.get_load(req.params.load_id)

    let boatExists = true
    let loadExists = true

    if (typeof boat[0] === 'undefined') {
      boatExists = false
    }

    if (typeof load[0] === 'undefined') {
      loadExists = false
    }

    if (boatExists && loadExists) {
      if (
        !boat[0].loads.find((load) => {
          return load.id === req.params.load_id
        })
      ) {
        res.status(404).send({
          Error:
            'The load you are looking to remove does not exist on this boat',
        })
        return
      } else {
        //Remove load from boat
        boat[0].loads = boat[0].loads.filter((load) => {
          return load.id != req.params.load_id
        })

        //Remove boat from load
        load[0].carrier = null
        //Add BOAT to LOAD

        const assignLoadToBoat = await loadModel.assign_load_to_boat(boat)
        const assignBoatToLoad = await loadModel.assign_boat_to_load(load)
        res.status(204).end()
      }
    } else if (!boatExists || !loadExists) {
      res
        .status(404)
        .send({ Error: '404 The specified boat and/or load does not exist' })
    }
  } catch (e) {
    console.log(
      'The specified boat and/or load you are trying to remove does not exist:',
      e
    )
  }
}

exports.postLoad = async (req, res) => {
  if (!req.body.weight || !req.body.content || !req.body.delivery_date) {
    res.status(400).send({
      Error:
        'The request object is missing at least one of the required attributes',
    })
    return
  }

  const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  try {
    const new_load = await loadModel.post_load(
      req.body.weight,
      req.body.carrier,
      req.body.content,
      req.body.delivery_date
    )

    res.status(201).send({
      id: new_load.id,
      weight: req.body.weight,
      carrier: null,
      content: req.body.content,
      delivery_date: req.body.delivery_date,
      self: `${appURL}/${new_load.id}`,
    })
  } catch (e) {
    console.log('Error posting load: ', e)
  }
}

exports.getLoad = async (req, res) => {
  try {
    let load = await loadModel.get_load(req.params.load_id)

    if (typeof load[0] === 'undefined') {
      res.status(404).send({ Error: 'No load with this load_id exists' })
    } else {
      const appURL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      load[0]['id'] = req.params.load_id
      load[0]['self'] = `${appURL}`
      res.json(load[0])
    }
  } catch (e) {
    console.log('Error getting load: ')
  }
}

exports.getLoads = async (req, res) => {
  let loads = await loadModel.get_loads(req)
  const appURL = `${req.protocol}://${req.get('host')}/loads`

  loads.loads.forEach((load) => {
    load['self'] = `${appURL}/${load.id}`
  })

  res.status(200).json(loads)
}

exports.deleteLoad = async (req, res) => {
  try {
    let load = await loadModel.get_load(req.params.load_id)

    if (typeof load[0] === 'undefined') {
      res.status(404).send({ Error: 'No load with this load_id exists' })
      return
    } else {
      //The deleted load should also be removed from the ship

      if (load[0].carrier != null) {
        let boatToUpdate = await boatModel.get_boat(load[0].carrier.id)

        boatToUpdate[0].loads = boatToUpdate[0].loads.filter((load) => {
          return load.id !== req.params.load_id
        })
        const removeLoadInfoFromBoat = await loadModel.assign_load_to_boat(
          boatToUpdate
        )
        const deleted_load = await loadModel.delete_load(req.params.load_id)
      }

      res.status(204).end()
    }
  } catch (e) {
    console.log('Error deleting load: ', e)
  }
}
