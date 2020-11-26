const { Datastore } = require('@google-cloud/datastore')
const datastore = new Datastore()

const BOATS = 'Boats'
const LOADS = 'Loads'
const BOATLOADS = 'BoatLoads'

module.exports = {
  datastore,
  Datastore,
  BOATS,
  BOATLOADS,
  LOADS,
}
