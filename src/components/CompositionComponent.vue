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

    const addBoxMesh = (scale: Three.Vector3, position: Three.Vector3) => {
      const geometryToAdd = new Three.BoxGeometry(scale.x, scale.y, scale.z);
      const material = new Three.MeshNormalMaterial();

      const mesh = new Three.Mesh(geometryToAdd, material);
      mesh.position.set(position.x, position.y, position.z);

      scene.value.add(mesh);
    };

    const addCylinderMesh = (
      radiusTop: number,
      radiusBottom: number,
      height: number,
      radialSegments: number,
      heightSegments: number,
      posX: number,
      posY: number,
      posZ: number
    ) => {
      const geometry = new Three.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
        heightSegments
      );
      const material = new Three.MeshPhongMaterial({
        color: 0xe6e6e6,
        flatShading: false
      });
      const cylinder = new Three.Mesh(geometry, material);

      cylinder.position.set(posX, posY, posZ);
      cylinder.name = 'cylinder';

      scene.value.add(cylinder);
    };

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

      addCylinderMesh(1, 1, 0.2, 15, 15, -2, 0, -2);
      addCylinderMesh(1, 1, 0.2, 15, 15, 2, 0, -2);
      addCylinderMesh(1, 1, 0.2, 15, 15, -2, 0, 2);
      addCylinderMesh(1, 1, 0.2, 15, 15, 2, 0, 2);

      /*
      const meshScale = new Three.Vector3(2, 0.2, 2);
      let meshPosition = new Three.Vector3(-2, 0, 2);
      addBoxMesh(meshScale, meshPosition);
      meshPosition = new Three.Vector3(-2, 0, -2);
      addBoxMesh(meshScale, meshPosition);
      meshPosition = new Three.Vector3(2, 0, 2);
      addBoxMesh(meshScale, meshPosition);
      meshPosition = new Three.Vector3(2, 0, -2);
      addBoxMesh(meshScale, meshPosition);
      */

      renderer.value = new Three.WebGLRenderer({ antialias: true });
      renderer.value.setSize(window.innerWidth, window.innerHeight);

      controls.value = new OrbitControls(
        camera.value,
        renderer.value.domElement
      );

      renderer.value.setClearColor(0x45b6fe, 0.2);

      const light = new Three.AmbientLight(0x404040);
      scene.value.add(light);

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

      console.log(mouse.value.x);

      var intersects = raycaster.value.intersectObjects(scene.value.children);
      console.log('setup -> intersects', intersects);

      mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;

      for (const intersect of intersects) {
        //  console.log(intersect.object);
        //  intersect.object.material.color.set( 0xff0000 );
        if (intersect.object.name === 'cylinder') {
          intersect.object.material.color.set(0xf0000);
        }
      }
    };

    init();
    animate();

    window.addEventListener('click', onMouseMove, false);

    return {};
  }
});
</script>
