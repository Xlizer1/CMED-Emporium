// src/components/FileManager/components/UploadDialog.tsx
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Chip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import { Folder } from "../types/types";
import {
  validateFiles,
  ALLOWED_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
} from "@/utils/fileValidator";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  selectedFolder: Folder;
  isLoading: boolean;
}

/**
 * Dialog component for file uploads
 */
export const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  selectedFolder,
  isLoading,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [invalidFiles, setInvalidFiles] = useState<
    { file: File; errors: string[] }[]
  >([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate total size of selected files
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const { validFiles, invalidFiles } = validateFiles(fileArray);

      setFiles((prev) => [...prev, ...validFiles]);
      setInvalidFiles((prev) => [...prev, ...invalidFiles]);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files);
      const { validFiles, invalidFiles } = validateFiles(fileArray);

      setFiles((prev) => [...prev, ...validFiles]);
      setInvalidFiles((prev) => [...prev, ...invalidFiles]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Upload files and close dialog
  const handleUpload = async () => {
    if (files.length === 0) return;

    await onUpload(files);
    setFiles([]);
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isLoading) {
      setFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Upload Files to "{selectedFolder?.name || "Root"}"
      </DialogTitle>
      <DialogContent>
        {/* File type info */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Allowed File Types:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {ALLOWED_FILE_EXTENSIONS.map((ext) => (
              <Chip
                key={ext}
                label={ext}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem" }}
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)} MB
          </Typography>
        </Box>

        {/* Drag and drop area */}
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed",
            borderColor: dragActive ? "primary.main" : "grey.400",
            borderRadius: 2,
            padding: 3,
            textAlign: "center",
            backgroundColor: dragActive ? "rgba(0, 0, 0, 0.05)" : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            mb: 2,
          }}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept={ALLOWED_FILE_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          />
          <CloudUploadIcon
            sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
          />
          <Typography variant="h6" gutterBottom>
            Drag & Drop files here
          </Typography>
          <Typography variant="body2" color="textSecondary">
            or click to browse files
          </Typography>
        </Box>

        {/* Invalid files alert */}
        {invalidFiles.length > 0 && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setInvalidFiles([])}
              >
                Dismiss
              </Button>
            }
          >
            <Typography variant="subtitle2">
              {invalidFiles.length} file(s) cannot be uploaded:
            </Typography>
            <List dense>
              {invalidFiles.slice(0, 3).map((item, index) => (
                <ListItem key={index} dense disableGutters>
                  <Typography variant="caption" sx={{ display: "block" }}>
                    • {item.file.name} - {item.errors[0]}
                  </Typography>
                </ListItem>
              ))}
              {invalidFiles.length > 3 && (
                <ListItem dense disableGutters>
                  <Typography variant="caption" sx={{ display: "block" }}>
                    • ...and {invalidFiles.length - 3} more
                  </Typography>
                </ListItem>
              )}
            </List>
          </Alert>
        )}

        {/* Valid file list */}
        {files.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Selected Files ({files.length}) - Total Size: {totalSizeInMB} MB
            </Typography>
            <List dense sx={{ maxHeight: "200px", overflow: "auto" }}>
              {files.map((file, index) => (
                <ListItem
                  key={`${file.name}-${index}`}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isLoading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024).toFixed(2)} KB - ${
                      file.type || "Unknown type"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={files.length === 0 || isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
