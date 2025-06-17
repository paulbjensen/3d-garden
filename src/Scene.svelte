<script lang="ts">
import { useTask } from "@threlte/core";
import { Vector3 } from "three";
import Camera from "./lib/Camera.svelte";
import Lighting from "./lib/Lighting.svelte";
import Plate from "./lib/Plate.svelte";
import Player from "./lib/Player.svelte";
import eventEmitter from "./lib/eventEmitter";
import type { Body, PlayerPosition } from "./lib/types";
import { setupStartingPositions, toCenter } from "./lib/positionLogic";

const { players } = $props();

// Setup the default player positions from the initial player props
const defaultPlayerPositions = setupStartingPositions(players);
const playerPositions = $state(defaultPlayerPositions);

// Updates the player's position
function updatePlayerPostion(args: unknown) {
	const { id, position } = args as PlayerPosition;
	playerPositions[String(id)] = position;
}

// Reset the player positions to the default positions
function resetPositions(positions: PlayerPosition) {
	players.forEach((player: Body) => {
		playerPositions[player.id] = positions[player.id];
	});
}

// NOTE - this strategy is to simply move towards the center of the plate
function movePlayerToCenter(player: Body) {
	const playerPos = playerPositions[player.id];
	const playerVec = new Vector3(playerPos.x, playerPos.y, playerPos.z);
	eventEmitter.emit("playerAction", {
		playerId: player.id,
		action: "moveTowards",
		location: toCenter(playerVec),
	});
}

// Updates the player's position
eventEmitter.on("playerPositionUpdate", updatePlayerPostion);
eventEmitter.on("gameRestart", () => resetPositions(defaultPlayerPositions));

useTask(() => {
	for (const player of players) {
		if (player.isBot) movePlayerToCenter(player);
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
	size={player.size}
  />
{/each}
