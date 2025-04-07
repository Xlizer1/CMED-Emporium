"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Custom hooks
import { useFileExplorer } from "./hooks/useFileExplorer";
import { useFileOperations } from "./hooks/useFileOperations";
import { useContextMenu } from "./hooks/useContextMenu";
import { useFileSearch } from "./hooks/useFileSearch";

// Components
import { CustomTreeItem } from "./components/CustomTreeItem";
import { OptionMenu } from "./components/OptionMenu";
import { FileGrid } from "./components/FileGrid";
import { BreadcrumbPath } from "./components/BreadcrumbPath";
import { Toolbar } from "./components/Toolbar";
import { UploadDialog } from "./components/UploadDialog";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { Box as MuiBox } from "@mui/material";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Types
import { Folder } from "./types/types";

export function FileManager() {
  // Get theme mode from Redux store
  const mode = useSelector((state: RootState) => state.theme.mode);

  // Refs for DOM elements
  const folderRef = useRef<HTMLDivElement>(null);

  // Local state
  const [highlighted, setHighlighted] = useState<Folder | null>(null);
  const [doubleClickedItem, setDoubleClickedItem] = useState<Folder | false>(
    false
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);

  // Custom hooks for functionality
  const {
    treeView,
    navigationArr,
    folderPath,
    selectedFolder,
    setSelectedFolder,
    arrowClicked,
    setArrowClicked,
    arrowClickedCount,
    setArrowClickedCount,
    getData,
    handleDeleteLast,
    isLoading: isLoadingFolders,
  } = useFileExplorer();

  const {
    showFile,
    setShowFile,
    addForm,
    createNewFolder,
    setCreateNewFolder,
    createNewFile,
    folderName,
    setFolderName,
    specifyfolderAccessForm,
    addFile,
    handleCreateNewFolder,
    handleSpecifyfolderAccessForm,
    createFolder,
    updateFile,
    deleteFileOrFolder,
    downloadFile,
    uploadFiles,
    isLoading: isLoadingFileOps,
  } = useFileOperations(getData);

  const {
    menuOpen,
    menuPosition,
    rightClickedItem,
    handleContextMenu,
    createTreeContextMenuHandler,
    createParentContextMenuHandler,
    closeContextMenu,
  } = useContextMenu();

  const { searchValue, searchBoxOptions, handleSearchChange, setSelectedName } =
    useFileSearch(treeView);

  // Combined loading state
  const isLoading = isLoadingFolders || isLoadingFileOps;

  // Handle clicks outside of folders (to clear highlights)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        folderRef.current &&
        !folderRef.current.contains(event.target as Node)
      ) {
        setHighlighted(null);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle folder name input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  // Handle file upload button click
  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  // Handle new folder button click
  const handleNewFolderClick = () => {
    setCreateNewFolder(true);
  };

  // Handle file upload submission
  const handleUploadSubmit = async (files: File[]) => {
    if (selectedFolder?.id) {
      await uploadFiles(files, selectedFolder.id);
      setShowUploadDialog(false);
    }
  };

  // Recursively render tree items
  const renderTreeItems = (items: Folder[]) => {
    return items.map((folder) => (
      <CustomTreeItem
        key={folder.id}
        nodeId={folder?.nodeId || ""}
        label={folder.name}
        folder={folder}
        onSelect={handleFolderSelect}
        onContextMenu={createTreeContextMenuHandler(folder)}
      >
        {folder?.sub_classifications?.length
          ? folder?.sub_classifications
              .filter((item: Folder) => !item?.file_name)
              .map((subfolder: Folder) => (
                <CustomTreeItem
                  key={subfolder.id}
                  nodeId={subfolder?.nodeId || ""}
                  label={subfolder.name}
                  folder={subfolder}
                  onSelect={handleFolderSelect}
                  onContextMenu={createTreeContextMenuHandler(subfolder)}
                >
                  {subfolder?.sub_classifications?.length
                    ? subfolder?.sub_classifications
                        .filter((item: Folder) => !item?.file_name)
                        .map((deepFolder: Folder) => (
                          <CustomTreeItem
                            key={deepFolder.id}
                            nodeId={deepFolder?.nodeId || ""}
                            label={deepFolder.name}
                            folder={deepFolder}
                            onSelect={handleFolderSelect}
                            onContextMenu={createTreeContextMenuHandler(
                              deepFolder
                            )}
                          />
                        ))
                    : null}
                </CustomTreeItem>
              ))
          : null}
      </CustomTreeItem>
    ));
  };

  // Handle folder selection from tree
  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setArrowClickedCount(2);
    setArrowClicked(false);
  };

  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);

        // Handle dropped files
        if (e.dataTransfer.files.length > 0 && selectedFolder?.id) {
          const droppedFiles = Array.from(e.dataTransfer.files);
          uploadFiles(droppedFiles, selectedFolder.id);
        }
      }}
      sx={{
        height: "97.3vh",
        paddingTop: 7,
        userSelect: "none",
        position: "relative",
      }}
      ref={folderRef}
    >
      {isLoading && (
        <LinearProgress
          sx={{
            position: "absolute",
            top: 7,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
      )}

      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {/* Toolbar with navigation, title, search and action buttons */}
        <Toolbar
          mode={mode}
          arrowClicked={arrowClicked}
          arrowClickedCount={arrowClickedCount}
          navigationArr={navigationArr}
          searchBoxOptions={searchBoxOptions}
          searchValue={searchValue}
          setSelectedName={setSelectedName}
          handleSearchChange={handleSearchChange}
          handleDeleteLast={handleDeleteLast}
          setSelectedFolder={setSelectedFolder}
          setArrowClickedCount={setArrowClickedCount}
          setArrowClicked={setArrowClicked}
          getData={getData}
          onUploadClick={handleUploadClick}
          onNewFolderClick={handleNewFolderClick}
          selectedFolder={selectedFolder}
          isLoading={isLoading}
        />

        <Box sx={{ display: "flex", height: "100%" }}>
          {/* Left sidebar with folder tree */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              width: "20%",
              height: "100%",
              padding: 3,
              paddingY: 1,
              display: "flex",
              justifyContent: "center",
              borderRight: "1px solid #b3b3b3",
              overflow: "auto",
            }}
          >
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={
                <MuiBox sx={{ display: "flex", gap: 0.5 }}>
                  <ExpandMoreIcon /> <FaFolderOpen color="#F8D775" />
                </MuiBox>
              }
              defaultExpandIcon={
                <MuiBox sx={{ display: "flex", gap: 0.5 }}>
                  <ChevronRightIcon /> <FaFolder color="#F8D775" />
                </MuiBox>
              }
            >
              {renderTreeItems(treeView)}
            </TreeView>
          </Box>

          {/* Main content area */}
          <Box
            onContextMenu={(e) => {
              e.stopPropagation();
              if (selectedFolder?.id) {
                createParentContextMenuHandler(selectedFolder)(e);
              }
            }}
            onClick={() => {
              setHighlighted(null);
              if (createNewFolder && !folderName?.length) {
                setCreateNewFolder(false);
              }
            }}
            sx={{
              backgroundColor: "background.paper",
              width: "80%",
              height: "100%",
              overflow: "auto",
            }}
          >
            {/* Folder path breadcrumb navigation */}
            <BreadcrumbPath
              folderPath={folderPath}
              setSelectedFolder={setSelectedFolder}
            />

            {/* File and folder grid */}
            <Box
              sx={{
                backgroundColor: "background.paper",
                width: "100%",
                display: "flex",
                marginBottom: "100px",
              }}
            >
              <FileGrid
                selectedFolder={selectedFolder}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                handleContextMenu={handleContextMenu}
                createNewFolder={createNewFolder}
                rightClickedItem={rightClickedItem}
                folderName={folderName}
                handleChange={handleChange}
                handleCreateNewFolderByContextMenuOption={() =>
                  handleCreateNewFolder(selectedFolder?.id)
                }
                setDoubleClickedItem={setDoubleClickedItem}
                setShowFile={setShowFile}
                setSelectedFolder={setSelectedFolder}
                setArrowClickedCount={setArrowClickedCount}
                setArrowClicked={setArrowClicked}
                setIsDragging={setIsDragging}
              />

              {/* Context menu */}
              {menuOpen && (
                <OptionMenu
                  open={menuOpen}
                  onClose={closeContextMenu}
                  anchorReference="anchorPosition"
                  rightClickedItem={rightClickedItem}
                  fromSideMenu={menuPosition?.from_side_menu}
                  handleDeleteFileOrFolder={deleteFileOrFolder}
                  downloadFile={downloadFile}
                  setShowFile={setShowFile}
                  updateFile={updateFile}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  createFolder={createFolder}
                  addFile={addFile}
                  handleSpecifyfolderAccessForm={handleSpecifyfolderAccessForm}
                  anchorPosition={
                    menuPosition.y !== 0 && menuPosition.x !== 0
                      ? { top: menuPosition.y, left: menuPosition.x }
                      : undefined
                  }
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drag overlay */}
      {isDragging && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(74, 144, 226, 0.1)",
            border: "3px dashed #4a90e2",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            pointerEvents: "none",
          }}
        >
          <Box
            component="img"
            src="/file.svg"
            alt="Upload files"
            sx={{
              width: "80px",
              height: "80px",
              marginBottom: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h5"
            sx={{ color: "#4a90e2", fontWeight: "bold" }}
          >
            Drop files here
          </Typography>
          <Typography variant="body1" sx={{ color: "#4a90e2", mt: 1 }}>
            Upload to: {selectedFolder?.name || "Current folder"}
          </Typography>
        </Box>
      )}

      {/* File upload dialog */}
      <UploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleUploadSubmit}
        selectedFolder={selectedFolder}
        isLoading={isLoading}
      />

      {/* Loading backdrop for long operations */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading && (isDragging || showUploadDialog)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Additional modal components would go here */}
      {/* These would be separate components for:
          - File viewer modal (showFile state)
          - Add form modal (addForm state)
          - Specify folder access form modal (specifyfolderAccessForm state)
      */}
    </Box>
  );
}
