import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Alert,
  BackHandler,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import CheckBox from "expo-checkbox";
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import { RootStackParamList } from "../types";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { Loader } from "../components/Loader";

import { endpoint, completeJobStatusApi } from "../helpers/Api";

export default function NotFoundScreen(navigation: any) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [reloadJobList, setReloadJobList] = React.useState(Boolean);
  const [user, setUser] = React.useState(Object);
  const [item, setItem] = React.useState(Object);
  const [itemJob, setItemJob] = React.useState(Object);
  const [camera, setCamera] = React.useState();
  const [signature, setSignature] = React.useState(String);
  const [hasPermission, setHasPermission] = React.useState(Boolean);
  const [showForm, setShowForm] = React.useState(Boolean);
  const [showCamera, setShowCamera] = React.useState(Boolean);
  const [showGallery, setshowGallery] = React.useState(Boolean);
  const [showSignature, setShowSignature] = React.useState(Boolean);
  const [showJobSignature, setShowJobSignature] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(Boolean);
  const types = ["New Installation", "Checking", "Uninstallation", "Transfer"];

  const [bAircon, setBAircon] = React.useState(Boolean);
  const [bBattery, setBBattery] = React.useState(Boolean);
  const [bRadio, setBRadio] = React.useState(Boolean);
  const [bCashcard, setBCashcard] = React.useState(Boolean);
  const [bEngine, setBEngine] = React.useState(Boolean);
  const [bHorn, setBHorn] = React.useState(Boolean);
  const [bHeadlights, setBHeadlights] = React.useState(Boolean);
  const [bHazardlight, setBHazardlight] = React.useState(Boolean);
  const [bBreaklight, setBBreaklight] = React.useState(Boolean);
  const [bWiper, setBWiper] = React.useState(Boolean);

  const [checkAll, setcheckAll] = React.useState(Boolean);
  const [images, setImages] = React.useState([]);

  const [polar_text_1, setpolar_text_1] = React.useState([]);
  const [mainWithOpacity, setmainWithOpacity] = React.useState([]);

  const [isOpen, setIsOpen] = useState(false);

  const m1 = React.useMemo(
    () => ({
      getImageMetaData: false,
      initialLoad: 100,
      assetsType: [MediaLibrary.MediaType.photo],
      minSelection: 1,
      maxSelection: 15,
      portraitCols: 4,
      landscapeCols: 4,
    }),
    []
  );
  const m2 = React.useMemo(
    () => ({
      errorTextColor: "red",
      errorMessages: {
        hasErrorWithPermissions: "No Permission",
        hasErrorWithLoading: "Error R2",
        hasErrorWithResizing: "Error R",
        hasNoAssets: "No assets",
      },
    }),
    []
  );
  const m3 = React.useMemo(
    () => ({
      margin: 2,
      bgColor: "white",
      spinnerColor: "blue",
      widgetWidth: 99,
      videoIcon: {
        Component: Ionicons,
        iconName: "ios-videocam",
        color: "tomato",
        size: 20,
      },
      selectedIcon: {
        Component: Ionicons,
        iconName: "ios-checkmark-circle-outline",
        color: "white",
        bg: "#0eb14970",
        size: 26,
      },
    }),
    []
  );
  const m4 = React.useMemo(
    () => ({
      Texts: {
        finish: "finish",
        back: "back",
        selected: "selected",
      },
      midTextColor: "black",
      minSelection: 1,
      buttonTextStyle: {
        color: "white",
      },
      buttonStyle: {
        backgroundColor: "#555",
      },
      onBack: () => {
        setshowGallery(false);
      },
      onSuccess: (imgs: any) => {
        let _itemJob = { ...itemJob };

        for (var i = 0; i < imgs.length; i++) {
          _itemJob.photos.push(imgs[i]);
        }
        console.log("itemJob>>>> ", JSON.stringify(_itemJob));
        setItemJob(_itemJob);
        setshowGallery(false);
      },
      onError: (images: any) => {
        console.log(images);
      },
    }),
    [itemJob]
  );

  //cost data
  let _camera: Camera;
  let _signature = "";
  let _submitGallery = function () {
    setshowGallery(false);
  };

  React.useEffect(() => {
    if (!isLoaded) {
      let item = navigation["route"]["params"]["item"];

      for (let i in item.items) {
        item.items[i].photos = [];
      }

      setItem(item);
      if (item != null) {
        completeJobStatus(item);
      }
      AsyncStorage.getItem("user_info").then((e: any) => {
        setUser(JSON.parse(e));
      });

      // ask for permission
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();

      setIsLoaded(true);

      const backAction = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
    }
  });

  function completeJobStatus(item: any) {
    let job_id = item.id;
    completeJobStatusApi({ _data: { job_id } })
      .then((jobStatus) => {
        if (jobStatus.status) {
          setShowJobSignature(true);
        } else {
          setShowJobSignature(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: cameraRoll } = await Permissions.askAsync(
          Permissions.MEDIA_LIBRARY
        );
        if (cameraRoll !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  function goBack() {
    navigation.navigation.navigate("TabOneScreen", { user });
  }

  function createAccs(accs: any) {
    let accsElems = [];
    for (let i in accs) {
      let acc = accs[i];
      accsElems.push(
        <Text
          key={"accs-" + i}
          style={[styles.cardDetail, { paddingLeft: 10 }]}
        >
          {acc}
        </Text>
      );
    }

    return accsElems;
  }

  function renderJobItem(itemx: any) {
    let itemj = itemx.item;
    let statusStyle = itemj.status > 0 ? styles.completed : {};
    let filled = itemj.vehicle && itemj.photo;
    let accs = createAccs(itemj.accs ? itemj.accs.split("|") : []);
    return (
      <View key={"jobitem-" + itemj.id} style={[styles.cardWrap, statusStyle]}>
        <Text style={styles.cardDetail}>
          Vehicle: {itemj.vehicle.toUpperCase()}
          {item.type == 3 ? " to " + itemj.new_vehicle.toUpperCase() : ""}
        </Text>
        <Text style={[styles.cardDetail, { paddingLeft: 10 }]}>
          Device: {itemj.dev_name}(IMEI:{itemj.imei})
        </Text>
        <Text style={styles.cardDetail}>Accessories:</Text>
        {accs}

        {itemj.status == 0 && (
          <View style={{ position: "absolute", top: 10, right: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setBAircon(itemj.bAircon);
                setBBattery(itemj.bBattery);
                setBRadio(itemj.bRadio);
                setBCashcard(itemj.bCashcard);
                setBEngine(itemj.bEngine);
                setBHorn(itemj.bHorn);
                setBHeadlights(itemj.bHeadlights);
                setBHazardlight(itemj.bHazardlight);
                setBWiper(itemj.bWiper);
                setBBreaklight(itemj.bBreaklight);

                setItemJob(itemj);
                setShowForm(true);
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: !filled ? "#007bff" : "#28a745",
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
            >
              <AntDesign
                name={!filled ? "edit" : "check"}
                style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  function completeVehicle() {
    let formData = new FormData();
    let vehicleToSubmit = [];

    setShowLoader(true);
    setShowForm(false);
    setShowSignature(false);
    for (let i in item.items) {
      let _item = item.items[i];
      if (_item.photos.length > 0 && _item.status == 0) {
        vehicleToSubmit.push(_item);
        item.items[i].status = 1;

        formData.append("vehicle", _item.vehicle);
        formData.append("vehicle_id", _item.vehicle_id);
        formData.append("new_vehicle", _item.new_vehicle);

        for (let k in _item.photos) {
          let pht = _item.photos[k];
          console.log("Image Path >> ", JSON.stringify(pht));
          formData.append("photos[" + k + "]", {
            uri: pht.uri,
            name: "job_item_photo_" + _item.id + "_" + k + ".png",
            type: "image/png",
          });
        }

        // add remarks before and after form
        let remarks = [];

        if (_item.bAircon) remarks.push("Aircon");
        if (_item.bBattery) remarks.push("Battery");
        if (_item.bRadio) remarks.push("Radio");
        if (_item.bCashcard) remarks.push("Cashcard");
        if (_item.bEngine) remarks.push("Engine");
        if (_item.bHorn) remarks.push("Horn");
        if (_item.bHeadlights) remarks.push("Headlights");
        if (_item.bHazardlight) remarks.push("Hazardlight");
        if (_item.bWiper) remarks.push("Wiper");
        if (_item.bBreaklight) remarks.push("Breaklight");

        let rmks = "Checked: " + remarks.join(",");
        rmks += "\n\r" + _item.remarks;

        formData.append("item_id", _item.id);
        formData.append("remark", rmks);
      }
    }

    formData.append("job_id", item.id);
    formData.append("user_id", user["id"]);

    console.log("Vehicle formData>> ", JSON.stringify(formData));
    if (vehicleToSubmit.length > 0) {
      let options = {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };

      fetch(endpoint + "complete_vehicle", options)
        .then((e) => e.text())
        .then((e) => {
          console.log("Vehicle Success Case >>> ", e);
          setShowLoader(false);
          completeJobStatus(item);
        })
        .catch((error) => {
          setShowLoader(false);
          console.log("Vehicle Error Case >>> ", error);
        });
    } else {
      Alert.alert("There are no job to update.");
      setShowLoader(false);
    }
  }

  function completeAssignJob() {
    let formData = new FormData();
    setShowLoader(true);
    setShowSignature(false);
    //add call api here to submit job

    formData.append("job_id", item.id);
    formData.append("user_id", user["id"]);
    formData.append("signature", {
      uri: _signature,
      name: "job_sign_" + item.id + ".png",
      type: "image/png",
    });

    console.log("Signature formData>> ", JSON.stringify(formData));
    let options = {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    fetch(endpoint + "complete_assign_job", options)
      .then((e) => e.text())
      .then((e) => {
        console.log("Signature Success Case>>> ", e);
        setShowLoader(false);
        goBack();
      })
      .catch((error) => {
        setShowLoader(false);
        console.log("Signature Error Case>>> ", error);
      });
  }

  function renderItemPhoto({ index, item }: any) {
    let img = item;
    return (
      <TouchableOpacity
        key={"upload-img-" + index}
        onLongPress={() => {
          setShowLoader(true);
          Alert.alert("", "Remove this image?", [
            {
              text: "Cancel",
              onPress: () => {
                setShowLoader(false);
              },
            },
            {
              text: "OK",
              onPress: () => {
                itemJob.photos.splice(index, 1);
                setShowLoader(false);
              },
            },
          ]);
        }}
      >
        <Image
          source={{ uri: img.uri }}
          style={{ width: 120, height: 160, marginBottom: 10, marginRight: 10 }}
        />
      </TouchableOpacity>
    );
  }

  function renderBeforeForm1() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bAircon}
            onValueChange={() => {
              setBAircon(!itemJob.bAircon);
              itemJob.bAircon = !itemJob.bAircon;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Aircon</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bBattery}
            onValueChange={() => {
              setBBattery(!itemJob.bBattery);
              itemJob.bBattery = !itemJob.bBattery;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Battery</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bRadio}
            onValueChange={() => {
              setBRadio(!itemJob.bRadio);
              itemJob.bRadio = !itemJob.bRadio;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Radio</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bCashcard}
            onValueChange={() => {
              setBCashcard(!itemJob.bCashcard);
              itemJob.bCashcard = !itemJob.bCashcard;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Cashcard</Text>
        </View>
      </View>
    );
  }

  function renderBeforeForm2() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bEngine}
            onValueChange={() => {
              setBEngine(!itemJob.bEngine);
              itemJob.bEngine = !itemJob.bEngine;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Engine</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bHorn}
            onValueChange={() => {
              setBHorn(!itemJob.bHorn);
              itemJob.bHorn = !itemJob.bHorn;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Horn</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", width: 65 }}>
          <CheckBox
            style={{ margin: 0 }}
            value={bHeadlights}
            onValueChange={() => {
              setBHeadlights(!itemJob.bHeadlights);
              itemJob.bHeadlights = !itemJob.bHeadlights;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Headlights</Text>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", width: 100 }}
        >
          <CheckBox
            style={{ margin: 0 }}
            value={bHazardlight}
            onValueChange={() => {
              setBHazardlight(!itemJob.bHazardlight);
              itemJob.bHazardlight = !itemJob.bHazardlight;
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Hazardlight</Text>
        </View>
      </View>
    );
  }

  function renderBeforeForm3() {
    return (
      <>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 65 }}
          >
            <CheckBox
              style={{ margin: 0 }}
              value={bWiper}
              onValueChange={() => {
                setBWiper(!itemJob.bWiper);
                itemJob.bWiper = !itemJob.bWiper;
              }}
            />
            <Text style={{ fontSize: 10, flexShrink: 1 }}>Wiper</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center", width: 100 }}
          >
            <CheckBox
              style={{ margin: 0 }}
              value={bBreaklight}
              onValueChange={() => {
                setBBreaklight(!itemJob.bBreaklight);
                itemJob.bBreaklight = !itemJob.bBreaklight;
              }}
            />
            <Text style={{ fontSize: 10, flexShrink: 1 }}>Breaklights</Text>
          </View>
        </View>
        {renderBeforeForm4()}
      </>
    );
  }

  function renderBeforeForm4() {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", width: 100 }}
        >
          <CheckBox
            style={{ margin: 0 }}
            value={checkAll}
            onValueChange={() => {
              setAll();
              setcheckAll(true);
            }}
          />
          <Text style={{ fontSize: 10, flexShrink: 1 }}>Check All</Text>
        </View>
      </View>
    );
  }

  function setAll() {
    setBAircon(true);
    itemJob.bAircon = true;
    setBBattery(true);
    itemJob.bBattery = true;
    setBRadio(true);
    itemJob.bRadio = true;
    setBCashcard(true);
    itemJob.bCashcard = true;
    setBEngine(true);
    itemJob.bEngine = true;
    setBHorn(true);
    itemJob.bHorn = true;
    setBHeadlights(true);
    itemJob.bHeadlights = true;
    setBHazardlight(true);
    itemJob.bHazardlight = true;
    setBWiper(true);
    itemJob.bWiper = true;
    setBBreaklight(true);
    itemJob.bBreaklight = true;
  }

  let selectPhotos = async () => {
    setshowGallery(true);
    // MultipleImagePicker.openPicker({
    //     selectedAssets: images,
    //     mediaType: "image",
    //     usedCameraButton: false,
    //     // selectedColor: '#f9813a',
    // }).then((e) => {
    //     console.log(e);
    // });

    // let result = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.All,
    //     allowsEditing: false,
    //     aspect: [4, 3],
    //     quality: 1,
    // });
    // ImagePicker.openPicker({
    //     multiple: true
    // }).then(images => {
    //     console.log(images);
    // });

    //setShowLoader(true);
    // if (!result.cancelled) {
    //     itemJob.photos.push(result);
    // }

    //setShowLoader(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation["navigation"].navigate("Root");
          }}
        >
          <AntDesign name={"arrowleft"} style={styles.arrow} />
        </TouchableOpacity>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text>No access to camera</Text>
        </View>
      </View>
    );
  }
  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          pictureSize={"640x480"}
          ref={(ref: any) => {
            _camera = ref;
            setCamera(ref);
          }}
          type={Camera.Constants.Type.back}
        ></Camera>
        <View
          style={{
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
            onPress={() => {
              _camera.takePictureAsync().then((d: any) => {
                itemJob.photos.push(d);
                setShowCamera(false);
              });
            }}
          >
            <AntDesign
              name={"camera"}
              style={{ color: "#888", fontSize: 40 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
            onPress={() => {
              setShowCamera(false);
            }}
          >
            <AntDesign name={"close"} style={{ color: "#fff", fontSize: 30 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
        >
          <AntDesign name={"arrowleft"} style={styles.arrow} />
        </TouchableOpacity>
        <Text style={styles.title}>Job</Text>
        <Text style={styles.title}>{types[item.type]}</Text>
        <Text style={styles.date}>
          {moment(item.schedule_date).format("MMM DD, YYYY @ hh:mm A")} -{" "}
          {moment(item.schedule_date)
            .add(item.schedule_duration, "hour")
            .format("hh:mm A")}
        </Text>
        <Text style={styles.address}>Address: {item.address}</Text>
        <Text style={styles.address}>
          Contact: {item.contact_name}(#{item.contact_number})
        </Text>
        <Text style={styles.address}>Remarks: {item.remarks}</Text>
        <FlatList
          style={{ width: "100%", marginTop: 20 }}
          data={item.items}
          keyExtractor={(index, item) => {
            return "item" + item;
          }}
          renderItem={renderJobItem}
        />

        {showJobSignature && (
          <View
            style={{
              position: "absolute",
              right: 20,
              bottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowSignature(true);
              }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 30,
                elevation: 5,
                backgroundColor: "#28a745",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name={"save"}
                style={{ fontSize: 30, color: "#fff" }}
              />
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: 8,
                padding: 20,
                minHeight: 140,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                JOB ITEM COMPLETION FORM
              </Text>

              {(item.type == 0 || item.type == 2) && (
                <TextInput
                  defaultValue={itemJob.vehicle}
                  onChangeText={(text) => {
                    itemJob.vehicle = text;
                  }}
                  style={{ borderBottomWidth: 1, padding: 5, marginBottom: 10 }}
                  placeholder={"Vehicle Number"}
                />
              )}

              <Text>Check Before & After</Text>
              <Text style={{ fontSize: 10, marginBottom: 10 }}>
                (For issues, specify in the remarks section.)
              </Text>
              {renderBeforeForm1()}
              {renderBeforeForm2()}
              {renderBeforeForm3()}

              <TextInput
                multiline
                defaultValue={itemJob.remarks}
                onChangeText={(text) => {
                  itemJob.remarks = text;
                }}
                style={{ borderBottomWidth: 1, padding: 5, marginVertical: 20 }}
                placeholder={"Remarks"}
              />

              {itemJob.photos && (
                <FlatList
                  style={{
                    width: "100%",
                    height: 180,
                    marginVertical: item.type == 0 ? 20 : 0,
                  }}
                  keyExtractor={(index, item) => {
                    return "photo" + item;
                  }}
                  numColumns={2}
                  data={itemJob.photos}
                  renderItem={renderItemPhoto}
                />
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowCamera(true);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#007bff",
                    width: 135,
                    padding: 8,
                    elevation: 5,
                    borderRadius: 8,
                  }}
                >
                  <AntDesign
                    name={"camera"}
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Add Photo(s)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    selectPhotos();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#007bff",
                    width: 135,
                    padding: 8,
                    elevation: 5,
                    borderRadius: 8,
                  }}
                >
                  <AntDesign
                    name={"picture"}
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{ color: "#fff", fontSize: 16 }}>
                    Select Photo(s)
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowForm(false)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#6c757d",
                    width: 135,
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 20,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: "#fff", fontSize: 16 }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => completeVehicle()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#28a745",
                    width: 135,
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 20,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: "#fff", fontSize: 16 }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showSignature && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
              padding: 40,
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                width: "100%",
                borderRadius: 8,
                minHeight: 450,
              }}
            >
              <SignatureScreen
                //ref={ref => { setSignature(ref) }}
                onOK={(sign) => {
                  const path = FileSystem.cacheDirectory + "sign.png";
                  //setSignature("");
                  FileSystem.writeAsStringAsync(
                    path,
                    sign.replace("data:image/png;base64,", ""),
                    { encoding: FileSystem.EncodingType.Base64 }
                  )
                    .then((res: any) => {
                      _signature = path;
                      //setSignature(path);
                      Alert.alert("", "Complete this job?", [
                        { text: "Cancel", onPress: () => {} },
                        {
                          text: "OK",
                          onPress: () => {
                            completeAssignJob();
                          },
                        },
                      ]);
                    })
                    .catch((err: any) => {
                      console.log("err", err);
                    });
                }}
                descriptionText={"Signature"}
              />

              <View style={{ position: "absolute", top: 10, right: 10 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowSignature(false);
                  }}
                >
                  <AntDesign
                    name={"close"}
                    style={{
                      textAlign: "center",
                      color: "#555",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showLoader ? <Loader /> : null}

        {showGallery && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              elevation: 6,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <AssetsSelector
                Settings={m1}
                Errors={m2}
                Styles={m3}
                Navigator={m4}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  arrow: {
    fontSize: 36,
    color: "#674172",
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    color: "#674172",
    fontWeight: "bold",
  },
  date: {
    marginTop: 20,
    fontSize: 14,
    color: "#674172",
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "#674172",
    fontWeight: "bold",
  },
  cardWrap: {
    padding: 10,
    width: "100%",
    borderLeftColor: "#007bff",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#ecf5fe",
    shadowColor: "#000",
    borderLeftWidth: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#674172",
  },
  cardDate: {
    fontSize: 14,
    color: "#947cb0",
    fontWeight: "500",
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: "#674172",
    fontWeight: "500",
  },
  completed: {
    borderLeftColor: "#28a745",
  },
});
