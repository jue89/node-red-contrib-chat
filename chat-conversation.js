const assert = require('assert');
const uiFactory = require('./ui.js');

module.exports = function (RED) {
	const ui = uiFactory(RED);

	RED.nodes.registerType('chat-conversation', function (config) {
		RED.nodes.createNode(this, config);
		this.on('input', ({payload}) => {
			const {date, nick, msg} = payload;
			assert(config.room, 'Room must be configured');
			assert(date, 'Missing payload item: date');
			assert(nick, 'Missing payload item: nick');
			assert(msg, 'Missing payload item: msg');
			ui.sendMessage(config.room, {date, nick, msg});
		});
	});
}
