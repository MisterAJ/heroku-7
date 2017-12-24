Treehouse Techdegree Project 12 - Capstone Project
The app features an index page of body therapies in the North Charlotte Area.
The app features an Express Server, Node.JS, Mongo DB, and Bootstrap CSS.
The app will be hosted on the Heroku Site.
From the index page a detail link can be clicked to see more details about
the therapy. The app features a log in which authenticates through Facebook.
The app features a way to add, modify and delete user and therapy data by an administrator.
The Therapy List and User List (which link to edit pages) are only displayed for user's that are 
logged in who have admin rights set to true.
Logged in users and admin users are tracked using req.session data.
All log in and signup links go to facebook for facebook authentication.
I don't allow for any email or user name changes. User name and email come
from Facebook and are not changed. Only user admin rights can be changed. 
The app shows a Twitter page which shows the last 5 tweets from the 
Website Twitter Page which would be listed as Search Therapy.

## To Start the Website
From your console, install all dependencies that are listed
in the package.json file.
Next, run: npm start

