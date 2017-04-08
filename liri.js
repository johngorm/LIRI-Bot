//Node file that emulates SIRI, only using written language as input - hence LIRI
console.assert(process.argv[2], 'No instruction provided in command line. ');
var userCommand = process.argv[2];

var twitter = require('twitter');
var twitter_exports = require('./keys.js');
var twitterKeys = twitter_exports.twitterKeys;
var client = new twitter({
	consumer_key: twitterKeys.consumer_key,
	consumer_secret: twitterKeys.consumer_secret,
	access_token_key: twitterKeys.access_token_key,
	access_token_secret: twitterKeys.access_token_secret
});


var spotify = require('spotify');

var request = require('request');

parseInstruction(userCommand);

function parseInstruction(instruction) {
	if(instruction === 'my-tweets'){
		
		client.get('statuses/user_timeline', {screen_name: 'stormy_eye'}, function (error, tweets, response){
			if(error){
				console.log('Error occured: ' + error);
			}

			else{
				tweets.forEach(function(tweet) {
					console.log(tweet.text.trim())
				});
			}
		});
		
	}

	else if(instruction === 'spotify-this-song'){
		var song = 'The+Sign+Ace+of+Base';
		if(process.argv[3]){
			song = process.argv.splice(3).join('+');
		}
	
		searchOptions = {
			type: 'track',
			query: song
		};

		spotify.search(searchOptions, function(error, song){
			if (error){
				console.log('Error occured: ' + error)
			}
			else{
				var track = song.tracks.items[0];
				var track_artists = track.artists;
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
	}

	else if(instruction === 'movie-this'){
		var movie = 'Mr.+Nobody';
		if(process.argv[3]){
			movie = process.argv.splice(3).join('+');
		}

		request('http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&r=json', (error,response,body) => {
			if(error || response.statusCode !== 200){
				console.log('Error ' + response.statusCode + ': ' + error);
			}
			console.log(JSON.stringify(JSON.parse(body), null, 2))
			// var movie = JSON.parse(body);
			// //console.log(movie);
			// console.log('Title: ', movie.Title);
			// console.log('Year: ' , movie.Year);
			// console.log('IMDB rating: ', movie.imdbRating);
			// console.log('Country: ', movie.Country);
			// console.log('Plot: ', movie.Plot);
			// console.log('Staring: ', movie.Actors);

		
		})



	}

	else if(instruction === 'do-what-it-says'){
		console.log('car');

	}

	else{
		console.log('Invalid Instruction');
		return -1;
	}
};

