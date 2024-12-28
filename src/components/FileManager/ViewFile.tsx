import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Host from "../../assets/js/Host";
import { toast } from "react-toastify";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CustomeSelectField from "../../Components/CustomeSelectField";
import PopupForm from "../../Components/PopupForm";
import CustomTextField from "../../Components/CustomTextField";
import UploadImage from "../../assets/img/upload.png";
import { setGlobalLoading } from "../../reduxStore/SettingsReducer";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import axios from "../../assets/js/AxiosInterceptors";

const cookies = new Cookies();
const RenderContent = (props) => {
  const [t] = useTranslation("common");
  const maintheme = useSelector((state) => state.themeData.maintheme);
  const handlFileChaged = (e) => {
    if (e.target?.files && e.target.files?.length) {
      props?.setData({
        ...props?.data,
        file: e.target.files[0],
      });
    }
  };
  useEffect(() => {
    console.log("FILEUPLOAD===>", props?.data);
  }, [props?.data]);
  const getImageUrl = (file) => {
    const url = URL.createObjectURL(file);
    return url;
  };
  function isImageFileByExtension(filePath) {
    if (filePath) {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
      const extension = filePath
        .split(".")
        .pop()
        .toLowerCase();
      return imageExtensions.includes(extension);
    } else {
      return;
    }
  }
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginTop: "10px",
        }}
      >
        {props?.data?.path ? (
          <Box
            sx={{
              width: "300px",
              backgroundColor: "#f3f3f3",
              boxShadow: "0 0 7px -2px #000",
              minHeight: "250px",
              maxHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              borderRadius: "5px",
            }}
          >
            {isImageFileByExtension(props?.data?.path) ? (
              <img
                src={Host + props?.data?.path}
                style={{
                  width: "200px",
                  height: "100px",
                  objectFit: "scale-down",
                  backgroundPosition: "center center",
                }}
              />
            ) : (
              <InsertDriveFileIcon
                style={{ fontSize: "100px", color: "#1e6a99" }}
              />
            )}
            <span
              style={{
                wordBreak: "break-all",
              }}
            >
              {props?.data?.file_name}
            </span>
            <Box
              sx={{
                marginTop: "10px",
                width: "140px",
                height: "43px",
                borderRadius: "20px",
                backgroundColor: "#1e6a99",
                boxShadow: "0 0 7px -2px #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={props?.downloadFile}
            >
              <CloudDownloadIcon sx={{ color: "#fff" }} />
              <span style={{ color: "#fff" }}>Download</span>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "300px",
              backgroundColor: "#f3f3f3",
              boxShadow: "0 0 7px -2px #000",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              borderRadius: "5px",
            }}
          >
            {props?.data?.file?.type?.includes("image/") ? (
              <img
                src={getImageUrl(props?.data?.file)}
                style={{
                  width: "200px",
                  height: "100px",
                  objectFit: "scale-down",
                  backgroundPosition: "center center",
                }}
              />
            ) : (
              <InsertDriveFileIcon
                style={{ fontSize: "100px", color: "#1e6a99" }}
              />
            )}
            <span
              style={{
                wordBreak: "break-all",
              }}
            >
              {props?.data?.file?.name}
            </span>
          </Box>
        )}
      </Box>
      <CustomTextField
        label={"Name"}
        haswidth={true}
        value={props?.data?.name}
        error={props?.messageError?.err_name_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_name]}
        readOnly={true}
      />
      <CustomTextField
        label={"Description"}
        haswidth={true}
        value={props?.data?.description}
        error={props?.messageError?.err_description_status}
        customWidth="485px"
        hasMultipleLine={true}
        message={[props?.messageError?.err_description]}
        readOnly={true}
      />
      <CustomTextField
        label={"Version"}
        haswidth={true}
        value={props?.data?.version}
        error={props?.messageError?.err_version_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_version]}
        readOnly={true}
      />
      <CustomTextField
        label={"Size"}
        haswidth={true}
        value={props?.data?.size}
        error={props?.messageError?.err_size_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_size]}
        readOnly={true}
      />
      <Box
        style={{
          width: "465px",
          backgroundColor: "#fff",
          boxShadow: "0 0 7px -2px #000",
          height: "55px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          marginLeft: "10px",
          marginRight: "10px",
          borderLeft: "5px solid #1e6a99",
        }}
      >
        <FormControlLabel
          sx={{ width: "100%" }}
          control={
            <Checkbox
              checked={props?.data?.active_status ? true : false}
              readOnly
            />
          }
          label="Active Status"
        />
      </Box>
      {!props?.createMode ? (
        <CustomTextField
          label={"File Name"}
          haswidth={true}
          value={props?.data?.file_name}
          error={false}
          customWidth="485px"
          hasMultipleLine={false}
          message={""}
          readOnly={true}
        />
      ) : null}
      <CustomeSelectField
        label={"Classification"}
        haswidth={true}
        customWidth="485px !important"
        value={props?.selectedParentId ? props?.selectedParentId : null}
        list={props?.classifications ? props?.classifications : []}
        customGetOptionLabel={(option) => option?.name}
        error={props?.messageError?.err_classification_status}
        message={[props?.messageError?.err_description]}
        multiple={false}
        readOnly={true}
        focused={true}
      />
      <CustomeSelectField
        label={"Classification Level 1"}
        haswidth={true}
        customWidth="485px !important"
        value={props?.selectedParentId1 ? props?.selectedParentId1 : null}
        list={props?.classificationsLevel1 ? props?.classificationsLevel1 : []}
        customGetOptionLabel={(option) => option?.name}
        error={false}
        message={[]}
        multiple={false}
        readOnly={true}
        focused={true}
      />
      <CustomeSelectField
        label={"Classification Level 2"}
        haswidth={true}
        customWidth="485px !important"
        value={props?.selectedParentId2 ? props?.selectedParentId2 : null}
        list={props?.classificationsLevel2 ? props?.classificationsLevel2 : []}
        customGetOptionLabel={(option) => option?.name}
        error={false}
        message={[]}
        multiple={false}
        readOnly={true}
        focused={true}
      />
      <CustomeSelectField
        label={"Classification Level 3"}
        haswidth={true}
        customWidth="485px !important"
        value={props?.selectedParentId3 ? props?.selectedParentId3 : null}
        list={props?.classificationsLevel3 ? props?.classificationsLevel3 : []}
        customGetOptionLabel={(option) => option?.name}
        error={false}
        message={[]}
        multiple={false}
        readOnly={true}
        focused={true}
      />
      <CustomeSelectField
        label={"Classification Level 4"}
        haswidth={true}
        customWidth="485px !important"
        value={props?.selectedParentId4 ? props?.selectedParentId4 : null}
        list={props?.classificationsLevel4 ? props?.classificationsLevel4 : []}
        customGetOptionLabel={(option) => option?.name}
        error={false}
        message={[]}
        multiple={false}
        readOnly={true}
        focused={true}
      />
    </Box>
  );
};

const RenderFooter = (props) => {
  const gridtheme = useSelector((state) => state.themeData.gridtheme);
  const [t] = useTranslation("common");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box display="flex">
          <Button
            variant="outlined"
            // spacing={2}
            sx={{
              width: "50% !important",
              // flexGrow: 1,
              minWidth: "80px !important",
              maxWidth: "80px !important",
              margin: 1,
              backgroundColor: "#f7f7f7",
              borderColor: gridtheme?.colorWhite,
              color: gridtheme?.colorblack,
              boxShadow: "0 0 7px -2px white",
              //   color:SearchButtonTheme?.clear_button_text_color,
              "&:hover": {
                backgroundColor: "#f7f7f7",
                borderColor: gridtheme?.colorWhite,
                color: gridtheme?.colorblack,
                boxShadow: "0 0 7px 1px white",
                boxShadow: "0",
              },
              height: "35px",
              fontFamily: "Cairo-Bold",
            }}
            className="iconeFilterClear"
            color="secondary"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            {"Close"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
const ViewFile = (props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    file: null,
    path: "",
    file_name: "",
    name: "",
    description: "",
    version: "",
    size: "",
    active_status: "",
  });
  const dispatch = useDispatch();
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentId1, setSelectedParentId1] = useState(null);
  const [selectedParentId2, setSelectedParentId2] = useState(null);
  const [selectedParentId3, setSelectedParentId3] = useState(null);
  const [selectedParentId4, setSelectedParentId4] = useState(null);

  useEffect(() => {
    if (props?.object) {
      setData({
        ...data,
        path: props?.object?.path,
        name: props?.object?.name,
        description: props?.object?.description,
        file_name: props?.object?.file_name,
        version: props?.object?.version,
        size: props?.object?.size,
        active_status: props?.object?.active_status == 1 ? true : false,
      });
      setSelectedParentId(
        props?.object?.classification_id
          ? {
              id: props?.object?.classification_id,
              name: props?.object?.classification_name,
            }
          : null
      );
      setSelectedParentId1(
        props?.object?.sub_classification1_id
          ? {
              id: props?.object?.sub_classification1_id,
              name: props?.object?.sub_classification1_name,
            }
          : null
      );
      setSelectedParentId2(
        props?.object?.sub_classification2_id
          ? {
              id: props?.object?.sub_classification2_id,
              name: props?.object?.sub_classification2_name,
            }
          : null
      );
      setSelectedParentId3(
        props?.object?.sub_classification3_id
          ? {
              id: props?.object?.sub_classification3_id,
              name: props?.object?.sub_classification3_name,
            }
          : null
      );
      setSelectedParentId4(
        props?.object?.sub_classification3_id
          ? {
              id: props?.object?.sub_classification4_id,
              name: props?.object?.sub_classification4_name,
            }
          : null
      );
    }
  }, [props?.object]);
  function downloadFileFromUrl(url, filename) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = filename || "downloaded_file";

        // Trigger the download
        downloadLink.click();

        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Example usage for various file types:
  const imageUrl = "https://example.com/path/to/your/image.jpg";
  const pdfUrl = "https://example.com/path/to/your/document.pdf";
  const otherFileUrl = "https://example.com/path/to/your/otherfile.xyz";

  downloadFileFromUrl(imageUrl, "image.jpg");
  downloadFileFromUrl(pdfUrl, "document.pdf");
  downloadFileFromUrl(otherFileUrl, "otherfile.xyz");

  const downloadFile = async () => {
    if (!props?.object?.id) {
      toast.warn("file ID not found!");
      return;
    }
    setLoading(true);
    var headers = {
      jwt: cookies.get("token"),
    };
    dispatch(setGlobalLoading(true));
    let result = null;
    try {
      result = await axios({
        url: Host + `file/download/` + props?.object?.id,
        method: "get",
        headers: headers,
      });
      dispatch(setGlobalLoading(false));
      if (result?.status) {
        toast.success("Info downloaded successfully");
        downloadFileFromUrl(Host + props?.object?.path, data?.file_name);
        // window.open(Host+props?.object?.path,'_blank')
        setLoading(false);
      } else {
        toast.success("Unkhown error!");
        setLoading(false);
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      toast.error("Network Error");
      setLoading(false);
    }
  };

  return (
    <PopupForm
      open={props.addForm}
      setOpen={props.setAddForm}
      title={"View File Information"}
      isFullScreen={true}
      width="100%"
      customeHeight={"100%"}
      customePadding="0 5px"
      content={
        <RenderContent
          data={data}
          setData={setData}
          createMode={props?.createMode}
          selectedParentId={selectedParentId}
          setSelectedParentId={setSelectedParentId}
          selectedParentId1={selectedParentId1}
          setSelectedParentId1={setSelectedParentId1}
          selectedParentId2={selectedParentId2}
          setSelectedParentId2={setSelectedParentId2}
          selectedParentId3={selectedParentId3}
          setSelectedParentId3={setSelectedParentId3}
          selectedParentId4={selectedParentId4}
          setSelectedParentId4={setSelectedParentId4}
          downloadFile={downloadFile}
        />
      }
      footer={<RenderFooter open={props.addForm} setOpen={props.setAddForm} />}
    />
  );
};
export default ViewFile;
