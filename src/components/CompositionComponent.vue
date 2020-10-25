<template>
  <div id="container"></div>
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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default defineComponent({
  name: 'CompositionComponent',
  components: {},
  props: {},
  setup(props) {
    const camera = ref();
    const scene = ref();
    const renderer = ref();
    const mesh = ref();

    const raycaster = ref(new Three.Raycaster());
    const mouse = ref(new Three.Vector2());

    const controls = ref();

    window.addEventListener('resize', () => {
      renderer.value.setSize(window.innerWidth, window.innerHeight);
      camera.value.aspect = window.innerWidth / window.innerHeight;

      camera.value.updateProjectionMatrix();
    });

    const init = () => {
      camera.value = new Three.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      );
      camera.value.position.z = 5;

      scene.value = new Three.Scene();

      const gridHelper = new Three.GridHelper();
      scene.value.add(gridHelper);

      let geometry = new Three.BoxGeometry(1, 1, 1);
      let material = new Three.MeshNormalMaterial();

      mesh.value = new Three.Mesh(geometry, material);
      mesh.value.position.x = Math.random() * 2 * Math.random() < 0.5 ? -1 : 1;
      scene.value.add(mesh.value);

      renderer.value = new Three.WebGLRenderer({ antialias: true });
      renderer.value.setSize(window.innerWidth, window.innerHeight);

      controls.value = new OrbitControls(
        camera.value,
        renderer.value.domElement
      );

      document.body.prepend(renderer.value.domElement);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      raycaster.value.setFromCamera(mouse.value, camera.value);

      // calculate objects intersecting the picking ray
      var intersects = raycaster.value.intersectObjects(scene.value.children);

      for (const intersect of intersects) {
        // intersect.object.material.color.set(0xff0000)
        // console.log(typeof intersect.object)
        // intersect.object.rotation.x -= 0.02;
        // intersect.object.rotation.y += 0.02;
      }
      controls.value.update();
      renderer.value.render(scene.value, camera.value);
    };

    const onMouseMove = event => {
      event.preventDefault();

      mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;

      /* for (const intersect of intersects) {
        console.log(intersect);
       //  intersect.object.material.color.set( 0xff0000 );
      }*/
    };

    init();
    animate();

    window.addEventListener('mousemove', onMouseMove, false);

    return {};
  }
});
</script>
