const express = require('express');
	http = require('http'),
	WebSocket = require('ws');
	path = require('path');

const app = express(),
	port = 8000,
	server = http.createServer(app),
	wss = new WebSocket.Server({ server });

const generatePlayer = require('./player');

app.use(express.static(path.join(__dirname + '/../')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')));

let players = [],
	noticeAllClients = message => {
		wss.clients.forEach(client => {
			if(client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		})
	};

wss.on('connection', (ws, req) => {
	let newPlayer = generatePlayer();
	ws.id = newPlayer.id;
	players.push(newPlayer);

	ws.send(JSON.stringify({type: 'GET_ME', payload: newPlayer}));
	noticeAllClients({type: 'GET_PLAYERS', payload: players});

	ws.on('close', function close() {
		players = players.filter(player => player.id !== ws.id);
		
		noticeAllClients({type: 'GET_PLAYERS', payload: players});
	});

	ws.on('message', message => {
		const parsedData = typeof message === 'string' ? JSON.parse(message) : message;

		switch(parsedData.type) {
			case 'PLAYER_MOVE':
				players = players.map(player => {
					if(player.id === parsedData.payload.id) {
						player = parsedData.payload;
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

server.listen(port, () => console.log(`Listening on port ${port}`));