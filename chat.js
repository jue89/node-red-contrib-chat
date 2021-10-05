const uiFactory = require('./ui.js');

module.exports = function (RED) {
	const ui = uiFactory(RED);
	RED.nodes.registerType('chat', function (config) {
		RED.nodes.createNode(this, config);
		this.name = config.name;
		this.nick = config.nick;
		ui.addRoom(this.id, this);
		this.on('close', () => ui.delRoom(this.id));
	});
}
