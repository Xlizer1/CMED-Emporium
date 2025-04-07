// useFileOperations.ts - Custom hook for file operations
import { useState } from "react";
import { Folder } from "../types/types";

/**
 * Custom hook that provides file operation functions and related state
 */
export const useFileOperations = () => {
  const [showFile, setShowFile] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [createNewFolder, setCreateNewFolder] = useState<boolean>(false);
  const [createNewFile, setCreateNewFile] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("");
  const [specifyfolderAccessForm, setSpecifyfolderAccessForm] =
    useState<boolean>(false);

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
  const handleCreateNewFolder = async (): Promise<void> => {
    try {
      // Here you would make an API call to create the folder
      console.log("Creating new folder:", folderName);
      // After successful API call:
      setCreateNewFolder(false);
      setFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      // Handle error (show toast notification, etc.)
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
    setAddForm(true);
  };

  const uploadFiles = async (
    files: File[],
    folderId: number
  ): Promise<void> => {
    try {
      // Create a FormData object to send the files
      const formData = new FormData();

      // Append each file to the FormData
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Add the folder ID to know where to store the files
      formData.append("folderId", folderId.toString());

      // In a real app, you would send this to your API
      console.log("Uploading files to folder:", folderId, files);

      // Example API call (uncomment and adapt when you have your API ready)
      /*
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      // Refresh the file list after successful upload
      getData();
      */
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  /**
   * Deletes a file or folder
   */
  const deleteFileOrFolder = async (item: Folder): Promise<void> => {
    try {
      // Here you would make an API call to delete the item
      console.log("Deleting item:", item);
      // After successful deletion, you would refresh the file list
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  /**
   * Downloads a file
   */
  const downloadFile = async (item: Folder): Promise<void> => {
    try {
      // Here you would make an API call to download the file
      console.log("Downloading file:", item);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle error (show toast notification, etc.)
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
