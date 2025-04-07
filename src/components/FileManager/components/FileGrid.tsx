// FileGrid.tsx - Grid component to display files and folders
import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { FileItem } from "./FileItem";
import { FolderItem } from "./FolderItem";
import { Folder } from "../types/types";
import folderIcon from "../../../assets/FileExplorerIcons/folder.png";

interface FileGridProps {
  selectedFolder: Folder;
  highlighted: Folder | null;
  setHighlighted: (folder: Folder | null) => void;
  handleContextMenu: (event: React.MouseEvent, folder: Folder) => void;
  createNewFolder: boolean;
  rightClickedItem: Folder;
  folderName: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateNewFolderByContextMenuOption: () => Promise<void>;
  setDoubleClickedItem: (folder: Folder) => void;
  setShowFile: (show: boolean) => void;
  setSelectedFolder: (folder: Folder) => void;
  setArrowClickedCount: (count: number) => void;
  setArrowClicked: (clicked: boolean) => void;
  setIsDragging?: (isDragging: boolean) => void;
}

/**
 * Grid component to display files and folders
 */
export const FileGrid: React.FC<FileGridProps> = ({
  selectedFolder,
  highlighted,
  setHighlighted,
  handleContextMenu,
  createNewFolder,
  rightClickedItem,
  folderName,
  handleChange,
  handleCreateNewFolderByContextMenuOption,
  setDoubleClickedItem,
  setShowFile,
  setSelectedFolder,
  setArrowClickedCount,
  setArrowClicked,
  setIsDragging,
}) => {
  // Handle file double click
  const handleFileDoubleClick = (file: Folder) => {
    setDoubleClickedItem(file);
    setShowFile(true);
  };

  // Handle folder double click
  const handleFolderDoubleClick = (folder: Folder) => {
    setSelectedFolder(folder);
    setArrowClickedCount(2);
    setArrowClicked(false);
  };

  // Handle item click to highlight
  const handleItemClick = (item: Folder, event: React.MouseEvent) => {
    event.stopPropagation();
    setHighlighted(item);
  };

  // Handle context menu for items
  const handleItemContextMenu = (item: Folder, event: React.MouseEvent) => {
    event.stopPropagation();
    handleContextMenu(event, item);
  };

  // If there's no selected folder, show a message
  if (!selectedFolder?.id) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: 3,
        }}
      >
        <Typography sx={{ textAlign: "center", color: "#919191" }}>
          No Selected Directory...
        </Typography>
      </Box>
    );
  }

  // If the folder is empty and we're not creating a new folder, show a message
  if (!selectedFolder?.sub_classifications?.length && !createNewFolder) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: 3,
        }}
      >
        <Typography sx={{ textAlign: "center", color: "#919191" }}>
          Empty Directory...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "inline-flex",
        flexWrap: "wrap",
        padding: 1,
        alignContent: "flex-start",
      }}
      onClick={() => {
        if (setIsDragging) setIsDragging(false);
        setHighlighted(null);
      }}
    >
      {/* Render files and folders */}
      {selectedFolder?.sub_classifications?.map((item) =>
        item?.file_name ? (
          // Render file
          <FileItem
            key={item.id}
            file={item}
            highlighted={highlighted}
            onDoubleClick={handleFileDoubleClick}
            onClick={handleItemClick}
            onContextMenu={handleItemContextMenu}
          />
        ) : (
          // Render folder
          <FolderItem
            key={item.id}
            folder={item}
            highlighted={highlighted}
            onDoubleClick={handleFolderDoubleClick}
            onClick={handleItemClick}
            onContextMenu={handleItemContextMenu}
          />
        )
      )}

      {/* Creating new folder UI */}
      {createNewFolder &&
        rightClickedItem?.id === selectedFolder?.id &&
        !rightClickedItem?.treeFolder && (
          <Box
            sx={{
              height: "125px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              borderRadius: "2px",
              margin: 0.5,
              textAlign: "center",
              "&:hover": {
                backgroundColor: "#e3e3e3",
                cursor: "pointer",
              },
            }}
          >
            <Box
              component="img"
              src={folderIcon}
              alt="New folder"
              sx={{
                width: "45px",
              }}
            />
            <TextField
              autoFocus
              value={folderName}
              sx={{ fontFamily: "Cairo-Medium", marginX: 2 }}
              InputProps={{
                sx: { height: "5px", width: "100px" },
              }}
              onChange={handleChange}
              multiline
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNewFolderByContextMenuOption();
                }
              }}
            />
          </Box>
        )}
    </Box>
  );
};
