import {LitElement, html} from 'lit-element';
import {getColor} from '../lib/color.js';
import {convertDate} from '../lib/date-format.js';

class ChatTextbox extends LitElement {
	static get properties() {
		return {
			nick: {type: String},
			date: {type: Object}
		}
	}

	constructor () {
		super();
		this.nick = '';
		this.date = new Date();
	}

	connectedCallback () {
		super.connectedCallback();
		this.dateInt = setInterval(() => { this.date = new Date(); }, 5000);
	}

	disconnectedCallback () {
		clearInterval(this.dateInt);
		super.disconnectedCallback();
	}

	_send () {
		const input = this.shadowRoot.querySelector('input');
		input.focus();
		const msg = input.value;
		if (!msg.length) return;
		this.dispatchEvent(new CustomEvent('sendMessage', {detail: {msg}}));
		input.value = '';
	}

	render () {
		return html`
			<style>
				.textbox {
					display: flex;
					height: calc(100% - 1px);
					border-top: 1px solid #143d77;
					font-family: sans-serif;
					font-size: 12pt;
				}
				.textbox label {
					width: 150px;
					padding: 0px 5px 0px 20px;
					text-overflow: ellipsis;
					overflow: hidden;
					line-height: 35px;
					white-space: nowrap;
					color: #999999;
				}
				.textbox input {
					flex-grow: 1;
					border: none;
					font-family: sans-serif;
					font-size: 12pt;
				}
			</style>

			<div class="textbox">
				<label class="nick">${convertDate(this.date)} <span style="color: ${getColor(this.nick)}">${this.nick}</span></label>
				<input type="text" @keydown="${(e) => e.keyCode === 13 && this._send()}" placeholder="Your message ...">
				<button @click="${(e) => this._send()}">Send</button>
			</div>
		`;
	}
}

customElements.define('chat-textbox', ChatTextbox);
