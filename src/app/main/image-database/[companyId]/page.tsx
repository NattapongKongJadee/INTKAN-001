"use client";
import React, { useEffect, useMemo, useState } from "react";
import GoBackButton from "@/app/components/GoBackButton/GoBack";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useRouter } from "next/navigation";

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
import CustomModal from "@/app/components/ReuseModal/Reusemodal";
import { log } from "node:console";
import { io } from "socket.io-client";

interface Company {
  _id: string;
  companyName: string;
  address: string;
  poNumber?: number;
  avatarImage: URL[];
  allImages: URL[];
  allStorage: string[];
  listJob: any;
  dateCreated: string | Date;
}

export default function ListJob() {
  const [company, setCompany] = useState<Company | null>(null);

  const [open, setOpen] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [jobName, setJobName] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const { companyId, jobId } = useParams(); // Get the companyId from the URL dynamically
  const router = useRouter();

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxWidth: "90vw",
    bgcolor: " #3a88fe",
    textAlign: "center",
    borderRadius: "16px",
    borderColor: "#ffffff",
    boxShadow: 12,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  };

  const handleForJobId = (jobId: string) => {
    setSelectedJobId(jobId);
    setOpenDeleteConfirm(true);
  };
  const handleOnCloseDelete = () => setOpenDeleteConfirm(false);
  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: "index",
        header: "ลำดับ",
        size: 10,
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "light",
              fontSize: "18px",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: "เลขที่อ้างอิงใบเสนอราคา",
        size: 50,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#333",
            padding: "8px 16px",
          },
        },
      },
      {
        accessorKey: "jobName",
        header: "ชื่องาน",
        size: 100,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#333",
            padding: "8px 16px",
          },
        },
      },
      {
        accessorFn: (row) => row.dateCreated, // Use accessor function to access dateCreated directly
        id: "dateCreated",
        header: "วันที่สร้าง",
        size: 80,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#333",
            padding: "8px 16px",
          },
        },
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();

          return (
            <div className="text-md">
              {typeof dateValue === "string" ||
              typeof dateValue === "number" ||
              dateValue instanceof Date
                ? dayjs(dateValue).format("DD-MM-YYYY")
                : "N/A"}
            </div>
          );
        },
      },
      {
        id: "details",
        header: "ข้อมูลงาน",
        size: 100,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#333",
            padding: "8px 16px",
          },
        },

        Cell: ({ row }) => {
          return (
            <Link
              href={`/main/image-database/${companyId}/${row.original._id}`}
            >
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to left, #007BFF, #00FFFF)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(to right, #0056b3, #00b3b3)",
                  },
                }}
              >
                รายละเอียด
              </Button>
            </Link>
          );
        },
      },
      {
        // accessorKey: "",
        header: "ลบ",
        size: 50,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#333",
            padding: "8px 16px",
          },
        },
        Cell: ({ row, table }) => {
          const jobId = row.original._id;
          const isRowSelected = table
            .getSelectedRowModel()
            .flatRows.includes(row);

          return (
            <Button
              disabled={!isRowSelected}
              startIcon={<DeleteIcon />}
              // onClick={() => handleDelete(jobId)}
              onClick={() => handleForJobId(jobId)}
              sx={{
                backgroundColor: "#F00000",
                padding: "8px 16px",
                color: "white",
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              ลบ
            </Button>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useMaterialReactTable<Company>({
    columns,
    data: company?.listJob || [],
    initialState: { density: "compact" },
    enableRowSelection: true,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#007BFF",
        fontFamily: "Roboto, sans-serif",
        color: "white",
        "& .MuiTableSortLabel-icon": {
          color: "black !important",
        },
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Apply alternating background color
      },
    }),
  });

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
        `https://backend-itk-581518296545.asia-southeast1.run.app/api//image/new-job/${companyId}`,
        newJob
      );

      // Handle success
      console.log("Job added successfully:", response.data);
      handleClose();
      // refecthCompanyData();
      setJobName("");
      setPoNumber("");
    } catch (error) {
      // Handle error
      console.error("Error adding job:", error);
      alert("Failed to add job");
    }
  };
  const handleDelete = async (jobId: any) => {
    try {
      const response = await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/${companyId}/${jobId}/deleteJob`
        //
      );
      if (response.status === 200) {
        // setCompany((prevData: any) => {
        //   if (!prevData) return prevData; // Ensure prevData is not null

        //   return {
        //     ...prevData,
        //     listJob: prevData.listJob.filter((job: any) => job._id !== jobId),
        //   };
        // });
        console.log("Job deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      handleOnCloseDelete();
    }
  };
  const refecthCompanyData = () => {
    console.log(companyId, jobId);

    if (companyId) {
      console.log("Fetching company with ID:", companyId);
      axios;
      axios
        .get(
          `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/company/${companyId}`
        )

        .then((response) => {
          console.log("Company data:", response.data);
          setCompany(response.data);
        })
        .catch((error) => {
          console.error("Error fetching company:", error);
        });
    }
  };

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("jobAdded", ({ companyId, job }) => {
      console.log("Received jobAdded event:", { companyId, job });

      setCompany((prevData) => {
        // Ensure prevData is of type Company
        if (!prevData || prevData._id !== companyId) return prevData;

        // Append the new job to listJob
        return {
          ...prevData,
          listJob: [...prevData.listJob, job], // Use listJob instead of jobs
        };
      });
    });

    socket.on("jobDeleted", ({ companyId: eventCompanyId, jobId }) => {
      console.log("Received jobDeleted event:", { eventCompanyId, jobId });

      // Update the company data if the companyId matches the current one
      setCompany((prevData: any) => {
        if (!prevData || prevData._id !== eventCompanyId) return prevData;

        return {
          ...prevData,
          listJob: prevData.listJob.filter((job: any) => job._id !== jobId),
        };
      });
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, [companyId]);

  useEffect(() => {
    refecthCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  return (
    <>
      <div
        style={{ width: "calc(100vw - 15%)" }}
        className="flex my-4 font-bold text-xl items-center   text-white font-sans  "
      >
        <div className="flex flex-row">
          <div
            className="flex bg-gradient-to-r from-[#007BFF] to-[#00FFFF] rounded-full p-2 items-center mr-4 cursor-pointer hover:scale-110 hover:bg-orange-500 rotate-20 transition duration-100"
            onClick={handleOpen}
          >
            <AddIcon></AddIcon>
          </div>
          {/* <div className="p-2 text-lg text-white bg-gradient-to-r from-[#007BFF] to-[#00FFFF] rounded-lg shadow-lg"> */}
          <div className="flex  text-2xl font-bold text-black items-center">
            {company?.companyName}
          </div>
        </div>
        <div className="flex ml-auto">
          <GoBackButton />
        </div>
      </div>
      <div style={{ width: "calc(100vw - 15%)", height: "100vh" }}>
        <MaterialReactTable table={table} />
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={styleModal}>
          <FormControl defaultValue="" required>
            <Typography
              variant="h6"
              marginBottom={2}
              style={{ fontFamily: "sans-serif", color: "white" }}
            >
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
              <Button
                variant="contained"
                sx={{ bgcolor: "#77bb41" }}
                onClick={handleSubmit}
              >
                บันทึก
              </Button>
            </div>
          </FormControl>
        </Box>
      </Modal>
      <CustomModal
        header="ลบงาน"
        open={openDeleteConfirm}
        handleConfirm={() => handleDelete(selectedJobId!)}
        handleClose={handleOnCloseDelete}
      ></CustomModal>
    </>
  );
}
