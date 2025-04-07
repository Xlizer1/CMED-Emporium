// OptionMenu.tsx - Context menu for file manager items
import React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { Folder } from "../types/types";

interface OptionMenuProps {
  open: boolean;
  onClose: () => void;
  anchorReference: "anchorPosition" | "anchorEl";
  anchorPosition?: { top: number; left: number };
  rightClickedItem: Folder;
  fromSideMenu?: boolean;
  downloadFile: (item: Folder) => Promise<void>;
  handleDeleteFileOrFolder: (item: Folder) => Promise<void>;
  updateFile: (item: Folder) => void;
  setShowFile: (show: boolean) => void;
  selectedFolder: Folder;
  setSelectedFolder: (folder: Folder) => void;
  addFile: () => Promise<void>;
  createFolder: () => Promise<void>;
  handleSpecifyfolderAccessForm: () => Promise<void>;
}

/**
 * Context menu for file and folder operations
 */
export const OptionMenu: React.FC<OptionMenuProps> = ({
  open,
  onClose,
  anchorReference,
  anchorPosition,
  rightClickedItem,
  fromSideMenu,
  downloadFile,
  handleDeleteFileOrFolder,
  updateFile,
  setShowFile,
  selectedFolder,
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
      {/* Open menu item */}
      {!rightClickedItem?.parentFolder && (
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
      )}

      {/* Edit menu item (for files only) */}
      {rightClickedItem?.file_name && (
        <MenuItem
          onClick={() => {
            updateFile(rightClickedItem);
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
      )}

      {/* Add file and create folder menu items */}
      {(rightClickedItem?.parentFolder || rightClickedItem?.treeFolder) &&
        !rightClickedItem?.treeFolder && (
          <>
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
          </>
        )}

      {/* Delete menu item */}
      {!rightClickedItem?.parentFolder && (
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
      )}

      {/* Download menu item (for files only) */}
      {rightClickedItem?.file_name && (
        <MenuItem
          onClick={() => {
            downloadFile(rightClickedItem);
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
      )}
    </Menu>
  );
};
