const uiFactory = require('./ui.js');

module.exports = function (RED) {
	const ui = uiFactory(RED);

	RED.nodes.registerType('chat-textbox', function (config) {
		RED.nodes.createNode(this, config);
		if (config.room) {
			const room = RED.nodes.getNode(config.room);
			ui.on(config.room, ({msg}) => {
				const date = new Date().toISOString();
				const nick = room.nick;
				this.send({payload: {date, nick, msg}});
			});
		}
	});
}
