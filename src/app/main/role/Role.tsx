"use client";
import Image from "next/image";
import { IoIosAddCircle } from "react-icons/io";
import CardPlanner from "@/app/view/app/card-role/card-planner";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useMemo, useRef, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import DadImg from "../../assets/images/organize_picture/dad_edit.png";
import PCheer from "../../assets/images/organize_picture/heavyweight.png";
import AE from "../../assets/images/organize_picture/AE1.png";
import Boy from "../../assets/images/organize_picture/Boy.png";
import Cat from "../../assets/images/organize_picture/Cat.png";
import Jor from "../../assets/images/organize_picture/Jor.png";
import M from "../../assets/images/organize_picture/M.png";
import Mark from "../../assets/images/organize_picture/Mark.png";
import Mom from "../../assets/images/organize_picture/mom.png";
import New from "../../assets/images/organize_picture/New.png";
import NhuNa from "../../assets/images/organize_picture/NhuNa.png";
import Nut from "../../assets/images/organize_picture/Nut.png";
import Pong from "../../assets/images/organize_picture/Pong.png";
import Tansil from "../../assets/images/organize_picture/Tansil.png";
import Tom from "../../assets/images/organize_picture/Tom.png";
import { Box, FormControl, Modal, Typography } from "@mui/material";
import { Box, Draggable } from "./page";

export default function Role() {
  const defaultPosition = [
    { id: "dad", x: 0, y: 0 },
    { id: "mom", x: 0, y: 0 },
    { id: "cheer", x: 0, y: 0 },
    { id: "new", x: 0, y: 0 },
    { id: "pong", x: 0, y: 0 },
    { id: "nut", x: 0, y: 0 },
    { id: "mark", x: 0, y: 0 },
    { id: "boy", x: 0, y: 0 },
    { id: "jor", x: 0, y: 0 },
    { id: "tom", x: 0, y: 0 },
    { id: "m", x: 0, y: 0 },
    { id: "ae", x: 0, y: 0 },
    { id: "nn", x: 0, y: 0 },
    { id: "tansil", x: 0, y: 0 },
    { id: "cat", x: 0, y: 0 },
  ];
  const [cardBox, setCardBox] = useState<Box[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [positions, setPositions] = useState(defaultPosition);

  const handleDrag = (e: any, data: any, id: any) => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) =>
        pos.id === id ? { ...pos, x: data.x, y: data.y } : pos
      )
    );
  };

  const resetPosition = () => {
    setPositions(defaultPosition);
  };

  const onDragging = () => {
    isDraggingRef.current = true;
  };

  const onStart = () => {
    isDraggingRef.current = true;
  };

  const onStop = () => {
    isDraggingRef.current = false;
  };
  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  const handleClick = (e: any) => {
    if (isDragging) {
      e.preventDefault();
    } else {
      onDragging();
      console.log("Image clicked!");
    }
  };

  const handleAdd = () => {
    const containerBoxes = [...cardBox, []];
    const newItem = {
      id: uuidv4(),
      title: "TEST",
      description: "Lorem ipsum",
      boxColor: "white",
    };
    setCardBox((prevBoxes: Box[]) => [...prevBoxes, newItem]);
    console.log(cardBox.length);
  };
  const imageElement = useMemo(
    () => (
      <img
        src={DadImg.src}
        className="w-full h-full rounded-full border-dashed bg-orange-500 shadow-xl object-contain"
        alt="Cheer"
      />
    ),
    [DadImg.src]
  );

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
        {/* <div className="grid grid-cols-2 gap-4 items-start"> */}
        <div className="flex flex-col m-auto items-start">
          {cardBox.map((data, i) => (
            <div className="relative mb-6">
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
                    title={data.title}
                    description={data.description}
                    boxColor={data.boxColor}
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
        <div className="relative grid grid-cols-4 auto-rows-auto gap-x-3 gap-y-5 w-[30vw] h-full  ml-4 my-4 p-4 bg-sky-50  rounded-lg shadow-xl">
          <IoIosRefresh
            className="absolute -top-3  bg-gray-200 rounded-full p-2 shadow-xl cursor-pointer hover:bg-red-400"
            size={40}
            onClick={resetPosition}
          />
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[0].x, y: positions[0].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[0].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[0].id}
            >
              <Image
                src="/dad_edit.png"
                alt="Cheer"
                width={110}
                height={110}
                className="rounded-full border-dashed bg-orange-500 shadow-xl object-contain"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[1].x, y: positions[1].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[1].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[1].id}
            >
              <img
                src={Mom.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[2].x, y: positions[2].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[2].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[2].id}
            >
              <img
                src={PCheer.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[3].x, y: positions[3].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[3].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[3].id}
            >
              <img
                src={New.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[4].x, y: positions[4].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[4].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[4].id}
            >
              <img
                src={Pong.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[5].x, y: positions[5].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[5].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[5].id}
            >
              <img
                src={Nut.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[6].x, y: positions[6].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[6].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[6].id}
            >
              <img
                src={Mark.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[7].x, y: positions[7].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[7].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[7].id}
            >
              <img
                src={Boy.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[8].x, y: positions[8].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[8].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[8].id}
            >
              <img
                src={Jor.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[9].x, y: positions[9].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[9].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[9].id}
            >
              <img
                src={Tom.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[10].x, y: positions[10].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[10].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[10].id}
            >
              <img
                src={M.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[11].x, y: positions[11].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[11].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[11].id}
            >
              <img
                src={AE.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[12].x, y: positions[12].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[12].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[12].id}
            >
              <img
                src={NhuNa.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[13].x, y: positions[13].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[13].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[13].id}
            >
              <img
                src={Tansil.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
          <Draggable
            allowAnyClick={true}
            position={{ x: positions[14].x, y: positions[14].y }}
            onDrag={(e, data) => handleDrag(e, data, positions[14].id)}
          >
            <div
              className=" w-[110px] h-[110px] cursor-pointer"
              key={positions[14].id}
            >
              <img
                src={Cat.src}
                className="w-full h-full rounded-full  bg-orange-500 shadow-xl object-fill"
                alt="Cheer"
              />
            </div>
          </Draggable>
        </div>
      </div>
    </div>
  );
}
