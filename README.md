# Movies-Library - Project Version 1
**Author Name**: Ola M AL-Shlool
## WRRC
![image](/assest/WRRC4.png)
## Overview
build server
## Getting Started
The Basic of step:

- After clone repo you should install all packages npm through the command npm install
- run the server by calling 'node server.js'
- in your browser open "http://localhost:15222/" to see the home page that loads th data json file
- open "http://localhost:15222/favorite" to see the favorite page
- open "http://localhost:15222/trending" to see the trending page result
- open "http://localhost:15222/search" to see the search page result
- open "http://localhost:15222/popular" to see the popular page result
- open "http://localhost:15222/upcoming" to see the upcoming page result
- Use "http://localhost:15222/getMovies" to get all movies from the database.
- Send POST request to "http://localhost:15222/addMovie" with json body containing the movie info to be added with your personal comments
- Send a PUT Requset to "http://localhost:15222/UPDATE/:id" to update your comments with json body containing the new comments.
- Send a DELETE Request to "http://localhost:15222/DELETE/:id" to delete movie from database by its id.
- Use "http://localhost:15222/getMovie/id" to get a movie from database by id.
## Project Features
- Movies Info
- Search Movies
- Popular Movies
- upcoming Movies
- Get Movies
- Add Movie
- Search for movies by id
- UPDATE Movie
- DELETE Movie
