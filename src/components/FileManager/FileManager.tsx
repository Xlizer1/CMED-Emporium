"use client";

import {
  Autocomplete,
  Box,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { TreeItemProps } from "@mui/lab";
import { TreeItemContentProps, useTreeItem2 } from "@mui/x-tree-view";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem2 } from "@mui/x-tree-view/TreeItem2";
import React, { forwardRef, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";
import clsx from "clsx";

import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CachedIcon from "@mui/icons-material/Cached";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import { FaFolder, FaLock, FaFolderOpen } from "react-icons/fa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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

import { useSpring, animated } from "@react-spring/web";

interface FileSearchOption {
  id: number;
  name: string;
  type: string;
  file_name: string;
}

interface CustomTreeItemProps extends TreeItemProps {
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

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

function TransitionComponent(props: any) {
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

export function FileManager() {
  const folderRef = useRef(null);
  const mode = useSelector((state: RootState) => state.theme.mode);

  const [treeView, setTreeView] = useState([]);
  const [arrowClicked, setArrowClicked] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<boolean>(false);
  const [arrowClickedCount, setArrowClickedCount] = useState(2);
  const [navigationArr, setNavigationArr] = useState([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [lastFolder, setLastFolder] = useState<FileSearchOption | null>(null);
  const [searchBoxOptions, setSearchBoxOptions] = useState<FileSearchOption[]>(
    []
  );
  const CustomContent = forwardRef<HTMLLIElement, CustomTreeItemProps>(
    function CustomContent(props, ref) {
      const {
        classes,
        className,
        label,
        itemId,
        icon: iconProp,
        expansionIcon,
        displayIcon,
        onSelect,
        ...contentProps
      } = props;

      const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        preventSelection,
      } = useTreeItem2(itemId);

      const icon = iconProp || expansionIcon || displayIcon;

      const handleMouseDown = (event: React.MouseEvent<HTMLLIElement>) => {
        preventSelection(event);
      };

      const handleExpansionClick = (
        event: React.MouseEvent<HTMLDivElement>
      ) => {
        handleExpansion(event);
      };

      const handleSelectionClick = () => {
        onSelect({ itemId, label });
      };

      return (
        <li
          ref={ref} // Ref forwarded to HTMLLIElement
          className={clsx(className, classes.root, {
            [classes?.expanded]: expanded,
            [classes?.selected]: selected,
            [classes?.focused]: focused,
            [classes?.disabled]: disabled,
          })}
          onMouseDown={handleMouseDown}
          {...contentProps}
          style={{
            marginBottom: JSON.parse(itemId) === lastFolder?.id ? "100px" : 0,
          }}
        >
          <div onClick={handleExpansionClick} className={classes.iconContainer}>
            {icon ? (
              icon
            ) : (
              <FolderIcon
                style={{
                  marginLeft: "22px",
                  color: "#F8D775",
                  fontSize: "21px",
                }}
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
        </li>
      );
    }
  );

  const CustomTreeItem = forwardRef<HTMLLIElement, CustomTreeItemProps>(
    function CustomTreeItem(props, ref) {
      const { onSelect, ...otherProps } = props;

      return (
        <TreeItem2
          itemId={props?.itemId}
          ref={ref} // Ref forwarded here as HTMLLIElement
          {...otherProps} // Use otherProps instead of props to avoid spreading `onSelect`
          slots={{
            ...props.slots,
            content: (contentProps: TreeItemContentProps) => (
              <CustomContent {...contentProps} onSelect={onSelect} />
            ),
          }}
        />
      );
    }
  );

  const handleDeleteLast = () => {};
  const getData = () => {};

  return (
    <Box
      sx={{
        height: "100%",
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
            display: "flex",
            alignItems: "center",
            width: "100%",
            padding: 3,
            paddingY: 2,
            gap: 3,
            mb: 1,
          }}
          ref={folderRef}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: 1,
              marginTop: 1,
              gap: 1,
            }}
          >
            <ArrowCircleLeftIcon
              sx={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
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
                backgroundColor: mode === "dark" ? "#fff" : "#000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0.3,
              }}
            >
              <CachedIcon
                sx={{
                  cursor: "pointer",
                  color: mode === "dark" ? "#000" : "#fff",
                  fontSize: "18px",
                  height: "20px",
                  width: "20px",
                }}
                onClick={() => {
                  getData();
                }}
              />
            </Box>
          </Box>
          <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
            Files
          </Typography>
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
                getOptionLabel={(option) => option.name || ""}
                filterOptions={(options, state) => options}
                onChange={(e, newVal) => {
                  if (newVal) setSelectedName(newVal.name);
                }}
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
                        <Image
                          src={
                            (
                              fileIconsMap.find(
                                (i) =>
                                  i?.name === option?.file_name.split(".")[1]
                              ) || fileIconsMap[0]
                            ).img
                          }
                          alt="#"
                          style={{
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
        <Divider variant="middle" />
        <Box ref={folderRef} sx={{ display: "flex", height: "100%" }}>
          <Box
            sx={{
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
            <RichTreeView
              aria-label="file system navigator"
              items={[]}
              defaultExpandedItems={["grid"]}
              slots={{ item: CustomTreeItem }}
              checkboxSelection
              isItemEditable
              experimentalFeatures={{
                labelEditing: true,
              }}
            >
              <TreeItem2 itemId="1" label="Root Folder">
                <CustomTreeItem
                  onSelect={(event: React.MouseEvent<HTMLDivElement>) => {
                    // Handle selection with the event, itemId, and label
                    console.log(event.target);
                  }}
                />
              </TreeItem2>
            </RichTreeView>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
