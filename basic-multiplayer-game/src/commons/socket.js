const socket = (function() {
	let instance;

	function createInstance() {
		if(window.ReconnectingWebSocket) {
			return new window.ReconnectingWebSocket(`ws://localhost:8001`);
		} else if(window.WebSocket) {
			return new window.WebSocket(`ws://localhost:8001`);
		} else {
			return {};
		}
	}

	return {
		getInstance: function() {
			if(!instance) {
				instance = createInstance();
			}
			return instance;
		}
	}
})();

export default socket;