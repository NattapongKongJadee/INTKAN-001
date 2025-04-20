import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { IoIosRefresh } from "react-icons/io";
import DraggableItem from "../Draggable/DraggableAvatar";

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
  col: number;
  row: number;
  parentDivId: string;
}

interface DraggableContainerProps {
  positions: Position[];
  handleStop: (id: string, x: number, y: number, parentId: string) => void;
  resetPosition: () => void;
}

const CELL_SIZE = 100;

const DraggableContainer: React.FC<DraggableContainerProps> = ({
  positions,
  handleStop,
  resetPosition,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  // Setup the drop area
  const [{ isOverMain }, dropMain] = useDrop({
    accept: "component",
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      const targetElementRect = targetRef.current?.getBoundingClientRect();
      if (!offset || !targetElementRect) return;

      const dropPosition = {
        x: offset.x - targetElementRect.left,
        y: offset.y - targetElementRect.top,
      };

      handleStop(item.id, dropPosition.x, dropPosition.y, "main");
    },
    collect: (monitor) => ({
      isOverMain: !!monitor.isOver(),
    }),
  });

  dropMain(targetRef);

  return (
    <div
      ref={targetRef}
      id="main"
      className={`relative grid w-[30vw] min-h-[35vh] ml-4 my-2 bg-neutral-100 rounded-lg shadow-xl justify-center items-start  overflow-y-auto 
        ${isOverMain ? "border-2 border-sky-600" : "border-purple"}`}
    >
      {/* Refresh Button */}
      <IoIosRefresh
        className="absolute top-0 right-0 text-white bg-gray-200 rounded-full p-2 shadow-xl cursor-pointer hover:bg-green-500"
        size={35}
        onClick={resetPosition}
      />

      {/* Render Draggable Items */}
      <div className="grid grid-cols-4 gap-4">
        {positions
          .filter((position) => position.parentDivId === "main")
          .map((position) => (
            <DraggableItem
              key={position.id}
              position={position}
              currentParentId={"main"}
              handleStop={handleStop}
            />
          ))}
      </div>
    </div>
  );
};

export default DraggableContainer;
