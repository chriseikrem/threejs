import * as Three from 'three';

interface cylinderMeshInput {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    posX: number;
    posY: number;
    posZ: number;
}

export const createCylinderMesh = (cylinderMeshData: cylinderMeshInput): Three.Mesh => {
    const geometry = new Three.CylinderGeometry(
        cylinderMeshData.radiusTop,
        cylinderMeshData.radiusBottom,
        cylinderMeshData.height,
        cylinderMeshData.radialSegments,
        cylinderMeshData.heightSegments
      );
      const material = new Three.MeshPhongMaterial({
        color: 0xf2f2f2,
        flatShading: false
      });
      const cylinder = new Three.Mesh(geometry, material);

      cylinder.position.set(cylinderMeshData.posX, cylinderMeshData.posY, cylinderMeshData.posZ);
      cylinder.name = 'cylinder';
      
      return cylinder;
}