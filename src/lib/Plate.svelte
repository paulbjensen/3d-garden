<script lang="ts">
  import { T } from '@threlte/core'
  import { AutoColliders } from '@threlte/rapier'
</script>

<T.Group position={[0, 0, 0]}>
  <AutoColliders shape='trimesh'>
    <T.Mesh
        rotation.x={-Math.PI / 2}
        receiveShadow
    >
    <T.CircleGeometry args={[6, 40]} />
    <T.MeshStandardMaterial color="white" />
    </T.Mesh>
  </AutoColliders>
</T.Group>
