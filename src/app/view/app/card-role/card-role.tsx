import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import FocusLock from "react-focus-lock";

const CardRole = ({ title, description, boxColor, handleDelete }: any) => {
  const [editingLabel, setEditngLabel] = useState<string>("");

  // const handleLabelChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   id: number
  // ) => {
  //   setCheckBox(
  //     checkedBox.map((checkbox) =>
  //       checkbox.id === id
  //         ? { ...checkbox, label: event.target.value }
  //         : checkbox
  //     )
  //   );
  //   setEditngLabel(event.target.value);
  // };

  // const handleLabelSubmit = (id: number) => {
  //   // if (!document.activeElement?.classList.contains("delete-button")) {
  //   setCheckBox(
  //     checkedBox.map((checkbox) =>
  //       checkbox.id === id ? { ...checkbox, isEditing: false } : checkbox
  //     )
  //   );
  //   // }
  // };

  // const handleDeleteEachCheckBox = (id: number) => {
  //   console.log("TEST FUCNTION COULD WORK WELL ");
  //   setCheckBox(checkedBox.filter((checkbox) => checkbox.id !== id));
  // };

  // const handleEditAll = () => {
  //   console.log(checkedBox);
  //   setCheckBox(
  //     checkedBox.map((checkbox) => ({
  //       ...checkbox,
  //       isEditing: true, // Set isEditing to true for all checkboxes
  //     }))
  //   );
  // };

  return (
    <div className="relative m-auto">
      <Card
        sx={{
          width: 600,
          height: 250,
          boxShadow: "4",
          borderRadius: "20px",
          border: "1px solid rgb(255,255,255)",
          backgroundColor: boxColor,
          transition: "box-shadow 0.32 ease-in-out",
          "&:hover": {
            cursor: "pointer",
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardContent className="flex flex-col items">
          <div className="flex flex-row items-start">
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              color={"black"}
            >
              {title}
            </Typography>
            <div
              className="flex flex-row mx-2 mt-2 hover:animate-vibrate"
              // onClick={addCheckbox}
            >
              <IoAddCircleSharp
                size={24}
                className="text-gray-600  hover:text-green-400"
              />
            </div>
          </div>
        </CardContent>
        <div
          className=" absolute top-0 right-10 rounded-badge p-2 bg-gray-300 hover:bg-sky-500 cursor-pointer"
          style={{ transition: "background-color 0.3s" }}
          // onClick={handleEditAll}
        >
          <FaPencilAlt />
        </div>
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

export default CardRole;
