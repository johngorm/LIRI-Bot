//Node file that emulates SIRI, only using written language as input - hence LIRI
'use strict'
console.assert(process.argv[2], 'No instruction provided in command line. ');
const userCommand = process.argv[2];
const option = process.argv.splice(3).join(' ');   

const twitter = require('twitter');
const twitter_exports = require('./keys.js'); 
const twitterKeys = twitter_exports.twitterKeys;
const client = new twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
});

const spotify = require('spotify');

const request = require('request');

const fs = require('fs');

const logFile = 'log.txt';

parseInstruction(userCommand, option);

function parseInstruction(instruction, option) {
    if (instruction === 'my-tweets') {
        queryTwitter();
    } else if (instruction === 'spotify-this-song') {
        var song = 'The+Sign+Ace+of+Base';  //Default song if none provided by user
        if (option) {
            song = option.split(' ').join('+');
        }
        querySpotify(song);

    } else if (instruction === 'movie-this') {
        var movie = 'Mr.+Nobody';   //Default movie if none provided by user
        if (option) {
            movie = option.split(' ').join('+');
        }
        queryOMDB(movie);

    } else if (instruction === 'do-what-it-says') {
        fs.readFile('./random.txt', 'utf8', (error, data) => {
            if (error) {
                console.error('Error occured: ', error);
            } else {
                //Progarm can run random.txt even with multiple commands
                const instructionsText = data.split(',');
                var ii = 0;
                while (ii < instructionsText.length) {
                    let thisInstruction = instructionsText[ii].trim();
                    let nextInstruction;
                    (ii+ 1) < instructionsText.length ? nextInstruction = instructionsText[ii + 1].trim() : nextInstruction = null;
                    if (thisInstruction === 'my-tweets' || ['my-tweets', 'spotify-this-song', 'movie-this'].includes(nextInstruction) ) {
                        //User calls for tweets or they want a song/movie info but failed to provide a title after the instruction
                        parseInstruction(thisInstruction);
                        ii++;
                    } else {
                        parseInstruction(thisInstruction, nextInstruction);
                        ii += 2;
                    }
                }
            }
        });

    } else {
        console.log('Invalid Instruction');
        return -1;
    }
};

function queryTwitter() {
    //Change screen name to your own to get your tweets
    client.get('statuses/user_timeline', { screen_name: 'stormy_eye' }, function(error, tweets, response) {
        if (error) {
            console.log('Error occured: ' + error);
        } else {
            tweets.forEach(function(tweet) {
                console.log('\n' + tweet.text.trim());
                fs.appendFile(logFile, '\n' + tweet.text.trim(), (error) => {
                    if(error){
                        throw error;
                    }
                });
            });
        }
    });
};

function querySpotify(track) {
    var searchOptions = {
        type: 'track',
        query: track
    };

    spotify.search(searchOptions, function(error, song) {
        if (error) {
            console.error('Error occured: ' + error)
        } else {
            //Get the top song response
            const track = song.tracks.items[0];
            if(!track){
                console.error('Error: No track found');
                return -1;
            }

            const track_artists = track.artists;
            var artists = '';
            track_artists.forEach(function(artist) {
                artists = artists + artist.name + ', ';
            });
            console.log('\nArtist(s): ', artists);
            console.log('Track name: ', track.name);
            console.log('Album name: ', track.album.name)
            console.log('Track Preview Link: ', track.preview_url)
            console.log('~~~~~~~~~~~~~~~~~~~~');
            let logText = '\nArtist(s): ' + artists + '\nTrack Name: ' + track.name + '\nAlbum name: ' + track.album.name 
                + '\nTrack Preview Link: ' + track.preview_url + '\n~~~~~~~~~~~~~';
            fs.appendFile(logFile, logText, (error) => {
                if(error){
                    throw error;
                }
            });
        }
    });
};

function queryOMDB(movieTitle) {
    request('http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&tomatoes=true&r=json', (error, response, body) => {
        if (error || response.statusCode !== 200 ) {
            console.error('Error ' + response.statusCode + ': ' + error);
            throw error;
        }
        let movieInfo = JSON.parse(body);
        //Check if any valid movie results returned
        if(movieInfo['Response'] == 'False'){
            console.error('No film results returned');
            return ;
        }

        //Print movie info to console
        console.log('\nTitle: ', movieInfo.Title);
        console.log('Year: ', movieInfo.Year);
        console.log('IMDB rating: ', movieInfo.imdbRating);
        console.log('Country: ', movieInfo.Country);
        console.log('Plot: ', movieInfo.Plot);
        console.log('Staring: ', movieInfo.Actors);
        var logText = '\nTitle: ' + movieInfo.Title + '\nYear: ' + movieInfo.Year 
            + '\nIMDB rating: ' + movieInfo.imdbRating + '\nCountry: ' + movieInfo.Country
            + '\nPlot: ' + movieInfo.Plot + '\nStaring: ' + movieInfo.Actors;
        movieInfo.Ratings.forEach((rating) => {
            if (rating['Source'] === 'Rotten Tomatoes') {
                console.log('Rotten Tomatoes Rating:', rating['Value']);
                logText = logText + '\nRotten Tomatoes Rating: ' + rating['Value'];
            }
        });

        console.log('Rotten Tomatoes URL: ', movieInfo.tomatoURL);
        logText += '\nRotten Tomatoes URL: ' + movieInfo.tomatoURL;


        fs.appendFile(logFile, logText, (error) => {
            if(error){
                throw error;
            }
        });


    })

}
