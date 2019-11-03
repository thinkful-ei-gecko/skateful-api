Skateful API
https://skateful-api.herokuapp.com/api

Hello! Welcome to Skateful, by badri narayan

live link: https://skateful.badri-narayan.now.sh
frontend: https://github.com/thinkful-ei-gecko/skateful

this app was made for my first capstone project at Thinkful.

The goal for this app is to upload custom skater profiles and compete to see which skater gets the most up-votes.
Users can also comment on each skater, and have discussion if they'd like!

You can register for a new account, or you can log-in to the admin profile using the credentials: 'admin', 'password'
or to see how regular accounts work, you can create your own or log in using 'badri', 'password'

![Image of Skateful](https://i.ibb.co/mRH24GX/Screen-Shot-2019-10-25-at-7-05-40-AM.png)


The components can be re-used for other purposes as well, simply re-name the fields accordingly.
The Card component iterates through the CardsList component, ie the Cards are in the CardsList
The NewCard Component Creates a new Card.

All of the Components are organized as best as I could, separated in different folders, each containing their appropriate .css files. Some general CSS (CSS that doesn't  carries over the other components. 

Tech Stack: PERN, Testing: Chai, Jest, Mocha

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
