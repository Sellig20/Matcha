import app from "./src/app";
import { pool } from "./src/db";
import ORM from "./src/orm/orm";
import { schema } from "./src/orm/schema";
import dotenv from 'dotenv';
import http from 'http';
import { Socket } from 'socket.io';
import { authenticateWithToken } from "./src/authMiddleware";

dotenv.config();

const port = process.env.BACKEND_PORT;
let orm: ORM | null = null;

function startServer() {
	try {
		console.log("\n\n START SERVER \n\n");
		orm = new ORM(schema);
		if (!orm) {
			throw new Error("Failed to create ORM");
		}
		const server = http.createServer(app);
		return server;
	} catch (error) {
		console.error("Failed to start the server:", error);
	}
}

async function stopServer() {
	try {
		server?.close();
		await pool.end();
		console.log("[server]: Server stopped");
	} catch (error) {
		console.error("Failed to stop the server:", error);
	}
}

const server = startServer();

const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:8000',
		methods: ['GET', 'POST', 'DELETE', 'PUT'],
		credentials: true
	}
});

	export {io};

	io.on('connection', (socket: Socket) => {
		console.log('\n\n♦️♦️♦️♦️♦️♦️♦️♦️ WebSocket BACKEND connected:', socket.id, "♦️♦️♦️♦️♦️♦️♦️♦️\n\n");

		const userId = socket.handshake.query.userId

		socket.on('newUser', (data) => {
			socket.broadcast.emit('newUser', { id: socket.id, ...data });
		});

		socket.on('disconnect', () => {
			console.log('\n\n♦️♦️♦️♦️♦️♦️♦️♦️ User déconnected:', socket.id, "♦️♦️♦️♦️♦️♦️♦️♦️\n\n");
		});

		socket.on('joinRoom', (roomId) => {
			console.log(`\n\n\n *&*&*&*&*&*&* `, socket.id, `joined room : ${roomId} *&*&*&*&*&*&*&*\n\n`);
			socket.join(roomId);
		})

		socket.on('newMessageBK', (message, socket, roomId) => {
			io.to(roomId).emit('send_messages_both', {sender: socket, message});

		})

		socket.on('messagerie', (msg: string) => {
			socket.emit('messagerie', 'je suis sur ta messagerie');
		});
		
		socket.on('coucou', (msg: string) => {
			console.log(`\n\nserver.ts : ${msg}\n\n`);
		});

		socket.on('update_pvt', () => {
			console.log("\n\nserver.ts : update_pvt\n\n");
		})
	});
	

server?.listen(3000, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
	await stopServer();
});

process.on("SIGTERM", async () => {
	await stopServer();
});

export default orm;

