//META { "name": "notASelfBot" } *//

var notASelfBot = function() {

	var onChatMsg,onSendMsg,sendMsg,cancels = [];
	sendMsg = (cid,msg) => {
		BDV2.WebpackModules.findByUniqueProperties(['jumpToMessage', '_sendMessage']).sendMessage(cid,{content:msg, nonce: Math.random() * 5000000000000, tts: false})
	};
	var last = -1;
	var use = true;
	onChatMsg = ({methodArguments: [ev]}) => {
		var msg = ev.message;
		if (last == msg.timestamp) return;
		if (last == -1) last = msg.timestamp;
		var cmd = msg.content;
		var author = msg.author;
		var cid = ev.message.channel_id;
		switch(cmd.toLowerCase()) {
			case "!camera":
			case "!vidcode":
			case "how2cam":
			case String(cmd.match(/^(?=.*?\how\b)(?=.*?\bcamera\b)(?=.*?\bvc\b).*$/g)):
			case "!cam":
				var msg =   "Click CTRL+SHIFT+I on the discord client, go to the Console tab, enter this code at the bottom and click enter.```css\n"+
							"Object.values(webpackJsonp.push([[],{},[['a']]])).forEach((m,i) => {\n"+
							"    if(m.exports && m.exports.isDeveloper!==undefined)\n"+
							"        Object.defineProperty(m.exports, 'isDeveloper', { value: 1 });\n"+
							"});```";
				if (use == true){
					sendMsg(cid, msg);
					use = false;
				}
				break;
			default:
				break;
		}
		setTimeout(function() { use = true; }, 10000); // adds a 10 second delay between each command use
		
	};
	
	return {
		getName: () => "BD-NotASelfBot",
		getDescription: () => "",
		getAuthor: () => "Sami",
		getVersion: () => "1.0",

		start: () => {
			cancels.push(BdApi.monkeyPatch(
				BdApi.findModule(m => m._actionHandlers && m._actionHandlers.MESSAGE_CREATE)._actionHandlers,
				"MESSAGE_CREATE", {before: onChatMsg}
			));
		},

		stop: () => {
			cancels.forEach(c => c());
			cancels = [];
		}
	};
};
