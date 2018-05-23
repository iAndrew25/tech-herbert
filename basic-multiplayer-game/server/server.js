const express = require('express');
	WebSocket = require('ws');
	path = require('path'),
	generatePlayer = require('./player');

const app = express(),
	port = 8000,
	wss = new WebSocket.Server({ port: 8001 });

let players = [];

app.use(express.static(path.join(__dirname + '/../')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')));

const noticeAllClients = message => {
	wss.clients.forEach(client => client.send(JSON.stringify(message)));
}

wss.on('connection', ws => {
	let newPlayer = generatePlayer();
	ws.id = newPlayer.id;
	players.push(newPlayer);

	ws.send(JSON.stringify({type: 'GET_ME', payload: newPlayer}));

	noticeAllClients({type: 'GET_PLAYERS', payload: players});

	console.log('New Player. Total players', wss.clients.size);

	ws.on('close', () => {
		players = players.filter(player => player.id !== ws.id);
		noticeAllClients({type: 'GET_PLAYERS', payload: players});
	});

	ws.on('message', message => {
		const {type, payload} = JSON.parse(message);

		switch(type) {
			case 'PLAYER_MOVE':
				players = players.map(player => {
					if(player.id === payload.id) {
						player = payload;
					}
					return player;
				});

				noticeAllClients({type: 'GET_PLAYERS', payload: players});
				break;
			case 'RESET_PLAYERS':
				players = players.map(player => {
					player.x = 1;
					player.y = 1;
					return player;
				});

				noticeAllClients({type: 'GET_PLAYERS', payload: players});
				break;
			default:
		}
	});
});

app.listen(port, () => console.log(`Listening on port ${port}`));