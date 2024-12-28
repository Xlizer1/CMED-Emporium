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
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
    const extension = filePath
      .split(".")
      .pop()
      .toLowerCase();
    return imageExtensions.includes(extension);
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
        <Box
          sx={{
            width: "400px",
            height: "200px",
            border: "2px dashed #1e6a99",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f3f3f3",
            },
          }}
          onClick={(e) => {
            let fileUpload = document.getElementById("FILEUPLOAD");
            if (fileUpload) {
              fileUpload.click();
            }
          }}
        >
          <img
            src={UploadImage}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              backgroundPosition: "center center",
            }}
          />
          <input
            type="file"
            style={{ display: "none" }}
            id="FILEUPLOAD"
            onChange={handlFileChaged}
          />
        </Box>

        {props?.data?.path && !props?.data?.file ? (
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
          </Box>
        ) : props?.data?.file ? (
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
        ) : null}
      </Box>
      <CustomTextField
        label={"Name"}
        haswidth={true}
        value={props?.data?.name}
        error={props?.messageError?.err_name_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_name]}
        readOnly={false}
        onChange={(e) => {
          props?.setData({
            ...props?.data,
            name: e?.target?.value,
          });
          props?.setMessageErrors({
            ...props?.messageError,
            err_name: "",
            err_name_status: false,
          });
        }}
        onClearClick={() => {
          props?.setData({
            ...props?.data,
            name: "",
          });
        }}
      />
      <CustomTextField
        label={"Description"}
        haswidth={true}
        value={props?.data?.description}
        error={props?.messageError?.err_description_status}
        customWidth="485px"
        hasMultipleLine={true}
        message={[props?.messageError?.err_description]}
        readOnly={false}
        onChange={(e) => {
          props?.setData({
            ...props?.data,
            description: e?.target?.value,
          });
          props?.setMessageErrors({
            ...props?.messageError,
            err_description: "",
            err_description_status: false,
          });
        }}
        onClearClick={() => {
          props?.setData({
            ...props?.data,
            description: "",
          });
        }}
      />
      <CustomTextField
        label={"Version"}
        haswidth={true}
        value={props?.data?.version}
        error={props?.messageError?.err_version_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_version]}
        readOnly={false}
        onChange={(e) => {
          props?.setData({
            ...props?.data,
            version: e?.target?.value,
          });
          props?.setMessageErrors({
            ...props?.messageError,
            err_version: "",
            err_version_status: false,
          });
        }}
        onClearClick={() => {
          props?.setData({
            ...props?.data,
            version: "",
          });
        }}
      />
      <CustomTextField
        label={"Size"}
        haswidth={true}
        value={props?.data?.size}
        error={props?.messageError?.err_size_status}
        customWidth="485px"
        hasMultipleLine={false}
        message={[props?.messageError?.err_size]}
        readOnly={false}
        onChange={(e) => {
          if (!isNaN(e.target?.value)) {
            props?.setData({
              ...props?.data,
              size: e?.target?.value,
            });
            props?.setMessageErrors({
              ...props?.messageError,
              err_size: "",
              err_size_status: false,
            });
          }
        }}
        onClearClick={() => {
          props?.setData({
            ...props?.data,
            size: "",
          });
        }}
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
              onChange={(e) => {
                props?.setData({
                  ...props?.data,
                  active_status: e?.target?.checked,
                });
              }}
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
          readOnly={false}
          onChange={(e) => {
            props?.setData({
              ...props?.data,
              file_name: e?.target?.value,
            });
          }}
          onClearClick={() => {
            props?.setData({
              ...props?.data,
              file_name: "",
            });
          }}
        />
      ) : null}
      {!props?.branch?.length ? (
        <>
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
            readOnly={false}
            focused={true}
            onChange={(e, newValue) => {
              props?.setSelectedParentId(newValue);
              props?.setMessageErrors({
                ...props?.messageError,
                err_classification: "",
                err_classification_status: false,
              });
            }}
            onClearClick={() => {
              props?.setSelectedParentId(null);
              props?.setSelectedParentId1(null);
              props?.setSelectedParentId2(null);
              props?.setSelectedParentId3(null);
              props?.setSelectedParentId4(null);
            }}
          />
          <CustomeSelectField
            label={"Classification Level 1"}
            haswidth={true}
            customWidth="485px !important"
            value={props?.selectedParentId1 ? props?.selectedParentId1 : null}
            list={
              props?.classificationsLevel1 ? props?.classificationsLevel1 : []
            }
            customGetOptionLabel={(option) => option?.name}
            error={false}
            message={[]}
            multiple={false}
            readOnly={false}
            focused={true}
            onChange={(e, newValue) => {
              props?.setSelectedParentId1(newValue);
            }}
            onClearClick={() => {
              props?.setSelectedParentId1(null);
              props?.setSelectedParentId2(null);
              props?.setSelectedParentId3(null);
              props?.setSelectedParentId4(null);
            }}
          />
          <CustomeSelectField
            label={"Classification Level 2"}
            haswidth={true}
            customWidth="485px !important"
            value={props?.selectedParentId2 ? props?.selectedParentId2 : null}
            list={
              props?.classificationsLevel2 ? props?.classificationsLevel2 : []
            }
            customGetOptionLabel={(option) => option?.name}
            error={false}
            message={[]}
            multiple={false}
            readOnly={false}
            focused={true}
            onChange={(e, newValue) => {
              props?.setSelectedParentId2(newValue);
            }}
            onClearClick={() => {
              props?.setSelectedParentId2(null);
              props?.setSelectedParentId3(null);
              props?.setSelectedParentId4(null);
            }}
          />
          <CustomeSelectField
            label={"Classification Level 3"}
            haswidth={true}
            customWidth="485px !important"
            value={props?.selectedParentId3 ? props?.selectedParentId3 : null}
            list={
              props?.classificationsLevel3 ? props?.classificationsLevel3 : []
            }
            customGetOptionLabel={(option) => option?.name}
            error={false}
            message={[]}
            multiple={false}
            readOnly={false}
            focused={true}
            onChange={(e, newValue) => {
              props?.setSelectedParentId3(newValue);
            }}
            onClearClick={() => {
              props?.setSelectedParentId3(null);
              props?.setSelectedParentId4(null);
            }}
          />
          <CustomeSelectField
            label={"Classification Level 4"}
            haswidth={true}
            customWidth="485px !important"
            value={props?.selectedParentId4 ? props?.selectedParentId4 : null}
            list={
              props?.classificationsLevel4 ? props?.classificationsLevel4 : []
            }
            customGetOptionLabel={(option) => option?.name}
            error={false}
            message={[]}
            multiple={false}
            readOnly={false}
            focused={true}
            onChange={(e, newValue) => {
              props?.setSelectedParentId4(newValue);
            }}
            onClearClick={() => {
              props?.setSelectedParentId4(null);
            }}
          />
        </>
      ) : null}
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
          <Button
            variant="contained"
            // spacing={2}
            sx={{
              // flexGrow: 1,
              margin: 1,
              width: "80px !important",
              minWidth: "80px !important",
              maxWidth: "80px !important",
              "&:hover": {
                //   backgroundColor:SearchButtonTheme?.search_button_color+'88',
              },
              height: "35px",
              fontFamily: "Cairo-Bold",
            }}
            className="iconeFilterSearch"
            onClick={() => {
              props.submit();
            }}
          >
            {"Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const AddForm = (props) => {
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
  const [classifications, setClassifications] = useState([]);
  const [classificationsLevel1, setClassificationsLevel1] = useState([]);
  const [classificationsLevel2, setClassificationsLevel2] = useState([]);
  const [classificationsLevel3, setClassificationsLevel3] = useState([]);
  const [classificationsLevel4, setClassificationsLevel4] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedParentId1, setSelectedParentId1] = useState(null);
  const [selectedParentId2, setSelectedParentId2] = useState(null);
  const [selectedParentId3, setSelectedParentId3] = useState(null);
  const [selectedParentId4, setSelectedParentId4] = useState(null);
  let [messageError, setMessageErrors] = useState({
    err_name: "",
    err_name_status: false,
    err_description: "",
    err_description_status: false,
    err_version: "",
    err_version_status: false,
    err_size: "",
    err_size_status: false,
    err_classification: "",
    err_classification_status: false,
  });

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

  const submit = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };
    let objectError = messageError;
    let countError = 0;
    let formData = new FormData();
    if (data?.file) {
      formData.append("file", data?.file);
    } else if (props?.createMode) {
      toast.warn("You must Select the file");
      countError++;
      return;
    }
    if (data?.name) {
      formData.append("name", data?.name);
    } else {
      objectError = {
        ...objectError,
        err_name: "name field is required!",
        err_name_status: true,
      };
      countError++;
    }
    if (data?.description) {
      formData.append("description", data?.description);
    } else {
      objectError = {
        ...objectError,
        err_description: "description field is required!",
        err_description_status: true,
      };
      countError++;
    }
    if (data?.version) {
      formData.append("version", data?.version);
    } else {
      objectError = {
        ...objectError,
        err_version: "version field is required!",
        err_version_status: true,
      };
      countError++;
    }
    formData.append("size", data?.size);
    formData.append("active_status", data?.active_status ? 1 : 0);
    if (selectedParentId && selectedParentId?.id) {
      formData.append("classification_id", selectedParentId?.id);
    } else {
      objectError = {
        ...objectError,
        err_classification: "Classification field is required!",
        err_classification_status: true,
      };
      countError++;
    }
    if (selectedParentId1 && selectedParentId1?.id) {
      formData.append("sub_classification1_id", selectedParentId1?.id);
    }
    if (selectedParentId2 && selectedParentId2?.id) {
      formData.append("sub_classification2_id", selectedParentId2?.id);
    }
    if (selectedParentId3 && selectedParentId3?.id) {
      formData.append("sub_classification3_id", selectedParentId3?.id);
    }
    if (selectedParentId4 && selectedParentId4?.id) {
      formData.append("sub_classification4_id", selectedParentId4?.id);
    }
    if (countError > 0) {
      setMessageErrors(objectError);
      return;
    }
    dispatch(setGlobalLoading(true));
    let result = null;
    try {
      if (!props?.createMode && props?.object?.id) {
        if (data?.file_name) {
          formData.append("file_name", data?.file_name);
        }
        formData.append("id", props?.object?.id);

        result = await axios({
          url: Host + `file/update/` + props?.object?.id,
          method: "put",
          headers: headers,
          data: formData,
          headers: headers,
        });
      } else if (!props?.object?.id) {
        result = await axios({
          url: Host + `file/create`,
          method: "POST",
          headers: headers,
          data: formData,
        });
      }
      dispatch(setGlobalLoading(false));
      if (result.data.status === false) {
        toast.error(result.data.data.message);
      } else if (result.data.status === true) {
        if (!props?.createMode && props?.object?.id)
          toast.success("Info updated successfully");
        else toast.success("Info created successfully");
        props?.setAddForm(false);
        props?.getData();
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      toast.error("Network Error");
    }
  };

  useEffect(() => {
    getClassification();
  }, [props?.addForm]);

  const getClassification = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };

    try {
      dispatch(setGlobalLoading(true));
      let data = await axios({
        method: "get",
        url: Host + "file/calssifications/list",
        headers: headers,
      });
      dispatch(setGlobalLoading(false));
      console.log("sdadasdad===", data);
      if (data && data?.status && data?.data?.status) {
        setClassifications(data?.data?.data);
      } else {
        toast.warn("Unknown Error");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      console.log(err?.message);
    }
  };
  const getClassificationLevel1 = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };

    try {
      dispatch(setGlobalLoading(true));
      let data = await axios({
        method: "get",
        url: Host + "file/sub_classification1/list",
        headers: headers,
        params: {
          parent_id: selectedParentId?.id,
        },
      });
      dispatch(setGlobalLoading(false));
      if (data && data?.status && data?.data?.status) {
        setClassificationsLevel1(data?.data?.data);
      } else {
        toast.warn("Unknown Error");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      console.log(err?.message);
    }
  };
  const getClassificationLevel2 = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };

    try {
      dispatch(setGlobalLoading(true));
      let data = await axios({
        method: "get",
        url: Host + "file/sub_classification2/list",
        headers: headers,
        params: {
          parent_id: selectedParentId1?.id,
        },
      });
      dispatch(setGlobalLoading(false));
      console.log("sdadasdad===", data);
      if (data && data?.status && data?.data?.status) {
        setClassificationsLevel2(data?.data?.data);
      } else {
        toast.warn("Unknown Error");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      console.log(err?.message);
    }
  };
  const getClassificationLevel3 = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };

    try {
      dispatch(setGlobalLoading(true));
      let data = await axios({
        method: "get",
        url: Host + "file/sub_classification3/list",
        headers: headers,
        params: {
          parent_id: selectedParentId2?.id,
        },
      });
      dispatch(setGlobalLoading(false));
      console.log("sdadasdad===", data);
      if (data && data?.status && data?.data?.status) {
        setClassificationsLevel3(data?.data?.data);
      } else {
        toast.warn("Unknown Error");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      console.log(err?.message);
    }
  };
  const getClassificationLevel4 = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };

    try {
      dispatch(setGlobalLoading(true));
      let data = await axios({
        method: "get",
        url: Host + "file/sub_classification4/list",
        headers: headers,
        params: {
          parent_id: selectedParentId3?.id,
        },
      });
      dispatch(setGlobalLoading(false));
      console.log("sdadasdad===", data);
      if (data && data?.status && data?.data?.status) {
        setClassificationsLevel4(data?.data?.data);
      } else {
        toast.warn("Unknown Error");
      }
    } catch (err) {
      dispatch(setGlobalLoading(false));
      console.log(err?.message);
    }
  };

  useEffect(() => {
    if (selectedParentId && selectedParentId?.id) {
      getClassificationLevel1();
    } else {
      setClassificationsLevel1([]);
    }
  }, [selectedParentId]);

  useEffect(() => {
    if (selectedParentId1 && selectedParentId1?.id) {
      getClassificationLevel2();
    } else {
      setClassificationsLevel2([]);
    }
  }, [selectedParentId1]);

  useEffect(() => {
    if (selectedParentId2 && selectedParentId2?.id) {
      getClassificationLevel3();
    } else {
      setClassificationsLevel3([]);
    }
  }, [selectedParentId2]);

  useEffect(() => {
    if (selectedParentId3 && selectedParentId3?.id) {
      getClassificationLevel4();
    } else {
      setClassificationsLevel4([]);
    }
  }, [selectedParentId3]);

  useEffect(() => {
    setSelectedParentId(props?.branch[0]);
    setSelectedParentId1(props?.branch[1]);
    setSelectedParentId2(props?.branch[2]);
    setSelectedParentId3(props?.branch[3]);
    setSelectedParentId4(props?.branch[4]);
  }, [props?.branch]);

  return (
    <PopupForm
      open={props.addForm}
      setOpen={props.setAddForm}
      title={
        props?.createMode ? "Upload File" : "Edit uploaded File Information"
      }
      isFullScreen={true}
      width="100%"
      customeHeight={"100%"}
      customePadding="0 5px"
      content={
        <RenderContent
          data={data}
          setData={setData}
          classifications={classifications}
          classificationsLevel1={classificationsLevel1}
          classificationsLevel2={classificationsLevel2}
          classificationsLevel3={classificationsLevel3}
          classificationsLevel4={classificationsLevel4}
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
          setMessageErrors={setMessageErrors}
          messageError={messageError}
          branch={props?.branch}
        />
      }
      footer={
        <RenderFooter
          open={props.addForm}
          setOpen={props.setAddForm}
          submit={submit}
        />
      }
    />
  );
};

export default AddForm;
