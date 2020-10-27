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
import { DragControls } from 'three/examples/jsm/controls/DragControls';

export default defineComponent({
  name: 'CompositionComponent',
  components: {},
  props: {},
  setup(props) {
    const camera = ref();
    const scene = ref();
    const renderer = ref();
    const dragControls = ref();
    const mesh = ref();
    const meshesToRaycast = ref(Array<Three.Mesh>());
    const selectedMesh = ref(Three.Mesh);

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
        color: 0xf2f2f2,
        flatShading: false
      });
      const cylinder = new Three.Mesh(geometry, material);

      cylinder.position.set(posX, posY, posZ);
      cylinder.name = 'cylinder';
      meshesToRaycast.value.push(cylinder);

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
      camera.value.position.y = 6;
      camera.value.rotation.x = -45;

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

      /* const light = new Three.AmbientLight(0x404040);
      scene.value.add(light); */

      var light = new Three.PointLight(0xfff9db, 1, 400);
      light.position.set(0, 75, 25);
      scene.value.add(light);

      dragControls.value = new DragControls(
        meshesToRaycast.value,
        camera.value,
        renderer.value.domElement
      );
      document.body.prepend(renderer.value.domElement);
    };

    const animate = () => {
      requestAnimationFrame(animate);

      controls.value.update();

      renderer.value.render(scene.value, camera.value);
    };

    const onMouseMove = event => {
      event.preventDefault();

      mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.value.setFromCamera(mouse.value, camera.value);
      const intersects = raycaster.value.intersectObjects(
        meshesToRaycast.value
      );
      console.log('setup -> intersects', intersects);

      if (intersects[0]) {
        intersects[0].object.material.color.set(0xe0e0e0);
      }

      // selectedMesh.value = intersects[0].object;

      /* for (const intersect of intersects) {
        //  console.log(intersect.object);
        //  intersect.object.material.color.set( 0xff0000 );
        if (intersect.object.name === 'cylinder') {
          intersect.object.material.color.set(0xf0000);
        }
      }*/
    };

    init();
    animate();

    window.addEventListener('click', onMouseMove, false);

    dragControls.value.addEventListener('dragstart', event => {
      event.object.material.color.set(0xaaaaaa);
      event.object.position.y = 0;
    });
    dragControls.value.addEventListener('drag', event => {
      event.object.position.y = 0;
    });
    dragControls.value.addEventListener('dragend', event => {
      event.object.material.color.set(0xf2f2f2);
      controls.value.enabled = true;
    });
    dragControls.value.addEventListener('hoveron', event => {
      event.object.material.color.set(0xf2f2f2);
      controls.value.enabled = false;
    });
    dragControls.value.addEventListener('hoveroff', event => {
      controls.value.enabled = true;
    });

    return {};
  }
});
</script>
