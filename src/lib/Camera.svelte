<script lang="ts">
import { T } from "@threlte/core";
import { OrbitControls } from "@threlte/extras";

const desktopPosition = [0, 12, 15] as [x: number, y: number, z: number];
const mobilePosition = [0, 20, 30] as [x: number, y: number, z: number];

let defaultPosition = desktopPosition;

function handleResize() {
	const width = window.innerWidth;
	defaultPosition = width < 1024 ? mobilePosition : desktopPosition;
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