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

| Property Name | Type   | Notes                                       |
| ------------- | ------ | ------------------------------------------- |
| id            | Int    | The id of the boat. Generated automatically |
| name          | String | Name of the boat                            |
| type          | String | Type of the boat. Ex Yacht                  |
| length        | Int    | Length of the boat in feet                  |
| loads         | Array  | An array of loads held by the boat          |

**Load**

| Property Name | Type           | Notes                                       |
| ------------- | -------------- | ------------------------------------------- |
| id            | Int            | The id of the boat. Generated automatically |
| weight        | Int            | Weight of load in lbs                       |
| carrier       | Embeded Entity | The boat carrying this load                 |
| content       | String         | content of the load                         |
| delivery      | String         | Delivery date of load                       |

### Example Calls and Responses

## Create a Boat

## Create a Boat

    POST /boats

**Request parameters**

- None

**Request Body**

- Required

**Request Body Format**

- JSON

**Request attributes**

- Name
- Type
- Length

**Request body example**

    {
    "name" : "Odyssey" ,
    "type" : "Yatch" ,
    "length" : 99
    }

**Response Statuses**
|Outcome| Status Code |
|--|--|
|Success |201 |
|Failure|400|

**Response - Success**

    {
    "id" : "5680529164730368" ,
    "name" : "Odyssey" ,
    "type" : "Yatch" ,
    "length" : 99 ,
    "loads" : [],
    "self" : "http://localhost:8080/boats/5680529164730368"
    }

**Response - Failure**

    {
    "Error" : "The request object is missing at least one of the required attributes"
    }
