<template>
  <div id="container" >
  </div>
</template>

<style lang="css">
#container {
  width: 500;
  height: 500;
}
</style>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  toRef,
  Ref
} from '@vue/composition-api';
import { Todo, Meta } from './models';
import * as Three from 'three';

export default defineComponent({
  name: 'CompositionComponent',
  components: {},
  props: {},
  setup(props) {
    const camera = ref();
    const scene = ref();
    const renderer = ref();
    const mesh = ref();

    const init = () => {
      camera.value = new Three.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
      );
      camera.value.position.z = 1;

      scene.value = new Three.Scene();

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      mesh.value = new Three.Mesh(geometry, material);
      scene.value.add(mesh.value);

      renderer.value = new Three.WebGLRenderer({ antialias: true });
      renderer.value.setSize(window.innerWidth, window.innerHeight);
      document.body.prepend(renderer.value.domElement);
    };

    const animate = () => {
      requestAnimationFrame(animate);
     
      mesh.value.rotation.x += 0.01;
      mesh.value.rotation.y += 0.02;
      renderer.value.render(scene.value, camera.value);
    };

    init();
    animate();

    return {};
  }
});
</script>
