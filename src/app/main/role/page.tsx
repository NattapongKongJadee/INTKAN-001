"use client";
import axios from "axios";
import { IoIosAddCircle } from "react-icons/io";
import CardPlanner from "@/app/view/app/card-role/card-planner";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "../../components/Draggable/DraggableAvatar";
import { useDrop } from "react-dnd";

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
  name: string;
  x: number;
  y: number;
  col: number;
  row: number;
  parentDivId: string;
}

interface Component {
  _id: string;
  title: string;
  description: string;
  remark: string;
  progressionValue: number;
  tier: string;
  step: string;
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
import dynamic from "next/dynamic";
import DraggableContainer from "@/app/components/DraggableContainer/DraggableConatiner";
import { log } from "node:console";
import { io } from "socket.io-client";

export default function Role() {
  const defaultPosition: Position[] = [
    { id: "dad", name: "ป๋า", x: 0, y: 0, col: 0, row: 0, parentDivId: "main" },
    {
      id: "cheer",
      name: "เชียร์",
      x: 0,
      y: 0,
      col: 1,
      row: 0,
      parentDivId: "main",
    },
    {
      id: "new",
      name: "ป๋าน้อย",
      x: 0,
      y: 0,
      col: 2,
      row: 0,
      parentDivId: "main",
    },
    {
      id: "pong",
      name: "พงษ์",
      x: 0,
      y: 0,
      col: 3,
      row: 0,
      parentDivId: "main",
    },
    { id: "nut", name: "นัด", x: 0, y: 0, col: 4, row: 0, parentDivId: "main" },
    {
      id: "mark",
      name: "มาก",
      x: 0,
      y: 0,
      col: 0,
      row: 1,
      parentDivId: "main",
    },
    { id: "boy", name: "บอย", x: 0, y: 0, col: 1, row: 1, parentDivId: "main" },
    {
      id: "wen",
      name: "เหวิน",
      x: 0,
      y: 0,
      col: 2,
      row: 1,
      parentDivId: "main",
    },
    {
      id: "tom",
      name: "ต้อม",
      x: 0,
      y: 0,
      col: 3,
      row: 1,
      parentDivId: "main",
    },
    { id: "m", name: "เอ็ม", x: 0, y: 0, col: 4, row: 1, parentDivId: "main" },
    { id: "o", name: "โอ๋", x: 0, y: 0, col: 0, row: 2, parentDivId: "main" },
    {
      id: "nuna",
      name: "หนูนา",
      x: 0,
      y: 0,
      col: 1,
      row: 2,
      parentDivId: "main",
    },
    {
      id: "tansil",
      name: "แทนซิล",
      x: 0,
      y: 0,
      col: 2,
      row: 2,
      parentDivId: "main",
    },
    {
      id: "meow",
      name: "ป้าแมว",
      x: 0,
      y: 0,
      col: 3,
      row: 2,
      parentDivId: "main",
    },
    {
      id: "aumnuay",
      name: "อำนวย",
      x: 0,
      y: 0,
      col: 4,
      row: 2,
      parentDivId: "main",
    },
  ];

  const ItemTypes = {
    COMPONENT: "component",
  };

  // const [cardBox, setCardBox] = useState<Box[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const targetRef = useRef(null);

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

  const RiveDemo = dynamic(() => import("../../components/robotITK"), {
    ssr: false, // Disable server-side rendering
  });

  const handleStop = (id: string, x: number, y: number, parentId: string) => {
    console.log("handleStop called with:", { id, x, y, parentId });

    setPositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === id ? { ...pos, x, y, parentDivId: parentId } : pos
      )
    );

    axios
      .put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/positions/${id}`,
        {
          x,
          y,
          parentDivId: parentId,
        }
      )
      .catch((error) => console.error("Error updating backend:", error));
  };
  const handleDrop = (
    draggedItemId: any,
    targetComponentId: any,
    dropPosition = { x: 0, y: 0 }
  ) => {
    console.log("Dragged item ID:", draggedItemId);
    console.log("Target component ID to drop into:", targetComponentId);
    console.log("Positions before update:", positions);

    const updatedPositions = positions.map((pos) =>
      pos.id === draggedItemId
        ? {
            ...pos,
            x: dropPosition.x,
            y: dropPosition.y,
            parentDivId: targetComponentId,
          }
        : pos
    );
    setPositions(updatedPositions);
    console.log("Positions state after update:", updatedPositions);

    // Update backend
    axios
      .put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/positions/${draggedItemId}`,
        {
          x: dropPosition.x,
          y: dropPosition.y,
          parentDivId: targetComponentId,
        }
      )
      // .then((response) => {
      //   console.log("Backend update successful:", response.data),
      //     console.log("Check positions after drop", positions);
      // })
      .catch((error) => console.error("Error updating backend:", error));
  };

  const handleDeleteBox = (id: any) => {
    handleOpenDelete(id);
  };
  const handleConfirmDeleteComponents = async () => {
    console.log(selectedComponentId);

    if (selectedComponentId) {
      try {
        const response = await axios.delete(
          `https://backend-itk-581518296545.asia-southeast1.run.app/components/${selectedComponentId}`
        );
        // if (response.status === 204) {
        //   setComponents(
        //     components.filter((e) => e._id !== selectedComponentId)
        //   );
        // alert("Deleted success");
        // } else {
        //   console.log("Failed to Delete Component");
        // }
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
    bgcolor: "#3a88fe",
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
        "https://backend-itk-581518296545.asia-southeast1.run.app/reset-positions",
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
      step: "ผลิต",
      status: "ดำเนินการผลิต",
      date: Date.now(),
      boxColor: "white",
      imagesUrl: null,
    };
    try {
      const response = await axios.post(
        "https://backend-itk-581518296545.asia-southeast1.run.app/components",
        newComponent
      );
      setComponents([...components, response.data]);
      // alert("สำเร็จ !!!");
    } catch (e) {
      console.log("Error for adding components" + e);
    }
  };

  const fetchComponents = async () => {
    try {
      const response = await axios.get(
        "https://backend-itk-581518296545.asia-southeast1.run.app/components"
      );
      console.log("CHECK RESPONE AND DATA components", response.data);

      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const fetchPosition = async () => {
    try {
      const response = await axios.get(
        "https://backend-itk-581518296545.asia-southeast1.run.app/positions"
      );
      console.log("CHECK RESPONE AND DATA positions", response.data);
      setPositions(response.data);
    } catch (e) {
      console.log("Error fetching postiion", e);
    }
  };

  const handleUpdatePercentage = (id: string, progressionValue: number) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, progressionValue } : component
      )
    );
  };

  const handleUpdateRemark = (id: string, remark: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, remark } : component
      )
    );
  };

  const handleUpdateDescription = (id: string, description: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, description } : component
      )
    );
  };

  const handleUpdateTier = (id: string, tier: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, tier } : component
      )
    );
  };

  const handleUpdateStep = (id: string, step: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, step } : component
      )
    );
  };

  const handleUpdateDate = (id: string, date: number) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component._id === id ? { ...component, date } : component
      )
    );
  };

  useEffect(() => {
    fetchComponents();
    fetchPosition();
  }, []);

  useEffect(() => {
    console.log(components);
  }, [components]);

  useEffect(() => {
    console.log("Updated positions state:", positions);
  }, [positions]);

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("componentAdded", (newComponent) => {
      console.log("Received componentAdded event:", newComponent);

      // Update the components state
      setComponents((prevComponents) => [...prevComponents, newComponent]);
    });

    socket.on("componentDeleted", (deletedComponentId) => {
      console.log(
        "Received componentDeleted event for ID:",
        deletedComponentId
      );

      // Update the components state
      setComponents((prevComponents) =>
        prevComponents.filter(
          (component) => component._id !== deletedComponentId
        )
      );
    });
    socket.on("componentUpdated", (updatedComponent) => {
      console.log("Received componentUpdated event:", updatedComponent);

      setComponents((prevComponents) =>
        prevComponents.map((component) =>
          component._id === updatedComponent._id ? updatedComponent : component
        )
      );
    });

    socket.on("positionUpdated", (updatedPosition) => {
      console.log("Received positionUpdated event:", updatedPosition);

      // Update the positions state with the updated position
      setPositions((prevPositions) =>
        prevPositions.map((pos) =>
          pos.id === updatedPosition.id ? { ...pos, ...updatedPosition } : pos
        )
      );
    });

    socket.on("positionsReset", (newPositions) => {
      console.log("Received positionsReset event:", newPositions);
      setPositions(newPositions); // Update the state with the new positions
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);
  const CELL_SIZE = 100; // Define the size of each cell in the grid

  return (
    // <div className=" flex items-center bg-neutral-100 w-1/2">
    <div className="flex flex-row h-full w-[calc(100vw-7%)]">
      <div className="flex flex-col w-[70vw]  ml-4 my-4  bg-bg-image3  rounded-lg shadow-xl relative">
        <div
          className="bg-gradient-to-l from-custom-blue to-custom-cyan rounded-lg p-2 inline-flex items-center shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl hover:brightness-110"
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
              <Typography variant="h6" marginBottom={1} color={"white"}>
                หัวข้องาน
              </Typography>
              <TextField
                id="outlined-basic"
                sx={{
                  input: {
                    color: "white",
                  },
                  "& .MuiInputLabel-root": {
                    color: "white",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
                  },
                }}
                label="หัวข้องาน "
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
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-col m-auto items-start">
            {components.map((data, i) => (
              <div className="relative mb-6" key={data._id}>
                <AnimatePresence>
                  <motion.div
                    key={data._id}
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
                      componentID={data._id}
                      title={data.title}
                      description={data.description}
                      remark={data.remark}
                      progressionValue={data.progressionValue}
                      tier={data.tier}
                      date={data.date}
                      status={data.status}
                      step={data.step}
                      handleDelete={() => handleDeleteBox(data._id)}
                      positions={positions}
                      handleStop={handleStop}
                      onDrop={(draggedItemId, targetComponentId) =>
                        handleDrop(draggedItemId, targetComponentId)
                      }
                      onUpdatePercentage={handleUpdatePercentage}
                      onUpdateRemark={handleUpdateRemark}
                      onUpdateDescription={handleUpdateDescription}
                      onUpdateTier={handleUpdateTier}
                      onUpdateStep={handleUpdateStep}
                      onUpdateDate={handleUpdateDate}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ))}
          </div>
        </DndProvider>
      </div>
      <div className="flex flex-col ">
        <div className="flex relative justify-center items-center mt-10 font-sans text-2xl font-bold italic  text-sky-500    ">
          INTAKAN ENGINEERING
        </div>
        <div style={{ height: 500 }}>
          <RiveDemo />
        </div>
        <div className="bg-gradient-to-l from-custom-blue to-custom-cyan  rounded-lg p-2 ml-4 mt-4 items-center shadow-lg">
          <div className="card justify-center items-center content-center text-white font-sans">
            สมาชิกภายในองค์กร
          </div>
        </div>
        <DndProvider backend={HTML5Backend}>
          <DraggableContainer
            positions={positions}
            handleStop={handleStop}
            resetPosition={resetPosition}
          />
        </DndProvider>
      </div>
    </div>
  );
}
