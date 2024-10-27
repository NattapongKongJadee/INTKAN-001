"use client";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

const RiveDemo = () => {
  const { RiveComponent } = useRive({
    src: "itkRobot.riv",
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent />;
};

export default RiveDemo;
