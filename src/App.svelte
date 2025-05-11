<script lang="ts">
import { Canvas } from "@threlte/core";
import { World } from "@threlte/rapier";
import { onDestroy, onMount } from "svelte";
import { Vector3 } from "three";
import Scene from "./Scene.svelte";
import eventEmitter from "./lib/eventEmitter";
import { getRandomRotation } from "./lib/helpers";
import MobileControls from "./lib/MobileControls.svelte";
import Overlay from "./lib/Overlay.svelte";
import type { Body } from "./lib/types";

const players: Body[] = $state([]);

let gameStatus = $state("active");
let playerWhoWon: Body | null = $state(null);

const startingPositions = [
	new Vector3(-1, 4, 1),
	new Vector3(0, 4, 2),
	new Vector3(1, 4, 3),
	new Vector3(2, 4, 4),
];

players.push(
	{
		id: "xx1",
		name: "Player 1",
		mounted: Date.now(),
		position: startingPositions[0],
		rotation: getRandomRotation(), // Maybe this should be a fixed value
		color: "yellow",
		status: "active",
		isBot: false,
	},
	{
		id: "xx2",
		name: "Bot 1",
		mounted: Date.now(),
		position: startingPositions[1],
		rotation: getRandomRotation(),
		color: "green",
		status: "active",
		isBot: true,
	},
	{
		id: "xx3",
		name: "Bot 2",
		mounted: Date.now(),
		position: startingPositions[2],
		rotation: getRandomRotation(),
		color: "blue",
		status: "active",
		isBot: true,
	},
	{
		id: "xx4",
		name: "Bot 3",
		mounted: Date.now(),
		position: startingPositions[3],
		rotation: getRandomRotation(),
		color: "red",
		status: "active",
		isBot: true,
	},
);

function checkIfGameOver() {
	const remainingPlayers = players.filter(
		(player) => player.status === "active",
	);
	if (remainingPlayers.length === 1) {
		eventEmitter.emit("gameOver", { winner: remainingPlayers[0] });
	}

	// Check if it was the player that fells off
	const onlyBots = remainingPlayers.every((player) => player.isBot);
	if (onlyBots) {
		eventEmitter.emit("gameOver", { winner: null });
	}
}

eventEmitter.on("gameOver", (args) => {
	const { winner } = args as { winner: Body | null };
	playerWhoWon = winner;
	gameStatus = "gameOver";
});

function handleKeyDown(event: KeyboardEvent) {
	switch (event.key) {
		case "ArrowUp":
			eventEmitter.emit("playerAction", {
				playerId: players[0].id,
				action: "moveForward",
			});
			break;
		case "ArrowDown":
			eventEmitter.emit("playerAction", {
				playerId: players[0].id,
				action: "moveBackward",
			});
			break;
		case "ArrowLeft":
			eventEmitter.emit("playerAction", {
				playerId: players[0].id,
				action: "moveLeft",
			});
			break;
		case "ArrowRight":
			eventEmitter.emit("playerAction", {
				playerId: players[0].id,
				action: "moveRight",
			});
			break;
		case " ":
			eventEmitter.emit("playerAction", {
				playerId: players[0].id,
				action: "jump",
			});
			break;
	}
}

eventEmitter.on("ballFellOff", (args) => {
	const { id } = args as { id: string };
	const player = players.find((player) => player.id === id);
	if (player) player.status = "fallen";
	checkIfGameOver();
});

function restartGame() {
	players.forEach((player, i) => {
		player.status = "active";
	});
	gameStatus = "active";
	playerWhoWon = null;
	eventEmitter.emit("gameRestart");
}

onMount(() => {
	window.addEventListener("keydown", handleKeyDown);
});
onDestroy(() => {
	window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style>
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }

  #scores {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .score {
    width: 200px;
    border: solid 2px white;
    border-radius: 2px;
    padding: 4px;
  }

  .player-name {
    filter: invert(1) grayscale(1) brightness(1.3) contrast(9000);
    mix-blend-mode: luminosity;
    opacity: 0.95;
  }

  #controls {
    position: absolute;
    top: 100px;
    left: 20px;
    right: 20px;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    line-height: 4px;
    font-size: 10pt;
  }

    @media (max-width: 1023px) {
        .desktop-only {
            display: none;
        }
    }

    @media (min-width: 1024px) {
        .desktop-only {
            display: block;
        }
    }

</style>

<main>
  <Canvas>
    <World framerate={60} gravity={[0, -9.81, 0]}>
      <Scene {players} />
    </World>
  </Canvas>
  <div id="scores">
    {#each players as player (player.id)}
      <div class="score" style:background-color={player.color} style:opacity={player.status === 'active' ? 1 : 0.1}>
        <span class="player-name" style:color={player.color}>{player.name}</span>
      </div>
    {/each}
  </div>
  <div id="controls">
    <p>You are the yellow ball. Force the other balls off the table.</p>
    <p class="desktop-only">Use the arrow keys to control the player</p>
    <p class="desktop-only">Press space to jump</p>
  </div>
  <MobileControls playerId={players[0].id} />
  {#if gameStatus === 'gameOver'}
	<Overlay onClick={restartGame} {playerWhoWon} /> 
  {/if}
</main>

