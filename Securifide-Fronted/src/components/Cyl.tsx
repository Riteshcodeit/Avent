import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three"


const Cyl = () => {
  let tex = useTexture("./model2.png");
  let cyl = useRef<THREE.Mesh>(null)
  useFrame((_state,delta) =>{
    if (cyl.current) {
      cyl.current.rotation.y += delta;
    }
  })
  return (
    <mesh ref={cyl} rotation={[0,2.4,0.2]}>
      <cylinderGeometry args={[1, 1, 1, 60, 60, true]} />
      <meshStandardMaterial transparent map={tex} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default Cyl;
