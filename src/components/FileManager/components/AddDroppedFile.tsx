import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import axios from "../../../assets/js/AxiosInterceptors";
import { toast } from "react-toastify";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../Components/PopupForm";
import host from "../../../assets/js/Host";
import { setGlobalLoading } from "../../../reduxStore/SettingsReducer";
import CustomTextField from "../../../Components/CustomTextField";

const cookies = new Cookies();

const RenderContent = (props) => {
  const [t] = useTranslation("common");
  return (
    <Box className="Container-fluid">
      <Box className="row pt-4">
        <Box sx={{ display: "flex", width: "100%" }}>
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
        </Box>
        <Box sx={{ display: "flex", width: "100%" }}>
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
              }
            }}
            onClearClick={() => {
              props?.setData({
                ...props?.data,
                size: "",
              });
            }}
          />
        </Box>
        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <Box
            style={{
              width: "300px",
              backgroundColor: "#fff",
              boxShadow: "0 0 7px -2px #000",
              height: "55px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "10px",
              marginLeft: "10px",
              marginRight: "10px",
              borderLeft: "5px solid #1e6a99",
              marginTop: "3px",
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
        </Box>
      </Box>
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
              props.cancele();
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

const AddDroppedFile = (props) => {
  const dispatch = useDispatch();
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
    if (props?.branch?.length) {
      if (props?.branch[0] && props?.branch[0]?.id) {
        formData.append("classification_id", props?.branch[0]?.id);
      } else {
        objectError = {
          ...objectError,
          err_classification: "Classification field is required!",
          err_classification_status: true,
        };
        countError++;
      }
      if (props?.branch[1] && props?.branch[1]?.id) {
        formData.append("sub_classification1_id", props?.branch[1]?.id);
      }
      if (props?.branch[2] && props?.branch[2]?.id) {
        formData.append("sub_classification2_id", props?.branch[2]?.id);
      }
      if (props?.branch[3] && props?.branch[3]?.id) {
        formData.append("sub_classification3_id", props?.branch[3]?.id);
      }
      if (props?.branch[4] && props?.branch[4]?.id) {
        formData.append("sub_classification4_id", props?.branch[4]?.id);
      }
      if (countError > 0) {
        setMessageErrors(objectError);
        return;
      }
      dispatch(setGlobalLoading(true));
      let result = null;
      try {
        result = await axios({
          url: host + `file/create`,
          method: "POST",
          headers: headers,
          data: formData,
        });
        dispatch(setGlobalLoading(false));
        if (result.data.status === false) {
          toast.error(result.data.data.text);
        } else if (result.data.status === true) {
          if (!props?.createMode) toast.success("Info updated successfully");
          else toast.success("Info created successfully");
          props.setAddForm(false);
          props?.getData();
        }
      } catch (err) {
        dispatch(setGlobalLoading(false));
        toast.error("Network Error");
      }
    } else {
      toast.warn("Unknown Error");
    }
  };

  const cancele = async () => {
    setData({
      file: null,
      path: "",
      file_name: "",
      name: "",
      description: "",
      version: "",
      size: "",
      active_status: "",
    });
    props?.setFile(null);
    props.setAddForm(false);
  };

  useEffect(() => {
    // if (props?.file) {
    setData({
      ...data,
      file: props?.file,
      name: props?.file?.name,
      file_name: props?.file?.name,
    });
    // }
  }, [props.addForm]);

  return (
    <PopupForm
      open={props.addForm}
      setOpen={props.setAddForm}
      width={"70%"}
      title={"Include File Details"}
      content={
        <RenderContent
          data={data}
          setData={setData}
          messageError={messageError}
          setMessageErrors={setMessageErrors}
        />
      }
      footer={
        <RenderFooter
          open={props.addForm}
          setOpen={props.setAddForm}
          cancele={cancele}
          submit={submit}
        />
      }
    />
  );
};

export default AddDroppedFile;
