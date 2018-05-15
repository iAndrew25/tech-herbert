import socket from './socket';

const sw = socket.getInstance();
let subscribers = {};

sw.onmessage = ({data}) => {
	const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

	if(parsedData.type) {
		const msgType = subscribers[parsedData.type];

		if(msgType) {
			Object.keys(msgType).forEach(item => msgType[item](parsedData.payload));
		}
	}
}

const subscribe = (id, options = {}) => {
	if(!id || !Object.keys(options).length) return;
	const x = () => {};

	Object.keys(options).forEach(subscription => {
		subscribers[subscription] = Object.assign({}, subscribers[subscription], {
			[id]: options[subscription] || x
		})
	});
};
const unsubscribe = (type, id) => {
	const subscriber = subscribers[type];

	if(subscriber) {
		delete subscriber[id];
	}
}

export default {
	subscribe,
	unsubscribe
};