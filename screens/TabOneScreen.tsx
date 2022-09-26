import React, { useState, useEffect, useRef } from "react";

import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, View } from "../components/Themed";
import { Video } from "expo-av";

import moment from "moment";

import { GetJobs } from "../helpers/Api";
import { Loader } from "../components/Loader";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function TabOneScreen({ navigation, userinfo }: any) {
  const [isInit, setIsInit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(Boolean);
  const [showLoader, setShowLoader] = useState(Boolean);
  const [user, setUser] = useState(Object);
  const [vehicles, setVehicles] = useState(Array);
  const [data, setData] = useState(Array);
  const colors = ["#007bff", "#ffc107", "#dc3545", "#fd7e14"];
  const types = ["New Installation", "Checking", "Uninstallation", "Transfer"];

  const [cameras, setCameras] = useState([]);
  const [videos, setVideos] = useState([]);

  let videoWidth = Dimensions.get("window").width - 20;
  let videoHeight = videoWidth / 1.5;

  const [date, setDate] = useState(new Date());
  let dt = new Date();

  const [showDate, setshowDate] = useState(false);
  const intID = useRef<any>({});
  //const intID = useRef(0);

  useEffect(() => {
    if (userinfo.id != undefined) {
      setVehicles([]);
      setShowLoader(true);
      setIsLoaded(false);

      fetchJobs();
      intID.current = setInterval(() => {
        setShowLoader(true);
        fetchJobs();
      }, 10000);
    }
  }, [userinfo]);

  function fetchJobs() {
    GetJobs({
      _data: {
        user_id: userinfo.id,
        date: moment(dt).format("YYYY-MM-DD"),
      },
    }).then((jobs) => {
      if (jobs.status == 1) {
        setVehicles(jobs.data);
      }
      loadVehicles();
    });
  }

  function loadVehicles() {
    setIsLoaded(true);
    setShowLoader(false);
  }

  function renderJobItem({ item }: any) {
    return (
      <TouchableOpacity
        style={[
          styles.cardWrap,
          {
            backgroundColor: "#ecf5fe",
            borderLeftWidth: 6,
            borderColor: item.status == 0 ? "#007bff" : "#28a745",
          },
        ]}
        onPress={() => {
          navigation.navigate("NotFound", { item });
        }}
      >
        <View
          style={{
            alignItems: "center",
            marginRight: 15,
            backgroundColor: "#ecf5fe",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: "#674172",
              backgroundColor: "#ecf5fe",
            }}
          >
            JOB ID
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#674172",
              backgroundColor: "#ecf5fe",
            }}
          >
            #{item.id}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#ecf5fe" }}>
          <Text style={styles.name}>Company: {item.company_name}</Text>
          <Text style={styles.detail}>{types[item.type]}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#ecf5fe",
            }}
          >
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={"clock-outline"}
                style={[styles.icon, { backgroundColor: "#ecf5fe" }]}
              />
              <Text style={[styles.iconText, { backgroundColor: "#ecf5fe" }]}>
                {moment(item.schedule_date).format("MMM D, YYYY hh:mm A")} -{" "}
                {moment(item.schedule_date)
                  .add(item.schedule_duration, "hour")
                  .format("hh:mm A")}
              </Text>
            </View>
          </View>
          <Text style={styles.detail}>
            Address: {item.address ? item.address : "No Address"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const hideDatePicker = () => {
    setshowDate(false);
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    setDate(new Date(date));
    dt = new Date(date);

    clearInterval(intID.current);
    setShowLoader(true);
    fetchJobs();

    intID.current = setInterval(() => {
      setShowLoader(true);
      fetchJobs();
    }, 10000);
  };

  function toggleDate() {
    setshowDate(!showDate);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          backgroundColor: "#007bff",
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
          }}
        >
          JOBS
        </Text>

        <TouchableOpacity style={{ position: "absolute", right: 20 }}>
          <MaterialCommunityIcons
            name={"calendar"}
            style={{ fontSize: 22, color: "#fff" }}
            onPress={toggleDate}
          />
        </TouchableOpacity>
      </View>
      {!isLoaded ? (
        <View
          style={{
            flex: 1,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={"format-list-text"}
            style={{ color: "#ffc107", fontSize: 32 }}
          />
          <Text style={{ color: "#674172", fontSize: 18, marginLeft: 10 }}>
            Loading Job(s)
          </Text>
        </View>
      ) : vehicles != undefined && vehicles.length > 0 ? (
        <FlatList
          style={{ width: "100%", padding: 10 }}
          contentContainerStyle={{ paddingBottom: 5 }}
          data={vehicles}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderJobItem}
        />
      ) : (
        <View
          style={{
            flex: 1,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={"car"}
            style={{ color: "#ffc107", fontSize: 32 }}
          />
          <Text style={{ color: "#674172", fontSize: 18, marginLeft: 10 }}>
            No Jobs
          </Text>
        </View>
      )}

      {showLoader ? <Loader /> : null}

      {showDate ? (
        <DateTimePickerModal
          isVisible={showDate}
          mode="date"
          cancelTextIOS="Cancel"
          confirmTextIOS="Confirm"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  cardWrap: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    width: "100%",
    borderRadius: 3,
    marginBottom: 10,
    backgroundColor: "#ecf5fe",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#674172",
    marginBottom: 5,
  },
  iconWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 5,
  },
  icon: {
    fontSize: 14,
    color: "#674172",
    marginRight: 3,
  },
  iconText: {
    fontSize: 12,
    color: "#674172",
  },
  detail: {
    fontSize: 12,
    color: "#674172",
  },
  cardDate: {
    fontSize: 14,
    color: "#947cb0",
    fontWeight: "700",
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 16,
    color: "#674172",
    fontWeight: "700",
  },
  completed: {
    backgroundColor: "#28a74520",
  },
});
