<script lang="ts">
import eventEmitter from "./eventEmitter";
import { onDestroy, onMount } from "svelte";
const { playerId } = $props();

const keyboardControls = {
	moveForward: "ArrowUp",
	moveBackward: "ArrowDown",
	moveLeft: "ArrowLeft",
	moveRight: "ArrowRight",
	jump: " ",
};

const lookupKeys = Object.entries(keyboardControls).reduce(
	(acc, [action, key]) => {
		acc[key] = action;
		return acc;
	},
	{},
);

function handleKeyDown(event: KeyboardEvent) {
	const { key } = event; // Get the key pressed
	if (lookupKeys[key]) {
		eventEmitter.emit("playerAction", {
			playerId: playerId,
			action: lookupKeys[key],
		});
	}
}

onMount(() => {
	window.addEventListener("keydown", handleKeyDown);
});
onDestroy(() => {
	window.removeEventListener("keydown", handleKeyDown);
});
</script>