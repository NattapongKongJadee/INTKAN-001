"use client";
import BigCalendar from "@/app/components/Calendar/calendar";
import CardPostIt from "@/app/components/Post-it/post-it";
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "@/app/components/useLocal";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

// import { RiveDemo } from "./robotITK";
interface Box {
  // name: string;
  id: any;
  title: string;
  description: string;
  boxColor: string;
}

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

export default function Planner() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [jobHeader, setJobHeader] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const [boxes, setBoxes] = useLocalStorage<Box[]>("boxes", []);

  const handleAdd = () => {
    if (boxes.length <= 2) {
      const containerBoxes = [...boxes, []];
      const newItem = {
        id: uuidv4(),
        // name: "",
        title: jobHeader,
        description: "Lorem ipsum",
        boxColor: "white",
      };
      setBoxes((prevBoxes: Box[]) => [...prevBoxes, newItem]);
      console.log(boxes.length);
    } else {
      notifyPageExceeed();
    }
  };

  const handleDeleteBox = (i: any) => {
    handleOpenDelete();
  };

  const handleConfirmDeleteBox = (i: any) => {
    // handleOpenDelete();
    const deleteBoxes = [...boxes];
    deleteBoxes.splice(i, 1);
    setBoxes(deleteBoxes);
    handleCloseDelete();
  };

  const handleAddHeader = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    handleAdd();
    handleClose();
    setJobHeader("");
  };

  const notifyPageExceeed = () => toast.error("เพิ่มกระดาษได้สูงสุด 3 แผ่น");
  return (
    // <SideBarMain>
    <div className="flex flex-row h-screen w-[90vw]">
      <div className="flex row w-[60vw] mx-4 my-4 p-4 bg-neutral-100  rounded-lg shadow-xl">
        <BigCalendar calendarHeight="75svh" calendarWidth="50vw">
          {" "}
        </BigCalendar>
      </div>
      <div className="flex flex-col w-[40vw] bg-neutral-100 rounded-lg shadow-xl ml-4 my-4 relative ">
        <div
          className="bg-orange-global rounded-lg p-2 inline-flex items-center shadow-md"
          style={{ maxWidth: "fit-content" }}
        >
          <IoIosAddCircle
            className="cursor-pointer"
            size={30}
            color="white"
            onClick={handleOpen}
          />
          <button onClick={handleOpen} className="text-lg text-white">
            เพิ่มกระดาษ
          </button>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="flex flex-col items-center m-auto ">
          {boxes.map((data, i) => (
            <div className="relative  mb-4">
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
                  <CardPostIt
                    title={data.title}
                    description={data.description}
                    boxColor={data.boxColor}
                    handleDelete={() => handleDeleteBox(i)}
                    // handleDelete={openDelete}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
          {boxes.length <= 0 && (
            <div className="flex justify-center items-center m-auto cursor-pointer">
              <IoIosAddCircle size={50} color="white" onClick={handleOpen} />
            </div>
          )}
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
                  onClick={handleConfirmDeleteBox}
                >
                  ตกลง
                </Button>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
