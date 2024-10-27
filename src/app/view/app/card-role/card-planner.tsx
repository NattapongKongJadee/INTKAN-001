import { Backdrop, Card, CardContent, Modal, Typography } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { IoIosImages } from "react-icons/io";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import thLocale from "date-fns/locale/th";
import IconButton from "@mui/material/IconButton";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Box from "@mui/material/Box";
import { CiSquarePlus } from "react-icons/ci";
import axios from "axios";

const CardPlanner = ({
  title,
  description,
  remark,
  progressionValue,
  tier,
  status,
  date,
  boxColor,
  handleDelete,
  componentID,
}: any) => {
  const [contentRemark, setContentRemark] = useState<string>(remark);
  const [newDescription, setNewDescription] = useState<string>(description);
  const [priority, setPriority] = useState<string>(tier);
  const [newStatus, setNewStatus] = useState<string>(status);
  const [isEditingContent, isSetEditingContent] = useState<boolean>(false);
  const [isEditingRemark, isSetEditingRemark] = useState<boolean>(false);
  const [isEditingPriority, isSetPriority] = useState<boolean>(false);
  const [isEditingStatus, isSetEditingStatus] = useState<boolean>(false);
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
        `http://localhost:3000/components/${componentID}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
        alert("อัพโหลดสำเร็จ");
        fecthImages();
      } else {
        setUploadStatus("File upload failed.");
        alert("อัพโหลดไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      setUploadStatus("File upload failed.");
      alert("อัพโหลดไม่สำเร็จ");
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDeleteImage = async (imagesUrl: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/components/${componentID}/image`,
        {
          data: { imagesUrl }, // Sending the image URL in the request body
        }
      );

      if (response.status === 200) {
        console.log("Image deleted successfully:", response.data);
        alert("ลบสำเร็จ");
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
        `http://localhost:3000/components/${componentID}/image`
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
        `http://localhost:3000/components/${componentID}`,
        {
          description: newDescription,
        }
      );
      if (response.status === 200) {
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
        `http://localhost:3000/components/${componentID}`,
        {
          remark: contentRemark,
        }
      );
      if (response.status === 200) {
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
        `http://localhost:3000/components/${componentID}`,
        {
          tier: priority,
        }
      );
      if (response.status === 200) {
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

  const handleDoubleClickStatus = () => {
    isSetEditingStatus(true);
  };

  const handleChangeStatus = (e: any) => {
    setNewStatus(e.target.value);
    // isSetEditingStatus(false);
  };
  const handleDetailStatusOnBlur = async () => {
    console.log(status);
    try {
      const response = await axios.put(
        `http://localhost:3000/components/${componentID}`,
        {
          status: newStatus,
        }
      );
      if (response.status === 200) {
        console.log("Status updated successfully");
      } else {
        console.log("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      isSetEditingStatus(false);
    }
  };

  const handleChangePercentage = (e: any) => {
    const newPercentage = Math.max(0, Math.min(100, e.target.value));
    setPercentage(newPercentage);
  };
  const handleOnBlurPercentage = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/components/${componentID}`,
        {
          progressionValue: percentage,
        }
      );
      if (response.status === 200) {
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
        return "badge badge-error"; // blue
      case "TIER 2":
        return "badge badge-secondary"; // grey
      case "TIER 3":
        return "badge badge-primary"; // red
      default:
        return "badge badge-primary";
    }
  };

  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };
  const handleDateChange = async (newValue: Date | null) => {
    if (!newValue) return;

    // Update the selected date in state
    setSelectedDate(newValue);

    try {
      // Make the PUT request to update the date in the backend
      const response = await axios.put(
        `http://localhost:3000/components/${componentID}`,
        {
          date: newValue.getTime(), // Send the date as a timestamp
        }
      );

      if (response.status === 200) {
        console.log("Date updated successfully:", response.data);
      } else {
        console.log("Failed to update date");
      }
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  // useEffect(() => {
  //   fecthImages();
  // }, []);
  return (
    <div className="relative m-auto">
      <Card
        id={componentID}
        className="flex flex-row relative w-[1100px] h-[350px] shadow-md rounded-xl border border-white bg-[${boxColor}] transition-shadow duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg"
      >
        <CardContent className="flex flex-row w-screen">
          <div className="flex flex-row items-start">
            <Box
              sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
            >
              <Typography
                // className="mr-10"
                sx={{
                  display: "flex",
                  marginRight: "10px",
                }}
                gutterBottom
                variant="h5"
                component="div"
                color={"black"}
              >
                {title}
              </Typography>
              {selectedDate && (
                <Typography
                  variant="body1"
                  sx={{ display: "flex", marginLeft: 2, alignItems: "end" }}
                >
                  {formatDate(selectedDate)}
                </Typography>
              )}
            </Box>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={thLocale}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={handleOpenCalendar}>
                  <CalendarTodayIcon />
                </IconButton>
                <DatePicker
                  open={openCalendar}
                  onOpen={handleOpenCalendar}
                  onClose={handleCloseCalendar}
                  value={selectedDate}
                  onChange={(newValue) => handleDateChange(newValue!)}
                  renderInput={(params) => <div style={{ display: "none" }} />}
                />
              </Box>
            </LocalizationProvider>
          </div>
          <div className="grid grid-cols-4 gap-4 auto-rows-max"></div>
          <div className="flex flex-col w-1/2 ml-auto mb-5 ">
            <div className="flex h-full  flex-row  mb-5 ">
              <div
                className=" ml-4 mb-4 text-indigo-600 "
                style={{ width: "100%" }}
              >
                {isEditingContent ? (
                  <textarea
                    className="plain-input"
                    style={{
                      fontSize: "16px",
                      width: "100%",
                      borderRadius: "1px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      // flexFlow: "wrap",
                    }}
                    // type="text"
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
                      wordBreak: "break-word",
                      marginBottom: "4px",
                    }}
                  >
                    รายละเอียดงาน:{newDescription}
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-full  flex-col  mb-4">
              <div
                className="divider-vertical ml-4 text-gray-500"
                style={{ width: "100%" }}
              >
                {isEditingRemark ? (
                  <textarea
                    className="plain-input"
                    style={{
                      fontSize: "16px",
                      width: "100%",
                      borderRadius: "1px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      // flexFlow: "wrap",
                    }}
                    // type="text"
                    value={contentRemark}
                    onChange={handleChangeRemark}
                    onBlur={handleDetailRemarkOnBlur}
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={handleDobuleClickOnRemark}
                    className="flex-wrap"
                    style={{
                      display: "block",
                      wordBreak: "break-word",
                      marginBottom: "4px",
                    }}
                  >
                    หมายเหตุ :{contentRemark}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-start mt-5">
              <div
                className="radial-progress text-success my-6 mr-10"
                style={{
                  "--value": percentage,
                  "--size": "6rem",
                  "--thickness": "0.5rem",
                }}
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
              <div className="flex items-center mr-5">
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
                  <div
                    className={getBadgeClass()}
                    onClick={handleClickPriority}
                  >
                    {priority}
                  </div>
                )}
              </div>
              <div className="flex items-center mr-5">
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
                    className="badge badge-info"
                    onClick={handleDoubleClickStatus}
                  >
                    สถานะ:{newStatus}
                  </div>
                )}
              </div>
              <div className="flex items-center  text-green-600">
                <IoIosImages size={50} onClick={handleOpenImage} />
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
                          className="text-green-500 cursor-pointer"
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
                      // const url = url;
                      console.log(url);
                      return (
                        <div className="flex relative">
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
          </div>
        </CardContent>
        {/* <div
          className=" absolute top-0 right-10 rounded-badge p-2 bg-gray-300 hover:bg-sky-500 cursor-pointer"
          style={{ transition: "background-color 0.3s" }}
          // onClick={handleEditAll}
        >
          <FaPencilAlt />
        </div> */}
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
