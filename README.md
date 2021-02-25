# Grofers-internship
 Designing and Implementing a service which allows users to get Lucky Draw Raffle tickerts and use one lucky draw raffle ticket to participate in a lucky draw game.

 Developed using MongoDB used for database management and Express for backend JS.

## Installation
1. Install NodeJS and MongoDB.
2. Clone this repository.
3. Run `npm install` from repository.

## Run Server
```
nodemon run start
```

## Usage
Refer to API Diagram as a quick reference guide to all the use cases. All API calls developed:
### Users:
- Get all users: `GET http://localhost:8000/users/ `
- Get user details by ID: `GET http://localhost:8000/users/<id>`
- Add new user: `POST http://localhost:8000/users/<id>/enrollRaffle`
> Sample request body
```
{
  "name" : "Manan Gupta" (required)
  "email" : "manan17372@iiitd.ac.in" (required)
}
```
- Increase User's coupon count by 1: `PUT http://localhost:8000/users/<id>/newRaffle`
- Enroll user into a raffle draw event: `PUT http://localhost:8000/users/<id>/enrollRaffle`



### Events:
- Get all events: `GET http://localhost:8000/events/ `
- Get event details by ID: `GET http://localhost:8000/events/<id>`
- Get next upcoming event: `GET http://localhost:8000/events?nextEvent=T`
- Add a new event: `POST http://localhost:8000/events/`
> Sample request body
```
{
  "date" : "2020-10-02" (required)
  "reward" : "iPhone 12" (defaulted to "2000 Rupees")
}
```
- Get winners from last week: ` PUT http://localhost:8000/events/<id>/winners`
