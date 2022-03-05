'use strict';

const express = require("express");
const movies = require("./MovieData/data.json");
require("dotenv").config();
const axios = require("axios");
const pg = require("pg");
const cors =require('cors')
const app = express();

app.use(cors());

const APIKEY = process.env.APIKEY;
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
// const client = new pg.Client(DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false}
});

function Movies(id,title,release_date, poster_path, overview,){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
};
//
app.use(express.json());
app.get('/', movieHandler);
app.get('/favorite', favoriteHandler);
app.get('/trending', trendingHandler);
app.get("/search", searchHandler);
app.get("/popular", popularHandler);
app.get("/upcoming", upcomingHandler);
app.get("/getMovies", getMoviesHandler);
app.post("/addMovie", addMovieHandler);
app.put('/UPDATE/:id', updateMovieHandler);
app.delete('/DELETE/:id', deleteMovieHandler);
app.get('/getMovie/:id', getMovieHandler);
app.use("*", notFoundHandler);
app.use(errorHandler);


function errorHandler (err, req, res, next) {
    let error ={
        status:500,
        err:'Sorry, something went wrong'
    };
    res.status(500).send(error)
}
function movieHandler(req, res){
    let result = [];
    movies.data.forEach((value) => {
        let Movie1 = new Movies(value.title,value.poster_path, value.overview);
        result.push(Movie1);
    });
    return res.status(200).json(result);
};
function favoriteHandler(req, res){
    return res.status(201).json("Welcome to Favorite Page");
};
function trendingHandler(req,res){
    let result = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`)
    .then(apiResponse => {
        apiResponse.data.results.map(value => {
            let movei1 = new Movies(value.id,value.title,value.release_date,value.poster_path, value.overview);
            result.push(movei1);
        })
        return res.status(200).json(result);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}
function searchHandler(req,res){
    const search = req.query.query
    let results = [];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${search || "The"}&page=2`)
    .then(apiResponse=>{
        apiResponse.data.results.map(value => {
            let movei1 = new Movies( value.id || "N/A",value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A",value.overview || "N/A");
            results.push(movei1);  
        });
        return res.status(200).json(results);
    }).catch(error => {
        errorHandler(error, req, res);
    })
}
function popularHandler(req,res){
    let result = [];
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`)
    .then(apiResponse => {
        apiResponse.data.results.map(value => {
            let movei1 = new Movies(value.id,value.title,value.release_date,value.poster_path, value.overview);
            result.push(movei1);
        })
        return res.status(200).json(result);
    }).catch(error => {
        errorHandler(error, req, res);
    })

}
function upcomingHandler(req, res) {
    let upcoming = [];
    axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&language=en-US&page=1`)
    .then((value) => {
        value.data.results.forEach((value) => {
        let movei1 = new Movies(value.id,value.title,value.release_date,value.poster_path,value.overview);
            upcoming.push(movei1);
        });
        return res.status(200).json(upcoming);
    })
    .catch((error) => {
        errorHandler(error, req, res);
    });
}
function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = `INSERT INTO addmovie(title, release_date, poster_path, overview,comment) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    const values = [movie.title, movie.release_date,movie.poster_path,movie.overview,movie.comment];
    
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
}  
function getMoviesHandler(req, res) {
        const sql = `SELECT * FROM addmovie;`;
        
        client.query(sql).then((result) => {
        return res.status(200).json(result.rows);
        }).catch((error) => {
        errorHandler(error, req, res);
    });
}
function updateMovieHandler(req, res) {
    const id = req.params.id;
    const movie = req.body;
    const sql = `UPDATE addmovie SET title=$1, release_date=$2,poster_path=$3, overview=$4, comment=$5 WHERE id=$6 RETURNING *`;
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}
function deleteMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM addmovie WHERE id=$1;`;
    const values = [id];
    client.query(sql, values).then(() => {
        return res.status(204).json({});
    })
    .catch((error) => {
        errorHandler(error, req, res);
    });
}
function getMovieHandler(req, res) {
    const id = req.params.id;
    let sql = `SELECT * FROM addmovie WHERE id=$1;`;
    const values = [id];
    client.query(sql,values).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        errorHandler(error, req, res)
    });
}
function notFoundHandler(req, res){
    return res.status(404).send("Page Not Found");
}
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listen on ${PORT}`);
    });
});
