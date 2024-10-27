"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import GoBackButton from "@/app/components/GoBackButton/GoBack";
import { URL } from "url";
import SimpleBackdrop from "@/app/components/SimpleBackdrop/SimpleBackDrop";
import dayjs from "dayjs";
import JSZip from "jszip";
import fileDownload from "js-file-download";

const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark semi-transparent background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // Ensure it stays on top of other elements
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
  const [uploadStatus, setUploadStatus] = useState(false);

  const handleImageClick = (src: string) => {
    setSelectedUploadImage(src);
  };
  const handleCloseModal = () => {
    setSelectedUploadImage(null);
  };

  const handleChangImageToUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setUploadFile(Array.from(e.target.files));
    }
  };
  const downloadSelectedImages = async () => {
    const imagePromises = selectedImages.map(async (imageSrc) => {
      try {
        const response = await fetch(imageSrc);
        if (!response.ok) throw new Error(`Failed to fetch ${imageSrc}`);
        const blob = await response.blob(); // Get the image as a blob
        const imageName = imageSrc.split("/").pop(); // Extract the file name
        fileDownload(blob, imageName); // Use js-file-download to trigger download
      } catch (error) {
        console.error(`Failed to download image: ${error.message}`);
      }
    });

    await Promise.all(imagePromises); // Wait for all downloads to complete
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
          `http://localhost:3000/api/image/company/file-upload/${companyId}/${jobId}`,
          formData,
          {
            headers: {
              "Content-Type": "multerpart/form-data",
            },
          }
        );
        console.log("File upload response:", response.data);
        fetchCompanyData();
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

  const handleUploadFile = async () => {
    console.log(uploadFile);

    if (!uploadFile) {
      return null;
    }
    const formData = new FormData();
    if (uploadFile) {
      uploadFile.forEach((file) => {
        formData.append("allImages", file);
      });
      setOpen(true);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/image/company/image-upload/${companyId}/${jobId}`,
          formData,
          {
            headers: {
              "Content-Type": "multerpart/form-data",
            },
          }
        );
        console.log("File upload response:", response.data);
        fetchCompanyData();
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
        .get(`http://localhost:3000/api/image/company/${companyId}/${jobId}`)
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
    console.log("CHECK FUNCTION hanlde checkedbox");

    if (selectedImages.includes(src)) {
      setSelectedImages(selectedImages.filter((image) => image !== src));
    } else {
      setSelectedImages([...selectedImages, src]);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [companyId, setOpen]);

  if (!job) return <div>Loading...</div>;
  // if (job) {
  //   console.log(job);
  // }
  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <div className="flex ">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between my-6">
              <div>
                <input
                  type="file"
                  className="file-input file-input-bordered  w-full max-w-xs mr-4"
                  multiple
                  onChange={handleChangImageToUpload}
                  ref={imageInputRef}
                />

                <button className="btn" onClick={handleUploadFile}>
                  UPLOAD
                </button>
              </div>
              <div>
                <button className="btn btn-disabled mr-2">DELETE</button>
                <button className="btn" onClick={downloadSelectedImages}>
                  DOWNLOAD
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-4 gap-5 p-2 ">
              {Array.isArray(job.allImages) ? (
                job.allImages.map((src: string | URL, index: number) => (
                  <div key={index} className="form-control">
                    <div className="relative w-full max-w-md mx-auto">
                      {/* Absolute checkbox */}
                      <input
                        type="checkbox"
                        className="absolute top-0 left-0 m-2 checkbox checkbox-info"
                        onChange={() => handleCheckboxChange(src.toString())}
                      />
                      {/* Image */}
                      <img
                        src={src.toString()}
                        className="w-full h-60 border-2 border-gray-200 p-2 rounded-lg shadow-md object-cover cursor-pointer"
                        alt={`Avatar ${index}`}
                        onClick={() => handleImageClick(src)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center">no images found</div>
              )}
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="w-px h-auto bg-gray-300 mx-4 self-stretch"></div>{" "}
          <div className="flex  w-1/3 flex-col p-2">
            <div className="flex ml-auto my-4">
              <GoBackButton />
            </div>
            <div className="flex flex-row">
              <div className="text-blue-500 font-bold mr-2">ชื่อบริษัท:</div>
              <div>{job.jobName}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-blue-500 font-bold mr-2">
                เลขที่ใบเสนอราคา:{" "}
              </div>
              <div>{job.id}</div>
            </div>
            <div className="flex flex-row">
              <div className="text-blue-500 font-bold mr-2">วันที่สร้าง:</div>
              <div>{dayjs(job.dateCreated).format("DD-MM-YYYY") || 0}</div>
            </div>
            {/* <div>สถานะ: {job.poNumber || 0}</div> */}
            <div className="w-auto h-px bg-gray-300 my-4 self-stretch"></div>{" "}
            <input
              type="file"
              ref={fileInputRef}
              className="file-input file-input-bordered file-input-md w-full my-4"
              multiple
              onChange={handleChangeFileStorageToUpload}
            />
            <button className="btn">File Storage</button>
            {job.allStorage && job.allStorage.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-2">
                {job.allStorage.map((fileUrl: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col p-4 border bg-orange-200  rounded shadow-md items-center justify-center cursor-pointer"
                  >
                    <p>FILE {index + 1}</p>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-semibold"
                      download
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No files found in storage.</p>
            )}
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
    </div>
  );
};

export default CompanyDetail;
