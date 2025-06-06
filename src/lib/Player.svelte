<script
  lang="ts"
>
import { onDestroy, onMount } from "svelte";
import { RigidBody as RapierRigidBody } from "@dimforge/rapier3d-compat";
import { T } from "@threlte/core";
import { useTask } from "@threlte/core";
import { Collider, RigidBody } from "@threlte/rapier";
import { MeshStandardMaterial, SphereGeometry } from "three";
import eventEmitter from "./eventEmitter";
import type { Location, PlayerAction } from "./types";

let { id, position, color } = $props();
let rigidBody: RapierRigidBody | undefined = $state(undefined);

const geometry = new SphereGeometry(0.5);
const material = new MeshStandardMaterial({ color, wireframe: false });

// Functions

function moveForward() {
	moveTowards({ x: 0, y: 0, z: -1 });
}

function moveBackward() {
	moveTowards({ x: 0, y: 0, z: +1 });
}

function moveLeft() {
	moveTowards({ x: -1, y: 0, z: 0 });
}

function moveRight() {
	moveTowards({ x: +1, y: 0, z: 0 });
}

function jump() {
	moveTowards({ x: 0, y: 2, z: 0 });
}

function moveTowards(location: Location) {
	if (!rigidBody) return;
	rigidBody.applyImpulse(location, true);
	const newPosition = rigidBody.translation();
	eventEmitter.emit("playerPositionUpdate", { id, position: newPosition });
}

function reset() {
	if (!rigidBody) return;
	rigidBody.setTranslation(position, true);
	// Reset the rotation to the initial value
	rigidBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
	// Reset the velocity to zero
	rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
	rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
}

function handlePlayerAction(data: PlayerAction) {
	if (data.playerId === id) {
		switch (data.action) {
			case "moveForward":
				moveForward();
				break;
			case "moveBackward":
				moveBackward();
				break;
			case "moveLeft":
				moveLeft();
				break;
			case "moveRight":
				moveRight();
				break;
			case "jump":
				jump();
				break;
			case "moveTowards":
				if (data.location) {
					moveTowards(data.location);
				}
				break;
		}
	}
}

onMount(() => {
	eventEmitter.on("playerAction", (data) =>
		handlePlayerAction(data as PlayerAction),
	);
	eventEmitter.on("gameRestart", reset);
});
onDestroy(() => {
	eventEmitter.off("playerAction", (data) =>
		handlePlayerAction(data as PlayerAction),
	);
	eventEmitter.off("gameRestart", reset);
});

const { start, stop } = useTask(() => {
	if (rigidBody) {
		const position = rigidBody.translation();
		if (position.y < 0) {
			eventEmitter.emit("ballFellOff", { id });
			stop();
		}
	}
});

eventEmitter.on("gameRestart", start);
</script>

<T.Group
  position.x={position?.x}
  position.y={position?.y}
  position.z={position?.z}
>
  <RigidBody
    bind:rigidBody
    type={'dynamic'}
  >
    <Collider
      contactForceEventThreshold={30}
      restitution={0.4}
      shape={'ball'}
      args={[0.5]}
    />
    <T.Mesh
      castShadow
      receiveShadow
      {geometry}
      {material}
    />
  </RigidBody>
</T.Group>
