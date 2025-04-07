"use client";

import React, { useEffect, useState, forwardRef, useRef } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Tooltip,
  Menu,
  MenuItem,
  Collapse,
} from "@mui/material";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view";
import { TreeItem } from "@mui/x-tree-view";
import { useTreeItem } from "@mui/x-tree-view";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { FaFolder, FaLock, FaFolderOpen } from "react-icons/fa";

// Import images
import folderIcon from "../../assets/FileExplorerIcons/folder.png";
import folder_filesIcon from "../../assets/FileExplorerIcons/folder_files.png";
import fileIcon from "../../assets/FileExplorerIcons/file.png";
import csvIcon from "../../assets/FileExplorerIcons/csv.png";
import docIcon from "../../assets/FileExplorerIcons/doc.png";
import jpgIcon from "../../assets/FileExplorerIcons/jpg.png";
import pdfIcon from "../../assets/FileExplorerIcons/pdf.png";
import pngIcon from "../../assets/FileExplorerIcons/png.png";
import textIcon from "../../assets/FileExplorerIcons/text.png";
import zip from "../../assets/FileExplorerIcons/zip.png";
import rar from "../../assets/FileExplorerIcons/rar.png";

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

// Type definitions
interface FileSearchOption {
  id: number;
  name: string;
  type: string;
  file_name?: string;
}

interface Folder {
  id: number;
  name: string;
  level?: number;
  sub_classifications?: Folder[];
  file_name?: string;
  nodeId?: string;
  parentFolder?: boolean;
  treeFolder?: boolean;
  path?: string;
}

interface MenuPosition {
  x: number;
  y: number;
  from_side_menu: boolean;
}

interface OptionMenuProps {
  open: boolean;
  onClose: () => void;
  anchorReference: "anchorPosition" | "anchorEl";
  anchorPosition?: { top: number; left: number };
  rightClickedItem: Folder;
  fromSideMenu?: boolean;
  downloadFile: (item: Folder) => void;
  handleDeleteFileOrFolder: (item: Folder) => void;
  UpdateFunction: (item: Folder) => void;
  setShowFile: (show: boolean) => void;
  selectedFolder: Folder;
  setSelectedFolder: (folder: Folder) => void;
  addFile: () => void;
  createFolder: () => void;
  createTreeFolder: () => void;
  handleSpecifyfolderAccessForm: () => void;
}

// Option Menu Component
const OptionMenu: React.FC<OptionMenuProps> = ({
  open,
  onClose,
  anchorReference,
  anchorPosition,
  rightClickedItem,
  fromSideMenu,
  downloadFile,
  handleDeleteFileOrFolder,
  UpdateFunction,
  setShowFile,
  selectedFolder,
  setSelectedFolder,
  addFile,
  createFolder,
  createTreeFolder,
  handleSpecifyfolderAccessForm,
}) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference={anchorReference}
      anchorPosition={anchorPosition}
    >
      {!rightClickedItem?.parentFolder ? (
        <>
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
        </>
      ) : null}
      {rightClickedItem?.file_name ? (
        <MenuItem
          onClick={() => {
            UpdateFunction(rightClickedItem);
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
      ) : null}
      {rightClickedItem?.parentFolder || rightClickedItem?.treeFolder ? (
        <>
          {!rightClickedItem?.treeFolder ? (
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
          ) : null}
        </>
      ) : null}
      {!rightClickedItem?.parentFolder ? (
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
      ) : null}
      {rightClickedItem?.file_name ? (
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
      ) : null}
    </Menu>
  );
};

// TransitionComponent for TreeItem animation
function TransitionComponent(props: any) {
  return <Collapse {...props} />;
}

// Custom TreeItem Content Component
const CustomContent = forwardRef(function CustomContent(props: any, ref: any) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onSelect,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement>) => {
    handleExpansion(event);
  };

  const handleSelectionClick = () => {
    if (onSelect) {
      onSelect({ nodeId, label });
    }
  };

  return (
    <div
      className={clsx(className, classes?.root, {
        [classes?.expanded || ""]: expanded,
        [classes?.selected || ""]: selected,
        [classes?.focused || ""]: focused,
        [classes?.disabled || ""]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className={classes?.iconContainer}>
        {icon ? (
          icon
        ) : (
          <FolderIcon
            style={{ marginLeft: "22px", color: "#F8D775", fontSize: "21px" }}
          />
        )}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes?.label}
        sx={{ marginLeft: 1 }}
      >
        {label}
      </Typography>
    </div>
  );
});

// Custom TreeItem Component
const CustomTreeItem = forwardRef(function CustomTreeItem(
  props: any,
  ref: any
) {
  const { onSelect, ...otherProps } = props;
  return (
    <TreeItem
      ContentComponent={(contentProps) => (
        <CustomContent {...contentProps} onSelect={onSelect} />
      )}
      {...otherProps}
      ref={ref}
    />
  );
});

export function FileManager() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const [arrowClicked, setArrowClicked] = useState<boolean>(false);
  const [arrowClickedCount, setArrowClickedCount] = useState<number>(2);
  const [navigationArr, setNavigationArr] = useState<Folder[]>([]);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder>({} as Folder);
  const [rightClickedItem, setRightClickedItem] = useState<Folder>(
    {} as Folder
  );
  const [showFile, setShowFile] = useState<boolean>(false);
  const [addForm, setAddForm] = useState<boolean>(false);
  const [doubleClickedItem, setDoubleClickedItem] = useState<Folder | false>(
    false
  );
  const [treeView, setTreeView] = useState<Folder[]>([]);
  const [lastFolder, setLastFolder] = useState<Folder | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [highlighted, setHighlighted] = useState<Folder | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    x: 0,
    y: 0,
    from_side_menu: false,
  });
  const [folderName, setFolderName] = useState<string>("");
  const [createNewFolder, setCreateNewFolder] = useState<boolean>(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [createNewTreeFolder, setCreateNewTreeFolder] =
    useState<boolean>(false);
  const [createNewFile, setCreateNewFile] = useState<boolean>(false);
  const [showAddDroppedFile, setShowAddDroppedFile] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [searchBoxOptions, setSearchBoxOptions] = useState<FileSearchOption[]>(
    []
  );
  const [specifyfolderAccessForm, setSpecifyfolderAccessForm] =
    useState<boolean>(false);

  const folderRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    from_side_menu?: boolean
  ) => {
    event.preventDefault();
    setMenuOpen(true);
    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
      from_side_menu: from_side_menu || false,
    });
  };

  const addFile = async () => {
    setAddForm(true);
    setCreateNewFile(true);
  };

  const handleCreateNewFolderByContextMenuOption = async () => {
    // Placeholder for API call
    console.log("Creating new folder:", folderName);
    setCreateNewFolder(false);
    setFolderName("");
  };

  const handleSpecifyfolderAccessForm = async () => {
    setSpecifyfolderAccessForm(true);
  };

  const createFolder = async () => {
    setCreateNewFolder(true);
  };

  const createTreeFolder = async () => {
    setCreateNewTreeFolder(true);
  };

  const UpdateFunction = (row: Folder) => {
    setAddForm(true);
  };

  const handleDeleteFileOrFolder = (item: Folder) => {
    // Placeholder for delete API call
    console.log("Deleting item:", item);
  };

  const downloadFile = async (item: Folder) => {
    // Placeholder for download API call
    console.log("Downloading file:", item);
  };

  // Sample data for demo purposes
  const sampleTreeData: Folder[] = [
    {
      id: 1,
      name: "Documents",
      level: 0,
      nodeId: "1",
      sub_classifications: [
        {
          id: 2,
          name: "Reports",
          level: 1,
          nodeId: "1-0",
          sub_classifications: [
            {
              id: 4,
              name: "Annual Report.pdf",
              level: 2,
              nodeId: "1-0-0",
              file_name: "Annual Report.pdf",
            },
          ],
        },
        {
          id: 3,
          name: "Projects",
          level: 1,
          nodeId: "1-1",
          sub_classifications: [],
        },
      ],
    },
    {
      id: 5,
      name: "Images",
      level: 0,
      nodeId: "2",
      sub_classifications: [
        {
          id: 6,
          name: "Logo.png",
          level: 1,
          nodeId: "2-0",
          file_name: "Logo.png",
        },
      ],
    },
  ];

  // Initial data loading
  useEffect(() => {
    getData();
  }, []);

  // Set initial selected folder
  useEffect(() => {
    if (treeView?.length > 0) {
      setSelectedFolder(treeView[0]);
    }
  }, [treeView?.length]);

  // Update navigation array when selected folder changes
  useEffect(() => {
    if (selectedFolder?.id && !arrowClicked) {
      setNavigationArr([...navigationArr, selectedFolder]);
    }
  }, [selectedFolder?.id]);

  const handleDeleteLast = () => {
    const newArray = [...navigationArr];
    newArray.pop();
    setNavigationArr(newArray);
  };

  function addNodeId(data: Folder[], prefix = ""): Folder[] {
    return data.map((item, index) => {
      const newItem = { ...item, nodeId: `${prefix}${index}` };
      if (newItem.sub_classifications) {
        newItem.sub_classifications = addNodeId(
          newItem.sub_classifications,
          `${newItem.nodeId}-`
        );
      }
      return newItem;
    });
  }

  const getData = async () => {
    // For demo, use sample data
    const updatedData = addNodeId(sampleTreeData);
    setTreeView(updatedData);
    setCreateNewFile(false);
    setCreateNewFolder(false);
    setFolderName("");
  };

  function getLastFolderFromObjects(objects: Folder[]): Folder | null {
    let lastFolder: Folder | null = null;

    objects.forEach((obj) => {
      const folder = getLastFolder(obj);
      if (
        folder &&
        (!lastFolder ||
          (folder.sub_classifications?.length || 0) >
            (lastFolder.sub_classifications?.length || 0))
      ) {
        lastFolder = folder;
      }
    });

    return lastFolder;
  }

  function getLastFolder(obj: Folder): Folder | null {
    if (!obj.sub_classifications || obj.sub_classifications.length === 0) {
      return obj.file_name ? null : obj;
    } else {
      for (let i = obj.sub_classifications.length - 1; i >= 0; i--) {
        const sub = obj.sub_classifications[i];
        if (!sub.file_name) {
          if (obj.level === 2) {
            obj.sub_classifications.reverse();
          }
          const lastSubFolder = getLastFolder(sub);
          if (lastSubFolder) {
            return lastSubFolder;
          }
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const lastFolder = getLastFolderFromObjects(treeView);
    handleFilesSearch("");
    setLastFolder(lastFolder);
  }, [treeView]);

  const handleFilesSearch = (value: string) => {
    // Placeholder for search API call
    console.log("Searching for:", value);
    // Sample search results
    setSearchBoxOptions([
      {
        id: 1,
        name: "Annual Report",
        type: "file",
        file_name: "Annual Report.pdf",
      },
      { id: 2, name: "Projects", type: "folder" },
      { id: 3, name: "Logo", type: "file", file_name: "Logo.png" },
    ]);
  };

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

  const findFolderById = (
    folders: Folder[],
    targetId: number,
    targetLevel?: number,
    path: Folder[] = []
  ): Folder[] | null => {
    for (const folder of folders) {
      const newPath = path.length === 0 ? [folder] : [...path, folder];
      if (
        folder.id === targetId &&
        (!targetLevel || folder.level === targetLevel)
      ) {
        return newPath;
      }
      if (folder.sub_classifications && folder.sub_classifications.length > 0) {
        const found = findFolderById(
          folder.sub_classifications,
          targetId,
          targetLevel,
          newPath
        );
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (selectedFolder?.id) {
      const folderPathArray = findFolderById(
        treeView,
        selectedFolder.id,
        selectedFolder.level
      );
      if (folderPathArray) {
        setFolderPath(folderPathArray);
        setSelectedFolder(folderPathArray[folderPathArray?.length - 1]);
      }
    }
  }, [treeView, selectedFolder?.id]);

  return (
    <Box
      sx={{
        height: "100%",
        userSelect: "none",
      }}
      ref={folderRef}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          // "&::-webkit-scrollbar": {
          //   display: "none",
          // },
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: 3,
            paddingY: 2,
            gap: 3,
            mb: 1,
            borderBottom: "1px solid #b3b3b3",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: 1,
              gap: 1,
            }}
          >
            <ArrowCircleLeftIcon
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setArrowClicked(true);
                handleDeleteLast();
                setSelectedFolder(navigationArr[navigationArr?.length - 2]);
                setArrowClickedCount(arrowClickedCount + 1);
              }}
            />
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
              />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "18px" }}>Files</Typography>
          <Box
            sx={{
              width: "300px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                borderRadius: "3px",
                paddingX: 1,
              }}
            >
              <Autocomplete
                sx={{
                  ml: 1.5,
                  mt: 1,
                  mb: 1,
                  width: "95%",
                  "& .MuiFormLabel-root,& .MuiInputBase-input": {
                    fontFamily: "Cairo-Medium",
                  },
                }}
                options={searchBoxOptions}
                getOptionLabel={(option: any) => option?.name || ""}
                filterOptions={(options) => options}
                onChange={(e, newVal) => {
                  if (newVal) setSelectedName(newVal?.name);
                }}
                onInputChange={(e, newInputValue) => {
                  setSearchValue(newInputValue);
                  handleFilesSearch(newInputValue);
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
                          src={
                            (
                              fileIconsMap.find(
                                (i) =>
                                  i?.name === option?.file_name?.split(".")?.[1]
                              ) || fileIconsMap[0]
                            ).img
                          }
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
              <SearchIcon
                sx={{ position: "absolute", right: "20px", color: "gray" }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "100%" }}>
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
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <ExpandMoreIcon /> <FaFolderOpen color="#F8D775" />
                </Box>
              }
              defaultExpandIcon={
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <ChevronRightIcon /> <FaFolder color="#F8D775" />
                </Box>
              }
            >
              {treeView.map((folder) => (
                <CustomTreeItem
                  key={folder.id}
                  nodeId={folder?.nodeId || ""}
                  label={folder.name}
                  onSelect={() => {
                    setSelectedFolder(folder);
                    setArrowClickedCount(2);
                    setArrowClicked(false);
                  }}
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, true);
                    setRightClickedItem({
                      ...folder,
                      treeFolder: true,
                    });
                  }}
                >
                  {folder?.sub_classifications?.length
                    ? folder?.sub_classifications?.map((folder_lvl_1) =>
                        !folder_lvl_1?.file_name ? (
                          <CustomTreeItem
                            key={folder_lvl_1.id}
                            nodeId={folder_lvl_1?.nodeId || ""}
                            label={folder_lvl_1.name}
                            onSelect={() => {
                              setSelectedFolder(folder_lvl_1);
                              setArrowClickedCount(2);
                              setArrowClicked(false);
                            }}
                            onContextMenu={(e) => {
                              e.stopPropagation();
                              handleContextMenu(e, true);
                              setRightClickedItem({
                                ...folder_lvl_1,
                                treeFolder: true,
                              });
                            }}
                          >
                            {folder_lvl_1?.sub_classifications?.length
                              ? folder_lvl_1?.sub_classifications?.map(
                                  (folder_lvl_2) =>
                                    !folder_lvl_2?.file_name ? (
                                      <CustomTreeItem
                                        key={folder_lvl_2.id}
                                        nodeId={folder_lvl_2?.nodeId || ""}
                                        label={folder_lvl_2.name}
                                        onSelect={() => {
                                          setSelectedFolder(folder_lvl_2);
                                          setArrowClickedCount(2);
                                          setArrowClicked(false);
                                        }}
                                        onContextMenu={(e) => {
                                          e.stopPropagation();
                                          handleContextMenu(e, true);
                                          setRightClickedItem({
                                            ...folder_lvl_2,
                                            treeFolder: true,
                                          });
                                        }}
                                      />
                                    ) : null
                                )
                              : null}
                          </CustomTreeItem>
                        ) : null
                      )
                    : null}
                </CustomTreeItem>
              ))}
            </TreeView>
          </Box>

          <Box
            onContextMenu={(e) => {
              e.stopPropagation();
              if (selectedFolder?.id) {
                handleContextMenu(e);
                setRightClickedItem({
                  ...selectedFolder,
                  parentFolder: true,
                });
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #e3e3e3",
                marginLeft: 1,
                paddingBottom: 1,
              }}
            >
              {folderPath?.map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    ml: i === 0 ? 1 : -1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      padding: "3px 8px",
                    }}
                  >
                    {i > 0 ? ">  " : ""}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: i === 0 ? "bold" : "400",
                      padding: "3px 8px",
                      "&:hover": {
                        borderRadius: "3px",
                        backgroundColor: "lightblue",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => setSelectedFolder(f)}
                  >
                    {f?.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                backgroundColor: "background.paper",
                width: "100%",
                display: "flex",
                marginBottom: "100px",
              }}
            >
              {selectedFolder?.id ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "inline-flex",
                    flexWrap: "wrap",
                    padding: 1,
                    alignContent: "flex-start",
                  }}
                  onClick={() => {
                    setIsDragging(false);
                    setHighlighted(null);
                  }}
                >
                  {selectedFolder?.sub_classifications?.length ? (
                    selectedFolder?.sub_classifications?.map((element) =>
                      element?.file_name ? (
                        <Box
                          key={element.id}
                          onContextMenu={(e) => {
                            e.stopPropagation();
                            handleContextMenu(e);
                            setRightClickedItem(element);
                          }}
                          onDoubleClick={() => {
                            setDoubleClickedItem(element);
                            setShowFile(true);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHighlighted(element);
                          }}
                          sx={{
                            width: "calc(10% + 2rem)",
                            minHeight: "125px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "2px",
                            textAlign: "center",
                            backgroundColor:
                              highlighted?.id === element?.id &&
                              highlighted?.name
                                .toLowerCase()
                                .includes(element.name.toLowerCase())
                                ? "#b4cffa"
                                : "unset",
                            "&:hover": {
                              backgroundColor: "#e3e3e3",
                              cursor: "pointer",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              (
                                fileIconsMap.find(
                                  (i) =>
                                    i?.name ===
                                    element?.file_name?.split(".")?.[1]
                                ) || fileIconsMap[0]
                              ).img
                            }
                            alt="#"
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
                            {element?.name && element?.name?.length > 30 ? (
                              <Tooltip title={element?.name}>
                                <Box>
                                  {highlighted?.id === element?.id &&
                                  highlighted?.name
                                    .toLowerCase()
                                    .includes(element.name.toLowerCase())
                                    ? element?.name
                                    : element?.name
                                        ?.replace(/\s+/g, " ")
                                        ?.slice(0, 30) + "..."}
                                </Box>
                              </Tooltip>
                            ) : element?.name && element?.name?.length > 0 ? (
                              element?.name?.replace(/\s+/g, " ")
                            ) : (
                              ""
                            )}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          key={element.id}
                          onContextMenu={(e) => {
                            e.stopPropagation();
                            handleContextMenu(e);
                            setRightClickedItem(element);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHighlighted(element);
                          }}
                          sx={{
                            width: "calc(10% + 2rem)",
                            minHeight: "125px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "2px",
                            textAlign: "center",
                            backgroundColor:
                              highlighted?.id === element?.id &&
                              highlighted?.name
                                .toLowerCase()
                                .includes(element.name.toLowerCase())
                                ? "#b4cffa"
                                : "unset",
                            "&:hover": {
                              backgroundColor: "#e3e3e3",
                              cursor: "pointer",
                            },
                          }}
                          onDoubleClick={() => {
                            setSelectedFolder(element);
                            setArrowClickedCount(2);
                            setArrowClicked(false);
                          }}
                        >
                          {element?.sub_classifications?.length ? (
                            <Box
                              component="img"
                              src={folder_filesIcon}
                              alt="#"
                              sx={{
                                width: "45px",
                              }}
                            />
                          ) : (
                            <Box
                              component="img"
                              src={folderIcon}
                              alt="#"
                              sx={{
                                width: "45px",
                              }}
                            />
                          )}
                          <Typography>
                            {element?.name && element?.name?.length > 30 ? (
                              <Tooltip title={element?.name}>
                                <Box>
                                  {element?.name
                                    ?.replace(/\s+/g, " ")
                                    ?.slice(0, 30) + "..."}
                                </Box>
                              </Tooltip>
                            ) : element?.name && element?.name?.length > 0 ? (
                              element?.name?.replace(/\s+/g, " ")
                            ) : (
                              ""
                            )}
                          </Typography>
                        </Box>
                      )
                    )
                  ) : createNewFolder ? null : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: 3,
                      }}
                    >
                      <Typography
                        sx={{ textAlign: "center", color: "#919191" }}
                      >
                        Empty Directory...
                      </Typography>
                    </Box>
                  )}
                  {createNewFolder &&
                  rightClickedItem?.id === selectedFolder?.id &&
                  !rightClickedItem?.treeFolder ? (
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
                        alt="#"
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
                  ) : null}
                </Box>
              ) : (
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
              )}
              {menuOpen && (
                <OptionMenu
                  open={menuOpen}
                  onClose={() => setMenuOpen(false)}
                  anchorReference="anchorPosition"
                  rightClickedItem={rightClickedItem}
                  fromSideMenu={menuPosition?.from_side_menu}
                  handleDeleteFileOrFolder={handleDeleteFileOrFolder}
                  downloadFile={downloadFile}
                  setShowFile={setShowFile}
                  UpdateFunction={UpdateFunction}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  createFolder={createFolder}
                  addFile={addFile}
                  createTreeFolder={createTreeFolder}
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
    </Box>
  );
}
