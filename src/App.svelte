<script lang="ts">
import { Canvas } from "@threlte/core";
import { World } from "@threlte/rapier";
import { Vector3 } from "three";
import Scene from "./Scene.svelte";
import eventEmitter from "./lib/eventEmitter";
import { getRandomRotation } from "./lib/helpers";
import MobileControls from "./lib/MobileControls.svelte";
// import GamepadControls from "./lib/GamepadControls.svelte";
import KeyboardControls from "./lib/KeyboardControls.svelte";
import Overlay from "./lib/Overlay.svelte";
import type { Body } from "./lib/types";
import Guide from "./lib/Guide.svelte";

let players: Body[] = $state([]);

let gameStatus = $state("active");
let playerWhoWon: Body | null = $state(null);

// Maybe we should make the positions random in the future, linked to the size of the map

const createRandomPosition = () => {
	return new Vector3(
		Math.floor(Math.random() * 5) - 2, // Random x between -2 and 2
		4, // Fixed height
		Math.floor(Math.random() * 5) - 2, // Random z between -2 and 2
	);
};

// This adds the players for the game. We will need to make this comfigurable from a new game screen in the future
players.push(
	{
		id: "xx1",
		name: "Player 1",
		mounted: Date.now(),
		position: createRandomPosition(),
		rotation: getRandomRotation(), // Maybe this should be a fixed value
		color: "yellow",
		status: "active",
		isBot: false,
		size: 0.5,
	},
	{
		id: "xx2",
		name: "Bot 1",
		mounted: Date.now(),
		position: createRandomPosition(),
		rotation: getRandomRotation(),
		color: "green",
		status: "active",
		isBot: true,
		size: 0.5,
	},
	{
		id: "xx3",
		name: "Bot 2",
		mounted: Date.now(),
		position: createRandomPosition(),
		rotation: getRandomRotation(),
		color: "blue",
		status: "active",
		isBot: true,
		size: 0.5,
	},
	{
		id: "xx4",
		name: "Bot 3",
		mounted: Date.now(),
		position: createRandomPosition(),
		rotation: getRandomRotation(),
		color: "red",
		status: "active",
		isBot: true,
		size: 0.5,
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

eventEmitter.on("ballFellOff", ({ id }: { id: string }) => {
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
  <Guide />
  <!-- <GamepadControls playerId={players[0].id} gamepadId={0} {restartGame} />
  <GamepadControls playerId={players[1].id} gamepadId={1} {restartGame} /> -->
  <MobileControls playerId={players[0].id} />
  <KeyboardControls playerId={players[0].id} />
  {#if gameStatus === 'gameOver'}
	<Overlay onClick={restartGame} {playerWhoWon} /> 
  {/if}
</main>

