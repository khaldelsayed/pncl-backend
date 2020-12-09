# Pncl questions search

### Endpoints
-  `GET server-url/api/questions/search?q=[topic name]` To search for questions with topic name
-  `GET server-url/api/topics/load` To load topics to database
-  `GET server-url/api/questions/load` To load questions to database

### Loading topics and questions to database
- First call the endpoint to load topics and wait until all topics are completely loaded in the database.
- Call the endpoint to load questions.

### Note
```
Heroku process that hosts the app, after a period of time as idle, it stops working.
So with the first API request, it will take some time to start up again then it works fine. 

```
### Heroku server endpoints
- https://pncl-backend-app.herokuapp.com/api/questions/search?q=Inheritance
- https://pncl-backend-app.herokuapp.com/api/topics/load
- https://pncl-backend-app.herokuapp.com/api/questions/load

### Heroku Endpoints examples for search questions
- https://pncl-backend-app.herokuapp.com/api/questions/search?q=Cell%20Structure%20and%20Organisation
- https://pncl-backend-app.herokuapp.com/api/questions/search?q=Nutrition%20in%20Humans
- https://pncl-backend-app.herokuapp.com/api/questions/search?q=Respiration%20in%20Humans







