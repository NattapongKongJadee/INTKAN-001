"use client";
import BigCalendar from "@/app/components/Calendar/calendar";
import CardPostIt from "@/app/components/Post-it/post-it";
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import "react-toastify/dist/ReactToastify.css";
import { useLocalStorage } from "@/app/components/useLocal";
import SimpleBackdrop from "@/app/components/SimpleBackdrop/SimpleBackDrop";
import { io } from "socket.io-client";

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
import { log } from "node:console";

// import { RiveDemo } from "./robotITK";
interface Box {
  _id: string;
  title: string;
  checkboxList: { label: string; checked: boolean }[];
}

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

export default function Planner() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [jobHeader, setJobHeader] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isClient, setIsClient] = useState(false);

  // const handleAdd = () => {
  //   if (boxes.length <= 2) {
  //     // const containerBoxes = [...boxes, []];
  //     const newItem = {
  //       id: uuidv4(),
  //       title: jobHeader,
  //     };
  //     setBoxes((prevBoxes: Box[]) => [...prevBoxes, newItem]);
  //     console.log(boxes.length);
  //   } else {
  //     notifyPageExceeed();
  //   }
  // };

  const handleAdd = async () => {
    if (boxes.length <= 2) {
      const newItem = {
        title: jobHeader,
        checkboxList: [], // Add any default or empty checkbox list if needed
      };

      try {
        const response = await axios.post(
          // "https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes",
          "https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes",

          newItem
        );
        console.log("New box created:", response.data);
      } catch (error) {
        console.error("Error creating a new box:", error);
      }
    } else {
      notifyPageExceeed();
    }
  };

  const handleOpenDelete = (index: number) => {
    setSelectedBoxIndex(index);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedBoxIndex(null);
  };

  const handleConfirmDeleteBox = async () => {
    console.log(boxes);

    console.log(selectedBoxIndex);

    if (selectedBoxIndex !== null) {
      try {
        const selectedBox = boxes[selectedBoxIndex];
        console.log("Selected Box Object:", selectedBox);
        const boxId = selectedBox._id;

        await axios.delete(
          `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${boxId}`
        );
        const updatedBoxes = [...boxes];
        updatedBoxes.splice(selectedBoxIndex, 1);
        setBoxes(updatedBoxes);
        console.log(`Box with ID ${boxId} deleted successfully`);
      } catch (error) {
        console.error("Error deleting the box:", error);
      } finally {
        handleCloseDelete();
      }
    }
  };

  // const handleConfirmDeleteBox = (i: any) => {
  //   // handleOpenDelete();
  //   const deleteBoxes = [...boxes];
  //   deleteBoxes.splice(i, 1);
  //   setBoxes(deleteBoxes);
  //   handleCloseDelete();
  // };

  const handleAddHeader = (e: any) => {
    e.preventDefault(); // Prevent default form submission
    handleAdd();
    handleClose();
    setJobHeader("");
  };

  const addCheckboxToBox = (boxId: any, newCheckbox: any) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) =>
        box._id === boxId
          ? { ...box, checkboxList: [...box.checkboxList, newCheckbox] }
          : box
      )
    );
  };

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("boxAdded", (newBox) => {
      console.log("New box added:", newBox);
      setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    });

    socket.on("boxDeleted", ({ id }) => {
      console.log("Box deleted:", id);
      // Remove the deleted box from the state
      setBoxes((prevBoxes) => prevBoxes.filter((box) => box._id !== id));
    });

    socket.on("checkboxAdded", ({ id, checkbox }) => {
      setBoxes((prevBoxes) =>
        prevBoxes.map((box) =>
          box._id === id
            ? { ...box, checkboxList: [...box.checkboxList, checkbox] }
            : box
        )
      );
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);
  const fetchBoxes = async () => {
    try {
      const response = await axios.get(
        // "https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes"
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes"
      );
      setBoxes((prevBoxes) => {
        const fetchedBoxes = response.data;
        console.log("Previous Boxes State:", prevBoxes);
        console.log("Fetched Boxes:", response.data);
        return fetchedBoxes.map((fetchedBox: any) => {
          const existingBox = prevBoxes.find(
            (box) => box._id === fetchedBox._id
          );
          return existingBox || fetchedBox; // Keep local changes if available
        });
      });
      console.log("Fetched boxes:", response.data);
    } catch (error) {
      console.error("Error fetching boxes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBoxes();
  }, []);

  const notifyPageExceeed = () => toast.error("เพิ่มกระดาษได้สูงสุด 3 แผ่น");
  useEffect(() => {
    setIsClient(true); // Ensures this component is rendered only on the client-side
  }, []);

  if (!isClient) return null;
  return (
    // <SideBarMain>
    <div className="flex flex-row h-screen w-[calc(100vw-7%)]">
      <div className="flex row w-[60vw] mx-4 my-4 p-4 bg-neutral-100  rounded-lg shadow-xl">
        <BigCalendar calendarHeight="75svh" calendarWidth="50vw">
          {" "}
        </BigCalendar>
      </div>
      <div className="flex flex-col w-[40vw] bg-bg-image rounded-lg shadow-xl ml-4 my-4 relative ">
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
          <button onClick={handleOpen} className="text-lg text-white">
            เพิ่มโน๊ต
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
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            boxes.map((data, i) => (
              <div className="relative mb-4 " key={data._id}>
                <AnimatePresence>
                  <motion.div
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
                      handleDelete={() => handleOpenDelete(i)}
                      id={data._id}
                      checkboxList={data.checkboxList} // Pass checkboxList directly
                      addCheckboxToBox={addCheckboxToBox} //

                      // handleDelete={openDelete}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ))
          )}
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
              <Typography variant="h6" marginBottom={1} sx={{ color: "white" }}>
                หัวข้องาน
              </Typography>
              <TextField
                id="outlined-basic"
                label="หัวข้องาน"
                variant="standard"
                value={jobHeader}
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white", // Text color
                  },
                  "& .MuiInputLabel-root": {
                    color: "white", // Label color
                  },
                  "& .MuiInput-underline:before": {
                    borderBottomColor: "white", // Line color before focus
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white", // Line color after focus
                  },
                }}
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
                <Button
                  variant="contained"
                  onClick={handleCloseDelete}
                  sx={{ bgcolor: "gray", color: "white" }}
                >
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
      <SimpleBackdrop open={isLoading} setOpen={setIsLoading}></SimpleBackdrop>
    </div>
  );
}
