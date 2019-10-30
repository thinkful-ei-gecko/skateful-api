Skateful API
https://skateful-api.herokuapp.com/api

URL
/skaters

Method
GET

URL Params
None

Data Params
None

Success Response
Code: 200
Content: List of all submitted skaters

Error Response 
Code: 500
______________________________

URL
/skaters/:skaterId

Method
GET

URL Params
skaterId= {integer}

Data Params
None

Success Response
Code: 200
Content: {
        "id": 1,
        "name": "Badri",
        "location": "Los Angeles",
        "instagram": "badri",
        "date_created": "2019-10-25T18:59:52.747Z",
        "bio": "",
        "img_url": "https://i.ibb.co/nnK0MQN/Screen-Shot-2019-10-17-at-11-08-47-AM.png",
        "up_votes": 67
    }

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/comments

Method
GET

URL Params
id={integer}

Data Params
None

Success Response
Code: 200
Content: List of all submitted comments

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/comments/:commentsId

Method
GET

URL Params
skaterId = {integer}
commentId = {integer}

Data Params
None

Success Response
Code: 200
Content: One comment

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters

Method
POST

URL Params
None

Data Params
at least: 
  { 
  name: "some name",
  location: "somewhere"
  }
  

Success Response
Code: 200
Content: {created skater}

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/comments/

Method
POST

URL Params
skaterId= {integer}

Data Params
{ 
skaterId: {integer}
comment: "some comment"
}

Success Response
Code: 200
Content: submitted comment

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId

Method
DELETE

URL Params
skaterId= {integer}

Data Params
None

Success Response
Code: 204

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/comments/:commentId

Method
DELETE

URL Params
skaterId= {integer}
commentId= {integer}

Data Params
None

Success Response
Code: 204

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/comments/:commentId

Method
PATCH

URL Params
skaterId= {integer}
commentId= {integer}

Data Params
{ comment: "new comment" }

Success Response
Code: 201
Content: Updated comment

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________

URL
/skaters/:skaterId/

Method
PATCH

URL Params
skaterId= {integer}
commentId= {integer}

Data Params
can change any properties of skater
{ name: "new name" }

Success Response
Code: 201
Content: Updated skater

Error Response 
Code: 401
Content: "error, unauthorized request"
______________________________
