import {LitElement} from 'lit-element';

class SocketIO extends LitElement {
    connectedCallback () {
        const path = this.basePath || '/socket.io/';
        const script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', `${path}socket.io.js`);
		this.appendChild(script);
		script.onload = () => {
			this.socket = io({path});
            this.dispatchEvent(new Event('ready'));
            this.socket.on('message', (msg) => this.dispatchEvent(
                new CustomEvent('message', {detail: { msg }})
            ));
		};
    }

    send (msg) {
        this.socket.send(msg);
    }

	static get properties () {
		return {
			socket: {
				type: Object,
				attribute: false
			},
            basePath: {
                attribute: 'base-path'
            }
		};
	}
}

customElements.define('socket-io', SocketIO);
