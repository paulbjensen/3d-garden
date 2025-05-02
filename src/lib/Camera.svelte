<script lang="ts">
import { T } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";

let defaultPosition = [0, 12, 15] as [x: number, y: number, z: number];

function handleResize() {
	const width = window.innerWidth;

	if (width < 1024) {
		defaultPosition = [0, 20, 30] as [x: number, y: number, z: number];
	} else {
		defaultPosition = [0, 12, 15] as [x: number, y: number, z: number];
	}
}

window.addEventListener("resize", handleResize);
handleResize();
</script>

<T.PerspectiveCamera
  makeDefault
  position={defaultPosition}
  oncreate={(ref) => {
    ref.lookAt(0, 1, 0)
  }}
  onresize={handleResize}
>
    <OrbitControls />
</T.PerspectiveCamera>  