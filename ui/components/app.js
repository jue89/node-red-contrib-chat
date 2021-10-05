import {LitElement, html} from 'lit-element';
import './socket-io.js';
import './tabs.js';
import './textbox.js';
import './conversation.js';

class ChatApp extends LitElement {
	static get properties() {
		return {
			rooms: {type: Array},
			activeRoom: {type: String}
		}
	}

	constructor () {
		super();
		this.rooms = [];
		this.activeRoom = '';
	}

	_handleEvent ({event, ...args}) {
		console.log(event, args);
		if (event === 'addRoom') {
			const {id, name, nick, msgs} = args;
			this.rooms = [...this.rooms.filter((r) => r.id !== id), {id, name, nick, msgs}];
			if (this.rooms.length === 1) this._enterRoom();
		} else if (event === 'delRoom') {
			const {id} = args;
			let deletedRoom;
			this.rooms = this.rooms.filter((r) => {
				if (r.id !== id) return true;
				deletedRoom = r;
				return false;
			});
			if (deletedRoom === this.activeRoom) this._enterRoom();
		} else if (event === 'sendMessage') {
			const {id, date, nick, msg} = args;
			this.rooms = this.rooms.map((r) => {
				if (r.id !== id) return r;
				r.msgs = [...r.msgs, {date, nick, msg}];
				return r;
			});			
		}
	}

	_enterRoom (id) {
		if (!id && this.rooms.length > 0) {
			this.activeRoom = this.rooms[0];
		} else {
			this.activeRoom = this.rooms.find((r) => r.id === id);
		}
	}

	_sendMessage (msg) {
		const {id} = this.activeRoom;
		this.shadowRoot.querySelector('socket-io').send({event: 'sendMessage', id, msg})
	}

	render () {
		return html`
			<style>
				chat-tabs {
					position: absolute;
					top: 0px;
					left: 0px;
					right: 0px;
					height: 35px;
				}

				chat-textbox {
					position: absolute;
					bottom: 0px;
					left: 0px;
					right: 0px;
					height: 35px;
				}

				chat-conversation {
					position: absolute;
					top: 35px;
					bottom: 35px;
					left: 0px;
					right: 0px;
				}
			</style>
			<socket-io base-path="${window.location.pathname}socket.io/" @message="${(e) => this._handleEvent(e.detail.msg)}"></socket-io>
			<chat-tabs .rooms="${this.rooms}" .activeRoom="${this.activeRoom}" @selectRoom="${({detail}) => this._enterRoom(detail.id)}"></chat-tabs>
			${this.activeRoom ? html`
				<chat-conversation .msgs="${this.activeRoom.msgs}"></chat-conversation>
				<chat-textbox .nick="${this.activeRoom.nick}" @sendMessage="${({detail}) => this._sendMessage(detail.msg)}"></chat-textbox>
			` : ''}
		`;
	}
}

customElements.define('chat-app', ChatApp);
