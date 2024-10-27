"use client";
import axios from "axios";
import { IoIosAddCircle } from "react-icons/io";
import CardPlanner from "@/app/view/app/card-role/card-planner";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import DraggableItem from "../../components/Draggable/DraggableAvatar";
interface Box {
  // name: string;
  id: any;
  title: string;
  description: string;
  boxColor: string;
  imageUrl: string;
}

interface Position {
  id: string;
  x: number;
  y: number;
  col: number;
  row: number;
  parentDivId: string;
}

interface Component {
  id: string;
  title: string;
  description: string;
  remark: string;
  progressionValue: number;
  tier: string;
  status: string;
  date: number;
  boxColor: string;
  imagesUrl: Array<string>;
}

import {
  Box,
  Button,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DraggableData, DraggableEvent } from "react-draggable";

export default function Role() {
  const defaultPosition: Position[] = [
    { id: "ป๋า", x: 0, y: 0, col: 0, row: 0, parentDivId: "" },
    { id: "เจ้", x: 0, y: 0, col: 1, row: 0, parentDivId: "" },
    { id: "เชียร์", x: 0, y: 0, col: 2, row: 0, parentDivId: "" },
    { id: "ใหม่", x: 0, y: 0, col: 3, row: 0, parentDivId: "" },
    { id: "พงษ์", x: 0, y: 0, col: 0, row: 1, parentDivId: "" },
    { id: "นัท", x: 0, y: 0, col: 1, row: 1, parentDivId: "" },
    { id: "มาร์ค", x: 0, y: 0, col: 2, row: 1, parentDivId: "" },
    { id: "บอย", x: 0, y: 0, col: 3, row: 1, parentDivId: "" },
    { id: "เหวิน", x: 0, y: 0, col: 0, row: 2, parentDivId: "" },
    { id: "ต้อม", x: 0, y: 0, col: 1, row: 2, parentDivId: "" },
    { id: "เอ็ม", x: 0, y: 0, col: 2, row: 2, parentDivId: "" },
    { id: "เอ๋", x: 0, y: 0, col: 3, row: 2, parentDivId: "" },
    { id: "หนูนา", x: 0, y: 0, col: 0, row: 3, parentDivId: "" },
    { id: "แทนซิล", x: 0, y: 0, col: 1, row: 3, parentDivId: "" },
    { id: "ป้าแมว", x: 0, y: 0, col: 2, row: 3, parentDivId: "" },
  ];

  // const [cardBox, setCardBox] = useState<Box[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const handleOpenDelete = (id: string) => {
    console.log(id);
    setSelectedComponentId(id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setSelectedComponentId(null);
    setOpenDelete(false);
  };
  const [jobHeader, setJobHeader] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [components, setComponents] = useState<Component[]>([]);

  const gridSize = 80;

  const determineParentDiv = (componentId: string) => {
    for (const component of components) {
      console.log(
        "COMPONENTS ID ",
        components.map((e) => console.log(e.id))
      );

      console.log("CHECK COMPONENT ID", componentId);

      if (component.id === componentId) {
        return component.id;
      }
    }

    return null; // Default or fallback parentDivId if no match is found
  };

  // const handleStop = async (e: any, data: any, id: any) => {
  //   const newParentDiv = determineParentDiv(id);

  //   if (!positions) {
  //     console.error("Positions array is null or undefined");
  //     return;
  //   }

  //   const updatedPositions: any = positions.map((pos) => {
  //     if (pos.id === id) {
  //       return {
  //         ...pos,
  //         x: data.x,
  //         y: data.y,
  //         col: Math.round(data.x / gridSize),
  //         row: Math.round(data.y / gridSize),
  //         parentDivId: newParentDiv || pos.parentDivId,
  //       };
  //     }
  //     return pos;
  //   });
  //   setPositions(updatedPositions);
  //   try {
  //     await axios.put(`http://localhost:3000/positions/${id}`, {
  //       x: data.x,
  //       y: data.y,
  //       col: Math.round(data.x / gridSize),
  //       row: Math.round(data.y / gridSize),
  //       parentDivId: newParentDiv,
  //     });
  //   } catch (error) {
  //     console.error("Error updating position:", error);
  //   }
  // };

  const handleStop = async (e: any, data: any, id: any) => {
    if (!positions) {
      console.error("Positions array is null or undefined");
      return;
    }

    // Calculate new position
    const newX = data.x;
    const newY = data.y;

    // Update the positions state
    const updatedPositions = positions.map((pos) =>
      pos.id === id ? { ...pos, x: newX, y: newY } : pos
    );
    setPositions(updatedPositions);

    // Update the position on the server
    try {
      await axios.put(`http://localhost:3000/positions/${id}`, {
        x: newX,
        y: newY,
      });
    } catch (error) {
      console.error("Error updating position:", error);
    }
  };

  // const handleStop = async (
  //   e: any,
  //   data: any,
  //   draggableComponentId: string
  // ) => {
  //   // Select the right-side container
  //   const rightContainer = document.querySelector(".right-container");

  //   if (rightContainer) {
  //     const rightContainerRect = rightContainer.getBoundingClientRect();
  //     console.log("Right container bounding box:", rightContainerRect);
  //     // Adjust coordinates to be relative to the document
  //     const newX = data.x + rightContainerRect.left;
  //     const newY = data.y + rightContainerRect.top;

  //     console.log("Adjusted coordinates:", newX, newY);

  //     const newParentDivId = getDroppedOnParentDiv(newX, newY);

  //     if (newParentDivId) {
  //       console.log("New parent div detected:", newParentDivId);
  //       // Proceed with updating the positions or state as necessary...
  //     }
  //   } else {
  //     console.error("Right container not found!");
  //   }
  // };

  function getDroppedOnParentDiv(x: number, y: number): string | null {
    console.log("getDroppedOnParentDiv called with coordinates:", x, y);

    let detectedParentDivId: string | null = null;

    for (const parentDiv of components) {
      console.log("Checking parentDiv:", parentDiv.id);

      const parentElement = document.getElementById(parentDiv.id);

      if (!parentElement) {
        console.warn(`No element found for id: ${parentDiv.id}`);
        continue;
      }

      const rect = parentElement.getBoundingClientRect();

      // Detailed bounding box logs
      console.log(`Bounding box for ${parentDiv.id}:`, rect);

      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        detectedParentDivId = parentDiv.id;
        console.log("Dropped on:", detectedParentDivId);
        break;
      }
    }

    return detectedParentDivId;
  }

  // Update position when the parent div moves
  // function getDroppedOnParentDiv(x: number, y: number): string | null {
  //   let detectedParentDivId: string | null = null;

  //   for (const parentDiv of components) {
  //     console.log("Checking parentDiv:", parentDiv.id);
  //     const parentElement = document.getElementById(parentDiv.id);

  //     if (!parentElement) {
  //       console.warn(`No element found for id: ${parentDiv.id}`);
  //       continue; // Skip this loop iteration if the element is not found
  //     }

  //     const rect = parentElement!.getBoundingClientRect();

  //     // Log bounding box for debugging
  //     console.log("Bounding box for:", parentDiv.id, rect);

  //     if (
  //       x >= rect.left &&
  //       x <= rect.right &&
  //       y >= rect.top &&
  //       y <= rect.bottom
  //     ) {
  //       // If more than one div is a candidate, you might want to prioritize or decide based on some condition
  //       detectedParentDivId = parentDiv.id;
  //       console.log("Dropped on:", detectedParentDivId);
  //       break; // Exit loop if you find the first matching parent div
  //     }
  //   }

  //   return detectedParentDivId;
  // }

  const handleDeleteBox = (id: any) => {
    handleOpenDelete(id);
  };
  const handleConfirmDeleteComponents = async () => {
    console.log(selectedComponentId);

    if (selectedComponentId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/components/${selectedComponentId}`
        );
        if (response.status === 204) {
          setComponents(components.filter((e) => e.id !== selectedComponentId));
          alert("Deleted success");
        } else {
          console.log("Failed to Delete Component");
        }
      } catch (e) {
        console.log("Error deleteing component", e);
      } finally {
        handleCloseDelete();
      }
    }
  };

  const handleAddHeader = (e: any) => {
    e.preventDefault();
    handleAddComponents();
    handleClose();
    setJobHeader("");
  };

  const styleModal = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    textAlign: "center",
    borderRadius: "16px",
    // border: "1px solid #000",
    boxShadow: 12,
    p: 4,
  };

  const resetPosition = async () => {
    setPositions(defaultPosition);
    try {
      await axios.post(
        "http://localhost:3000/reset-positions",
        defaultPosition
      );
    } catch (e) {
      console.error("Error reseting postiions", e);
    }
  };

  const handleAddComponents = async () => {
    const newComponent = {
      title: jobHeader,
      description: null,
      remark: null,
      progressionValue: 0,
      tier: "TIER 1",
      status: "ดำเนินการผลิต",
      date: Date.now(),
      boxColor: "white",
      imagesUrl: null,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/components",
        newComponent
      );
      setComponents([...components, response.data]);
      alert("สำเร็จ !!!");
    } catch (e) {
      console.log("Error for adding components" + e);
    }
  };

  const fetchComponents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/components");
      console.log("CHECK RESPONE AND DATA", response.data);

      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await axios.get("http://localhost:3000/positions");
        setPositions(response.data);
      } catch (e) {
        console.log("Error fetching postiion", e);
      }
    };
    fetchPosition();
  }, []);

  return (
    // <div className=" flex items-center bg-neutral-100 w-1/2">
    <div className="flex flex-row h-full w-[90vw]">
      <div className="flex flex-col w-[70vw]  ml-4 my-4  bg-neutral-100  rounded-lg shadow-xl relative">
        <div
          className="bg-orange-global rounded-lg p-2 mb-4 inline-flex items-center shadow-md"
          style={{ maxWidth: "fit-content" }}
        >
          <IoIosAddCircle
            className="cursor-pointer"
            size={30}
            color="white"
            onClick={handleOpen}
          />
          <button className="text-lg text-white" onClick={handleOpen}>
            เพิ่มงาน
          </button>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <FormControl defaultValue="" required>
              <Typography variant="h6" marginBottom={1}>
                กรุณากรอกหัวข้องาน
              </Typography>
              <TextField
                id="outlined-basic"
                label="หัวข้องาน"
                variant="standard"
                value={jobHeader}
                onChange={(e) => setJobHeader(e.target.value)}
              />
              <div className=" flex flex-row my-4  justify-end items-end ">
                <Button variant="contained" onClick={handleAddHeader}>
                  เพิ่มงาน
                </Button>
              </div>
            </FormControl>
          </Box>
        </Modal>
        <Modal
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <FormControl defaultValue="" required>
              <Typography variant="h6" marginBottom={1} fontSize={18}>
                ยืนยันที่จะลบชิ้นงานใช่หรือไม่
              </Typography>
              <div className=" flex flex-row my-4   items-end justify-between ">
                <Button variant="outlined" onClick={handleCloseDelete}>
                  ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDeleteComponents}
                >
                  ตกลง
                </Button>
              </div>
            </FormControl>
          </Box>
        </Modal>
        {/* <div className="grid grid-cols-2 gap-4 items-start"> */}
        <div className="flex flex-col m-auto items-start">
          {components.map((data, i) => (
            <div className="relative mb-6" key={data.id}>
              <AnimatePresence>
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.15,
                    transition: { duration: 0.65 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardPlanner
                    componentID={data.id}
                    title={data.title}
                    description={data.description}
                    remark={data.remark}
                    progressionValue={data.progressionValue}
                    tier={data.tier}
                    date={data.date}
                    status={data.status}
                    boxColor={data.boxColor}
                    handleDelete={() => handleDeleteBox(data.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="bg-indigo-300 rounded-lg p-2 ml-4 mt-4 items-center shadow-md">
          <div className="card justify-center items-center content-center">
            สมาชิกภายในองค์กร
          </div>
        </div>
        <div className="relative grid grid-cols-4  w-[30vw] h-full  ml-4 my-4 p-6 bg-sky-50  rounded-lg shadow-xl justify-center content-start gap-y-4 right-container">
          <IoIosRefresh
            className="absolute -top-3  bg-gray-200 rounded-full p-2 shadow-xl cursor-pointer hover:bg-red-400"
            size={40}
            onClick={resetPosition}
          />
          {positions.map((position, index) => (
            <DraggableItem
              key={position.id}
              position={position}
              handleStop={handleStop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
