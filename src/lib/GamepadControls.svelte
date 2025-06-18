<script lang="ts">
import { onMount, onDestroy } from "svelte";
import eventEmitter from "./eventEmitter";
const { playerId, restartGame } = $props();

let listenForPlayerAction = $state(false);
let x = $state(0);
let z = $state(0);
let gameIsOver = $state(false);
const gamepads = {};

function jump() {
	eventEmitter.emit("playerAction", { playerId, action: "jump" });
}

function movePlayerTo({ x, z }) {
	if (!listenForPlayerAction) return;
	eventEmitter.emit("playerAction", {
		playerId,
		action: "moveTowards",
		location: { x: x * 1, y: 0, z: z * 1 },
	});
}

function gamepadHandler(event, connected) {
	const gamepad = event.gamepad;
	// Note:
	// gamepad === navigator.getGamepads()[gamepad.index]

	if (connected) {
		gamepads[gamepad.index] = gamepad;
	} else {
		delete gamepads[gamepad.index];
	}
}

onMount(() => {
	// Initialize gamepads
	const initialGamepads = navigator.getGamepads();
	for (let i = 0; i < initialGamepads.length; i++) {
		const gamepad = initialGamepads[i];
		if (gamepad) {
			gamepadHandler({ gamepad }, true);
		}
	}

	console.log("GamepadControls mounted");

	window.addEventListener(
		"gamepadconnected",
		(e) => {
			gamepadHandler(e, true);
		},
		false,
	);
	window.addEventListener(
		"gamepaddisconnected",
		(e) => {
			gamepadHandler(e, false);
		},
		false,
	);

	// Maybe you can set this at the top of the App.svelte file and pass it down as a prop to the component instead?
	eventEmitter.on("gameOver", () => {
		gameIsOver = true;
	});

	eventEmitter.on("gameRestart", () => {
		gameIsOver = false;
	});

	setInterval(() => {
		const myGamepad = navigator.getGamepads()[0]; // use the first gamepad
		if (!myGamepad) {
			listenForPlayerAction = false;
			console.log("No gamepad connected");
			return;
		}
		listenForPlayerAction = true;

		// TODO - add damping to the axes values (left and right so they don't drift when centered)
		// TODO - add support for multiple gamepads

		movePlayerTo({
			x: myGamepad.axes[0],
			z: myGamepad.axes[1],
		});

		if (myGamepad.buttons[0].pressed) {
			gameIsOver ? restartGame() : jump();
		}

		console.log(`Right stick at (${myGamepad.axes[2]}, ${myGamepad.axes[3]})`);
	}, 1000 / 30); // print axes 10 times per second
});
</script>