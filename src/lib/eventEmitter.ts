import type { Body, PlayerAction, Location } from "./types";
import EventEmitter from "@anephenix/event-emitter";

type EventMap = {
	// Used to indicate when a ball has fallen off the table
	ballFellOff: ({ id }: { id: string }) => void;
	// Used to indicate when the game is over
	gameOver: ({ winner }: { winner: Body | null }) => void;
	// Used to indicate when a player has performed an action
	playerAction: (params: PlayerAction) => void;
	// Used to indicate the position of a player
	playerPositionUpdate: ({
		id,
		position,
	}: { id: string; position: Location }) => void;
	// Used to reset the game and the player's positions
	gameRestart: () => void;
	// Used to update game settings
	updateGameSettings: (settings: {
		numberOfPlayers: number;
	}) => void;
};

const eventEmitter = new EventEmitter<EventMap>();

// Set this flag to true to enable logging
// eventEmitter.enableLogging = true;

export default eventEmitter;
