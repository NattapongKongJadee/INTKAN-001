"use client";
import React, { useEffect, useState } from "react";
import GoBackButton from "@/app/components/GoBackButton/GoBack";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";

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
import Avatar from "@mui/material/Avatar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { GoOrganization } from "react-icons/go";
import { IoIosInformationCircleOutline } from "react-icons/io";
import axios from "axios";

interface Company {
  _id: string;
  companyName: string;
  address: string;
  poNumber?: number;
  avatarImage: URL[];
  allImages: URL[];
  allStorage: string[];
  listJob: [Object];
}

export default function ListJob() {
  const [company, setCompany] = useState<Company | null>(null);

  const [open, setOpen] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [jobName, setJobName] = useState("");
  const { companyId, jobId } = useParams(); // Get the companyId from the URL dynamically

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(poNumber, jobName);

    // Prepare the job data
    const newJob = {
      id: poNumber,
      jobName: jobName,
      dateCreated: new Date(),
    };

    try {
      // Make POST request to the backend
      const response = await axios.post(
        `http://localhost:3000/api//image/new-job/${companyId}`,
        newJob
      );

      // Handle success
      console.log("Job added successfully:", response.data);
      alert("Job added successfully");
    } catch (error) {
      // Handle error
      console.error("Error adding job:", error);
      alert("Failed to add job");
    }
  };
  useEffect(() => {
    console.log(companyId, jobId);

    if (companyId) {
      console.log("Fetching company with ID:", companyId);
      axios;
      axios
        .get(`http://localhost:3000/api/image/company/${companyId}`)

        .then((response) => {
          console.log("Company data:", response.data);
          setCompany(response.data);
        })
        .catch((error) => {
          console.error("Error fetching company:", error);
        });
    }
  }, [companyId]);

  return (
    <>
      <div
        style={{ width: "calc(100vw - 20%)" }}
        className="flex my-4 font-bold text-xl items-center text-slate-600"
      >
        <button className="btn mx-4" onClick={handleOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          เพิ่มงานใหม่
        </button>
        งานบริษัท {company?.companyName}
        <div className="flex ml-auto">
          <GoBackButton />
        </div>
      </div>
      <div style={{ width: "calc(100vw - 10%)", height: "100vh" }}>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="font-bold text-lg text-slate-500">
              <tr>
                <th></th>
                <th>เลขอ้างอิงใบเสนอราคา</th>
                <th>ชื่องาน</th>
                <th>วันที่สร้าง</th>
                <th>รายละเอียดงาน</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {/* <tr className="hover">
                <th>1</th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
                <td>
                  <button className="btn btn-info">รายละเอียดงาน</button>
                </td>
              </tr> */}
              {company?.listJob &&
                company.listJob.map((each: any, index: any) => (
                  <tr className="hover" key={each.index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className=" text-md font-medium">{index}</div>
                          {/* <div className="text-sm opacity-50">{each.address}</div> */}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className=" text-md font-medium">{each.id}</div>
                          {/* <div className="text-sm opacity-50">{each.address}</div> */}
                        </div>
                      </div>
                    </td>
                    <td>{each.jobName}</td>
                    <td>
                      <div className="text-md">
                        {" "}
                        {dayjs(each.dateCreated).format("DD-MM-YYYY")}
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/main/image-database/${company._id}/${each._id}`}
                      >
                        <button className="btn btn-info">รายละเอียดงาน</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              {/* row 2 */}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={styleModal}>
          <FormControl defaultValue="" required>
            <Typography variant="h6" marginBottom={2}>
              เพิ่มงานใหม่
            </Typography>

            <label className="input input-bordered flex items-center gap-2">
              <GoOrganization />
              <input
                type="text"
                className="my-2 mx-2 grow"
                placeholder="เลขที่อ้างอิงใบเสนอราคา"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 my-2">
              <IoIosInformationCircleOutline />
              <input
                type="text"
                className="my-2 mx-2 grow"
                placeholder="ชื่องาน"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
              />
            </label>
            <div
              className=" flex flex-row my-4  justify-end items-end "
              // onClick={uploadNewCompany}
            >
              <button className="btn btn-info" onClick={handleSubmit}>
                บันทึก
              </button>
            </div>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
}
