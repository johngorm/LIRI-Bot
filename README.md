# LIRI-Bot
Def: Node.js program to emulate SIRI

NOTE: In order to run the Twitter request function, you will need to several API keys from Twitter. To do this, create a keys.js file that contains a JSON object called "twitterKeys". Structure twitterKeys as follows:

	module.exports.twitterKeys = {
		consumer_key: '<input here>',
		consumer_secret: '<input here>',
		access_token_key: '<input here>',
		access_token_secret: '<input here>'
	}

To get your API keys, got to https://apps.twitter.com/app/new . Fill out the form with dummy data and submit the form. On the next screen, click the Keys and Access Tokens tab to get your consumer key and secret. At the bottom of the page, click the "Create my access token" to get your access token and secret. Paste the keys into their corresponding key-value pair. Save the file into the same directory as liri.js. 

Finally, go the queryTwitter function in liri.js. Change the second argument for the GET function to:

	{screen_name: '<input your username>'}

#usage: node liri.js [command] [title]

command - enter command to execute. Options are as follows:

  my-tweets: Display the latests tweets from the user name provided in the liri.js file.

  spotify-this-song [title]: Search spotify for a track with the provided title name. Default search is  "The Sign" by Ace of Base.

  movie-this [title]: Search for information on a movie by title. Default search is "Mr. Robot".

  do-what-it-says: Reads CSV instructions found in the random.txt file. 
