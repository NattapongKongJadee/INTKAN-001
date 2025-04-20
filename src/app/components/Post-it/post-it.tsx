import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import FocusLock from "react-focus-lock";
import axios from "axios";
import { io } from "socket.io-client";

import { log } from "node:console";
import zIndex from "@mui/material/styles/zIndex";

interface Checkbox {
  id: string;
  checked: boolean;
  label: string;
  isEditing: boolean;
}

const CardPostIt = ({
  title,
  handleDelete,
  id,
  checkboxList,
  addCheckboxToBox,
}: any) => {
  const [checkedBox, setCheckBox] = useState([checkboxList]);
  const [editingLabel, setEditngLabel] = useState<string>("");

  const addCheckbox = async (boxId: string) => {
    try {
      const newCheckboxData = {
        label: "เนื้อหางาน",
      };
      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${boxId}/checkboxes`,
        newCheckboxData
      );
      // addCheckboxToBox(boxId, newCheckboxData);

      console.log("Checkbox added successfully:", response.data);
    } catch (error) {
      console.error("Error adding a new checkbox:", error);
    }
  };

  // const toggleCheckbox = async (checkboxId: string) => {
  //   // Optimistically update UI
  //   setCheckBox((prevCheckBox) =>
  //     prevCheckBox.map((checkbox) =>
  //       checkbox._id === checkboxId
  //         ? { ...checkbox, checked: !checkbox.checked }
  //         : checkbox
  //     )
  //   );

  //   try {
  //     // Send the request to the backend to persist the change
  //     await axios.put(
  //       `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${id}/checkboxes/${checkboxId}/toggle`
  //     );
  //     console.log(`Checkbox with ID ${checkboxId} toggled successfully`);
  //   } catch (error) {
  //     console.error("Error toggling checkbox:", error);

  //     // Revert the state if the request fails
  //     setCheckBox((prevCheckBox) =>
  //       prevCheckBox.map((checkbox) =>
  //         checkbox._id === checkboxId
  //           ? { ...checkbox, checked: !checkbox.checked }
  //           : checkbox
  //       )
  //     );
  //   }
  // };

  // const toggleEdit = (idSubWork: string) => {
  //   console.log("Current checkboxes:", checkedBox);
  //   console.log(idSubWork);

  //   setCheckBox(
  //     checkedBox.map((checkbox) =>
  //       checkbox._id === idSubWork ? { ...checkbox, isEditing: true } : checkbox
  //     )
  //   );
  // };

  const toggleCheckbox = async (idSubWork: string) => {
    try {
      await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${id}/checkboxes/${idSubWork}/toggle`
      );

      // No need to manually update the state, as the backend emits the event
    } catch (error) {
      console.error("Error toggling checkbox status:", error);
    }
  };

  const toggleEdit = (idSubWork: string) => {
    console.log("Toggling edit mode for:", idSubWork);

    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox._id === idSubWork ? { ...checkbox, isEditing: true } : checkbox
      )
    );
  };

  const handleLabelChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    idSubWork: string
  ) => {
    console.log(idSubWork);

    setCheckBox(
      checkedBox.map((checkbox) =>
        checkbox._id === idSubWork
          ? { ...checkbox, label: event.target.value }
          : checkbox
      )
    );
  };

  const handleLabelSubmit = async (idSubWork: string) => {
    console.log(idSubWork);

    const updatedCheckbox = checkedBox.find(
      (checkbox) => checkbox._id === idSubWork
    );
    if (!updatedCheckbox) return;

    try {
      await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${id}/checkboxes/${idSubWork}/edit`,
        {
          label: updatedCheckbox.label,
        }
      );

      setCheckBox(
        checkedBox.map((checkbox) =>
          checkbox._id === idSubWork
            ? { ...checkbox, isEditing: false }
            : checkbox
        )
      );
    } catch (error) {
      console.error("Error updating the label:", error);
    }
  };
  const handleDeleteEachCheckBox = async (idSubWork: string) => {
    try {
      await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/boxes/${id}/checkboxes/${idSubWork}`
      );

      // setCheckBox(checkedBox.filter((checkbox) => checkbox._id !== idSubWork));
      // console.log(`Checkbox with ID ${idSubWork} deleted successfully`);
    } catch (error) {
      console.error("Error deleting the checkbox:", error);
    }
  };

  // const handleEditAll = () => {
  //   setCheckBox(
  //     checkedBox.map((checkbox) => ({
  //       ...checkbox,
  //       isEditing: checkbox.checked ? false : true, // Only set `isEditing` to true if `checked` is false
  //     }))
  //   );
  // };
  useEffect(() => {
    if (checkboxList) {
      setCheckBox((prevCheckBox) => {
        // Map existing checkboxes and replace with new ones if necessary
        const updatedList = checkboxList.map((newCheckbox: any) => {
          const existingCheckbox = prevCheckBox.find(
            (checkbox) => checkbox._id === newCheckbox._id
          );
          return existingCheckbox || newCheckbox; // Use existing if available
        });

        console.log("Merged Checkbox List:", updatedList);
        return updatedList;
      });
    }
  }, [checkboxList]);

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    // socket.on("checkboxAdded", ({ id, checkbox }) => {
    //   console.log("Received checkboxAdded event:", { id, checkbox });
    //   setCheckBox((prevCheckboxList) => {
    //     console.log("Previous State:", prevCheckboxList);

    //     const updatedCheckboxList = [...prevCheckboxList, checkbox];

    //     console.log("Updated Checkbox List:", updatedCheckboxList);
    //     return updatedCheckboxList;
    //   });
    // });

    socket.on("checkboxEditToggled", ({ boxId, checkboxId, isEditing }) => {
      setCheckBox((prevCheckboxList) =>
        prevCheckboxList.map((checkbox) =>
          checkbox._id === checkboxId ? { ...checkbox, isEditing } : checkbox
        )
      );
    });

    // Listen for label changes
    socket.on("checkboxLabelChanged", ({ boxId, checkboxId, label }) => {
      setCheckBox((prevCheckboxList) =>
        prevCheckboxList.map((checkbox) =>
          checkbox._id === checkboxId ? { ...checkbox, label } : checkbox
        )
      );
    });

    socket.on("checkboxStatusToggled", ({ boxId, checkboxId, checked }) => {
      setCheckBox((prevCheckboxList) =>
        prevCheckboxList.map((checkbox) =>
          checkbox._id === checkboxId ? { ...checkbox, checked } : checkbox
        )
      );
    });

    socket.on("checkboxDeleted", ({ boxId, checkboxId }) => {
      setCheckBox((prevCheckboxList) =>
        prevCheckboxList.filter((checkbox) => checkbox._id !== checkboxId)
      );
    });
  }, []);

  return (
    <div className="relative  m-auto">
      <Card
        sx={{
          width: { sm: "50px", md: "450px", lg: "650px" },
          height: { sm: "150px", md: "200px", lg: "250px" },
          boxShadow: "4",
          borderRadius: "20px",
          border: "1px solid rgb(2,116,225)",
          background: "white",
          transition: "box-shadow 0.32 ease-in-out",
          "&:hover": {
            cursor: "pointer",
            boxShadow: "0 16px 32px 0 rgba(2,116,225,0.2)",
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
              sx={{ fontFamily: "sans-serif" }} // Add this line
            >
              {title}
            </Typography>
            <div
              className="flex flex-row mx-2 mt-2 hover:animate-vibrate"
              onClick={() => addCheckbox(id)}
            >
              <IoAddCircleSharp
                size={24}
                className="text-sky-600  hover:text-green-400"
              />
            </div>
          </div>
          <Typography
            variant="body2"
            color="black"
            sx={{ fontFamily: "sans-serif" }}
          >
            {checkedBox.map((checkbox: any) => (
              <div key={checkbox._id} className="flex flex-row items-center ">
                <div onClick={() => toggleCheckbox(checkbox._id)}>
                  {checkbox.checked ? (
                    <MdCheckBox
                      size={24}
                      className="text-sky-500"
                      style={{ zIndex: "999" }}
                    />
                  ) : (
                    <MdCheckBoxOutlineBlank
                      size={24}
                      className="text-sky-500"
                    />
                  )}
                </div>
                {checkbox.isEditing ? (
                  <div className="flex relative flex-row  w-screen justify-between ">
                    <input
                      className="plain-input"
                      style={{
                        fontSize: "18px",
                        width: "100%",
                        borderRadius: "1px",
                        marginRight: 50,
                      }}
                      type="text"
                      value={checkbox.label}
                      onChange={(e) => handleLabelChange(e, checkbox._id)}
                      onBlur={() => handleLabelSubmit(checkbox._id)}
                      autoFocus
                    />
                    <TiDelete
                      size={30}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEachCheckBox(checkbox._id);
                      }}
                      className="text-red-500 delete-button"
                      style={{ zIndex: 99999, cursor: "auto" }}
                    />
                  </div>
                ) : (
                  <Typography
                    onDoubleClick={() => toggleEdit(checkbox._id)}
                    marginX={2}
                    className={`${
                      checkbox.checked ? "line-through" : ""
                    } cursor-pointer`}
                    sx={{
                      textDecoration: checkbox.checked
                        ? "line-through"
                        : "none",
                      textDecorationColor: checkbox.checked ? "red" : "inherit", // Change 'red' to any color you prefer
                    }}
                  >
                    {checkbox.label}
                  </Typography>
                  //{" "}
                )}
              </div>
            ))}
          </Typography>
        </CardContent>
        {/* <div
          className=" absolute top-0 right-10 rounded-badge p-2 bg-gray-300 hover:bg-sky-500 cursor-pointer"
          style={{ transition: "background-color 0.3s" }}
          onClick={handleEditAll}
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

export default CardPostIt;
