import React from "react";
import { useContext } from "react";

import { GeneralContext } from "./App.jsx";

import "./css/footer.css";

import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import CallIcon from "@mui/icons-material/Call";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DialpadIcon from "@mui/icons-material/Dialpad";
import SettingsIcon from "@mui/icons-material/Settings";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";


const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1001,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const Footer = () => {
  const { callType, callCount } = useContext(GeneralContext);

  return (
    <AppBar
      position="absolute"
      color="primary"
      sx={{
        top: "auto",
        bottom: 0,
        height: "fit-content",
        padding: 0,
        backgroundColor: "#FAF9F6",
      }}
    >
      <Toolbar>
        <IconButton
          sx={{ borderBottom: "none !important" }}
          className="clicked"
          color="inherit"
          aria-label="open drawer"
        >
          <CallIcon sx={{ borderBottom: "3px solid green" }} />
          {callType[0] !== "archived" && (
            <div>
              <p id="nav-counter">{callCount}</p>
            </div>
          )}
        </IconButton>
        <IconButton
          className=" general-btn"
          color="inherit"
          aria-label="open drawer"
        >
          <PersonOutlineOutlinedIcon sx={{ color: "grey" }} />
        </IconButton>
        <StyledFab
          sx={{ backgroundColor: "green", border: "5px double white" }}
          color="secondary"
          aria-label="add"
        >
          <DialpadIcon />
        </StyledFab>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton className=" general-btn" color="inherit">
          <SettingsIcon sx={{ color: "grey" }} />
        </IconButton>
        <IconButton className=" general-btn" color="inherit">
          <RadioButtonCheckedIcon sx={{ color: "grey" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
