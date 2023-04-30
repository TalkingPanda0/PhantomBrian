const ttsTitle = "TTS";
const brian = 
"https://api.streamelements.com/kappa/v2/speech?voice=Brian&text="; 
 function ttSay(Text)
{
	var url = brian + Text;
	$.alertspollssocket.triggerAudioPanel(url);
}

(function () {

	$.bind('command', function (event) {
		var sender = event.getSender(),
			args = event.getArgs();
	
		ttSay(args.join(" "));
	});

	$.bind('PubSubChannelPoints', function (event) {
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
		$.registerChatCommand('./custom/tts.js', 'tts', 2);
	});

})();
