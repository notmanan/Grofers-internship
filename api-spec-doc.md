|Request Type| Endpoints     | Description | Parameter | Parameter Type |
|:--| :------------- |:------------|:-------|  :------------|
|GET|/users/all                 | Get all users                             |||
|GET| /users/id/{id}            | Get user details by ID                    |id|String|        
|POST| /users/add                | Add new user                             |||
|PATCH| /users/{id}/newRaffle     | Increase User's coupon count by 1       |id|String| 
|PATCH| /users/{id}/enrollRaffle  | Enroll user into a raffle draw event    |id|String|
|GET| /events/all               | Get all events                            |||
|GET| /events/id/{id}           | Get events by ID                          |id|String|   
|POST| /events/add               | Create New Event                         ||| 
|GET| /events/nextEvent         | Get Next Event                            ||| 
|GET| /events/week              | Get winners from last week                |||    


