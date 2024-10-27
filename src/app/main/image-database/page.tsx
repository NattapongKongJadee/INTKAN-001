"use client";

import { useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { FaRegAddressBook } from "react-icons/fa";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Avatar from "@mui/material/Avatar";
import Suka from "./../../assets/images/Suka.jpg";

// public/suka.JPG

import { GoOrganization } from "react-icons/go";
import axios from "axios";
import Link from "next/link";
import { Console, log } from "node:console";

export default function ImageDatabase() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [companies, setCompanies] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleEditOpen = (data: any) => (console.log(data), setOpenEdit(true));
  const handleClose = () => {
    setOpen(false);
    setImageSrc("");
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const [imageSrc, setImageSrc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [addressName, setAddressName] = useState("");

  const imilitRecord = 10;

  //example data type
  type Person = {
    name: {
      firstName: string;
      lastName: string;
    };
    address: string;
    city: string;
    state: string;
  };

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

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxWidth: "90vw",
    bgcolor: "background.paper",
    textAlign: "center",
    borderRadius: "16px",
    boxShadow: 12,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  };

  const handleCompanyName = (e: any) => {
    setCompanyName(e.target.value);
  };

  const handleAddressCompany = (e: any) => {
    setAddressName(e.target.value);
  };

  const uploadNewCompany = async () => {
    console.log("Company Name :", companyName);
    console.log("Address Company :", addressName);
    console.log("Image :", imageSrc);

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("address", addressName);

      if (imageSrc) {
        // Use fetch to convert the Base64 image URL to a Blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "avatar.png", { type: blob.type });

        formData.append("avatarImage", file);
      }

      const response = await axios.post(
        "http://localhost:3000/api/image/new-company",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
      alert("Upload Success");
    } catch (err) {
      console.log(err, "Error uploding New company");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImageSrc(e.target.result as string); // Type assertion, since e.target.result can be string or ArrayBuffer
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getAllCompanies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/image/getAllCompanies"
      );
      setCompanies(response.data);
    } catch (err) {
      console.error("Error to fetch company : ", err);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  return (
    <div className="w-[calc(100vw-10%)] h-screen">
      {/* <div className="w-[calc(100vw - 50%)]"> */}
      {/* <div className="w-[calc(56% - 120px)]"> */}
      <div className="flex flex-row">
        <button
          className="btn btn-info mx-2 my-2 text-sm "
          onClick={handleOpen}
        >
          <IoMdCreate />
          สร้างใหม่
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead className="bg-blue-300 bg-opacity-40 ">
            <tr>
              <th className="text-left font-bold text-gray-800 text-md">
                ชื่อบริษัท
              </th>
              <th className="text-left font-bold text-gray-800 text-md">
                ที่อยู่
              </th>
              <th className="text-left font-bold text-gray-800 text-md">
                จำนวนงาน
              </th>
              <th className="text-left font-bold text-gray-800 text-md">
                แก้ไข
              </th>
              <th className="text-left font-bold text-gray-800 text-md">
                ข้อมูลงาน
              </th>
              <th className="text-left font-bold text-gray-800 text-md"></th>
            </tr>
          </thead>

          <tbody>
            {companies &&
              companies.map((each: any) => (
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={each.avatarImage}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className=" text-md font-medium">
                          {each.companyName}
                        </div>
                        {/* <div className="text-sm opacity-50">{each.address}</div> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-md"> {each.address}</div>
                  </td>
                  <td>{each.poNumber || 0}</td>
                  <th>
                    <button
                      className="btn  btn-neutral btn-md"
                      onClick={(e) => {
                        const row = (e.target as HTMLButtonElement).closest(
                          "tr"
                        ); // Find the closest <tr> element
                        if (row) {
                          // Collect all the cell data from the row
                          const rowData = Array.from(row.cells).map(
                            (cell) => cell.textContent?.trim() || ""
                          );
                          handleEditOpen(rowData);
                        }
                      }}
                    >
                      แก้ไข
                    </button>
                  </th>
                  <th>
                    <Link href={`/main/image-database/${each._id}`}>
                      <button className="btn btn-primary btn-md">
                        ข้อมูลงาน
                      </button>
                    </Link>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <FormControl defaultValue="" required>
              <Typography variant="h6" marginBottom={2}>
                ลงทะเบียนบริษัทใหม่
              </Typography>
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#00c7fc",
                  width: 140,
                  // marginLeft: "auto",
                }}
                // onChange={handleImageChange}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <VisuallyHiddenInput type="file" />
              </Button>
              <Avatar
                src={imageSrc || "https://via.placeholder.com"}
                sx={{
                  width: 140,
                  height: 140,
                  marginY: "14px",
                  marginX: "auto",
                }}
              />
              <label className="input input-bordered flex items-center gap-2">
                <GoOrganization />
                <input
                  type="text"
                  className="my-2 mx-2 grow"
                  placeholder="ชื่อบริษัท"
                  value={companyName}
                  onChange={(e) => handleCompanyName(e)}
                />
              </label>

              <textarea
                className="textarea textarea-bordered  grow h-full w-auto  my-3"
                placeholder="ที่อยู่ / ข้อมูลบริษัท"
                value={addressName}
                onChange={(e) => handleAddressCompany(e)}
              ></textarea>

              <div
                className=" flex flex-row my-4  justify-end items-end "
                onClick={uploadNewCompany}
              >
                <button className="btn btn-info">บันทึก</button>
              </div>
            </FormControl>
          </Box>
        </Modal>
        <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="แบบฟอร์มแก้ไข"
        >
          <Box sx={styleModal}>
            <FormControl defaultValue="" required>
              <Typography variant="h6" marginBottom={2}>
                แบบฟอร์มแก้ไขข้อมูลบริษัท
              </Typography>
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#00c7fc",
                  width: 140,
                  // marginLeft: "auto",
                }}
                // onChange={handleImageChange}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload
                <VisuallyHiddenInput type="file" />
              </Button>
              <Avatar
                src={imageSrc || "https://via.placeholder.com"}
                sx={{
                  width: 140,
                  height: 140,
                  marginY: "14px",
                  marginX: "auto",
                }}
              />
              <label className="input input-bordered flex items-center gap-2">
                <GoOrganization />
                <input
                  type="text"
                  className="my-2 mx-2 grow"
                  placeholder="ชื่อบริษัท"
                  value={companyName}
                  onChange={(e) => handleCompanyName(e)}
                />
              </label>

              <textarea
                className="textarea textarea-bordered  grow h-full w-auto  my-3"
                placeholder="ที่อยู่ / ข้อมูลบริษัท"
                value={"TEST"}
                onChange={(e) => handleAddressCompany(e)}
              ></textarea>
              <div className="flex flex-row">
                <div
                  className=" flex flex-row my-4 mr-auto  justify-start  items-end "
                  onClick={uploadNewCompany}
                >
                  <button className="btn btn-error">ลบข้อมูลบริษัท</button>
                </div>
                <div
                  className=" flex flex-row my-4  justify-end items-end "
                  onClick={uploadNewCompany}
                >
                  <button className="btn btn-info">บันทึก</button>
                </div>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </div>
    // {/* </div> */}
  );
}
