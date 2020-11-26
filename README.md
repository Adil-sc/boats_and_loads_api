## Boats and Loads API

### `Build Instructions`

```
1. yarn install
2. yarn start

```

### `Running Postman test suite`

```
1. Import the postman collection and environment JSON files found in the Tests/Postman folder into Postman
2. Run the collection
```

### `Built With`

```
- Node
```

# Project Overview

### Data Model

**Boat**

| Property Name | Notes                                       |
| ------------- | ------------------------------------------- |
| id            | The id of the boat. Generated automatically |
| name          | Name of the boat                            |
| type          | Type of the boat. Ex Yacht                  |
| length        | Length of the boat in feet                  |
| loads         | An array of loads held by the boat          |

```

Load
Property Name Notes
id The id of the load. Generated automatically
by Google Datastore
weight Int - Weight of load in lbs
carrier Embedded Entity - The boat carrying this load
content String - Describes the content of the load
delivery String - Delivery date of load
```
