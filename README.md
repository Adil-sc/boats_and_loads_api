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
- Google Cloud Platform
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

## Supported Requests

| Endpoints                            | Description                |
| ------------------------------------ | -------------------------- |
| POST /boats                          | create a new boat          |
| GET /boats/:boat_id                  | view a specifc boat        |
| GET /boats                           | view all boats (paginated) |
| DELETE /boats/:boat_id               | delete a boat              |
| POST /loads                          | create a load              |
| GET /boats                           | view all loads (paginated) |
| DELETE /loads/:load_id               | delete a load              |
| PUT /boats/:boat_id/loads/:load_id   | assign load to a boat      |
| DELETE /boats:boat_id/loads/:load_id | remove a load from a boat  |
| GET /boats/:boat_id/loads            | view all loads for a boat  |

Note pagination is supported and 3 results are returned per page

## Example Calls and Responses

### Create a Boat

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

### View a Boat

    GET /boats/:boat_id

**Request parameters**

- boat_id

**Request Body**

- None

**Request Body Format**

- JSON

**Response Statuses**
|Outcome| Status Code |
|--|--|
|Success |201 |
|Failure|404|

**Response - Success**

    {
        "type" : "Yatch" ,
        "name" : "Odyssey" ,
        "length" : 99 ,
        "loads" : [],
        "id" : "5680529164730368" ,
        "self" : "http://localhost:8080/boats/5680529164730368"
    }

**Response - Failure**

    {
        "Error" : "No boat with this boat_id exists"
    }
