"use client";

import { useEffect, useState, useMemo } from "react";
import { IoMdCreate } from "react-icons/io";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
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
import AddIcon from "@mui/icons-material/Add";
import { GoOrganization } from "react-icons/go";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import SimpleBackdrop from "@/app/components/SimpleBackdrop/SimpleBackDrop";
import CustomModal from "@/app/components/ReuseModal/Reusemodal";
import { io } from "socket.io-client";

type Company = {
  _id: string;
  companyName: string;
  address: string;
  poNumber: number;
  listJob: Array<string>;
  avatarImage: string;
};

export default function ImageDatabase() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [companies, setCompanies] = useState<any>([]);
  const [imageSrc, setImageSrc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [addressName, setAddressName] = useState("");
  const [idCompany, setIdCompany] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleOpen = () => {
    setOpen(true), console.log("test");
  };
  const handleEditOpen = (data: any) => (
    console.log(data),
    setCompanyName(data.companyName),
    setIdCompany(data._id),
    setImageSrc(data.avatarImage),
    setAddressName(data.address),
    setOpenEdit(true)
  );
  const handleClose = () => {
    setOpen(false);
    setImageSrc("");
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
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
  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: "companyName",
        header: "ชื่อบริษัท",
        size: 200,
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
            <img
              src={row.original.avatarImage}
              alt={`${row.original.companyName} logo`}
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            {row.original.companyName}
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "ข้อมูล / ที่อยู่",
        size: 250,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif", // Apply sans-serif font
            fontSize: "16px", // Adjust font size
            color: "#333", // Set text color
            padding: "8px 16px", // Adjust cell padding
          },
        },
      },
      {
        accessorKey: "listJob",
        header: "จำนวนงาน",
        size: 100,
        muiTableBodyCellProps: {
          sx: {
            fontFamily: "Roboto, sans-serif", // Apply sans-serif font
            fontSize: "16px", // Adjust font size
            color: "#333", // Set text color
            padding: "8px 16px", // Adjust cell padding
          },
        },
        Cell: ({ cell }) => {
          return (
            <div className="badge badge-accent badge-lg p-4 text-white text-md font-sans font-bold">
              {(cell.getValue() as string[]).length || 0}
            </div>
          );
        }, // Default to 0 if undefined
      },
      {
        id: "edit",
        header: "แก้ไข",
        size: 100,
        Cell: ({ row }) => (
          <Button
            onClick={() => handleEditOpen(row.original)}
            startIcon={<IoMdCreate />}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              color: "white",
              marginY: "6px",
              background: "#CBDCEB", // Main Pink gradient
              "&:hover": {
                background: "linear-gradient(to right, #ff7f50, #ff9933)", // Orange gradient on hover
              },
            }}
          >
            แก้ไข
          </Button>
        ),
      },
      {
        id: "details",
        header: "ข้อมูลงาน",
        size: 150,
        Cell: ({ row }) => (
          <Link href={`/main/image-database/${row.original._id}`}>
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
              ข้อมูลงาน
            </Button>
          </Link>
        ),
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data: companies,
    initialState: { density: "compact" },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#D5DBDB",
        fontFamily: "Roboto, sans-serif", // Apply sans-serif font
        fontSize: "18px", // Adjust font size
        color: "black",
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

  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxWidth: "90vw",
    bgcolor: "#3a88fe",
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
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/image/new-company",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
      // alert("Upload Success");
    } catch (err) {
      console.log(err, "Error uploding New company");
    } finally {
      handleClose();
      // getAllCompanies();
    }
  };

  const editCompany = async (companyId: string) => {
    console.log("Company Name:", companyName);
    console.log("Address Company:", addressName);
    console.log("Image:", imageSrc);

    try {
      const formData = new FormData();
      formData.append("companyName", companyName);
      formData.append("address", addressName);

      if (imageSrc) {
        // Convert Base64 image URL to Blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], "avatar.png", { type: blob.type });

        formData.append("avatarImage", file);
      }

      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/edit-company/${companyId}`, // Adjust endpoint for editing
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Edit successful:", response.data);
      // alert("Edit Success");
    } catch (err) {
      console.log(err, "Error editing company");
    } finally {
      handleCloseEdit();
      // getAllCompanies();
    }
  };
  const deleteCompany = async (companyId: string) => {
    try {
      const response = await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/image/delete-company/${companyId}`
      );
      console.log("Company deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setOpenDeleteConfirm(false);
      handleCloseEdit();
      // getAllCompanies();
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
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/image/getAllCompanies"
      );
      setCompanies(response.data);
    } catch (err) {
      console.error("Error to fetch company : ", err);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    // Listen for the companyAdded event
    socket.on("companyAdded", (newCompany) => {
      console.log("Received companyAdded event:", newCompany);

      // Update the state to include the new company
      setCompanies((prevCompanies: any) => [...prevCompanies, newCompany]);
    });

    socket.on("companyUpdated", (updatedCompany) => {
      console.log("Received companyUpdated event:", updatedCompany);

      // Update the state with the updated company
      setCompanies((prevCompanies: any) =>
        prevCompanies.map((company: any) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );
    });

    socket.on("companyDeleted", (deletedCompanyId) => {
      console.log("Received companyDeleted event:", deletedCompanyId);

      // Update the state to remove the deleted company
      setCompanies((prevCompanies: any) =>
        prevCompanies.filter((company: any) => company._id !== deletedCompanyId)
      );
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);

  console.log(companies);

  return (
    <div className="w-[calc(100vw-12%)]  bg-bg-image2 flex flex-col">
      <div className="flex flex-row   ">
        {/* <div className="flex relative my-2   mr-4  ">
          <Image
            src={"/logo-removebg-2.png"}
            width={80}
            height={80}
            style={{
              padding: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              borderRadius: "4px",
            }}
          />
        </div> */}
        <Button
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            color: "white",
            marginY: "10px",
            boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.3)", // Large shadow
            background: "linear-gradient(to top, #007BFF, #00FFFF)",
            "&:hover": {
              background: "linear-gradient(to right, #ffa500, #ffd1b3)",
            },
          }}
        >
          สร้างใหม่
        </Button>
      </div>
      <div className="w-full overflow-y-auto">
        <MaterialReactTable table={table} />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <FormControl defaultValue="" required>
              <Typography
                variant="h6"
                marginBottom={2}
                style={{ fontFamily: "sans-serif", color: "white" }}
              >
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
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                รูปภาพ
                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
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
                <Button variant="contained" sx={{ bgcolor: "#77bb41" }}>
                  บันทึก
                </Button>
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
              <Typography variant="h6" marginBottom={2} sx={{ color: "white" }}>
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
                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
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
              <div className="flex flex-row">
                <div
                  className=" flex flex-row my-4 mr-auto  justify-start  items-end "
                  onClick={() => setOpenDeleteConfirm(true)}
                >
                  <button className="btn btn-error">ลบข้อมูลบริษัท</button>
                </div>
                <div
                  className=" flex flex-row my-4  justify-end items-end "
                  onClick={() => editCompany(idCompany)}
                >
                  <button className="btn btn-info">บันทึก</button>
                </div>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
      <CustomModal
        open={openDeleteConfirm}
        header={companyName}
        handleClose={() => setOpenDeleteConfirm(false)}
        handleConfirm={() => deleteCompany(idCompany)}
      ></CustomModal>
    </div>
    // {/* </div> */}
  );
}
