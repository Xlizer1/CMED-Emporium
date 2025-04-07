// src/components/FileManager/components/Toolbar.tsx
import React from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CachedIcon from "@mui/icons-material/Cached";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { FileSearchOption, Folder } from "../types/types";

interface ToolbarProps {
  mode: string;
  arrowClicked: boolean;
  arrowClickedCount: number;
  navigationArr: Folder[];
  searchBoxOptions: FileSearchOption[];
  searchValue: string;
  setSelectedName: (name: string) => void;
  handleSearchChange: (value: string) => void;
  handleDeleteLast: () => void;
  setSelectedFolder: (folder: Folder) => void;
  setArrowClickedCount: (count: number) => void;
  setArrowClicked: (clicked: boolean) => void;
  getData: () => Promise<void>;
  onUploadClick: () => void;
  onNewFolderClick: () => void;
  selectedFolder: Folder | null;
  isLoading: boolean;
}

/**
 * Component that renders the main toolbar of the file manager
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  arrowClicked,
  arrowClickedCount,
  navigationArr,
  searchBoxOptions,
  searchValue,
  setSelectedName,
  handleSearchChange,
  handleDeleteLast,
  setSelectedFolder,
  setArrowClickedCount,
  setArrowClicked,
  getData,
  onUploadClick,
  onNewFolderClick,
  selectedFolder,
  isLoading,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: 3,
        paddingY: 2,
        gap: 2,
        mb: 1,
        borderBottom: "1px solid #b3b3b3",
      }}
    >
      {/* Navigation controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Back button */}
        <ArrowCircleLeftIcon
          sx={{
            cursor: navigationArr.length > 1 ? "pointer" : "default",
            opacity: navigationArr.length > 1 ? 1 : 0.5,
          }}
          onClick={() => {
            if (navigationArr.length > 1) {
              setArrowClicked(true);
              handleDeleteLast();
              setSelectedFolder(navigationArr[navigationArr?.length - 2]);
              setArrowClickedCount(arrowClickedCount + 1);
            }
          }}
          aria-label="Go back"
        />

        {/* Refresh button */}
        <Box
          sx={{
            borderRadius: "50%",
            bgcolor: mode === "dark" ? "#fff" : "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20px",
            width: "20px",
          }}
        >
          <CachedIcon
            sx={{
              cursor: "pointer",
              color: mode === "dark" ? "#000" : "#fff",
              fontSize: "18px",
            }}
            onClick={() => {
              getData();
            }}
            aria-label="Refresh file list"
          />
        </Box>
      </Box>

      {/* Title */}
      <Typography sx={{ fontSize: "18px" }}>Files</Typography>

      {/* Search box */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            borderRadius: "3px",
            paddingX: 1,
            width: "300px",
          }}
        >
          <Autocomplete
            sx={{
              width: "100%",
              "& .MuiFormLabel-root,& .MuiInputBase-input": {
                fontFamily: "Cairo-Medium",
              },
            }}
            options={searchBoxOptions}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option?.name || ""
            }
            filterOptions={(options) => options}
            onChange={(e, newVal) => {
              if (newVal && typeof newVal !== "string")
                setSelectedName(newVal.name);
            }}
            onInputChange={(e, newInputValue) => {
              handleSearchChange(newInputValue);
            }}
            limitTags={1}
            freeSolo
            renderOption={(props, option) => {
              return (
                <li {...props}>
                  {option.type === "folder" ? (
                    <FolderIcon
                      style={{
                        marginRight: "15px",
                        color: "#F8D775",
                        fontSize: "25px",
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={option.file_name?.split(".")[1] || "file"}
                      alt="#"
                      sx={{
                        marginRight: "15px",
                        width: "25px",
                      }}
                    />
                  )}
                  {option?.name}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={"Search in directory"}
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    height: "35px",
                  },
                  endAdornment: <SearchIcon sx={{ color: "gray" }} />,
                }}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  sx: {
                    "&:not(.Mui-focused)": {
                      color: "gray",
                      marginTop: -1,
                    },
                  },
                }}
                inputProps={{
                  ...params.inputProps,
                  style: {
                    marginTop: -10,
                  },
                }}
              />
            )}
          />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={onUploadClick}
          disabled={!selectedFolder?.id || isLoading}
          color="primary"
          size="small"
        >
          Upload
        </Button>
        <Button
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          onClick={onNewFolderClick}
          disabled={!selectedFolder?.id || isLoading}
          size="small"
        >
          New Folder
        </Button>
      </Box>
    </Box>
  );
};
