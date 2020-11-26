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

/* ------------- Begin Load Model Functions ------------- */

post_load = (weight, carrier = null, content, delivery_date) => {
  const key = datastore.key(LOADS)
  const new_load = {
    weight: weight,
    carrier: carrier,
    content: content,
    delivery_date: delivery_date,
  }
  return datastore.save({ key: key, data: new_load }).then(() => {
    return key
  })
}

get_loads = (req) => {
  let q = datastore.createQuery(LOADS).limit(3)
  const results = {}
  if (Object.keys(req.query).includes('cursor')) {
    q = q.start(req.query.cursor)
  }
  return datastore.runQuery(q).then((entities) => {
    // console.log(entities)
    results.loads = entities[0].map(fromDatastore)
    if (entities[1].moreResults !== datastore.NO_MORE_RESULTS) {
      results.next = `${req.protocol}://${req.get('host')}${
        req.baseUrl
      }?cursor=${entities[1].endCursor}`
    }

    return results
  })
}

get_all_loads = () => {
  const q = datastore.createQuery(LOADS)
  return datastore.runQuery(q).then((entities) => {
    return entities[0].map(fromDatastore)
  })
}

get_load = (load_id) => {
  const key = datastore.key([LOADS, parseInt(load_id, 10)])
  const result = datastore.get(key).then((res) => {
    return res
  })

  return result
}

delete_load = (load_id) => {
  const key = datastore.key([LOADS, parseInt(load_id, 10)])
  return datastore.delete(key)
}

assign_boat_to_load = (load) => {
  const load_id = load[0][Datastore.KEY].id

  //   console.log('load payload >>>', load[0])
  const key = datastore.key([LOADS, parseInt(load_id, 10)])

  return datastore.save({ key: key, data: load[0] }).then(() => {
    return key
  })
}

assign_load_to_boat = (boat) => {
  const boat_id = boat[0][Datastore.KEY].id

  const key = datastore.key([BOATS, parseInt(boat_id, 10)])

  return datastore.save({ key: key, data: boat[0] }).then(() => {
    return key
  })
}

/* ------------- End Model Functions ------------- */

module.exports = {
  post_load,
  get_load,
  get_loads,
  delete_load,
  assign_boat_to_load,
  assign_load_to_boat,
  get_all_loads,
}
