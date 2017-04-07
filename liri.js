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
var user = {screen_name: 'stormy_eye'}

var spotify = require('spotify');


parseInstruction(userCommand);

function parseInstruction(instruction) {
	if(instruction === 'my-tweets'){
		
		client.get('statuses/user_timeline', user, function (error, tweets, response){
			if(error){
				console.log('Error occured: ' + error);
				
			}
			else{
				tweets.forEach(function(tweet) {
					console.log(tweet.text.trim())
				});
			}
		})
		
	}

	else if(instruction === 'spotify-this-song'){
		var song;
		if(process.argv[3]){
			song = process.argv[3];
		}
		else{
			song = 'The Sign';
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
				console.log(JSON.parse(JSON.stringify(song.tracks)));
			}
		});
	}

	else if(instruction === 'movie-this'){
		console.log('moo');

	}

	else if(instruction === 'do-what-it-says'){
		console.log('car');

	}

	else{
		console.log('Invalid Instruction');
		return -1;
	}
};

