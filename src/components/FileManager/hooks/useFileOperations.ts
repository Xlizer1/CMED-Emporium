// src/components/FileManager/hooks/useFileOperations.ts
import { useState } from "react";
import { Folder } from "../types/types";
import { fileService } from "@/services/fileService";
import { toast } from "react-toastify";

/**
 * Custom hook that provides file operation functions and related state
 */
export const useFileOperations = (refreshData: () => Promise<void>) => {
  const [showFile, setShowFile] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [createNewFolder, setCreateNewFolder] = useState<boolean>(false);
  const [createNewFile, setCreateNewFile] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [specifyfolderAccessForm, setSpecifyfolderAccessForm] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<Folder | null>(null);

  /**
   * Adds a new file
   */
  const addFile = async (): Promise<void> => {
    setAddForm(true);
    setCreateNewFile(true);
  };

  /**
   * Creates a new folder with the name stored in state
   */
  const handleCreateNewFolder = async (parentId?: number): Promise<void> => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    try {
      setIsLoading(true);
      await fileService.createFolder(folderName, parentId);
      toast.success(`Folder "${folderName}" created successfully`);
      setCreateNewFolder(false);
      setFolderName("");
      await refreshData();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Opens folder access form
   */
  const handleSpecifyfolderAccessForm = async (): Promise<void> => {
    setSpecifyfolderAccessForm(true);
  };

  /**
   * Sets state to create a new folder
   */
  const createFolder = async (): Promise<void> => {
    setCreateNewFolder(true);
  };

  /**
   * Updates a file or folder
   */
  const updateFile = (file: Folder): void => {
    setSelectedFile(file);
    setAddForm(true);
  };

  /**
   * Uploads files to a specific folder
   * @param files Files to upload
   * @param folderId Target folder ID
   */
  const uploadFiles = async (
    files: File[],
    folderId: number
  ): Promise<void> => {
    try {
      setIsLoading(true);

      // Filter out video files
      const allowedFiles = files.filter(
        (file) => !file.type.startsWith("video/")
      );

      if (allowedFiles.length < files.length) {
        toast.warning("Video files are not allowed and were skipped");
      }

      if (allowedFiles.length === 0) {
        toast.error("No valid files to upload");
        return;
      }

      await fileService.uploadMultipleFiles(allowedFiles, folderId);
      toast.success(`${allowedFiles.length} files uploaded successfully`);
      await refreshData();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a file or folder
   */
  const deleteFileOrFolder = async (item: Folder): Promise<void> => {
    try {
      setIsLoading(true);
      await fileService.deleteItem(item);

      const itemType = item.file_name ? "File" : "Folder";
      toast.success(`${itemType} "${item.name}" deleted successfully`);

      await refreshData();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Downloads a file
   */
  const downloadFile = async (item: Folder): Promise<void> => {
    if (!item.id || !item.file_name) {
      toast.error("Invalid file");
      return;
    }

    try {
      setIsLoading(true);
      const blob = await fileService.downloadFile(item.id);

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`File "${item.name}" downloaded successfully`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    showFile,
    setShowFile,
    addForm,
    setAddForm,
    createNewFolder,
    setCreateNewFolder,
    createNewFile,
    setCreateNewFile,
    folderName,
    setFolderName,
    specifyfolderAccessForm,
    setSpecifyfolderAccessForm,
    isLoading,
    selectedFile,
    setSelectedFile,

    // Functions
    addFile,
    handleCreateNewFolder,
    handleSpecifyfolderAccessForm,
    createFolder,
    updateFile,
    deleteFileOrFolder,
    downloadFile,
    uploadFiles,
  };
};
