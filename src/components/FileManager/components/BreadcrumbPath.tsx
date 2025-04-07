// BreadcrumbPath.tsx - Component to display folder navigation path
import React from "react";
import { Box, Typography } from "@mui/material";
import { Folder } from "../types/types";

interface BreadcrumbPathProps {
  folderPath: Folder[];
  setSelectedFolder: (folder: Folder) => void;
}

/**
 * Component that renders a breadcrumb path for folder navigation
 */
export const BreadcrumbPath: React.FC<BreadcrumbPathProps> = ({
  folderPath,
  setSelectedFolder,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e3e3e3",
        marginLeft: 1,
        paddingBottom: 1,
        flexWrap: "wrap", // Allow wrapping for long paths
      }}
    >
      {folderPath.map((folder, index) => (
        <Box
          key={index}
          sx={{
            ml: index === 0 ? 1 : -1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              padding: "3px 8px",
            }}
          >
            {index > 0 ? ">  " : ""}
          </Typography>
          <Typography
            sx={{
              fontWeight: index === 0 ? "bold" : "400",
              padding: "3px 8px",
              "&:hover": {
                borderRadius: "3px",
                backgroundColor: "lightblue",
                cursor: "pointer",
              },
            }}
            onClick={() => setSelectedFolder(folder)}
            // Add accessibility attributes
            role="button"
            aria-label={`Navigate to ${folder.name}`}
            tabIndex={0}
          >
            {folder?.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
