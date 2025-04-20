import React, { ReactNode } from "react";
import {
  Button,
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  header: string;
}
const styleModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#3a88fe",
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: 12,
  p: 4,
};

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  handleClose,
  handleConfirm,
  header,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={styleModal}>
        <FormControl defaultValue="" required>
          <Typography
            variant="h6"
            marginBottom={1}
            fontSize={18}
            style={{ fontFamily: "sans-serif", color: "white" }}
          >
            ยืนยันที่จะลบ{header}ใช่หรือไม่
          </Typography>
          <div className=" flex flex-row my-4   items-end justify-between ">
            <Button
              variant="contained"
              sx={{ bgcolor: "#c0c0c0" }}
              onClick={handleClose}
            >
              ยกเลิก
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirm}>
              ตกลง
            </Button>
          </div>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default CustomModal;
