import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";

//export const endpoint = "http://13.250.121.147/api/"; //Live Server
export const endpoint = "http://192.168.1.73/cms_may/api/"; //TESTING

export const LoginApi = async ({ _data }: any) => {
  return fetch(endpoint + "login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_data),
  }).then((response) => response.json());
};

export const GetJobs = async ({ _data }: any) => {
  return fetch(endpoint + "get_jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_data),
  })
    .then((response) => response.json())
    .catch((e) => []);
};

export const GetComms = async ({ _data }: any) => {
  return fetch(endpoint + "get_commissions/" + _data.user_id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const completeJobStatusApi = async ({ _data }: any) => {
  return fetch(endpoint + "complete_job_status", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_data),
  }).then((response) => response.json());
};
