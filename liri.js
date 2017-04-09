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

parseInstruction(userCommand, option);

function parseInstruction(instruction, option) {
	if(instruction === 'my-tweets'){
		queryTwitter();		
	}

	else if(instruction === 'spotify-this-song'){
		var song = 'The+Sign+Ace+of+Base';
		if(option){
			song = option.split(' ').join('+');
		}
		
		querySpotify(song);
	}

	else if(instruction === 'movie-this'){
		var movie = 'Mr.+Nobody';
		if(option){
			movie = option.split(' ').join('+');
		}
		queryOMDB(movie);

	}

	else if(instruction === 'do-what-it-says'){
		fs.readFile('./random.txt', 'utf8', (error, data) => {
			if(error){
				console.error('Error occured: ', error);
			}
			else{
				const instructionsText = data.split(',');
				
				for(let ii = 0; ii < instructionsText.length; ii += 2){
					parseInstruction(instructionsText[ii].trim(), instructionsText[ii+1].trim());
				}
			}
		});

	}

	else{
		console.log('Invalid Instruction');
		return -1;
	}
};

function queryTwitter(){
	client.get('statuses/user_timeline', {screen_name: 'stormy_eye'}, function (error, tweets, response){
		if(error){
			console.log('Error occured: ' + error);
		}

		else{
			tweets.forEach(function(tweet) {
				console.log('\n' + tweet.text.trim());
			});
		}
	});
};

function querySpotify(track){
	var searchOptions = {
		type: 'track',
		query: track
	};

	spotify.search(searchOptions, function(error, song){
		if (error){
			console.error('Error occured: ' + error)
		}
		else{
			const track = song.tracks.items[0];
			const track_artists = track.artists;
			var artists = '';
			track_artists.forEach(function(artist){
				artists = artists + artist.name + ', ';
			});
			console.log('\nArtist(s): ', artists);
			console.log('Track name: ' , track.name);
			console.log('Album name: ', track.album.name)
			console.log('Track Preview Link: ', track.preview_url)
			console.log('~~~~~~~~~~~~~~~~~~~~');
		}
	});
};

function queryOMDB(movieTitle){
	request('http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&r=json', (error,response,body) => {
		if(error || response.statusCode !== 200){
			console.error('Error ' + response.statusCode + ': ' + error);
		}
	
		let movieInfo = JSON.parse(body);
		console.log('\nTitle: ', movieInfo.Title);
		console.log('Year: ' , movieInfo.Year);
		console.log('IMDB rating: ', movieInfo.imdbRating);
		console.log('Country: ', movieInfo.Country);
		console.log('Plot: ', movieInfo.Plot);
		console.log('Staring: ', movieInfo.Actors);
		movieInfo.Ratings.forEach((rating) => {
			if(rating['Source'] === 'Rotten Tomatoes'){
				console.log('Rotten Tomatoes Rating:', rating['Value']);
			}
		})

	
	})

}

