import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { GeneralContext } from "./App.jsx";

import { Grid, CircularProgress } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";

import { months } from "./assets/months.js";
import { baseURL } from "./App.jsx";

const ActivityFeed = () => {
  const [calls, setCalls] = useState(null);
  const [callDetailsId, setCallDetailsId] = useState(null);
  const [isArchived, setIsArchived] = useState(null);
  const [formattedCalls, setFormattedCalls] = useState({});
  const [callExpanded, setCallExpanded] = useState(false);
  const { callType, setCallType, callCount, setCallCount } =
    useContext(GeneralContext);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    calls && callType && formatData();
  }, [calls, callType]);

  const formatData = () => {
    if (calls) {
      const formatted = calls
        .filter(
          (call) =>
            (callType[0] === "inbound" &&
              call.direction === callType[0] &&
              call.is_archived === callType[1]) ||
            (callType[0] !== "inbound" && call.is_archived === callType[1])
        )
        .reduce((acc, val) => {
          const date = new Date(val.created_at);
          const callDate = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          const callDateFormatted = `${
            months[date.getMonth() + 1]
          }, ${date.getDate()} ${date.getFullYear()}`;
          const updatedCall = {};
          updatedCall.call = val;
          updatedCall.callDateFormatted = callDateFormatted;
          if (acc[callDate]) {
            acc[callDate] = [...acc[callDate], updatedCall];
          } else {
            acc[callDate] = [updatedCall];
          }
          return acc;
        }, {});
      setFormattedCalls(formatted);
      const count = Object.values(formatted).reduce((acc, val) => {
        acc = acc + val.length;
        return acc;
      }, 0);
      setCallCount(count);
    }
  };

  const formatDate = (dateStamp) => {
    const date = new Date(dateStamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  const getData = () => {
    axios
      .get(`${baseURL}activities`)
      .then((response) => {
        setCalls(response.data);
        setIsArchived(response.data.is_archived);
      })
      .catch((err) => console.log(err));
  };

  const getCallDetails = (callId) => {
    axios
      .get(`${baseURL}activities/${callId}`)
      .then((response) => {
        if (callDetailsId === null) {
          setCallDetailsId(response.data.id);
          setCallExpanded(true);
        }

        if (callDetailsId !== null) {
          setCallDetailsId(null);
          setCallExpanded(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const archiveUnarchiveCall = (callId, status) => {
    if (status === "Archive") {
      axios
        .patch(`${baseURL}activities/${callId}`, { is_archived: true })
        .then(() => {
          const updatedCalls = calls.map((c) => {
            if (c.id == callId) c.is_archived = true;
            return c;
          });
          setCalls(updatedCalls);
          setIsArchived(true);
        })
        .catch((err) => console.log(err));
    } else if (status === "Unarchive") {
      axios
        .patch(`${baseURL}activities/${callId}`, { is_archived: false })
        .then(() => {
          const updatedCalls = calls.map((c) => {
            if (c.id == callId) c.is_archived = false;
            return c;
          });
          setCalls(updatedCalls);
          setIsArchived(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const archiveUnarchiveAllCalls = (callType) => {
    if (callType !== "archived") {
      for (let call of calls) {
        axios
          .patch(`${baseURL}activities/${call.id}`, { is_archived: true })
          .then(() => {
            const updatedCalls = calls.map((c) => {
              if (c.id == call.id) c.is_archived = true;
              return c;
            });
            setCalls(updatedCalls);
          })
          .catch((err) => console.log(err));
      }
    } else {
      axios
        .patch(`${baseURL}reset`, { is_archived: false })
        .then(() => {
          const updatedCalls = calls.map((c) => {
            c.is_archived = false;
            return c;
          });
          setCalls(updatedCalls);
          setIsArchived(false);
        })
        .catch((err) => console.log(err));
    }
  };

  if (!calls)
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%"}}
      >
        <CircularProgress />
      </Grid>
    );
  return (
    <div className="background">
      <div
        onClick={() => {
          archiveUnarchiveAllCalls(callType[0]);
        }}
        id="align-btn"
        className="call bold"
      >
        <Inventory2OutlinedIcon
          id="archive-icon"
          className="icon-size archive-icon"
        />
        {callType[0] !== "archived"
          ? "Archive all calls"
          : "Unarchive all calls"}
      </div>
      {Object.keys(formattedCalls).map((date) => {
        let counter = 1;
        return (
          <div key={date}>
            <span className="grey bold" id="date-margin">
              <hr className="dotted-line" />
              {formattedCalls[date][0].callDateFormatted}
              <hr className="dotted-line" />
            </span>
            {formattedCalls[date].map((el, index, array) => {
              const { call } = el;
              if (counter > 1) {
                counter--;
                return;
              }
              while (array[index + counter]) {
                if (
                  array[index + counter].call.direction === call.direction &&
                  array[index + counter].call.from === call.from &&
                  array[index + counter].call.to === call.to
                ) {
                  counter++;
                } else {
                  break;
                }
              }

              return (
                <div
                  key={call.id}
                  className={
                    (callDetailsId === call.id ? "expanded" : "") + " call"
                  }
                  onClick={() => {
                    getCallDetails(call.id);
                  }}
                >
                  <div className="inline">
                    <div>
                      {call.direction === "inbound" ? (
                        <PhoneCallbackIcon className="icon-size" />
                      ) : (
                        <PhoneForwardedIcon className="icon-size" />
                      )}
                    </div>
                    <div style={{ width: "150px" }}>
                      <div className="width-30">
                        {" "}
                        <h3 className="bold">
                          {call.from ? call.from : "Unknown"}
                        </h3>
                        {counter > 1 && <p className="counter">{counter}</p>}
                      </div>
                      <h3 className="grey">
                        tried to call on{" "}
                        <span className="bold">
                          {" "}
                          {call.to ? call.to : "Unknown"}
                        </span>
                      </h3>
                    </div>

                    <span className="elipsis">⋮</span>

                    <div className="grey">{formatDate(call.created_at)}</div>
                  </div>
                  <div className="expanded">
                    <div id="expanded">
                      <div className="padding">
                        <div id="r-margin-23" className="grey ">
                          {callDetailsId === call.id && call.call_type}
                        </div>
                        <div className="grey">
                          {callDetailsId === call.id &&
                            (call.duration === 0
                              ? null
                              : `${call.duration} seconds`)}
                        </div>
                      </div>

                      {callDetailsId === call.id && (
                        <button
                          id="archive-btn"
                          onClick={() => {
                            archiveUnarchiveCall(
                              call.id,
                              call.is_archived ? "Unarchive" : "Archive"
                            );
                          }}
                        >
                          {call.is_archived ? "Unarchive" : "Archive"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
