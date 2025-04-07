// FolderItem.tsx - Component for displaying a folder
import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { Folder } from "../types/types";

// Import folder icons
import folderIcon from "../../../assets/FileExplorerIcons/folder.png";
import folder_filesIcon from "../../../assets/FileExplorerIcons/folder_files.png";

interface FolderItemProps {
  folder: Folder;
  highlighted: Folder | null;
  onDoubleClick: (folder: Folder) => void;
  onClick: (folder: Folder, event: React.MouseEvent) => void;
  onContextMenu: (folder: Folder, event: React.MouseEvent) => void;
}

/**
 * Component that renders a folder item in the file manager
 */
export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  highlighted,
  onDoubleClick,
  onClick,
  onContextMenu,
}) => {
  // Determine if this folder is highlighted
  const isHighlighted =
    highlighted?.id === folder.id &&
    highlighted.name.toLowerCase().includes(folder.name.toLowerCase());

  // Determine which icon to use (folder with files or empty folder)
  const hasSubs =
    folder.sub_classifications && folder.sub_classifications.length > 0;

  // Format folder name for display (truncate if too long)
  const formatFolderName = () => {
    if (!folder.name) return "";

    if (folder.name.length > 30) {
      return folder.name.replace(/\s+/g, " ").slice(0, 30) + "...";
    }

    return folder.name.replace(/\s+/g, " ");
  };

  return (
    <Box
      onContextMenu={(e) => onContextMenu(folder, e)}
      onClick={(e) => onClick(folder, e)}
      onDoubleClick={() => onDoubleClick(folder)}
      sx={{
        width: "calc(10% + 2rem)",
        minHeight: "125px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "2px",
        textAlign: "center",
        backgroundColor: isHighlighted ? "#b4cffa" : "unset",
        "&:hover": {
          backgroundColor: "#e3e3e3",
          cursor: "pointer",
        },
      }}
    >
      <Box
        component="img"
        src={hasSubs ? folder_filesIcon.src : folderIcon.src}
        alt={`${folder.name} folder icon`}
        sx={{
          width: "45px",
        }}
      />

      <Typography>
        {folder.name && folder.name.length > 30 ? (
          <Tooltip title={folder.name}>
            <Box>{formatFolderName()}</Box>
          </Tooltip>
        ) : (
          formatFolderName()
        )}
      </Typography>
    </Box>
  );
};
