import React, { useEffect, useState, forwardRef, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
  Tooltip,
  debounce,
} from "@mui/material";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
import axios from "axios";
import Host from "../../../src/assets/js/Host";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import { FaFolder, FaLock, FaFolderOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "../../reduxStore/SettingsReducer";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import folderIcon from "../../assets/img/FileExplorerIcons/folder.png";
import folder_filesIcon from "../../assets/img/FileExplorerIcons/folder_files.png";
import fileIcon from "../../assets/img/FileExplorerIcons/file.png";
import csvIcon from "../../assets/img/FileExplorerIcons/csv.png";
import docIcon from "../../assets/img/FileExplorerIcons/doc.png";
import jpgIcon from "../../assets/img/FileExplorerIcons/jpg.png";
import pdfIcon from "../../assets/img/FileExplorerIcons/pdf.png";
import pngIcon from "../../assets/img/FileExplorerIcons/png.png";
import textIcon from "../../assets/img/FileExplorerIcons/text.png";
import zip from "../../assets/img/FileExplorerIcons/zip.png";
import rar from "../../assets/img/FileExplorerIcons/rar.png";
import ViewFile from "../Files/ViewFile";
import AddForm from "./AddForm";
import ClearIcon from "@mui/icons-material/Clear";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Collapse from "@mui/material/Collapse";
import UploadImage from "../../assets/img/upload.png";

import { useSpring, animated } from "@react-spring/web";
import AddDroppedFile from "./components/AddDroppedFile";
import FolderAccessForm from "./components/FolderAccessForm";

const cookies = new Cookies();

const OptionMenu = ({
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
          {!rightClickedItem?.file_name &&
          JSON.parse(localStorage.getItem("roles")).includes(90) ? (
            <MenuItem
              onClick={() => {
                handleSpecifyfolderAccessForm();
                onClose();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                height: "30px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  marginLeft: "2px",
                }}
              >
                <FaFolder style={{ color: "#F8D775", fontSize: "20px" }} />
                <FaLock
                  style={{
                    color: "#fff",
                    position: "absolute",
                    bottom: "5px",
                    right: "3px",
                    fontSize: "8px",
                  }}
                />
              </Box>
              <Typography>Specify who can access this folder</Typography>
            </MenuItem>
          ) : null}
        </>
      ) : null}
      {rightClickedItem?.file_name &&
      JSON.parse(localStorage.getItem("roles")).includes(66) ? (
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
              {JSON.parse(localStorage.getItem("roles")).includes(65) ? (
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
              ) : null}
              {rightClickedItem?.level !== 4 &&
              JSON.parse(localStorage.getItem("roles")).includes(68) ? (
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
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
      {!rightClickedItem?.parentFolder &&
      (rightClickedItem?.file_name
        ? JSON.parse(localStorage.getItem("roles")).includes(67)
        : JSON.parse(localStorage.getItem("roles")).includes(68)) ? (
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

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const FileManager = () => {
  const dispatch = useDispatch();
  const [arrowClicked, setArrowClicked] = useState(false);
  const [arrowClickedCount, setArrowClickedCount] = useState(2);
  const [navigationArr, setNavigationArr] = useState([]);
  const [folderPath, setFolderPath] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState({});
  const [rightClickedItem, setRightClickedItem] = useState({});
  const [showFile, setShowFile] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [doubleClickedItem, setDoubleClickedItem] = useState(false);
  const [treeView, setTreeView] = useState([]);
  const [lastFolder, setLastFolder] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlighted, setHighlighted] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
    from_side_menu: false,
  });
  const [folderName, setFolderName] = useState("");
  const [createNewFolder, setCreateNewFolder] = useState(false);
  const [droppedFile, setDroppedFile] = useState(null);
  const [createNewTreeFolder, setCreateNewTreeFolder] = useState(false);
  const [createNewFile, setCreateNewFile] = useState(false);
  const [showAddDroppedFile, setShowAddDroppedFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchBoxOptions, setSearchBoxOptions] = useState([]);
  const [specifyfolderAccessForm, setSpecifyfolderAccessForm] = useState(false);

  const handleChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleContextMenu = (event, from_side_menu) => {
    event.preventDefault();
    setMenuOpen(true);
    setMenuPosition({
      x: event.clientX,
      y: event.clientY,
      from_side_menu: from_side_menu ? from_side_menu : false,
    });
  };

  const addFile = async () => {
    setAddForm(true);
    setCreateNewFile(true);
  };

  const handleCreateNewFolderByContextMenuOption = async () => {
    let data = null;
    var headers = {
      jwt: cookies.get("token"),
    };
    dispatch(setGlobalLoading(true));
    data = await axios({
      url:
        Host +
        "file/" +
        (!rightClickedItem?.level && rightClickedItem?.sub_classifications
          ? "sub_classification1"
          : rightClickedItem?.level === 1
          ? "sub_classification2"
          : rightClickedItem?.level === 2
          ? "sub_classification3"
          : "sub_classification4") +
        "/add",
      method: "POST",
      headers: headers,
      data: {
        name: folderName ? folderName?.replace(/'/g, "") : "",
        parent_id: rightClickedItem?.id,
      },
    });
    if (data.data.status === false) {
      toast.error(data.data.data.text);
      dispatch(setGlobalLoading(false));
    } else if (data.data.status === true) {
      toast.success("Folder created!");
      dispatch(setGlobalLoading(false));
      setFolderName("");
      setCreateNewFolder(false);
      getData();
    }
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

  const UpdateFunction = (row) => {
    setAddForm(true);
  };

  const fileIconsMap = [
    {
      name: "file",
      img: fileIcon,
    },
    {
      name: "csv",
      img: csvIcon,
    },
    {
      name: "doc",
      img: docIcon,
    },
    {
      name: "docx",
      img: docIcon,
    },
    {
      name: "jpg",
      img: jpgIcon,
    },
    {
      name: "pdf",
      img: pdfIcon,
    },
    {
      name: "png",
      img: pngIcon,
    },
    {
      name: "text",
      img: textIcon,
    },
    {
      name: "zip",
      img: zip,
    },
    {
      name: "rar",
      img: rar,
    },
  ];
  const CustomContent = forwardRef(function CustomContent(props, ref) {
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

    const handleMouseDown = (event) => {
      preventSelection(event);
    };

    const handleExpansionClick = (event) => {
      handleExpansion(event);
    };

    const handleSelectionClick = () => {
      onSelect({ nodeId, label });
    };

    return (
      <div
        className={clsx(className, classes.root, {
          [classes?.expanded]: expanded,
          [classes?.selected]: selected,
          [classes?.focused]: focused,
          [classes?.disabled]: disabled,
        })}
        onMouseDown={handleMouseDown}
        ref={ref}
        style={{
          marginBottom: JSON.parse(nodeId) === lastFolder?.id ? "100px" : 0,
        }}
      >
        <div onClick={handleExpansionClick} className={classes.iconContainer}>
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
          className={classes.label}
          marginLeft={1}
        >
          {label}
        </Typography>
      </div>
    );
  });

  const CustomTreeItem = forwardRef(function CustomTreeItem(props, ref) {
    const { onSelect, ...otherProps } = props;
    return (
      <TreeItem
        slot={{ groupTransition: TransitionComponent, ...props.slot }}
        ContentComponent={(props) => (
          <CustomContent {...props} onSelect={onSelect} />
        )}
        {...props}
        ref={ref}
      />
    );
  });

  function filterFoldersWithAccess(folders, accessList) {
    const allowedClassificationIDs = new Set(
      accessList.map((access) => access.classification_id)
    );
    const allowedSubClassificationIDs = accessList.reduce((acc, access) => {
      for (let i = 1; i <= 4; i++) {
        const subClassID = access[`sub_classification${i}_id`];
        if (subClassID) {
          acc[i] = acc[i] || new Set();
          acc[i].add(subClassID);
        }
      }
      return acc;
    }, {});

    const filterFolder = (folder) => {
      if (allowedClassificationIDs.has(folder.id)) {
        // Check if it's a leaf node (file) or has sub-classifications
        if (
          folder.sub_classifications &&
          folder.sub_classifications.length > 0
        ) {
          folder.sub_classifications = folder.sub_classifications.filter(
            (sub) => {
              // Check if the user has access to the sub-classification directly
              const directAccess = allowedSubClassificationIDs[sub.level]?.has(
                sub.id
              );
              // Check if the user has access to the parent classification
              const parentAccess = allowedClassificationIDs.has(sub.parent_id);

              return directAccess || parentAccess;
            }
          );
        }
        return true;
      }
      return false;
    };

    const filteredFolders = folders.filter(filterFolder);

    return filteredFolders.length > 0 ? filteredFolders : null;
  }

  function addNodeId(data, prefix = "") {
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
    dispatch(setGlobalLoading(true));
    const user_id = cookies.get("user_id");

    // const accessResult = await axios({
    //   url: Host + `file/get_read_access_permission`,
    //   method: "GET",
    //   headers: {
    //     jwt: cookies.get("token"),
    //   },
    //   params: {
    //     user_id: user_id,
    //   },
    // });

    // const accessList = accessResult?.data?.data;

    axios({
      url: Host + "file/folder_tree",
      method: "get",
      headers: {
        jwt: cookies.get("token"),
      },
    })
      .then((res) => {
        dispatch(setGlobalLoading(false));
        if (res?.data?.status) {
          try {
            const updatedData = addNodeId(res?.data?.data);
            setTreeView([]);
            setTreeView(updatedData);
          } catch (error) {
            console.log("Error: ", error);
          }
        } else {
          toast.warn("Unknown Error");
        }
      })
      .catch((error) => {
        dispatch(setGlobalLoading(false));
        toast.error("Network Error!");
      });
    setCreateNewFile(false);
    setCreateNewFolder(false);
    setFolderName("");
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (treeView?.length > 0) {
      setSelectedFolder(treeView[0]);
    }
  }, [treeView?.length]);

  useEffect(() => {
    if (selectedFolder?.id && !arrowClicked) {
      setNavigationArr([...navigationArr, selectedFolder]);
    }
  }, [selectedFolder]);

  const handleDeleteLast = () => {
    const newArray = [...navigationArr];
    newArray.pop();
    setNavigationArr(newArray);
  };

  const updateTreeView = (folders, parentId, newFolder) => {
    return folders.map((folder) => {
      if (folder.id === parentId) {
        return {
          ...folder,
          sub_classifications: [...folder.sub_classifications, newFolder],
        };
      } else if (folder.sub_classifications.length > 0) {
        return {
          ...folder,
          sub_classifications: updateTreeView(
            folder.sub_classifications,
            parentId,
            newFolder
          ),
        };
      }
      return folder;
    });
  };

  const handleDeleteFileOrFolder = (item) => {
    swal({
      title:
        "Are you sure you want to delete this " +
        (rightClickedItem?.file_name ? "file?" : "folder?"),
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await axios({
          url: Host + "file/class/delete",
          method: "DELETE",
          headers: {
            jwt: cookies.get("token"),
          },
          data: {
            id: item?.id,
            level: item?.level,
          },
        });
        if (result?.data?.status) {
          getData();
          if (!item.file_name) {
            setSelectedFolder((prevState) => ({
              ...prevState,
              sub_classifications: prevState?.sub_classifications?.filter(
                (item) => item.id !== item?.id
              ),
            }));
          }
          toast.success("Deleted");
        } else {
          toast.warn("Something went wrong!");
        }
      } else {
        return;
      }
    });
  };

  function downloadFileFromUrl(url, filename) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = filename || "downloaded_file";

        downloadLink.click();

        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const downloadFile = async () => {
    if (!rightClickedItem?.id) {
      toast.warn("file ID not found!");
      return;
    }
    var headers = {
      jwt: cookies.get("token"),
    };
    dispatch(setGlobalLoading(true));
    let result = null;
    try {
      result = await axios({
        url: Host + `file/download/` + rightClickedItem?.id,
        method: "get",
        headers: headers,
      });
      dispatch(setGlobalLoading(false));
      if (result?.status) {
        toast.success("Info downloaded successfully");
        downloadFileFromUrl(
          Host + rightClickedItem?.path,
          rightClickedItem?.file_name
        );
      } else {
        toast.success("Unkhown error!");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      toast.error("Network Error");
    }
  };

  const findFolderByName = (folders, folderName, parentFolder = null) => {
    for (const folder of folders) {
      if (folder.name === folderName) {
        return { folder, parentFolder };
      }
      if (folder.sub_classifications && folder.sub_classifications.length > 0) {
        const result = findFolderByName(
          folder.sub_classifications,
          folderName,
          folder
        );
        if (result) return result;
      }
    }
    return null;
  };

  const findFoldersByPartialName = (folders, partialName) => {
    const folderSuggestions = [];
    const fileSuggestions = [];

    for (const folder of folders) {
      if (
        folder.file_name &&
        folder.name.toLowerCase().includes(partialName.toLowerCase())
      ) {
        fileSuggestions.push({
          id: folder.id,
          name: folder.name,
          type: "file",
          file_name: folder.file_name,
        });
      } else if (
        folder.name.toLowerCase().includes(partialName.toLowerCase())
      ) {
        folderSuggestions.push({
          id: folder.id,
          name: folder.name,
          type: "folder",
        });
      }
      if (folder.sub_classifications && folder.sub_classifications.length > 0) {
        const foundSuggestions = findFoldersByPartialName(
          folder.sub_classifications,
          partialName
        );
        if (foundSuggestions.length > 0) {
          foundSuggestions.forEach((suggestion) => {
            if (suggestion.type === "folder") {
              folderSuggestions.push(suggestion);
            } else {
              fileSuggestions.push(suggestion);
            }
          });
        }
      }
    }

    // Concatenate folder and file suggestions
    return folderSuggestions.concat(fileSuggestions);
  };

  useEffect(() => {
    if (selectedName?.length) {
      const { folder, parentFolder } = findFolderByName(treeView, selectedName);
      if (folder && !folder?.file_name) {
        setSelectedFolder(folder);
      } else if (parentFolder) {
        setSelectedFolder(parentFolder);
      }
    }
  }, [selectedName]);

  const findFolderById = (folders, targetId, targetLevel, path = []) => {
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
    const folderPathArray = findFolderById(
      treeView,
      selectedFolder.id,
      selectedFolder.level
    );
    if (folderPathArray) {
      setFolderPath(folderPathArray);
      setSelectedFolder(folderPathArray[folderPathArray?.length - 1]);
      console.log("Folder path:", folderPathArray);
    } else {
      console.log("Folder not found");
    }
  }, [treeView, selectedFolder]);

  const folderRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (folderRef.current && !folderRef.current.contains(event.target)) {
        setHighlighted(null);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const debouncedSetIsDragging = debounce(setIsDragging, 50);

  const handleDragOver = (e) => {
    e.preventDefault();
    debouncedSetIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    debouncedSetIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDroppedFile(e?.dataTransfer?.files[0]);
    setShowAddDroppedFile(true);
  };

  function getLastFolderFromObjects(objects) {
    let lastFolder = null;

    // Iterate over each object in the array
    objects.forEach((obj) => {
      const folder = getLastFolder(obj);
      if (
        folder &&
        (!lastFolder ||
          folder.sub_classifications.length >
            lastFolder.sub_classifications.length)
      ) {
        lastFolder = folder;
      }
    });

    return lastFolder;
  }

  function getLastFolder(obj) {
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

  const getFiles = async (text) => {
    const jwt = cookies.get("token");
    var headers = {
      jwt: jwt,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    try {
      const response = await axios({
        url: Host + `file`,
        method: "GET",
        headers: headers,
        params: {
          searchText: text,
        },
      });
      let result = response?.data?.data?.data?.data;
      if (result?.length) {
        return result;
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Network Error!");
    }
  };

  useEffect(() => {
    const lastFolder = getLastFolderFromObjects(treeView);
    handleFilesSearch("");
    setLastFolder(lastFolder);
  }, [treeView]);

  useEffect(() => {
    if (showAddDroppedFile) {
      setIsDragging(false);
    }
  }, [showAddDroppedFile, isDragging]);

  const handleFilesSearch = debounce(async (value) => {
    const filesResult = await getFiles(value);
    let filterOptions = findFoldersByPartialName(treeView, value);
    const filterOptionsIDs = filterOptions?.map((file) => file?.id);
    filesResult?.map((file) => {
      if (!filterOptionsIDs?.some((id) => id === file.id)) {
        filterOptions?.push({
          id: file.id,
          name: file.name,
          type: "file",
          file_name: file.file_name,
        });
      }
    });
    setSearchBoxOptions(filterOptions);
  }, 500);

  return (
    <Box
      sx={{
        height: "97.3vh",
        paddingTop: 7,
        userSelect: "none",
      }}
      ref={folderRef}
    >
      <Box
        ref={folderRef}
        sx={{
          height: "100%",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: 3,
            paddingY: 2,
            gap: 3,
            mb: 1,
            borderBottom: "1px solid #b3b3b3",
          }}
          ref={folderRef}
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
                bgcolor: "#000",
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
                  color: "#fff",
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
                getOptionLabel={(option) => option?.name || ""}
                filterOptions={(options, state) => options}
                onChange={(e, newVal) => {
                  setSelectedName(newVal?.name);
                }}
                onInputChange={(e, newInputValue) => {
                  setSearchValue(newInputValue);
                  handleFilesSearch(newInputValue);
                }}
                limitTags={1}
                freeSolo
                clearIcon={() => <ClearIcon sx={{ marginRight: "10px" }} />}
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
                        <img
                          src={
                            (
                              fileIconsMap.find(
                                (i) =>
                                  i?.name === option?.file_name.split(".")[1]
                              ) || fileIconsMap[0]
                            ).img
                          }
                          alt="#"
                          width={"25px"}
                          style={{
                            marginRight: "15px",
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
                    sx={{ fontFamily: "Cairo-Medium" }}
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        height: "35px",
                      },
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      sx: {
                        "&.Mui-focused": {
                          color: "blue",
                        },
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

        <Box ref={folderRef} sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              width: "20%",
              height: "100%",
              padding: 3,
              paddingY: 1,
              display: "flex",
              justifyContent: "center",
              borderRight: "1px solid #b3b3b3",
              overflow: "auto",
            }}
            ref={folderRef}
          >
            <TreeView
              multiSelect={true}
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
              {treeView.map((folder) => {
                return (
                  <CustomTreeItem
                    nodeId={JSON.stringify(folder?.nodeId)}
                    label={folder.name}
                    onSelect={(item) => {
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
                    {folder?.sub_classifications?.length &&
                    folder?.sub_classifications?.some(
                      (sc) => typeof sc?.level === "number"
                    )
                      ? folder?.sub_classifications?.map((folder_lvl_1) =>
                          !folder_lvl_1?.file_name ? (
                            <CustomTreeItem
                              nodeId={JSON.stringify(folder_lvl_1?.nodeId)}
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
                              {folder_lvl_1?.sub_classifications?.length &&
                              folder_lvl_1?.sub_classifications?.some(
                                (sc) => typeof sc?.level === "number"
                              )
                                ? folder_lvl_1?.sub_classifications?.map(
                                    (folder_lvl_2) =>
                                      !folder_lvl_2?.file_name ? (
                                        <CustomTreeItem
                                          nodeId={JSON.stringify(
                                            folder_lvl_2?.nodeId
                                          )}
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
                                        >
                                          {folder_lvl_2?.sub_classifications
                                            ?.length &&
                                          folder_lvl_2?.sub_classifications?.some(
                                            (sc) =>
                                              typeof sc?.level === "number"
                                          )
                                            ? folder_lvl_2?.sub_classifications?.map(
                                                (folder_lvl_3) =>
                                                  !folder_lvl_3?.file_name ? (
                                                    <CustomTreeItem
                                                      nodeId={JSON.stringify(
                                                        folder_lvl_3?.nodeId
                                                      )}
                                                      label={folder_lvl_3.name}
                                                      onSelect={() => {
                                                        setSelectedFolder(
                                                          folder_lvl_3
                                                        );
                                                        setArrowClickedCount(2);
                                                        setArrowClicked(false);
                                                      }}
                                                      onContextMenu={(e) => {
                                                        e.stopPropagation();
                                                        handleContextMenu(
                                                          e,
                                                          true
                                                        );
                                                        setRightClickedItem({
                                                          ...folder_lvl_3,
                                                          treeFolder: true,
                                                        });
                                                      }}
                                                    >
                                                      {folder_lvl_3
                                                        ?.sub_classifications
                                                        ?.length &&
                                                      folder_lvl_3?.sub_classifications?.some(
                                                        (sc) =>
                                                          typeof sc?.level ===
                                                          "number"
                                                      )
                                                        ? folder_lvl_3?.sub_classifications?.map(
                                                            (folder_lvl_4) =>
                                                              !folder_lvl_4?.file_name ? (
                                                                <CustomTreeItem
                                                                  nodeId={JSON.stringify(
                                                                    folder_lvl_4?.nodeId
                                                                  )}
                                                                  label={
                                                                    folder_lvl_4.name
                                                                  }
                                                                  onSelect={() => {
                                                                    setSelectedFolder(
                                                                      folder_lvl_4
                                                                    );
                                                                    setArrowClickedCount(
                                                                      2
                                                                    );
                                                                    setArrowClicked(
                                                                      false
                                                                    );
                                                                  }}
                                                                  onContextMenu={(
                                                                    e
                                                                  ) => {
                                                                    e.stopPropagation();
                                                                    handleContextMenu(
                                                                      e,
                                                                      true
                                                                    );
                                                                    setRightClickedItem(
                                                                      {
                                                                        ...folder_lvl_4,
                                                                        treeFolder: true,
                                                                      }
                                                                    );
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
                                      ) : null
                                  )
                                : null}
                            </CustomTreeItem>
                          ) : null
                        )
                      : null}
                  </CustomTreeItem>
                );
              })}
            </TreeView>
          </Box>

          <Box
            ref={folderRef}
            onDragOver={handleDragOver}
            sx={{
              backgroundColor: "#fff",
              width: "80%",
              height: "100%",
              overflow: "auto",
            }}
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
              ref={folderRef}
              sx={{
                backgroundColor: "#fff",
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
                    flexWrap: "wrap", // Allow flex items to wrap to the next line if necessary
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
                            width: "calc(10% + 2rem)", // Adjust width as per your requirement
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
                          <img
                            src={
                              (
                                fileIconsMap.find(
                                  (i) =>
                                    i.name === element?.file_name.split(".")[1]
                                ) || fileIconsMap[0]
                              ).img
                            }
                            alt="#"
                            width={"45px"}
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
                            width: "calc(10% + 2rem)", // Adjust width as per your requirement
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
                            <img
                              src={folder_filesIcon}
                              alt="#"
                              width={"45px"}
                            />
                          ) : (
                            <img src={folderIcon} alt="#" width={"45px"} />
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
                        display: "felx",
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
                        // backgroundColor:
                        //   highlighted?.id === element?.id &&
                        //   highlighted?.name
                        //     .toLowerCase()
                        //     .includes(element.name.toLowerCase())
                        //     ? "#b4cffa"
                        //     : "unset",
                        "&:hover": {
                          backgroundColor: "#e3e3e3",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <img src={folderIcon} alt="#" width={"45px"} />
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
                    display: "felx",
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
      {showAddDroppedFile ? (
        <AddDroppedFile
          addForm={showAddDroppedFile}
          setAddForm={setShowAddDroppedFile}
          file={droppedFile}
          setFile={setDroppedFile}
          branch={folderPath}
          createMode={true}
          getData={getData}
        />
      ) : null}
      {showFile ? (
        <ViewFile
          addForm={showFile}
          setAddForm={setShowFile}
          object={doubleClickedItem || rightClickedItem}
          createMode={rightClickedItem ? false : true}
          getData={getData}
        />
      ) : null}
      {addForm ? (
        <AddForm
          addForm={addForm}
          setAddForm={setAddForm}
          object={!createNewFile ? rightClickedItem : null}
          createMode={rightClickedItem && !createNewFile ? false : true}
          getData={getData}
          branch={folderPath}
        />
      ) : null}
      {specifyfolderAccessForm ? (
        <FolderAccessForm
          addForm={specifyfolderAccessForm}
          setAddForm={setSpecifyfolderAccessForm}
          object={rightClickedItem}
          createMode={true}
          getData={getData}
          folder={rightClickedItem}
          branch={folderPath}
        />
      ) : null}
      {isDragging && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              gap: 2,
            }}
          >
            <CancelIcon
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setIsDragging(false)}
            />
            <img
              src={UploadImage}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                backgroundPosition: "center center",
                marginLeft: 4,
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                fontFamily: "Cairo-Medium",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              Drop your file here
            </Typography>
          </div>
        </div>
      )}
    </Box>
  );
};

export default FileManager;
