import {LitElement, html} from 'lit-element';

class ChatTabs extends LitElement {
	static get properties() {
		return {
			rooms: {type: Array},
			activeRoom: {type: Object}
		}
	}

	constructor () {
		super();
		this.rooms = [];
	}

	_click (id) {
		this.dispatchEvent(new CustomEvent('selectRoom', {detail: {id}}));
	}

	render () {
		return html`
			<style>
				.tabs {
					display: flex;
					background: #d5edfa;
					height: calc(100% - 1px);
					padding: 0px 2px 0px 2px;
					border-bottom: 1px solid #143d77;

					font-family: sans-serif;
					font-weight: bold;
				}
				.room {
					position: relative;
					top: 1px;
					margin: 4px 2px 0px 2px;
					padding: 0px 20px 0px 20px;
					border-top: 1px solid transparent;
					border-left: 1px solid transparent;
					border-right: 1px solid transparent;
					font-size: 14px;
					line-height: 30px;
					color: #143d77;
					cursor: pointer;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}

				.room.active {
					border-top: 1px solid #143d77;
					border-left: 1px solid #143d77;
					border-right: 1px solid #143d77;
					border-bottom: 1px solid #ffffff;
					background: #ffffff;
				}
			</style>

			<div class="tabs">
				${this.rooms.map((r) => html`
					<div class="room ${r === this.activeRoom ? 'active': ''}" @click="${() => this._click(r.id)}">${r.name}</div>
				`)}
			</div>
		`;
	}
}

customElements.define('chat-tabs', ChatTabs);
