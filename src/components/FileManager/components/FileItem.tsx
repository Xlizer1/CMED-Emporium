// FileItem.tsx - Component for displaying a file
import React from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { Folder } from "../types/types";

// Import file icons
import fileIcon from "../../../assets/FileExplorerIcons/file.png";
import csvIcon from "../../../assets/FileExplorerIcons/csv.png";
import docIcon from "../../../assets/FileExplorerIcons/doc.png";
import jpgIcon from "../../../assets/FileExplorerIcons/jpg.png";
import pdfIcon from "../../../assets/FileExplorerIcons/pdf.png";
import pngIcon from "../../../assets/FileExplorerIcons/png.png";
import textIcon from "../../../assets/FileExplorerIcons/text.png";
import zip from "../../../assets/FileExplorerIcons/zip.png";
import rar from "../../../assets/FileExplorerIcons/rar.png";

// Define file types
const fileIconsMap = [
  { name: "file", img: fileIcon },
  { name: "csv", img: csvIcon },
  { name: "doc", img: docIcon },
  { name: "docx", img: docIcon },
  { name: "jpg", img: jpgIcon },
  { name: "pdf", img: pdfIcon },
  { name: "png", img: pngIcon },
  { name: "text", img: textIcon },
  { name: "zip", img: zip },
  { name: "rar", img: rar },
];

interface FileItemProps {
  file: Folder;
  highlighted: Folder | null;
  onDoubleClick: (file: Folder) => void;
  onClick: (file: Folder, event: React.MouseEvent) => void;
  onContextMenu: (file: Folder, event: React.MouseEvent) => void;
}

/**
 * Component that renders a file item in the file manager
 */
export const FileItem: React.FC<FileItemProps> = ({
  file,
  highlighted,
  onDoubleClick,
  onClick,
  onContextMenu,
}) => {
  // Get the file extension and find the corresponding icon
  const fileExtension = file.file_name?.split(".").pop();
  const icon =
    fileIconsMap.find((i) => i.name === fileExtension) || fileIconsMap[0];

  // Determine if this file is highlighted
  const isHighlighted =
    highlighted?.id === file.id &&
    highlighted.name.toLowerCase().includes(file.name.toLowerCase());

  // Format file name for display (truncate if too long)
  const formatFileName = () => {
    if (!file.name) return "";

    if (file.name.length > 30) {
      if (isHighlighted) {
        return file.name;
      }
      return file.name.replace(/\s+/g, " ").slice(0, 30) + "...";
    }

    return file.name.replace(/\s+/g, " ");
  };

  return (
    <Box
      onContextMenu={(e) => onContextMenu(file, e)}
      onDoubleClick={() => onDoubleClick(file)}
      onClick={(e) => onClick(file, e)}
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
        src={icon.img.src}
        alt={`${file.name} icon`}
        sx={{
          width: "45px",
        }}
      />

      <Typography
        sx={{
          maxWidth: "125px",
          overflowWrap: "break-word",
        }}
      >
        {file.name && file.name.length > 30 ? (
          <Tooltip title={file.name}>
            <Box>{formatFileName()}</Box>
          </Tooltip>
        ) : (
          formatFileName()
        )}
      </Typography>
    </Box>
  );
};
