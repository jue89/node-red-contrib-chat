import {LitElement, html} from 'lit-element';
import {getColor} from '../lib/color.js';
import {convertDate} from '../lib/date-format.js';

class ChatConversation extends LitElement {
	static get properties() {
		return {
			msgs: {type: Array}
		}
	}

	constructor () {
		super();
		this.msgs = [];
	}

	render () {
		return html`
			<style>
				.conversation {
					width: 100%;
					height: 100%;
					overflow: hidden;
					overflow-y: scroll;
				}

				.container {
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					width: 100%;
					min-height: 100%;
				}

				.row {
					display: flex;
					font-family: sans-serif;
					font-size: 12pt;
				}

				.row label {
					width: 150px;
					padding: 0px 5px 0px 20px;
					flex-shrink: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #999999;
				}
				.row div {
					display: flex;
				}
			</style>

			<div class="conversation"><div class="container">
				${this.msgs.map(({date, nick, msg}) => html`<div class="row">
					<label>${convertDate(date)} <span style="color: ${getColor(nick)}">${nick}</span></label>
					<div>${msg}</div>
				</div>`)}
			</div></div>
		`;
	}

	updated () {
		const last = this.shadowRoot.querySelector('.row:last-child');
		if (last) last.scrollIntoView();
	}
}

customElements.define('chat-conversation', ChatConversation);
