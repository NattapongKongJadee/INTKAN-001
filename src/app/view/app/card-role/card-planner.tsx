/* eslint-disable @next/next/no-img-element */
import {
  Backdrop,
  Card,
  CardContent,
  colors,
  Modal,
  Popper,
  TextField,
  Typography,
} from "@mui/material";

import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { IoIosAddCircle, IoIosImages } from "react-icons/io";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import thLocale from "date-fns/locale/th";
import IconButton from "@mui/material/IconButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Box from "@mui/material/Box";
import { CiSquarePlus } from "react-icons/ci";
import { IoImageSharp } from "react-icons/io5";
import axios from "axios";
import { useDrop } from "react-dnd";
import DraggableItem from "@/app/components/Draggable/DraggableAvatar";
import { log } from "node:console";
import { useMediaQuery } from "@mui/material";
import { io } from "socket.io-client";

interface CardPlannerProps {
  componentID: string;
  title: string;
  description?: string;
  remark?: string;
  progressionValue?: number;
  tier?: string;
  step?: string;
  status?: string;
  date?: number;
  handleDelete: () => void;
  onDrop: (draggedItemId: string, targetComponentId: string) => void;
  positions: Position[]; // Add positions here
  children?: React.ReactNode;
  handleStop: (id: string, x: number, y: number, parentId: string) => void;
  onUpdatePercentage: (id: string, progressionValue: number) => void;
  onUpdateRemark: (id: string, remark: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateTier: (id: string, tier: string) => void;
  onUpdateStep: (id: string, step: string) => void;
  onUpdateDate: (id: string, date: number) => void;
}

const ItemTypes = {
  COMPONENT: "component",
};

interface Position {
  id: string;
  name: string;
  x: number;
  y: number;
  col: number;
  row: number;
  parentDivId: string;
}

const CardPlanner: React.FC<CardPlannerProps> = ({
  title,
  description,
  remark,
  progressionValue,
  tier,
  status,
  step,
  date,
  handleDelete,
  onDrop,
  componentID,
  positions,
  handleStop,
  onUpdatePercentage,
  onUpdateRemark,
  onUpdateDescription,
  onUpdateTier,
  onUpdateStep,
  onUpdateDate,
}: any) => {
  const [contentRemark, setContentRemark] = useState<string>(remark);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [priority, setPriority] = useState<string>(tier);
  const [newStep, setNewStep] = useState<string>(step);
  const [isEditingContent, isSetEditingContent] = useState<boolean>(false);
  const [isEditingRemark, isSetEditingRemark] = useState<boolean>(false);
  const [isEditingPriority, isSetPriority] = useState<boolean>(false);
  const [percentage, setPercentage] = useState(progressionValue);
  const [editingPercentage, setEditingPercentage] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [openCalendar, setOpenCalendar] = useState(false);
  const [imagesUrls, setImageUrls] = useState<any>([]);
  const [imageModal, setImageModal] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const isLargeScreen = useMediaQuery("(min-width:1500px)");
  const isMediumScreen = useMediaQuery("(min-width:900px)");
  const steps = ["ผลิต", "ติดตั้ง", "แก้ไขงาน", "ส่งมอบ"];

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.COMPONENT,
    drop: (item: any, monitor: any) => {
      const offset = monitor.getClientOffset();
      const targetElementRect = targetRef.current?.getBoundingClientRect();

      if (!offset || !targetElementRect) return;

      const dropPosition = {
        x: offset.x - targetElementRect.left,
        y: offset.y - targetElementRect.top,
      };

      onDrop(item.id, componentID, dropPosition);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(targetRef);

  const itemsInThisCard = positions.filter(
    (pos: any) => pos.parentDivId === componentID
  );

  const styleModalImage = {
    position: "absolute",
    // border: "2px solid #F8F8FF",
    borderRadius: "24px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "80%",
    overflowY: "auto",
    zIndex: 1000,
  };

  const buttonRef = useRef<HTMLInputElement>(null);
  const handleButton = (e: React.MouseEvent) => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageToComponent = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
        // alert("อัพโหลดสำเร็จ");
        fecthImages();
      } else {
        setUploadStatus("File upload failed.");
        // alert("อัพโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      setUploadStatus("File upload failed.");
      // alert("อัพโหลดไม่สำเร็จ");
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDeleteImage = async (imagesUrl: string) => {
    try {
      const response = await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}/image`,
        {
          data: { imagesUrl }, // Sending the image URL in the request body
        }
      );

      if (response.status === 200) {
        console.log("Image deleted successfully:", response.data);
        // alert("ลบสำเร็จ");
      } else {
        console.log("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
    fecthImages();
  };

  const handleClearUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const fecthImages = async () => {
    try {
      const response = await axios.get(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}/image`
      );
      if (response.status === 200) {
        const { images } = response.data;
        setImageUrls(images);
      } else {
        console.log("Failed to fetch Images");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenImage = () => {
    setImageModal(true);
    fecthImages();
  };

  const handleCloseImage = () => {
    setImageModal(false);
    setImageUrls([]);
  };
  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  const handleChangeDescription = (e: any) => {
    setNewDescription(e.target.value);
  };
  const handleDetailContentOnBlur = async () => {
    console.log(componentID);
    try {
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        {
          description: newDescription,
        }
      );
      if (response.status === 200) {
        onUpdateDescription(componentID, newDescription);
        console.log("Description updated successfully");
      } else {
        console.log("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      isSetEditingContent(false);
    }
  };

  const handleChangeRemark = (e: any) => {
    setContentRemark(e.target.value);
  };

  const handleDetailRemarkOnBlur = async () => {
    try {
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        {
          remark: contentRemark,
        }
      );
      if (response.status === 200) {
        onUpdateRemark(componentID, contentRemark);

        console.log("Description updated successfully");
      } else {
        console.log("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      isSetEditingRemark(false);
    }
  };

  const handleChangePriority = (e: any) => {
    console.log(e.target.value);
    setPriority(e.target.value);
    // isSetPriority(false);
  };

  const handleDetailPriorityOnBlur = async () => {
    console.log(priority);

    try {
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        {
          tier: priority,
        }
      );
      if (response.status === 200) {
        onUpdateTier(componentID, priority);
        console.log("Priority updated successfully");
      } else {
        console.log("Failed to update priority");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      isSetPriority(false);
    }
  };
  const handleDoubleClickOnDescription = () => {
    isSetEditingContent(true);
  };
  const handleDobuleClickOnRemark = () => {
    isSetEditingRemark(true);
  };

  const handleDoubleClickPercentage = () => {
    setEditingPercentage(true);
  };
  const handleClickPriority = () => {
    isSetPriority(true);
  };

  const handleStepClick = async (selectedStepIndex: any) => {
    const selectedStep = steps[selectedStepIndex];
    setNewStep(selectedStep); // Update step state
    try {
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        { step: selectedStep }
      );
      if (response.status === 200) {
        console.log("seelcted tep", selectedStep);

        console.log("Step updated successfully");
        onUpdateStep(componentID, selectedStep);
      } else {
        console.log("Failed to update step");
      }
    } catch (error) {
      console.error("Error updating step:", error);
    }
  };
  const handleChangePercentage = (e: any) => {
    const newPercentage = Math.max(0, Math.min(100, e.target.value));
    setPercentage(newPercentage);
  };
  const handleOnBlurPercentage = async () => {
    try {
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        {
          progressionValue: percentage,
        }
      );
      if (response.status === 200) {
        console.log("Percentage updated successfully");

        // Notify the parent about the update
        onUpdatePercentage(componentID, percentage);
        console.log("Description updated successfully");
      } else {
        console.log("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      setEditingPercentage(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleOnBlurPercentage();
    }
  };
  const closeFullscreen = () => {
    setFullscreenImage(null);
  };
  const openFullscreen = (url: any) => {
    setFullscreenImage(url);
  };

  const getBadgeClass = () => {
    switch (priority) {
      case "TIER 1":
        return "badge  bg-red-600 text-white p-4 zindex-999";
      case "TIER 2":
        return "badge bg-blue-600 text-white p-4";
      case "TIER 3":
        return "badge bg-gray-500 text-white p-4";
      default:
        return "badge bg-gray-500 text-white p-4";
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "Invalid Date"; // Handle null or undefined

    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date"; // Handle cases where the date is invalid
    }

    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  };

  const handleDateChange = async (newValue: Date | null) => {
    console.log(componentID);

    if (!newValue) return;

    // Update the selected date in state
    setSelectedDate(newValue);

    try {
      // Make the PUT request to update the date in the backend
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/components/${componentID}`,
        {
          date: newValue.getTime(), // Send the date as a timestamp
        }
      );

      if (response.status === 200) {
        onUpdateDate(componentID, newValue.getTime());
        console.log("Date updated successfully:", response.data);
      } else {
        console.log("Failed to update date");
      }
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("imageAddedToComponent", ({ componentId, imageUrl }) => {
      console.log("Received imageAddedToComponent event:", {
        componentId,
        imageUrl,
      });

      // Update the component's images in real-time
      setImageUrls((prevImageUrls: any[]) => [...prevImageUrls, imageUrl]);
    });
    socket.on("imageDeletedFromComponent", ({ componentId, imagesUrl }) => {
      console.log("Received imageDeletedFromComponent event:", {
        componentId,
        imagesUrl,
      });

      // Update the imageUrls state directly
      setImageUrls((prevImageUrls: string[]) =>
        prevImageUrls.filter((url) => url !== imagesUrl)
      );
    });

    // socket.on("componentUpdated", (updatedComponent) => {
    //   console.log("Received componentUpdated event:", updatedComponent);

    // setComponents((prevComponents) =>
    //   prevComponents.map((component) =>
    //     component._id === updatedComponent._id ? updatedComponent : component
    //   )
    // );
    // });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);

  useEffect(() => {
    setPercentage(progressionValue);
  }, [progressionValue]);
  useEffect(() => {
    setContentRemark(remark);
  }, [remark]);
  useEffect(() => {
    setNewDescription(description);
  }, [description]);
  useEffect(() => {
    setPriority(tier);
  }, [tier]);
  useEffect(() => {
    setNewStep(step);
  }, [step]);
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);
  return (
    <div ref={targetRef} style={{ position: "relative" }}>
      <Card
        id={componentID}
        style={{
          borderRadius: "16px",
          borderColor: "blue",
        }}
        className={`flex flex-row  relative md:w-[800px] md:h-[280px]   lg:w-[1100px] lg:h-[350px]    transition-shadow duration-300 ease-in-out cursor-pointer overflow-y-auto ${
          isOver ? "border-2 border-orange-500" : "border-purple"
        }`}
      >
        <div className="absolute top-0 left-0 items-center mr-5 shrink-0">
          {isEditingPriority ? (
            <select
              value={priority}
              onChange={handleChangePriority}
              onBlur={handleDetailPriorityOnBlur}
              autoFocus
              className="select select-ghost"
            >
              <option value="TIER 1">TIER 1</option>
              <option value="TIER 2">TIER 2</option>
              <option value="TIER 3">TIER 3</option>
            </select>
          ) : (
            <div className={`${getBadgeClass()}`} onClick={handleClickPriority}>
              {priority}
            </div>
          )}
        </div>
        <CardContent className="flex flex-row w-screen">
          <div className="flex flex-row items-start mt-4">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={thLocale}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                  // marginTop: 1,
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    position: "absolute",
                    top: "-10px",
                    left: "100px",
                    marginRight: "10px",
                    marginTop: "10px",
                  }}
                  gutterBottom
                  variant="h5"
                  component="div"
                  color={"black"}
                >
                  {title}
                </Typography>
                <IconButton onClick={handleOpenCalendar}>
                  <CalendarTodayIcon sx={{ color: "blue" }} />
                </IconButton>
                <DatePicker
                  open={openCalendar}
                  onOpen={handleOpenCalendar}
                  onClose={handleCloseCalendar}
                  value={selectedDate}
                  onChange={(newValue) => handleDateChange(newValue!)}
                  renderInput={(params) => (
                    <div style={{ visibility: "hidden", position: "absolute" }}>
                      <TextField {...params} />
                    </div>
                  )}
                  PopperProps={{ placement: "auto-end" }}
                />
                {selectedDate && (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      marginLeft: 2,
                      marginTop: "6px",
                      alignItems: "end",
                      minWidth: { md: "200px", lg: "300px" },
                      fontWeight: "semibold",
                      color: "blue",
                    }}
                  >
                    {formatDate(selectedDate)}
                  </Typography>
                )}
              </Box>
            </LocalizationProvider>
            <div className="absolute mt-10 grid grid-cols-3">
              {itemsInThisCard.map((position: any) => (
                <DraggableItem
                  key={position.id}
                  position={position}
                  currentParentId={position.parentDivId || "main"}
                  handleStop={handleStop}
                />
              ))}
            </div>{" "}
          </div>
          <div className="flex flex-row w-2/3 lg:ml-2 md:ml-6  mb-5 ">
            <div className="flex flex-col mr-6 ">
              <div className="flex h-full mt-6 flex-col mb-4 text-black    text-md md:min-w[200px]  lg:min-w-[365px]">
                {isEditingContent ? (
                  <textarea
                    className="plain-input"
                    style={{
                      width: "90%",
                      height: "auto",
                      borderRadius: "1px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                    }}
                    value={newDescription}
                    onChange={handleChangeDescription}
                    onBlur={handleDetailContentOnBlur}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={handleDoubleClickOnDescription}
                    className="flex-wrap"
                    style={{
                      display: "block",
                      width: "90%",
                      flexShrink: "0",
                      wordBreak: "break-word",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "blue" }}>รายละเอียดงาน:</span>{" "}
                    {newDescription}
                  </span>
                )}
              </div>
              <div className="flex h-screen flex-col  ">
                {isEditingRemark ? (
                  <textarea
                    className="plain-input"
                    style={{
                      fontSize: "16px",
                      height: "auto",
                      width: "80%",
                      borderRadius: "1px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      minHeight: "200px",
                    }}
                    value={contentRemark}
                    onChange={handleChangeRemark}
                    onBlur={handleDetailRemarkOnBlur}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={handleDobuleClickOnRemark}
                    className="flex-wrap text-md"
                    style={{
                      display: "block",
                      width: "70%",
                      wordBreak: "break-word",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{ color: "blue" }}
                      className="lg:text-md mg:text-sm"
                    >
                      หมายเหตุ:
                    </span>{" "}
                    {contentRemark}
                  </span>
                )}
              </div>
              {/* </div> */}
            </div>
            <div className=" flex shrink-0  ml-auto w-px h-auto bg-gray-400 mx-4 self-stretch"></div>{" "}
            <div className="flex flex-col justify-start  ml-auto shrink-0">
              <div className="flex flex-row mb-10 justify-between">
                <div
                  className="
                  radial-progress text-indigo-600 md:my-4 lg:my-6 ml-8 hover:brightness-110
                  md:[--size:5rem] lg:[--size:6rem] xl:[--size:8rem]
                "
                  style={
                    {
                      "--value": percentage,
                      "--size": "6rem",
                      "--thickness": "0.75rem",
                    } as React.CSSProperties
                  }
                  role="progressbar"
                  onDoubleClick={handleDoubleClickPercentage}
                >
                  {editingPercentage ? (
                    <input
                      type="number"
                      value={percentage}
                      onChange={handleChangePercentage}
                      onBlur={handleOnBlurPercentage}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      style={{
                        width: "3rem",
                        textAlign: "center",
                        border: "none",
                        outline: "none",
                        fontSize: "1rem",
                      }}
                    />
                  ) : (
                    `${percentage}%`
                  )}
                </div>
                <div className="flex items-center mr-8  text-indigo-600 hover:text-green-500">
                  <IoImageSharp
                    size={isLargeScreen ? 70 : isMediumScreen ? 40 : 50}
                    onClick={handleOpenImage}
                  />
                </div>
              </div>

              <ul className="steps w-full  ">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className={`step   ${
                      index <= steps.indexOf(newStep) ? "step-primary" : ""
                    }`}
                    style={{
                      width:
                        window.innerWidth >= 1500
                          ? "4rem"
                          : window.innerWidth >= 1000
                          ? "2rem"
                          : "2rem",
                    }}
                    onClick={() => handleStepClick(index)}
                  >
                    {step}
                  </li>
                ))}
              </ul>
              {/* <div className="flex flex-row my-4 justify-center">
                <div className="flex items-center mr-5 shrink-0">
                  {isEditingStatus ? (
                    <select
                      value={newStatus}
                      onChange={handleChangeStatus}
                      onBlur={handleDetailStatusOnBlur}
                      autoFocus
                      className="select select-ghost"
                    >
                      <option value="ดำเนินการผลิต">ดำเนินการผลิต</option>
                      <option value="ดำเนินการติดตั้ง">ดำเนินการติดตั้ง</option>
                      <option value="พักไว้">พักไว้</option>
                    </select>
                  ) : (
                    <div
                      className="badge bg-gray-500 text-white p-4"
                      onClick={handleDoubleClickStatus}
                    >
                      สถานะ:{newStatus}
                    </div>
                  )}
                </div>
              </div> */}
            </div>
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: 2000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              open={Boolean(fullscreenImage)}
              onClick={closeFullscreen}
            >
              {fullscreenImage && (
                <img
                  src={fullscreenImage}
                  alt="Fullscreen"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </Backdrop>
            <Modal
              open={imageModal}
              onClose={handleCloseImage}
              aria-labelledby="image-modal-title"
              aria-describedby="image-modal-description"
            >
              <Box sx={styleModalImage}>
                {/* <div className="text-xl">รูปภาพประกอบ</div> */}
                <div className="flex flex-wrap">
                  {/* {imagesUrls.length === 0 && <p>Loading images...</p>} */}
                  <input
                    ref={buttonRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex w-96 h-72 mt-5 border-4 border-dashed border-sky-500 rounded-lg m-8 items-center justify-center">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-xs max-h-64 mb-2"
                      />
                    )}
                    {!previewUrl && (
                      <CiSquarePlus
                        className="text-indigo-500 cursor-pointer"
                        size={40}
                        onClick={handleButton}
                      />
                    )}
                    {selectedFile && (
                      <div className="absolute top-0 left-10 flex flex-row items-center mt-4">
                        <button
                          onClick={handleAddImageToComponent}
                          className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                        >
                          Upload File
                        </button>
                        <button
                          onClick={handleClearUpload}
                          className="bg-red-500 text-white py-2 px-4 rounded mt-2 ml-2"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {imagesUrls.map((url: string, index: number) => {
                    console.log(url);
                    return (
                      <div className="flex relative" key={index}>
                        <img
                          onClick={() => openFullscreen(url)}
                          key={index}
                          src={url}
                          alt={`Image ${index}`}
                          className="flex border-4 border-dashed border-sky-500 rounded-lg cursor-pointer m-8 max-w-96 max-h-72"
                        />
                        <TiDelete
                          size={36}
                          className="absolute right-0 top-0 text-red-500 cursor-pointer"
                          onClick={() => handleDeleteImage(url!)}
                        />
                      </div>
                    );
                  })}
                </div>
              </Box>
            </Modal>
          </div>
          {/* </div> */}
        </CardContent>
        <div
          className=" absolute top-0 right-0 rounded-badge p-2 bg-gray-300 hover:bg-red-500 cursor-pointer"
          style={{ transition: "background-color 0.3s" }}
          onClick={() => handleDelete()}
        >
          <FaTrashAlt />
        </div>
      </Card>
    </div>
  );
};

export default CardPlanner;
