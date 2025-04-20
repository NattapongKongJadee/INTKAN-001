import React, { useRef } from "react";
import { useDrag } from "react-dnd";

const ItemTypes = {
  COMPONENT: "component",
};

interface DraggableItemProps {
  position: {
    id: string;
    name: string;
    x: number;
    y: number;
  };
  currentParentId: string;
  handleStop: (id: string, x: number, y: number, parentId: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  position,
  currentParentId,
  handleStop,
}) => {
  const [, drag] = useDrag({
    type: ItemTypes.COMPONENT,
    item: { id: position.id },
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        console.log("Drop successful for item:", item);
        const sourceOffset = monitor.getSourceClientOffset();
        if (sourceOffset) {
          handleStop(item.id, sourceOffset.x, sourceOffset.y, currentParentId);
        }
      }
    },
  });
  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      className="
    rounded-full ml-6 my-2 border-dashed bg-white shadow-xl 
    p-1 text-sky-600 lg:text-xl md:text-md flex items-center justify-center cursor-pointer
    w-[3rem] h-[3rem] 
    md:w-[4rem] md:h-[4rem] 
    lg:w-[5rem] lg:h-[5rem]
  "
    >
      {position.name}
    </div>
  );
};

export default DraggableItem;
