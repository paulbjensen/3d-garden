<script lang="ts">
import { useTask } from "@threlte/core";
import { Vector3 } from "three";
import Camera from "./lib/Camera.svelte";
import Lighting from "./lib/Lighting.svelte";
import Plate from "./lib/Plate.svelte";
import Player from "./lib/Player.svelte";
import eventEmitter from "./lib/eventEmitter";
import type { Body } from "./lib/types";

const { players } = $props();

const defaultPlayerPositions: {
	[key: string]: { x: number; y: number; z: number };
} = {};
players.forEach((player) => {
	defaultPlayerPositions[player.id] = player.position;
});

const playerPositions = $state(defaultPlayerPositions);

eventEmitter.on("playerPositionUpdate", ({ id, position }) => {
	playerPositions[id] = position;
});

// Helper to compute distance
// function getDistance(a: Vector3, b: Vector3) {
//   return a.distanceTo(b)
// }

const center = new Vector3(0, 0, 0);
const factor = 0.05;

eventEmitter.on("gameRestart", () => {
	// Reset player positions
	players.forEach((player: Body) => {
		playerPositions[player.id] = defaultPlayerPositions[player.id];
	});
});

useTask(() => {
	// Player 4 is the bot
	for (const player of players) {
		if (player.isBot) {
			// NOTE - this strategy is to simply move towards the center of the plate
			const playerPos = playerPositions[player.id];
			const playerVec = new Vector3(playerPos.x, playerPos.y, playerPos.z);

			const toCenter = center.clone().sub(playerVec).normalize();
			eventEmitter.emit("playerAction", {
				playerId: player.id,
				action: "moveTowards",
				location: { x: toCenter.x * factor, y: 0, z: toCenter.z * factor },
			});
		}
	}
});
</script>

<Lighting />
<Camera />
<Plate />
{#each players as player (player.id)}
  <Player
    id={player.id}
    position={player.position}
    color={player.color}
  />
{/each}
