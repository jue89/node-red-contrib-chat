const socketio = require('socket.io');
const serveStatic = require('serve-static');
const path = require('path');
const events = require('events');

let ui = null;
module.exports = function (RED) {
	if (!ui) ui = factory(RED);
	return ui;
}

function factory (RED) {
	// Configuration
	const chatSettings = RED.settings.chat || {};
	if (!chatSettings.path) chatSettings.path = '/chat';
	const basePath = chatSettings.path;
	const socketIoPath = `${basePath}/socket.io`;

	// State
	const rooms = {};
	const ui = new events.EventEmitter();

	const io = socketio(RED.server, {path: socketIoPath});
	function send (event, args = {}) {
		io.send({event, ...args});
	}
	io.on('connect', (socket) => {
		Object.values(rooms).filter(({enabled}) => enabled).forEach((room) => send('addRoom', room));
		socket.on('message', ({event, id, date, nick, msg}) => {
			if (event !== 'sendMessage') return;
			if (!id || !rooms[id] || rooms[id].enabled === false) return;
			if (!msg) return;
			ui.emit(id, {date, nick, msg});
		});
	});

	RED.httpNode.use(basePath, serveStatic(path.join(__dirname, 'ui')));

	function addRoom (id, {name, nick}) {
		if (!rooms[id]) rooms[id] = {id, msgs: [], enabled: false};
		const room = rooms[id];
		const wasEnabled = room.enabled;
		Object.assign(room, {name, nick, enabled: true});
		if (!wasEnabled) send('addRoom', room);
	}

	function delRoom (id) {
		if (!rooms[id]) return;
		const room = rooms[id];
		const wasEnabled = room.enabled;
		room.enabled = false;
		if (wasEnabled) send('delRoom', {id});
	}

	function sendMessage (id, {date, nick, msg}) {
		if (!rooms[id]) return;
		const room = rooms[id];
		if (!room.enabled) return;
		const m = {date, nick, msg};
		room.msgs.push(m);
		send('sendMessage', {id, ...m});
	}

	Object.assign(ui, {addRoom, delRoom, sendMessage});

	return ui;
}
