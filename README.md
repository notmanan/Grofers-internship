# Grofers-internship
 Designing and Implementing a service which allows users to get Lucky Draw Raffle tickerts and use one lucky draw raffle ticket to participate in a lucky draw game.

 Developed using MongoDB used for database management and Express for backend JS.

## Installation
1. Install Express and MongoDB.
2. Clone this repository.
3. Run `npm install` from repository.

## Begin
```
nodemon run start
```

## Usage
This solution provides all relevant API calls:
### Users:
- Get all users: `GET http://localhost:8000/users/all `
- Get user details by ID: `GET http://localhost:8000/users/id/<id>`
- Add new user: `POST http://localhost:8000/users/<id>/enrollRaffle`
> Sample body
```
{
  "name" : "Manan Gupta" (required)
  "email" : "manan17372@iiitd.ac.in" (required)
  "password" : "testPassword" (required)
}
```
- Increase User's coupon count by 1: `PATCH http://localhost:8000/users/<id>/newRaffle`
- Enroll user into a raffle draw event: `PATCH http://localhost:8000/users/<id>/enrollRaffle`



### Events:
- Get all events: `GET http://localhost:8000/events/all `
- Get event details by ID: `GET http://localhost:8000/events/id/<id>`
- Add a new event: `POST http://localhost:8000/events/add`
> Sample body
```
{
  "date" : "2020-10-02" (required)
  "reward" : "iPhone 12" (defaulted to "2000 Rupees")
}
```

- Get next event: `GET http://localhost:8000/events/nextEvent`
- Choose a winner for next event: `PATCH http://localhost:8000/events/nextEvent`
- Get winners from last week: ` GET http://localhost:8000/events/week`
