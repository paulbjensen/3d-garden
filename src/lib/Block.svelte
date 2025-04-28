<script>
  import { T, useTask } from '@threlte/core'
  import { interactivity } from '@threlte/extras'
  import { Spring } from 'svelte/motion'

  interactivity()

  const scale = new Spring(1)

  let rotation = 0
  useTask((delta) => {
    rotation += delta
  })
</script>


<T.Mesh
  rotation.y={rotation}
  position.y={1}
  scale={scale.current}
  onpointerenter={() => {
    scale.target = 1.5
  }}
  onpointerleave={() => {
    scale.target = 1
  }}
  castShadow
>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshStandardMaterial color="orange" />
</T.Mesh>