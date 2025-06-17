import type { Body } from "./types";
import EventEmitter from "@anephenix/event-emitter";

type EventMap = {
	// Used to indicate when a ball has fallen off the table
	ballFellOff: () => void;
	// Used to indicate when the game is over
	gameOver: ({ winner }: { winner: Body | null }) => void;
	// Used to indicate when a player has performed an action
	playerAction: (action: string) => void;
	// Used to indicate the position of a player
	playerPositionUpdate: (position: { x: number; y: number; z: number }) => void;
	// Used to reset the game and the player's positions
	gameRestart: () => void;
};

const eventEmitter = new EventEmitter<EventMap>();

// Set this flag to true to enable logging
// eventEmitter.enableLogging = true;

export default eventEmitter;
