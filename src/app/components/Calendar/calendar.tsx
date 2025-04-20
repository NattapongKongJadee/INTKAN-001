"use client";
import React, { useEffect } from "react";
import {
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import Events from "./EventData";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import "./styleMUI.css";
import PageContainer from "@/app/components/Container/PageContainer";
import { IconCheck } from "@tabler/icons-react";
import BlankCard from "@/app/components/BankCard/BankCard";
import Breadcrumb from "@/app/components/Breadcumb/Breadcrumb";
import RiveDemo from "@/app/components/robotITK";
import { io } from "socket.io-client";

import Image from "next/image";
import "moment/locale/th"; // Import Thai locale for moment.js
import axios from "axios";
import { log } from "node:console";

// moment.locale("en-GB");
moment.locale("th");

const localizer = momentLocalizer(moment);

type EvType = {
  _id?: string;
  title: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
};

interface colorType {
  id: number;
  eColor: string;
  value: string;
}

const BigCalendar = ({ calendarHeight, calendarWidth }: any) => {
  const [calevents, setCalEvents] = React.useState<any>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [slot, setSlot] = React.useState<EvType>();
  const [start, setStart] = React.useState<any | null>();
  const [end, setEnd] = React.useState<any | null>();
  const [color, setColor] = React.useState<string>("default");
  const [update, setUpdate] = React.useState<EvType | undefined | any>();

  const ColorVariation: colorType[] = [
    {
      id: 1,
      eColor: "#1a97f5",
      value: "default",
    },
    {
      id: 2,
      eColor: "#39b69a",
      value: "green",
    },
    {
      id: 3,
      eColor: "#fc4b6c",
      value: "red",
    },
    {
      id: 4,
      eColor: "#615dff",
      value: "azure",
    },
    {
      id: 5,
      eColor: "#fdd43f",
      value: "warning",
    },
  ];

  const addNewEventAlert = async (slotInfo: EvType) => {
    // Open a modal or interface to collect event details
    setOpen(true);
    setSlot(slotInfo);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);

    // Optionally, pre-fill a title or collect it via a form
    const newEvent = {
      title: slotInfo.title,
      allDay: slotInfo.allDay || false,
      start: slotInfo.start,
      end: slotInfo.end,
      color: slotInfo.color || "default",
    };

    try {
      // Send a POST request to add the event to the backend
      const response = await axios.post(
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/events",
        newEvent
      );
      console.log("Event added:", response.data);

      // Optionally, update your calendar state here
      setCalEvents((prevEvents: any) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Error adding new event:", error);
    }
  };

  const editEvent = (event: any) => {
    setOpen(true);
    const newEditEvent = calevents.find(
      (elem: EvType) => elem.title === event.title
    );
    setColor(event.color);
    setTitle(newEditEvent.title);
    setColor(newEditEvent.color);
    setStart(newEditEvent.start);
    setEnd(newEditEvent.end);
    setUpdate(newEditEvent);
  };

  const updateEvent = async (e: any) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        title,
        start,
        end,
        color,
      };

      const response = await axios.put(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/events/${update._id}`,
        updatedEvent
      );

      // setCalEvents(
      //   calevents.map((elem: EvType) =>
      //     elem._id === update._id ? response.data : elem
      //   )
      // );
      setOpen(false);
      setTitle("");
      setColor("");
      setStart("");
      setEnd("");
      setUpdate(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const selectinputChangeHandler = (id: string) => setColor(id);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate title and dates before proceeding
    if (!title.trim()) {
      console.error("Title is required");
      alert("กรุณากรอกหัวข้องาน");
      return;
    }

    const newEvent = {
      title,
      start,
      end,
      color,
    };

    try {
      // Send a POST request to the backend to save the event
      const response = await axios.post(
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/events",
        newEvent
      );
      console.log("Event added:", response.data);

      // Update the calevents state with the event including its ID from the backend
      // setCalEvents((prevEvents: any) => [...prevEvents, response.data]);
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      // Close the dialog and reset the form state
      setOpen(false);
      setTitle("");
      setStart(new Date());
      setEnd(new Date());
    }
  };

  const deleteHandler = async (event: EvType) => {
    try {
      if (!event._id) {
        console.error("Event ID is missing");
        return;
      }

      await axios.delete(
        `https://backend-itk-581518296545.asia-southeast1.run.app/api/events/${event._id}`
      );
      setOpen(false);

      // const updatedCalEvents = calevents.filter(
      //   (ind: EvType) => ind._id !== event._id
      // );
      // setCalEvents(updatedCalEvents);
      console.log(`Event with ID ${event._id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleClose = () => {
    // eslint-disable-line newline-before-return
    setOpen(false);
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setUpdate(null);
  };

  const eventColors = (event: EvType) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  const handleStartChange = (newValue: any) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue: any) => {
    setEnd(newValue);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://backend-itk-581518296545.asia-southeast1.run.app/api/events"
      );
      console.log(response.data);
      setCalEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    console.log("test fetching event calendar");
  }, []);

  useEffect(() => {
    const socket = io(
      "https://backend-itk-581518296545.asia-southeast1.run.app"
    );

    socket.on("eventAdded", (newEvent) => {
      console.log("Received eventAdded:", newEvent);
      // Update the calendar events state
      setCalEvents((prevEvents: any) => [...prevEvents, newEvent]);
    });

    socket.on("eventUpdated", (updatedEvent) => {
      console.log("Received eventUpdated:", updatedEvent);

      // Update the specific event in the state
      setCalEvents((prevEvents: any) =>
        prevEvents.map((event: EvType) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
    });

    socket.on("eventDeleted", (deletedEventId) => {
      console.log("Received eventDeleted:", deletedEventId);

      setCalEvents((prevEvents: any) =>
        prevEvents.filter(
          (event: EvType) => event && event._id !== deletedEventId // Check for null/undefined
        )
      );
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);

  return (
    <PageContainer title="แบบแผนงาน" description="this is Calendar page">
      <div className="flex items-center">
        <Breadcrumb
          title="ปฏิทิน"
          subtitle="แบบแผนงาน"
          // imageSrc={"/logo-removebg-2.png"}
        />
      </div>
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: calendarHeight, width: calendarWidth }}
            //   style={{ height: "calc(100vh - 350px" }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event: any) => eventColors(event)}
          />
        </CardContent>
      </BlankCard>
      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form onSubmit={update ? updateEvent : submitHandler}>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography
              variant="h4"
              sx={{ mb: 2 }}
              fontSize={20}
              fontWeight={600}
              color={"black"}
            >
              {update ? "อัพเดตตารางงาน" : "เพิ่มตารางงาน"}
            </Typography>
            <Typography
              mb={2}
              variant="subtitle2"
              fontWeight={100}
              color={"lightgray"}
            >
              {!update
                ? // ? "To add Event kindly fillup the title and choose the event color and press the add button"
                  `เพิ่มตารางาน โดยการใส่หัวข้อหลังจากนั้นเลือกสีเพื่อระบุประเภทของงาน ขั้นตอนสุดท้ายกด ปุ่ม "เพิ่ม" `
                : // : "To Edit/Update Event kindly change the title and choose the event color and press the update button"}
                  `อัพเดต/แก้ไข แก้ไขหัวข้อหลังจากนั้น กดปุ่ม "อัพเดต" `}
              {slot?.title}
            </Typography>
            <TextField
              id="หัวข้องาน"
              placeholder="ใส่หัวข้องาน"
              variant="outlined"
              fullWidth
              label="หัวข้องาน"
              value={title}
              sx={{ mb: 3 }}
              onChange={inputChangeHandler}
            />
            {/* ------------------------------------------- */}
            {/* Selection of Start and end date */}
            {/* ------------------------------------------- */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="วันที่เริ่ม"
                inputFormat="MM/dd/yyyy"
                value={start}
                onChange={handleStartChange}
                renderInput={(params: any) => (
                  <TextField {...params} fullWidth sx={{ mb: 3 }} />
                )}
              />
              <DatePicker
                label="วันที่สิ้นสุด"
                inputFormat="MM/dd/yyyy"
                value={end}
                onChange={handleEndChange}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{ mb: 3 }}
                    error={start > end}
                    helperText={
                      start > end
                        ? // ? "End date must be later than start date"
                          "กรุณากรอกวันที่สิ้นสุดให้ถูกต้อง"
                        : ""
                    }
                  />
                )}
              />
            </LocalizationProvider>

            {/* ------------------------------------------- */}
            {/* Calendar Event Color*/}
            {/* ------------------------------------------- */}
            <Typography variant="h6" fontWeight={300} my={2} fontSize={16}>
              เลือกสีของเหตุการณ์
            </Typography>
            {/* ------------------------------------------- */}
            {/* colors for event */}
            {/* ------------------------------------------- */}
            {ColorVariation.map((mcolor) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{
                    marginRight: "3px",
                    transition: "0.1s ease-in",
                    scale: mcolor.value === color ? "0.9" : "0.7",
                  }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <IconCheck width={16} /> : ""}
                </Fab>
              );
            })}
          </DialogContent>
          {/* ------------------------------------------- */}
          {/* Action for dialog */}
          {/* ------------------------------------------- */}
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} id="cancel">
              ยกเลิก
            </Button>

            {update ? (
              <Button
                id="delete"
                type="submit"
                color="error"
                variant="contained"
                onClick={() => deleteHandler(update)}
              >
                ลบ
              </Button>
            ) : (
              ""
            )}
            <Button
              type="submit"
              disabled={!title}
              variant="contained"
              id="addAndUpdate"
            >
              {update ? "อัพเดต" : "เพิ่ม"}
            </Button>
          </DialogActions>
          {/* ------------------------------------------- */}
          {/* End Calendar */}
          {/* ------------------------------------------- */}
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default BigCalendar;
