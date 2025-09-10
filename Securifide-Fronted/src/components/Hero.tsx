import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Cyl from "./Cyl";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import BlurText from "./ui/BlurText";
import LightRays from "./background/LightRays";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden bg-black">
      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#473C7F]/90 to-transparent z-0"></div> */}
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#00C951"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center py-20 relative">
        {/* Text */}
        <p className="text-sm text-primary mb-4 font-body">
          [ Introducing Avent ]
        </p>
        <h1
          className="text-5xl md:text-6xl font-extrabold leading-tight font-heading 
               bg-gradient-to-r from-white via-gray-300 to-gray-500 
               bg-clip-text text-transparent"
        >
          Real-Time Threat Intelligence
        </h1>
        <BlurText
          text="Isn't this so cool?!"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-2xl mb-8"
        />
        <p className="mt-4 text-gray-300 max-w-2xl font-body">
          Monitor malicious IPs, subnets, and URLs with a live, interactive
          dashboard. Stay ahead of cyber threats with powerful filtering,
          search, and reporting features.
        </p>

        {/* CTA */}
        <button className="mt-8 bg-primary px-6 py-3 font-body rounded-md text-white font-semibold hover:bg-[#075555]">
          View Demo
        </button>
      </div>

      {/* 3D Model */}
      <div className="w-full md:w-1/2 h-screen">
        <Canvas camera={{ fov: 30 }}>
          <OrbitControls />
          <ambientLight />
          <Cyl />
          <EffectComposer>
            <Bloom
              intensity={0.5} // The bloom intensity.
              luminanceThreshold={0.025} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={false} // Enables or disables mipmap blur.
            />
            <ToneMapping adaptive />
          </EffectComposer>
        </Canvas>
      </div>
    </section>
  );
}
