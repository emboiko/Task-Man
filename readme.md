# Task-Man

[http://emboiko-task-man.herokuapp.com/]()

Manage all your important tasks with this JWT-secured, JSON-based web API. Powered by Node, Express, and MongoDB - tested with Jest / Supertest. 

###### Currently hosted on a free Heroku dyno, which needs to spin up after 30 minutes of inactivity

<div align="center">
	<img src="http://www.emboiko.com/img/portfolio/task.png">
</div>


## User-Routes:

**POST** /users 
<br>
*No auth*

Create a new user with a name, email, password, and optionally an age
<br>Send a welcome email via [SendGrid](https://sendgrid.com/) API

---

**POST** /users/login 
<br>
*No auth*

Login with an email & password, sends a JWT to the client

---

**POST** /users/logout 
<br>
*JWT auth*

Logout user & remove their JWT

---

**POST** /users/logoutAll 
<br>
*JWT auth*

Logout user from all sessions & remove their JWTs

---

**GET** /users/me 
<br>
*JWT auth*

Return user profile

---

**PATCH** /users/me 
<br>
*JWT auth*

Update user profile by "name", "email", "password", and/or "age"

---

**DELETE** /users/me 
<br>
*JWT auth*

Delete user profile
<br>Send a cancellation email via SendGrid API

---

**GET** /users/:id/avatar
*<br>No Auth*

Find and return a given user's avatar by ID

---

**POST** /users/me/avatar 
<br>
*JWT auth*

Upload an avatar
<br>Images are resized to 250px square PNGs with [Sharp](https://www.npmjs.com/package/sharp) and uploaded to the DB with [Multer](https://www.npmjs.com/package/multer)

---

**DELETE** /users/me/avatar 
<br>
*JWT auth*

Delete user avatar


## Task-Routes:

**POST** /tasks 
<br>
*JWT auth*

Create a new task with a description & completion status

---

**GET** /tasks 
<br>
*JWT auth*

Paginate & sort by completion

---

**GET** /tasks/:id 
<br>
*JWT auth*

Return the task with the specified ID

---

**PATCH** /tasks/:id 
<br>
*JWT auth*

Update task by ID with description or completion

---

**DELETE** /tasks/:id 
<br>
*JWT auth*

Delete task by ID


