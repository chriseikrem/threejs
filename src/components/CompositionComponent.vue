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
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { createCylinderMesh } from '../utilities/threeUtils';
import { Water } from 'three/examples/jsm/objects/Water2.js';

export default defineComponent({
  name: 'CompositionComponent',
  components: {},
  props: {},
  setup(props) {
    const camera = ref(
      new Three.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      )
    );
    const scene = ref(new Three.Scene());
    const renderer = ref(new Three.WebGLRenderer({ antialias: true }));
    const dragControls = ref();
    const mesh = ref();
    const meshesToRaycast = ref(Array<Three.Mesh>());
    const selectedMesh = ref(Three.Mesh);
    const transformControls = ref(
      new TransformControls(camera.value, renderer.value.domElement)
    );

    const raycaster = ref(new Three.Raycaster());
    const mouse = ref(new Three.Vector2());

    const controls = ref(
      new OrbitControls(camera.value, renderer.value.domElement)
    );

    const water = ref();

    const init = () => {
      camera.value.position.z = 5;
      camera.value.position.y = 6;
      camera.value.rotation.x = -45;

      const gridHelper = new Three.GridHelper();
      scene.value.add(gridHelper);
      scene.value.add(transformControls.value);

      renderer.value.setSize(window.innerWidth, window.innerHeight);

      renderer.value.setClearColor(0x45b6fe, 0.2);

      addDemoData();

      var light = new Three.PointLight(0xfff9db, 1, 400);
      light.position.set(0, 75, 25);
      scene.value.add(light);

      /* TODO: Add working water
      const waterGeometry = new Three.PlaneBufferGeometry(100, 100);

      water.value = new Water(waterGeometry, {
        color: 0xc4dafd,
        scale: 1, 
        flowDirection: new Three.Vector2(1, 1),
        textureWidth: 1024,
					textureHeight: 1024
      });

      water.value.position.y = 0;
      water.value.position.x = 0;
      water.value.rotation.x = 64;
      scene.value.add(water.value);*/

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

    const onMouseMove = (event: any) => {
      event.preventDefault();

      mouse.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.value.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.value.setFromCamera(mouse.value, camera.value);
      const intersects = raycaster.value.intersectObjects(
        meshesToRaycast.value
      );

      if (intersects[0]) {
        intersects[0].object.material.color.set(0xe0e0e0);
        transformControls.value.attach(intersects[0].object);
      }
    };

    const addDemoData = () => {
      const demoCylinderMesh = {
        radiusTop: 1,
        radiusBottom: 1,
        height: 0.2,
        radialSegments: 15,
        heightSegments: 15,
        posX: -2,
        posY: 0,
        posZ: -2
      };

      const demo1 = createCylinderMesh(demoCylinderMesh);
      scene.value.add(demo1);
      meshesToRaycast.value.push(demo1);

      demoCylinderMesh.posX = 2;
      demoCylinderMesh.posZ = -2;
      const demo2 = createCylinderMesh(demoCylinderMesh);
      scene.value.add(demo2);
      meshesToRaycast.value.push(demo2);

      demoCylinderMesh.posX = -2;
      demoCylinderMesh.posZ = 2;
      const demo3 = createCylinderMesh(demoCylinderMesh);
      scene.value.add(demo3);
      meshesToRaycast.value.push(demo3);

      demoCylinderMesh.posX = 2;
      demoCylinderMesh.posZ = 2;
      const demo4 = createCylinderMesh(demoCylinderMesh);
      scene.value.add(demo4);
      meshesToRaycast.value.push(demo4);
    };

    init();
    animate();

    window.addEventListener('click', onMouseMove, false);

    // Keyboard input
    window.addEventListener('keydown', event => {
      switch (event.keyCode) {
        case 16: // shift
          transformControls.value.setTranslationSnap(1);
          break;
      }
    });

    window.addEventListener('keyup', function(event) {
      switch (event.keyCode) {
        case 16: // Shift
          transformControls.value.setTranslationSnap(null);
          break;
      }
    });

    window.addEventListener('resize', () => {
      renderer.value.setSize(window.innerWidth, window.innerHeight);
      camera.value.aspect = window.innerWidth / window.innerHeight;

      camera.value.updateProjectionMatrix();
    });

    transformControls.value.addEventListener(
      'dragging-changed',
      (event: any) => {
        controls.value.enabled = !event.value;
      }
    );

    /* dragControls.value.addEventListener('dragstart', (event: any) => {
      event.object.material.color.set(0xaaaaaa);
      event.object.position.y = 0;
    });
    dragControls.value.addEventListener('drag', (event: any) => {
      event.object.position.y = 0;
    });
    dragControls.value.addEventListener('dragend', (event: any) => {
      event.object.material.color.set(0xf2f2f2);
      controls.value.enabled = true;
    });
    dragControls.value.addEventListener('hoveron', (event: any) => {
      event.object.material.color.set(0xf2f2f2);
      controls.value.enabled = false;
    });
    dragControls.value.addEventListener('hoveroff', (event: any) => {
      controls.value.enabled = true;
    });*/

    return {};
  }
});
</script>
