require("dotenv").config();

// variables
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var title = process.argv.slice(3).join("+");
var params = {screen_name: 'Andrea Paula'};




// switch statement which takes one of the commands and runs he apporiate function.
switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThis(title);
        break;
    case "movie-this":
        movieThis(title);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log(
            "\r\n" +
            "Welcome to LIRI, the Language Interpretation and Recognition Interface. " +
            "\r\n" +
            "\r\n" +
            "Type one of the following commands into the command line: " +
            "\r\n" +
            "\r\n" +
            "For a list of tweets, type : node liri.js my-tweets " +
            "\r\n" +
            "\r\n" +
            "For song information, type: node liri.js spotify-this-song <any song name> " +
            "\r\n" +
            "\r\n" +
            "For movie information, type: node liri.js movie-this <any move name> " +
            "\r\n" +
            "\r\n" +
            "For a surprise type, node liri.js do-what-it-says " +
            "\r\n" +
            "\r\n" +
            "To see the instructions again type, node liri.js " +
            "\r\n" +
            "\r\n"

        );
}

// my tweets function, displays last 20 tweets.
function myTweets() {
client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                var logTwitterData =
                    "\r\n" +
                    "------------------------------------------" +
                    "\r\n" +
                    "@" + data[i].screen_name +
                    " " + data[i].created_at +
                    " " + data[i].text +
                    "\r\n" +
                    "------------------------------------------" +
                    "\r\n";
                console.log(logTwitterData);
                addToLog(logTwitterData);
            }
        } else {
            console.log("Error: " + error);
            return;
        }
    });
}

// Spotify this song
//if song title is specified, then it is set to White and Nerdy by weird al.
function spotifyThis(title) {
    if (!title) {
        title = "White and Nerdy";
    }
    spotify.search({
        type: "track",
        query: "\"" + title + "\""
    }, function (error, data) {
        if (!error) {
            var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                        "------------------------------" + "\r\n" +
                        "ARTIST NAME: " + songInfo[i].artists[0].name + "\r\n" +
                        "SONG NAME: " + songInfo[i].name + "\r\n" +
                        "PREVIEW LINK: " + songInfo[i].preview_url + "\r\n" +
                        "ALBUM NAME: " + songInfo[i].album.name + "\r\n" +
                        "------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    addToLog(spotifyResults);
                }
            }
        } else {
            console.log("Error :" + error);
            return;
        }
    });
};


// Movie this using OMDB
//if movie title is specified, then it is set to The Goonies.
function movieThis(title) {
    if (!title) {
        title = "The Goonies";
        console.log("GOONIES NEVER SAY DIE!");
    }
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + title, function (error, response, body) {
        console.log("------------------------------------------");
        if (!error && response.statusCode === 200) {
            var info = JSON.parse(body);
            var movieResults =
                "\r\n" +
                "\n" + "MOVIE TITLE: " + info.Title +
                "\n" + "YEAR OF RELEASE: " + info.Year +
                "\n" + "IMDB RATING: " + info.imdbRating +
                "\n" + "ROTTEN TOMATOES RATING: " + info.tomatoRating +
                "\n" + "COUNTRY: " + info.Country +
                "\n" + "LANGUAGE: " + info.Language +
                "\n" + "PLOT: " + info.Plot +
                "\n" + "ACTORS: " + info.Actors +
                "\n";
            console.log("------------------------------------------");
            console.log(movieResults);
            addToLog(movieResults);
        } else {
            console.log("Error: " + error);
            return;
        }
    });
}


// Do what it says, reads a txt file and using that info with the spotify function.
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (!error) {
            doItResults = data.split(",");
            console.log("------------------------------------------");
            console.log("DO IT: " + doItResults);
            spotifyThis(doItResults[1]);
            console.log("------------------------------------------");
        } else {
            console.log("Error: " + error);
        }
    });
}

// outputs all data to log.txt
function addToLog(data) {
    fs.appendFile("log.txt", data, error => {
        if (error) {
            throw error;
        }
    });
}

// alerts user if command is valid
if (command !== "my-tweets" && command !== "spotify-this-song" && command !== "movie-this" && command !== "do-what-it-says") {
    console.log("I'm sorry, I don't understand your command. Please try again.");
} else {
    console.log("Here are your results.") +
    "\r\n";
}