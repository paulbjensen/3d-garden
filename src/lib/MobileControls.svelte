<script lang="ts">
import eventEmitter from "./eventEmitter";
const { playerId } = $props();

let listenForPlayerAction = $state(false);
let x = $state(0);
let z = $state(0);

function jump(event: MouseEvent) {
	event.preventDefault();
	eventEmitter.emit("playerAction", { playerId, action: "jump" });
}

function startListening(event: TouchEvent) {
	event.preventDefault();
	listenForPlayerAction = true;
}
function stopListening(event: TouchEvent) {
	event.preventDefault();
	listenForPlayerAction = false;
	x = 0;
	z = 0;
}

function throttle<T extends (...args: any[]) => void>(
	func: T,
	limit: number,
): T {
	let inThrottle: boolean;

	return function (this: any, ...args: any[]) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	} as T;
}

function movePlayerTo(event: TouchEvent) {
	event.preventDefault();
	if (!listenForPlayerAction) return;

	const controller = document.getElementById("circle-movement-controller");
	if (!controller) return;

	const rect = controller.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	let clientX, clientY;

	// Use the first touch point
	const touch = event.touches[0];
	if (!touch) return;
	clientX = touch.clientX;
	clientY = touch.clientY;

	x = (clientX - centerX) / rect.width;
	z = (clientY - centerY) / rect.height;

	eventEmitter.emit("playerAction", {
		playerId,
		action: "moveTowards",
		location: { x: x * 0.5, y: 0, z: z * 0.5 },
	});
}

function mapValue(n: number) {
	// Map n from range [-1, 1] to range [0, 70]
	const controllerSize = 150;
	const innerSize = 30;
	const difference = controllerSize - innerSize;
	return ((n + 1) / 2) * difference;
}
</script>


<style>

    @media (max-width: 1023px) {
        #mobile-controls {
            display: block;
        }
    }

    @media (min-width: 1024px) {
        #mobile-controls {
            display: none;
        }
    }

    :root {
        --circle-movement-controller-size: 150px;
        --circle-movement-controller-inner-size: 30px;
    }

    #circle-movement-controller {
        position: absolute;
        bottom: 4vh;
        left: 4vw;
        width: var(--circle-movement-controller-size);
        height: var(--circle-movement-controller-size);
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        border: solid 3px white;
        user-select: none;
    }

    #jumper-button {
        position: absolute;
        bottom: 6vh;
        right: 4vw;
        width: 100px;
        height: 100px;
        background-color: orange;
        color: white;
        font-size: 16px;
        font-weight: bold;
        border: solid 2px white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        border-radius: 50%;
        user-select: none;
    }

    #circle-movement-controller-inner {
        width: var(--circle-movement-controller-inner-size);
        height: var(--circle-movement-controller-inner-size);
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        position: absolute;
        top: calc((var(--circle-movement-controller-size) - var(--circle-movement-controller-inner-size))/2);
        left: calc((var(--circle-movement-controller-size) - var(--circle-movement-controller-inner-size))/2);
        pointer-events: none;
        user-select: none;
    }

    #mobile-controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
    }

</style>

<div id="mobile-controls">
    <div id="circle-movement-controller" ontouchstart={startListening} ontouchend={stopListening} ontouchmove={movePlayerTo}>
        <div id="circle-movement-controller-inner"
            style:left={mapValue(x) + "px"}
            style:top={mapValue(z) + "px"}
        ></div>
    </div>
    <button id="jumper-button" onclick={jump}>Jump</button>
</div>