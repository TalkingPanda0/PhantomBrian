const ttsTitle = "TTS";
const api = 
"https://api.streamelements.com/kappa/v2/speech?"

const voices = ["Jan", "Giorgio", "Geraint", "Salli", "Matthew", "Kimberly", "Kendra", "Justin", "Joey", "Joanna", "Ivy", "Raveena", "Aditi", "Emma", "Brian", "Amy", "Russell", "Nicole", "Kangkang", "Linda", "Heather", "Sean" ];

var readEveryMessage = 0;
var freeCommand = 0;
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}
function ttSay(Text)
{
	var text = encodeURIComponent(Text); 
	text = replaceAll(text,"sweetb35","");

	if(text.charAt(0) !== '(')
		voice = "Brian";
	else
	{
		var voice = "";
		for(var i =1;;i++)
		{
			if(text.charAt(i) === ')')
				break;
			voice += text.charAt(i);
		}
		if(!voices.includes(voice))
			voice = "Brian";
		else
			text = text.slice(i+1);
	}


	$.alertspollssocket.triggerAudioPanel(`${api}voice=${voice}&text=${text}`);
}

(function () {

	$.bind('ircChannelMessage', function(event) {
		if(!readEveryMessage || event.getMessage().startsWith('!'))
			return;
	/*	const tags = event.getTags();
	    if (tags.containsKey('emotes')) {
            const emotesString = tags.get('emotes');
            	if (emotesString.length() > 0) {
		    	// hap emote
			    $.say(emotesString);
	    	}
	    }*/

		ttSay(event.getMessage());
	});
	$.bind('command', function (event) {

		var sender = event.getSender(),
			command = event.getCommand(),
			args = event.getArgs();
		if(command.equalsIgnoreCase("modtts"))
		{
			if(args[0].equalsIgnoreCase("start"))
			{
				$.say("Reading Every Message");
				readEveryMessage = 1;
				return;
			} else if(args[0].equalsIgnoreCase("stop")) {
				$.say("Stoppped");
				readEveryMessage = 0;
				freeCommand = 0;
				return;
			} else if(args[0].equalsIgnoreCase("enablefreecmd"))
			{
				$.say("Enabled Free TTS command. type !tts before your message to have brian read it!");
				freeCommand = 1;
				return;
			}
	
			ttSay(args.join(" "));
		} else if (command.equalsIgnoreCase("tts")) {
			var args = event.getArgs();
			if(args[0].equalsIgnoreCase("voices"))
			{
				$.say("Supported TTS voices are: " + voices.join(", "));
				return;
			}

			if(freeCommand){
				ttSay(args.join(" "));
			} 
		}
	});
	

	$.bind('PubSubChannelPoints', function (event) {
	if(readEveryMessage)
		
		return;
        var rewardTitle = event.getRewardTitle(),
            userInput = event.getUserInput();
		if(rewardTitle == ttsTitle)
		{
			ttSay(userInput);
		}
		
       
	});
	/*	
	* @event initReady
	*/
	$.bind('initReady', function () {
		$.registerChatCommand('./custom/tts.js', 'modtts', 2);
		$.registerChatCommand('./custom/tts.js', 'tts', 7);
	});

})();

