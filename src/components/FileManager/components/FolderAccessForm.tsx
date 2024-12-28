import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "../../../assets/js/AxiosInterceptors";
import PopupForm from "../../../Components/PopupForm";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Grid from "../../Grid/Grid";
import SearchInput from "../../../Components/SearchInput";
import Cookies from "universal-cookie";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import host from "../../../assets/js/Host";
import { setGlobalLoading } from "../../../reduxStore/SettingsReducer";

const cookies = new Cookies();

const FilterSearchContent = (props) => {
  const [t] = useTranslation("common");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100% !important",
      }}
    >
      <SearchInput
        value={props?.userName}
        setValue={props?.setUserName}
        searchFunction={props?.searchFunction}
        title={"User Name"}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          width: "100%",
          marginLeft: "20px !important",
          marginTop: "10px !important",
          "& .MuiTypography-root": {
            fontFamily: "Cairo-Medium",
          },
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={props.checkAllselected}
              onChange={(e) => {
                props.setCheckAllselected(e.target.checked);
                if (e.target.checked) props.setCheckAllNotSelected(false);
              }}
            />
          }
          label={"Selected Users"}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          width: "100%",
          marginLeft: "20px !important",
          marginTop: "10px !important",
          "& .MuiTypography-root": {
            fontFamily: "Cairo-Medium",
          },
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={props.checkAllNotSelected}
              onChange={(e) => {
                props.setCheckAllNotSelected(e.target.checked);
                if (e.target.checked) props.setCheckAllselected(false);
              }}
            />
          }
          label={"UnSelected Users"}
        />
      </Box>
    </Box>
  );
};

const RenderContent = (props) => {
  const [t] = useTranslation("common");

  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const handlePageChange = (newPage) => {
    setPageNumber(newPage + 1);
  };

  const screenwidth = useSelector((state) => state.settingsData.screenwidth);

  const [columns, setColumns] = useState([
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      width: 40,
    },
    { headerName: "#", field: "id", flex: 0.5 },
    { headerName: "name", field: "name", flex: 2 },
    {
      headerName: "Department",
      field: "department_id",
      flex: 2,
      renderCell: (rows) => {
        return (
          <Box>
            {
              props?.departments?.find(
                (d) => d?.id === rows?.row?.department_id
              )?.Department
            }
          </Box>
        );
      },
    },
  ]);
  const handleCheckBoxChange = useCallback((rows) => {
    console.log("datadadjandkasjdn", rows);
    props.setListOfSelectedRows(rows);
    let arr = [];
    props?.users &&
      props?.users?.length &&
      props?.users?.map((itm) => {
        if (rows?.find((e) => e == itm?.user_id)) {
          arr.push(itm);
        }
      });
    console.log("datadadjandkasjdn", arr);
    props?.setUser(arr);
  }, []);

  return (
    <Box className="Container-fluid">
      <Box className="row d-flex justify-content-center align-items-start">
        <Box
          className="col-12 col-sm-12 col-md-12 my-3 px-0"
          sx={{
            "& .MuiCheckbox-root": {
              color: "#1e6a99 !important",
              fill: "#1e6a99 !important",
            },
          }}
        >
          <Grid
            rows={props?.users}
            columns={columns}
            setColumns={setColumns}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageNumber={pageNumber + 1}
            setPageNumber={setPageNumber}
            loading={loading}
            handlePageChange={handlePageChange}
            rowsTotal={props?.users?.length}
            checkScreenSize={screenwidth}
            pageCount={Math.ceil(props?.users?.length / pageSize)}
            openFilterColumn={null}
            elementClicked={null}
            setOpenFilterColumn={null}
            setColumnFilterValue={null}
            columFilterValue={null}
            clearFunction={props?.handleClearInAddvancSearch}
            searchFunction={props?.handleSearchInAddvancSearch}
            creatFunction={null}
            ExportFunction={null}
            importFunction={null}
            mapFunction={null}
            telegramFunction={null}
            hasCreate={false}
            hasImport={false}
            // paginationMode="client"
            hasExport={false}
            hasMap={false}
            hasTetelgram={false}
            LeftButtonsGrid={() => {}}
            dataGridName={"ADDPERMISSIONSGRID"}
            filterChilds={
              <FilterSearchContent
                setUserName={props?.setUserName}
                userName={props?.userName}
                setCheckAllselected={props.setCheckAllselected}
                checkAllselected={props.checkAllselected}
                setCheckAllNotSelected={props.setCheckAllNotSelected}
                checkAllNotSelected={props?.checkAllNotSelected}
                searchFunction={props?.handleSearchInAddvancSearch}
              />
            }
            filterHasSelectCounter={true}
            sideFIlterSearch={false}
            popupGrid={true}
            filterHasSelectCounterValue={props?.listOfSelectedRows?.length}
            notHaveAdvancSearch={false}
            hasSelectOption={true}
            handleCheckBoxChange={handleCheckBoxChange}
            listOfSelectedRows={props?.listOfSelectedRows}
            paginationMode={"client"}
          />
        </Box>
      </Box>
    </Box>
  );
};

const RenderFooter = (props) => {
  const [t] = useTranslation("common");
  const gridtheme = useSelector((state) => state.themeData.gridtheme);

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
            Close
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
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default function FolderAccessForm(props) {
  const dispatch = useDispatch();
  const [t] = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [listOfSelectedRows, setListOfSelectedRows] = useState([]);
  const [filterdUsers, setFilterdUsers] = useState([]);
  const [userName, setUserName] = useState();
  const [isSearchApplay, setIsSearchApplay] = useState(false);
  const [checkAllselected, setCheckAllselected] = useState(false);
  const [checkAllNotSelected, setCheckAllNotSelected] = useState(false);

  const [user, setUser] = useState("");
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  function filterPermissions(selectedFolder, permissions) {
    return permissions.filter((permission) => {
      if (selectedFolder.level === 0) {
        return (
          permission.classification_id === selectedFolder.id &&
          permission.sub_classification1_id === null &&
          permission.sub_classification2_id === null &&
          permission.sub_classification3_id === null &&
          permission.sub_classification4_id === null
        );
      } else if (selectedFolder.level === 1) {
        return (
          permission.sub_classification1_id === selectedFolder.id &&
          permission.sub_classification2_id === null &&
          permission.sub_classification3_id === null &&
          permission.sub_classification4_id === null
        );
      } else if (selectedFolder.level === 2) {
        return (
          permission.sub_classification2_id === selectedFolder.id &&
          permission.sub_classification3_id === null &&
          permission.sub_classification4_id === null
        );
      } else if (selectedFolder.level === 3) {
        return (
          permission.sub_classification3_id === selectedFolder.id &&
          permission.sub_classification4_id === null
        );
      } else if (selectedFolder.level === 4) {
        return permission.sub_classification4_id === selectedFolder.id;
      }
    });
  }

  function filterUsersByPermissions(filteredPermissions, users) {
    const userIDsWithAccess = new Set();

    filteredPermissions.forEach((permission) => {
      if (permission.user_id) {
        userIDsWithAccess.add(permission.user_id);
      }
    });

    return users.filter((user) => userIDsWithAccess.has(user.user_id));
  }

  function hasDirectAccessToFolder(permissions, users, folder) {
    const filteredPermissions = filterPermissions(folder, permissions);
    const usersWithAccess = filterUsersByPermissions(
      filteredPermissions,
      users
    );
    return usersWithAccess;
  }

  useEffect(() => {
    let jwt = cookies.get("token");
    let headers = {
      jwt: jwt,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    axios({
      url: host + `users/usersList`,
      method: "GET",
      headers: headers,
    }).then((res) => {
      let arrCustom = [];
      res.data.data &&
        res.data.data?.map((itm, index) => {
          arrCustom.push({
            id: itm?.user_id,
            ...itm,
            name: itm.name ? itm.name : "لا يوجد إسم",
            department_id: itm?.department_id,
          });
        });
      setUsers(arrCustom);
      setFilterdUsers(arrCustom);
      let arr = [];
      axios({
        url: host + `file/get_read_access_permissions`,
        method: "GET",
        headers: headers,
      })
        .then((permissions) => {
          const userHasAccess = hasDirectAccessToFolder(
            permissions?.data?.data,
            res.data.data,
            {
              id: props?.folder?.id,
              parent_id: props?.folder?.parent_id
                ? props?.folder?.parent_id
                : null,
              level: props?.folder?.level ? props?.folder?.level : 0,
            }
          );

          setListOfSelectedRows(
            userHasAccess && userHasAccess.map((itm) => itm?.user_id)
          );
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    });

    axios({
      url: host + `departments/departments`,
      method: "GET",
      headers: headers,
    })
      .then((res) => {
        if (res.data.status === false) {
          cookies.remove("token");
          window.location.href = "/";
        } else {
          setLoading(false);
          let arr = [];
          for (let index = 0; index < res.data.data.length; index++) {
            let obj = {
              ...res.data.data[index],
              id: index + 1,
              Department: res.data.data[index].name,
            };
            arr.push(obj);
            // console.log('data11',this.state.arr);
          }
          setDepartments(arr);
        }
      })
      .catch((err) => {
        toast.error("Network Error");
        setLoading(false);
      });
  }, [props?.addForm]);

  const submit = async () => {
    var headers = {
      jwt: cookies.get("token"),
    };
    // if (selectedUsers?.length === 0) {
    //   var users_id = 0;
    // } else {
    //   users_id = selectedUsers?.map((itm) => itm?.user_id);
    // }
    let data = null;
    dispatch(setGlobalLoading(true));
    try {
      data = await axios({
        url: host + `file/folder_access`,
        method: "POST",
        headers: headers,
        data: {
          id: props?.folder?.id,
          level: props?.folder.level ? props?.folder.level : 0,
          path: props?.branch,
          users_ids: listOfSelectedRows,
        },
      });
      if (data.data.status === false) {
        toast.error(data.data.data.message.text);
        dispatch(setGlobalLoading(false));
      } else if (data.data.status === true) {
        toast.success("Updated Successfully");
        dispatch(setGlobalLoading(false));
      }
    } catch (err) {
      toast.error("Network Error");
      dispatch(setGlobalLoading(false));
    }
  };

  const handleSearchInAddvancSearch = () => {
    let arr = [];
    if (userName) {
      setIsSearchApplay(true);
      users &&
        users?.length &&
        users?.map((itm) => {
          if (itm?.name?.toLowerCase().includes(userName?.toLowerCase())) {
            arr.push(itm);
          }
        });
      setFilterdUsers(arr);
    } else {
      arr = [...users];
      setFilterdUsers(users);
    }
    if (checkAllselected) {
      setFilterdUsers(
        arr.filter((itm) => listOfSelectedRows?.includes(itm?.user_id))
      );
    }
    if (checkAllNotSelected) {
      setFilterdUsers(
        arr.filter((itm) => !listOfSelectedRows?.includes(itm?.user_id))
      );
    }
  };
  const handleClearInAddvancSearch = () => {
    setIsSearchApplay(false);
    setUserName("");
    setFilterdUsers(users);
    setCheckAllselected(false);
    setCheckAllNotSelected(false);
  };

  return (
    <PopupForm
      customeWidth="100%"
      width={"100%"}
      customeHeight={"100%"}
      isFullScreen={true}
      customePadding={"5px 20px"}
      open={props.addForm}
      setOpen={props.setAddForm}
      title={"Specify who can access this folder"}
      content={
        <RenderContent
          users={filterdUsers}
          user={user}
          setUser={setUser}
          allUsers={users}
          userName={userName}
          departments={departments}
          setUserName={setUserName}
          handleSearchInAddvancSearch={handleSearchInAddvancSearch}
          handleClearInAddvancSearch={handleClearInAddvancSearch}
          setListOfSelectedRows={setListOfSelectedRows}
          listOfSelectedRows={listOfSelectedRows}
          isSearchApplay={isSearchApplay}
          checkAllselected={checkAllselected}
          setCheckAllselected={setCheckAllselected}
          setCheckAllNotSelected={setCheckAllNotSelected}
          checkAllNotSelected={checkAllNotSelected}
          open={props.addForm}
          setOpen={props.setAddForm}
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
}
