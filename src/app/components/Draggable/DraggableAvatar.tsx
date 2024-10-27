import React, { memo } from "react";
import dynamic from "next/dynamic";
import { DraggableEvent, DraggableData } from "react-draggable";

interface DraggableItemProps {
  position: {
    id: string;
    x: number;
    y: number;
    col: number;
    row: number;
  };
  handleStop: (
    e: DraggableEvent,
    data: DraggableData,
    id: string
  ) => Promise<void>;
}

// Dynamically import Draggable with SSR disabled
const Draggable = dynamic(() => import("react-draggable"), { ssr: false });

const DraggableItem: React.FC<DraggableItemProps> = memo(
  ({ position, handleStop }) => {
    const handleStopWrapper = (e: DraggableEvent, data: DraggableData) => {
      handleStop(e, data, position.id).catch((error) => {
        console.error("Error in handleStop:", error);
      });
    };

    return (
      <Draggable
        key={position.id}
        position={{ x: position.x, y: position.y }}
        onStop={handleStopWrapper} // Use the wrapper here
      >
        <div
          className="relative rounded-full border-dashed bg-white shadow-xl p-1 text-bold text-sky-600 text-xl flex items-center justify-center cursor-pointer"
          style={{ width: "5rem", height: "5rem" }}
        >
          {position.id}
        </div>
      </Draggable>
    );
  }
);

export default DraggableItem;
