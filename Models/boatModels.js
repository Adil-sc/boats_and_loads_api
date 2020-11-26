const express = require('express')
const router = express.Router()

const {
  Datastore,
  datastore,
  BOATS,
  LOADS,
  BOATLOADS,
} = require('../Datastore/datastore')

function fromDatastore(item) {
  item.id = item[Datastore.KEY].id
  return item
}

/* ------------- Begin Boat Model Functions ------------- */

add_to_BoatLoad = (boat_id, load_id) => {
  const key = datastore.key(BOATLOADS)
  const new_boatLoad = { boat_id: boat_id, load_id: load_id }
  return datastore.save({ key: key, data: new_boatLoad }).then(() => {
    return key
  })
}

post_boat = (name, type, length, loads = []) => {
  const key = datastore.key(BOATS)
  const new_boat = { name: name, type: type, length: length, loads: loads }
  return datastore.save({ key: key, data: new_boat }).then(() => {
    return key
  })
}

get_boats = (req) => {
  let q = datastore.createQuery(BOATS).limit(3)
  const results = {}
  if (Object.keys(req.query).includes('cursor')) {
    q = q.start(req.query.cursor)
  }
  return datastore.runQuery(q).then((entities) => {
    // console.log(entities)
    results.boats = entities[0].map(fromDatastore)
    if (entities[1].moreResults !== datastore.NO_MORE_RESULTS) {
      results.next = `${req.protocol}://${req.get('host')}${
        req.baseUrl
      }?cursor=${entities[1].endCursor}`
    }

    return results
  })
}

get_all_boats = () => {
  const q = datastore.createQuery(BOATS)
  return datastore.runQuery(q).then((entities) => {
    return entities[0].map(fromDatastore)
  })
}

get_boat = (boat_id) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  const result = datastore.get(key).then((res) => {
    return res
  })

  return result
}

patch_boat = (boat_id, name, type, length) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  const boat = { name: name, type: type, length: length }
  return datastore.save({ key: key, data: boat }).then(() => {
    return key
  })
}

delete_boat = (boat_id) => {
  const key = datastore.key([BOATS, parseInt(boat_id, 10)])
  return datastore.delete(key)
}

/* ------------- End Model Functions ------------- */

module.exports = {
  post_boat,
  get_boats,
  get_boat,
  patch_boat,
  delete_boat,
  get_all_boats,
}
