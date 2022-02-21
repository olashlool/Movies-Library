'use strict';

const express = require("express");
const movies = require("./MovieData/data.json");
const app = express();

function Movies(title, poster_path, overview,){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
};

app.get('/', movieHandler);
app.get('/favorite', favoriteHandler);

function movieHandler(req, res){
    let result = [];
    movies.data.forEach((value) => {
        let Movie1 = new Movies(value.title,value.poster_path, value.overview);
        result.push(Movie1);
    });
    return res.json(result);
};

function favoriteHandler(req, res){
    return res.json("Welcome to Favorite Page");
};

app.listen(3000, () => {
    console.log("Listen on 3000");
});
