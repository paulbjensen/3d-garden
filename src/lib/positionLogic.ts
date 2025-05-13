import type { Body, PlayerPosition } from "./types";
import { Vector3 } from "three";

export function setupStartingPositions(players: Body[]) {
	// Setup the default player positions from the initial player props
	const defaultPlayerPositions: PlayerPosition = {};
	for (const player of players) {
		defaultPlayerPositions[player.id] = player.position;
	}
	return defaultPlayerPositions;
}

const center = new Vector3(0, 0, 0);
const factor = 0.05;

export function toCenter(playerVec: Vector3) {
	const centerPoint = center.clone().sub(playerVec).normalize();
	return { x: centerPoint.x * factor, y: 0, z: centerPoint.z * factor };
}
