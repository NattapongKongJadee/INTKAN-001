/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import GoBackButton from "@/app/components/GoBackButton/GoBack";
import { URL } from "url";
import SimpleBackdrop from "@/app/components/SimpleBackdrop/SimpleBackDrop";
import dayjs from "dayjs";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import Image from "next/image";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import { Box, Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CustomModal from "@/app/components/ReuseModal/Reusemodal";
import { io } from "socket.io-client";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "4px",
  maxWidth: "100%",
  height: "100%",
  width: "100%",
  maxHeight: "100%",
  overflowY: "auto",
};
interface Job {
  jobName: string;
  id: string;
  _id: string;
  allImages: string[];
  allStorage: string[];
  dateCreated: string;
}

const CompanyDetail = () => {
  const { companyId, jobId } = useParams();

  const [job, setJob] = useState<Job | null>(null);
  const [selectedUploadImage, setSelectedUploadImage] = useState<string | null>(
    null
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [uploadFileStorage, setUploadFileStorage] = useState<File[]>([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [openDeleteImg, setOpenDeleteImg] = useState(false);
  const [openDeleteFile, setOpenDeleteFile] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  const router = useRouter();

  const togglePreview = () => setOpenPreview(!openPreview);
  const handleImageClick = (src: string) => {
    setSelectedUploadImage(src);
  };

  const handleFileClick = (fileUrl: string) => {
    setSelectedFile(fileUrl);
    const fileType = fileUrl.endsWith(".pdf")
      ? "pdf"
      : fileUrl.match(/\.(jpeg|jpg|png|gif)$/)
      ? "image"
      : "unsupported";
    setSelectedFileType(fileType);
    togglePreview(); // Open the modal when file is clicked
  };

  const openDeleteFileModal = (fileUrl: string) => {
    setSelectedFileUrl(fileUrl);
    setOpenDeleteFile(true);
  };
  const handleOpenDeleteImgModal = () => setOpenDeleteImg(false);
  const handleOpenDeleteFileModal = () => setOpenDeleteFile(false);

  const handleCloseModal = () => {
    setSelectedUploadImage(null);
  };

  const handleChangImageToUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const selectFiles = Array.from(e.target.files);
      setUploadFile(selectFiles);
      await handleUploadFile(selectFiles);
    }
  };
  const downloadSelectedImages = async () => {
    const zip = new JSZip();
    const imageFolder = zip.folder("images");

    const imagePromises = selectedImages.map(async (imageSrc) => {
      try {
        const response = await fetch(imageSrc);
        if (!response.ok) throw new Error(`Failed to fetch ${imageSrc}`);

        const blob = await response.blob();
        const imageName = imageSrc.split("/").pop();

        if (imageName && imageFolder) {
          imageFolder.file(imageName, blob);
        }
      } catch (error: any) {
        console.error(`Failed to download image: ${error.message}`);
      }
    });
    await Promise.all(imagePromises);
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "selected_images.zip");
  };
  const handleChangeFileStorageToUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setUploadFileStorage(selectedFiles);
      console.log("Check selected filed", selectedFiles);

      await handleUploadFileStorage(selectedFiles);
    }
  };

  const handleUploadFileStorage = async (files: File[]) => {
    console.log(files);

    if (!files) {
      return;
    }
    const formData = new FormData();
    if (files) {
      files.forEach((file) => {
        formData.append("allStorage", file);
      });
      setOpen(true);

      try {
        const response = await axios.post(
          `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/file-upload/${companyId}/${jobId}`,
          formData,
          {
            headers: {
              "Content-Type": "multerpart/form-data",
            },
          }
        );
        console.log("File upload response:", response.data);
        // fetchCompanyData();
      } catch (error) {
        console.log(error);
      } finally {
        setUploadFileStorage([]);
        setOpen(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleUploadFile = async (files: File[]) => {
    if (!files) {
      return null;
    }
    const formData = new FormData();
    if (files) {
      files.forEach((file) => {
        formData.append("allImages", file);
      });
      setOpen(true);

      try {
        const response = await axios.post(
          `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/image-upload/${companyId}/${jobId}`,
          formData,
          {
            headers: {
              "Content-Type": "multerpart/form-data",
            },
          }
        );
        console.log("File upload response:", response.data);
        // fetchCompanyData();
      } catch (error) {
        console.log(error);
      } finally {
        setOpen(false);
        setSelectedUploadImage(null);
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }
      }
    }
  };

  const fetchCompanyData = () => {
    if (companyId) {
      console.log("Fetching job with ID:", companyId);
      axios
        .get(
          `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/${companyId}/${jobId}`
        )
        .then((response) => {
          console.log("JOB DATA:", response.data);
          setJob(response.data);
        })
        .catch((error) => {
          console.error("Error fetching company:", error);
        });
    }
  };
  const handleCheckboxChange = (src: any) => {
    console.log(src);

    console.log("CHECK FUNCTION hanlde checkedbox");

    if (selectedImages.includes(src)) {
      setSelectedImages(selectedImages.filter((image) => image !== src));
    } else {
      setSelectedImages([...selectedImages, src]);
    }
  };
  const handleDeleteImage = async () => {
    // setOpen(true);
    try {
      const response = await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/${companyId}/${jobId}/image`,
        {
          data: {
            imageUrl: selectedImages,
          },
        }
      );

      console.log("Images deleted successfully:", response.data);
      setSelectedImages([]);
    } catch (error) {
      console.error("Error deleting images:", error);
    } finally {
      setOpenDeleteImg(false);
      setOpen(false);
      fetchCompanyData();
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    setOpen(true);
    if (!fileUrl) {
      console.warn("No file selected for deletion.");
      return;
    } else {
      console.log(fileUrl);
    }

    try {
      const response = await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/${companyId}/${jobId}/file`,
        {
          data: {
            fileUrl: fileUrl,
          },
        }
      );
      console.log("File deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting images:", error);
    } finally {
      setOpenDeleteFile(false);
      setOpen(false);
      // fetchCompanyData();
    }
  };

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );
    socket.on(
      "fileStorageUpdated",
      ({ companyId: updatedCompanyId, jobId: updatedJobId, allStorage }) => {
        console.log("Received fileStorageUpdated event:", {
          updatedCompanyId,
          updatedJobId,
          allStorage,
        });

        // Update the `job` state if the companyId and jobId match
        setJob((prevJob) => {
          console.log(prevJob);
          console.log(updatedJobId);

          if (!prevJob) {
            console.log("Previous job is null, skipping update");
            return prevJob;
          }

          if (prevJob._id !== updatedJobId) {
            console.log("Job ID mismatch, skipping update");
            return prevJob;
          }

          console.log("Updating allStorage for the matched job");
          return {
            ...prevJob,
            allStorage: [...allStorage], // Replace with the updated file URLs
          };
        });
      }
    );

    socket.on(
      "fileDeleted",
      ({ companyId: updatedCompanyId, jobId: updatedJobId, fileUrl }) => {
        console.log("Received fileDeleted event:", {
          updatedCompanyId,
          updatedJobId,
          fileUrl,
        });

        // Update the `job` state if the companyId and jobId match
        if (updatedCompanyId === companyId && updatedJobId === jobId) {
          setJob((prevJob) => {
            if (!prevJob) return prevJob;
            if (prevJob._id !== updatedJobId) return prevJob;

            // Remove the fileUrl from allStorage
            const updatedAllStorage = prevJob.allStorage.filter(
              (file) => file !== fileUrl
            );
            console.log(
              "Updated allStorage after deletion:",
              updatedAllStorage
            );

            return {
              ...prevJob,
              allStorage: updatedAllStorage,
            };
          });
        }
      }
    );

    socket.on(
      "jobImagesUpdated",
      ({ companyId: updatedCompanyId, jobId: updatedJobId, allImages }) => {
        console.log("Received jobImagesUpdated event:", {
          updatedCompanyId,
          updatedJobId,
          allImages,
        });

        // Update the `job` state if the companyId and jobId match
        if (updatedCompanyId === companyId && updatedJobId === jobId) {
          setJob((prevJob) => {
            if (!prevJob) return prevJob;
            if (prevJob._id !== updatedJobId) return prevJob;

            console.log("Updating allImages for the matched job");
            return {
              ...prevJob,
              allImages,
            };
          });
        }
      }
    );

    socket.on(
      "jobImagesUpdated",
      ({ companyId: updatedCompanyId, jobId: updatedJobId, allImages }) => {
        console.log("Received jobImagesUpdated event:", {
          updatedCompanyId,
          updatedJobId,
          allImages,
        });

        // Update the `job` state if the companyId and jobId match
        if (updatedCompanyId === companyId && updatedJobId === jobId) {
          setJob((prevJob) => {
            if (!prevJob) return prevJob;
            if (prevJob._id !== updatedJobId) return prevJob;

            console.log(
              "Updating allImages for the matched job after deletion"
            );
            return {
              ...prevJob,
              allImages,
            };
          });
        }
      }
    );

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, setOpen]);

  if (!job)
    return (
      <div>
        <SimpleBackdrop open={open} setOpen={setOpen} />
      </div>
    );

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles} className="bg-bg-image">
        <div className="flex flex-row">
          <div className="flex relative   mr-4 ">
            <Image
              src={"/logo-removebg-2.png"}
              width={100}
              height={100}
              alt="company-logo"
            />
          </div>
          <div className="breadcrumbs flex mt-10 text-md font-semibold font-sans ">
            <ul>
              <li>
                <a href="/main/image-database">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <div className="ml-4">หน้าหลัก</div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.back();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <div className="ml-4">บริษัท</div>
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                    <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  {job.jobName}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-col ">
            <div className="flex flex-row justify-between my-6">
              <div>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    background: "linear-gradient(to left, #007BFF, #00FFFF)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(to right, #0056b3, #00b3b3)",
                    },
                  }}
                >
                  อัพโหลดรูปภาพ
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleChangImageToUpload}
                    multiple
                    ref={imageInputRef}
                  />
                </Button>
              </div>
              <div className="flex flex-row">
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  onClick={() => setOpenDeleteImg(true)}
                  disabled={selectedImages.length == 0}
                  sx={{
                    display: "flex",
                    alignItems: "left",
                    width: "fit-content",
                    color: "white",
                    background: "linear-gradient(to right, #ff4700 ,#ff7e4c)",
                    marginRight: "4px",
                    "&:hover": {
                      background: "linear-gradient(to right, #F08080, #FFA07A)",
                    },
                    "& .MuiButton-startIcon": {
                      fontSize: "30px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "30px",
                      },
                    },
                  }}
                >
                  <DeleteIcon sx={{ color: "white" }} />
                </Button>
                <Button
                  component="label"
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<DownloadIcon sx={{ color: "white" }} />}
                  onClick={downloadSelectedImages}
                  disabled={selectedImages.length == 0}
                  sx={{
                    display: "flex",
                    alignItems: "left",
                    width: "fit-content",
                    color: "white",
                    background: "linear-gradient(to right, #55b32c ,#aad995)",
                    marginRight: "4px",
                    "&:hover": {
                      background: "linear-gradient(to right, #F07BFF, #00ffff)",
                    },
                    "& .MuiButton-startIcon": {
                      fontSize: "30px",
                      "& .MuiSvgIcon-root": {
                        fontSize: "30px",
                      },
                    },
                  }}
                >
                  ดาวน์โหลด
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-5 p-2 ">
              {Array.isArray(job.allImages) && job.allImages.length > 0 ? (
                job.allImages.map((src: string | URL, index: number) => (
                  <div key={index} className="form-control">
                    <div className="relative  max-w-md mx-auto">
                      <input
                        type="checkbox"
                        className="absolute top-0 left-0 m-2 checkbox checkbox-info"
                        onChange={() =>
                          handleCheckboxChange((src = src.toString()))
                        }
                      />
                      <img
                        // src={src.toString()}
                        src={src.toString()}
                        className="w-full h-60 border-2 border-white p-2 rounded-lg shadow-md object-cover cursor-pointer"
                        alt={`Avatar ${index}`}
                        onClick={() => handleImageClick(src.toString())}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex w-[25vw]  h-full items-center justify-center py-2">
                  <div className="flex min-w-full  text-cyan-500 font-bold font-sans">
                    ไม่มีรูป ณ ขณะนี้...
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            id="right-side-content"
            className="w-px h-auto bg-gray-300  mx-4 self-stretch"
          ></div>{" "}
          <div className="flex  w-1/3 flex-col p-2">
            <div className="flex absolute top-0 right-4 ml-auto my-4">
              <GoBackButton />
            </div>
            <div className="flex flex-row">
              <div className="text-[#007BFF] font-thin font-sans mr-2">
                ชื่อบริษัท:
              </div>
              Imag
              <div>{job.jobName}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-[#007BFF] font-thin font-sans mr-2">
                เลขที่ใบเสนอราคา:{" "}
              </div>
              <div>{job.id}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-[#007BFF]  font-thin mr-2 font-sans">
                วันที่สร้าง:
              </div>
              <div>{dayjs(job.dateCreated).format("DD-MM-YYYY") || 0}</div>
            </div>
            {/* <div>สถานะ: {job.poNumber || 0}</div> */}
            <div className="w-auto h-px bg-gray-300 my-4 self-stretch"></div>{" "}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{
                background: "linear-gradient(to left, #007BFF, #00FFFF)",
                marginBottom: "10px",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(to right, #0056b3, #00b3b3)",
                },
              }}
            >
              อัพโหลดไฟล์
              <VisuallyHiddenInput
                type="file"
                onChange={handleChangeFileStorageToUpload}
                multiple
                ref={fileInputRef}
              />
            </Button>
            <div className="border-2 border-accent text-accent font-sans text-lg font-semibold px-4 py-2 rounded-md flex items-center justify-center">
              คลังข้อมูล
            </div>
            {job.allStorage && job.allStorage.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-2">
                {job.allStorage.map((fileUrl: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleFileClick(fileUrl)}
                    className="relative flex flex-col p-2 border bg-gradient-to-b from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-bold font-sans py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md items-center justify-center cursor-pointer"
                  >
                    <DeleteIcon
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering handleFileClick
                        openDeleteFileModal(fileUrl);
                      }}
                      className="absolute -top-1 -right-2  rounded-badge  text-orange-400 hover:text-red-500 cursor-pointer"
                    />

                    {/* Main Content */}
                    <p>ไฟล์ {index + 1}</p>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-semibold"
                      download
                    >
                      <SimCardDownloadIcon />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="flex justify-center my-4  font-sans font-bold text-md text-teal-400">
                ไม่มีไฟล์ ณ ขณะนี้......
              </p>
            )}
            <Modal open={openPreview} onClose={togglePreview}>
              <Box
                className="bg-white p-4 rounded-md shadow-lg"
                sx={{ position: "absolute", width: "100vw", height: "100vh" }}
              >
                <button
                  onClick={togglePreview}
                  className="flex ml-auto text-right text-xl   text-red-500"
                >
                  ปิด
                </button>
                {selectedFileType === "pdf" ? (
                  <iframe
                    src={selectedFile}
                    className="w-full h-full mb-4"
                    title="PDF preview"
                  />
                ) : selectedFileType === "image" ? (
                  <img
                    src={selectedFile}
                    alt="Image preview"
                    className="w-full h-full object-contain mb-4"
                  />
                ) : (
                  <div className="flex flex-col justify-center">
                    <p className="flex justify-center my-4">
                      Preview not available
                    </p>
                    <Button variant="contained">
                      <a
                        href={selectedFile}
                        download
                        className="text-white text-sm font-semibold"
                      >
                        Download File
                      </a>
                    </Button>
                  </div>
                )}
                {/* Download link */}
              </Box>
            </Modal>
          </div>
        </div>
      </div>
      {selectedUploadImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div className="relative">
            <img
              src={selectedUploadImage}
              className="max-w-full max-h-full  p-2 rounded-lg cursor-pointer"
              alt="Fullscreen"
            />
          </div>
        </div>
      )}
      <SimpleBackdrop open={open} setOpen={setOpen} />
      <CustomModal
        open={openDeleteImg}
        handleClose={handleOpenDeleteImgModal}
        header="รูปภาพ"
        handleConfirm={handleDeleteImage}
      ></CustomModal>
      <CustomModal
        open={openDeleteFile}
        handleClose={handleOpenDeleteFileModal}
        header="ไฟล์"
        handleConfirm={() => handleDeleteFile(selectedFileUrl!)}
      ></CustomModal>
    </div>
  );
};

export default CompanyDetail;
