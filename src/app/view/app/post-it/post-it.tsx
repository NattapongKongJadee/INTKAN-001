import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import FocusLock from "react-focus-lock";

interface Checkbox {
  id: number;
  checked: boolean;
  label: string;
  isEditing: boolean;
}

const CardPostIt = ({ title, description, boxColor, handleDelete }: any) => {
  const [checkedBox, setCheckBox] = useState<Checkbox[]>([]);
  const [editingLabel, setEditngLabel] = useState<string>("");

  const addCheckbox = () => {
    const newCheckbox = {
      id: checkedBox.length + 1,
      checked: false,
      label: "เนื้อหางาน..",
      isEditing: false,
    };
    setCheckBox([...checkedBox, newCheckbox]);
  };

  const toggleCheckbox = (id: any) => {
    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox
      )
    );
  };
  const toggleEdit = (id: any) => {
    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isEditing: true } : checkbox
      )
    );
  };

  const handleLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox.id === id
          ? { ...checkbox, label: event.target.value }
          : checkbox
      )
    );
    setEditngLabel(event.target.value);
  };

  // const handleLabelSubmit = (id: number) => {
  //   setCheckBox(
  //     checkedBox.map((checkbox) =>
  //       checkbox.id === id ? { ...checkbox, isEditing: false } : checkbox
  //     )
  //   );
  // };

  const handleLabelSubmit = (id: number) => {
    // if (!document.activeElement?.classList.contains("delete-button")) {
    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox.id === id ? { ...checkbox, isEditing: false } : checkbox
      )
    );
    // }
  };

  const handleDeleteEachCheckBox = (id: number) => {
    console.log("TEST FUCNTION COULD WORK WELL ");
    setCheckBox(checkedBox.filter((checkbox) => checkbox.id !== id));
  };

  const handleEditAll = () => {
    console.log(checkedBox);
    setCheckBox(
      checkedBox.map((checkbox) => ({
        ...checkbox,
        isEditing: true, // Set isEditing to true for all checkboxes
      }))
    );
  };

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
              onClick={addCheckbox}
            >
              <IoAddCircleSharp
                size={24}
                className="text-gray-600  hover:text-green-400"
              />
            </div>
          </div>
          <Typography variant="body2" color="text.secondary">
            {checkedBox.map((checkbox) => (
              <div key={checkbox.id} className="flex flex-row items-center ">
                <div onClick={() => toggleCheckbox(checkbox.id)}>
                  {checkbox.checked ? (
                    <MdCheckBox size={24} className="text-sky-500" />
                  ) : (
                    <MdCheckBoxOutlineBlank
                      size={24}
                      className="text-sky-500"
                    />
                  )}
                </div>
                {checkbox.isEditing ? (
                  <div className="flex relative flex-row justify-between ">
                    <input
                      className="plain-input"
                      style={{
                        fontSize: "18px",

                        borderRadius: "1px",
                        marginRight: 10,
                      }}
                      type="text"
                      value={checkbox.label}
                      onChange={(e) => handleLabelChange(e, checkbox.id)}
                      onBlur={() => handleLabelSubmit(checkbox.id)}
                      autoFocus
                    />
                    <TiDelete
                      size={30}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEachCheckBox(checkbox.id);
                      }}
                      className="text-red-500 delete-button"
                      style={{ zIndex: 99999, cursor: "auto" }}
                    />
                  </div>
                ) : (
                  <Typography
                    onDoubleClick={() => toggleEdit(checkbox.id)}
                    marginX={2}
                    className={`${
                      checkbox.checked ? "line-through" : ""
                    } cursor-pointer`}
                  >
                    {checkbox.label}
                  </Typography>
                  //{" "}
                )}
              </div>
            ))}
          </Typography>
        </CardContent>
        <div
          className=" absolute top-0 right-10 rounded-badge p-2 bg-gray-300 hover:bg-sky-500 cursor-pointer"
          style={{ transition: "background-color 0.3s" }}
          onClick={handleEditAll}
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

export default CardPostIt;
