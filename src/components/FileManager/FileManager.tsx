'use client'

import React, { useEffect, useState, forwardRef, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Tooltip,
  debounce,
} from "@mui/material";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, useTreeItemState } from "@mui/x-tree-view/TreeItem";
import axios from "axios";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { FaFolder, FaLock, FaFolderOpen } from "react-icons/fa";
import { useDispatch } from "react-redux";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

// import folderIcon from "../../assets/img/FileExplorerIcons/folder.png";
import folderIcon from "@/assets/FileExplorerIcons/folder.png";
import folder_filesIcon from "@/assets/img/FileExplorerIcons/folder_files.png";
import fileIcon from "@/assets/img/FileExplorerIcons/file.png";
import csvIcon from "@/assets/img/FileExplorerIcons/csv.png";
import docIcon from "@/assets/img/FileExplorerIcons/doc.png";
import jpgIcon from "@/assets/img/FileExplorerIcons/jpg.png";
import pdfIcon from "@/assets/img/FileExplorerIcons/pdf.png";
import pngIcon from "@/assets/img/FileExplorerIcons/png.png";
import textIcon from "@/assets/img/FileExplorerIcons/text.png";
import zip from "@/assets/img/FileExplorerIcons/zip.png";
import rar from "@/assets/img/FileExplorerIcons/rar.png";
import xlsx from "@/assets/img/FileExplorerIcons/xlsx.png";
// import ViewFile from "../Files/ViewFile";
// import AddForm from "./AddForm";
import ClearIcon from "@mui/icons-material/Clear";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Collapse from "@mui/material/Collapse";
import UploadImage from "../../assets/img/upload.png";
import { useSpring, animated } from "@react-spring/web";
// import AddDroppedFile from "./components/AddDroppedFile";
// import FolderAccessForm from "./components/FolderAccessForm";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import MainClassificationAdd from "../ClassificationsTreeView/MainClassificationAdd";
import { LuFolderGit } from "react-icons/lu";
// import SubClassification1Add from "../ClassificationsTreeView/SubClassification1Add";
// import SubClassification2Add from "../ClassificationsTreeView/SubClassification2Add";
// import SubClassification4Add from "../ClassificationsTreeView/SubClassification4Add";
// import SubClassification3Add from "../ClassificationsTreeView/SubClassification3Add";





interface FolderType {
  id: number;
  name: string;
  level: number;
  sub_classifications: FolderType[];
  file_name?: string;
  created_at: string;
  // Add other properties as needed
}

interface RightClickedItemType extends FolderType {
  treeFolder?: boolean;
  parentFolder?: boolean;
}

interface OptionMenuProps {
  open: boolean;
  onClose: () => void;
  anchorReference: "anchorPosition" | "anchorEl";
  anchorPosition?: { top: number; left: number };
  rightClickedItem: RightClickedItemType;
  setMainClassAdd: React.Dispatch<React.SetStateAction<boolean>>;
  downloadFile: () => Promise<void>;
  handleDeleteFileOrFolder: (item: RightClickedItemType) => void;
  UpdateFunction: (row: RightClickedItemType) => void;
  setShowFile: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFolder: React.Dispatch<React.SetStateAction<FolderType>>;
  addFile: () => Promise<void>;
  createFolder: () => Promise<void>;
  handleSpecifyfolderAccessForm: () => Promise<void>;
}

const OptionMenu: React.FC<OptionMenuProps> = ({
  open,
  onClose,
  anchorReference,
  anchorPosition,
  rightClickedItem,
  setMainClassAdd,
  downloadFile,
  handleDeleteFileOrFolder,
  UpdateFunction,
  setShowFile,
  setSelectedFolder,
  addFile,
  createFolder,
  handleSpecifyfolderAccessForm,
}) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference={anchorReference}
      anchorPosition={anchorPosition}
    >
      {!rightClickedItem?.parentFolder ? (
        <>
          <MenuItem
            onClick={() => {
              if (rightClickedItem?.file_name) setShowFile(true);
              else setSelectedFolder(rightClickedItem);
              onClose();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "30px",
            }}
          >
            <FolderIcon style={{ color: "#F8D775" }} />
            <Typography>Open</Typography>
          </MenuItem>
          {/* {!rightClickedItem?.file_name &&
          JSON.parse(localStorage.getItem("roles")).includes(90) ? ( */}
            <>
              <MenuItem
                onClick={() => {
                  setMainClassAdd(true);
                  onClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  height: "30px",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    marginLeft: "2px",
                  }}
                >
                  <LuFolderGit
                    style={{ color: "#F8D775", fontSize: "20px" }}
                  />
                  <FaLock
                    style={{
                      color: "#fff",
                      position: "absolute",
                      bottom: "5px",
                      right: "3px",
                      fontSize: "8px",
                    }}
                  />
                </Box>
                <Typography>Edit Folder</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleSpecifyfolderAccessForm();
                  onClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  height: "30px",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    marginLeft: "2px",
                  }}
                >
                  <FaFolder style={{ color: "#F8D775", fontSize: "20px" }} />
                  <FaLock
                    style={{
                      color: "#fff",
                      position: "absolute",
                      bottom: "5px",
                      right: "3px",
                      fontSize: "8px",
                    }}
                  />
                </Box>
                <Typography>Specify who can access this folder</Typography>
              </MenuItem>
            </>
          {/* ) : null} */}
        </>
      ) : null}
      {/* {rightClickedItem?.file_name &&
      JSON.parse(localStorage.getItem("roles")).includes(66) ? ( */}
        <MenuItem
          onClick={() => {
            UpdateFunction(rightClickedItem);
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "30px",
          }}
        >
          <EditIcon style={{ color: "#1E6A99" }} />
          <Typography>Edit</Typography>
        </MenuItem>
      {/* ) : null} */}
      {/* {rightClickedItem?.parentFolder || rightClickedItem?.treeFolder ? ( */}
        <>
          {/* {!rightClickedItem?.treeFolder ? ( */}
            <>
              {/* {JSON.parse(localStorage.getItem("roles")).includes(65) ? ( */}
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    addFile();
                    onClose();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    height: "30px",
                  }}
                >
                  <NoteAddIcon style={{ color: "#1E6A99" }} />
                  <Typography>Add File</Typography>
                </MenuItem>
              {/* ) : null} */}
              {/* {rightClickedItem?.level !== 4 &&
              JSON.parse(localStorage.getItem("roles")).includes(68) ? ( */}
                <MenuItem
                  onClick={() => {
                    createFolder();
                    onClose();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    height: "30px",
                  }}
                >
                  <CreateNewFolderIcon style={{ color: "#F8D775" }} />
                  <Typography>Create Folder</Typography>
                </MenuItem>
              {/* ) : null} */}
            </>
          {/* ) : null} */}
        </>
      {/* ) : null} */}
      {/* {!rightClickedItem?.parentFolder &&
      (rightClickedItem?.file_name
        ? JSON.parse(localStorage.getItem("roles")).includes(67)
        : JSON.parse(localStorage.getItem("roles")).includes(68)) ? ( */}
        <MenuItem
          onClick={() => {
            handleDeleteFileOrFolder(rightClickedItem);
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "30px",
          }}
        >
          <DeleteIcon sx={{ color: "#ff0000" }} />
          <Typography>Delete</Typography>
        </MenuItem>
      {/* ) : null} */}
      {/* {rightClickedItem?.file_name ? ( */}
        <MenuItem
          onClick={() => {
            // downloadFile(rightClickedItem);
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "30px",
          }}
        >
          <DownloadIcon style={{ fill: "#1E6A99" }} />
          <Typography>Download File</Typography>
        </MenuItem>
      {/* ) : null} */}
    </Menu>
  );
};
