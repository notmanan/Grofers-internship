# Grofers-internship
 Designing and Implementing a service which allows users to get Lucky Draw Raffle tickets and use each lucky draw raffle ticket to participate in a different lucky draw game.

## Developement Stack:
- MongoDB used for database management
- Express for backend JS

## Installation
1. Install NodeJS and MongoDB.
2. Clone this repository.
3. Run `npm install` from repository.

## Run Server
```
nodemon run start
```

## Usage
Refer to the [API Diagram](https://github.com/notmanan/Grofers-internship/blob/master/API%20Diagram.png) and [API specification](https://github.com/notmanan/Grofers-internship/blob/master/API%20Specification.pdf) as a quick reference guide to all the use cases. All API calls developed:
### Users:
- Get all users: `GET http://localhost:8000/users/ `
- Get user details by ID: `GET http://localhost:8000/users/<id>`
- Add new user: `POST http://localhost:8000/users/``
Sample request body:
```
{
  "name" : "Manan Gupta"
  "email" : "email@gmail.com"
}
```
- Increase User's coupon count by 1: `PUT http://localhost:8000/users/<id>/newRaffle`
- Enroll user into a raffle draw event: `PUT http://localhost:8000/users/<id>/enrollRaffle`



### Events:
- Get all events: `GET http://localhost:8000/events/ `
- Get event details by ID: `GET http://localhost:8000/events/<id>`
- Get next upcoming event: `GET http://localhost:8000/events?nextEvent=True`
- Add a new event: `POST http://localhost:8000/events/`
Sample request body:
```
{
  "date" : "2020-10-02"
  "reward" : "iPhone 12"
}
```

- Declare a winner for an event: ` PUT http://localhost:8000/events/<id>/declareWinner`
- Get winners from last week: ` GET http://localhost:8000/events?winners=True`
