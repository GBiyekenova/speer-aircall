import React, { useEffect, useState } from "react";
import axios from "axios";

import Footer from "./Footer.jsx";

const baseURL =
  "https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/";

const ActivityFeed = () => {
  const [calls, setCalls] = useState(null);
  const [showCallDetails, setShowCallDetails] = useState(null);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(`${baseURL}activities`).then((response) => {
      setCalls(response.data);
      setIsArchived(response.data.id_archived);
    });
  };

  const getCallDetails = (callId) => {
    axios.get(`${baseURL}activities/${callId}`).then((response) => {
      console.log(response.data);
      if (showCallDetails === null) setShowCallDetails(response.data.id);

      if (showCallDetails !== null) setShowCallDetails(null);
    });
  };

  const archiveCall = (callId) => {
    axios.patch(`${baseURL}activities/${callId}`, { is_archived: true });
    setIsArchived(callId);
  };

  if (!calls) return null;
  console.log(calls);
  console.log("showCallDetails " + showCallDetails);
  console.log("isArchived " + isArchived);

  return (
    <div className="background">
      <div className="call">Archive all calls</div>
      {calls
        .filter((call) => call.is_archived === false)
        .map((call) => (
          <div
            key={call.id}
            className="call"
            onClick={() => {
              getCallDetails(call.id);
            }}
          >
            <div>{call.direction}</div>
            {call.from ? <h3>{call.from}</h3> : <h3>Unknown</h3>}
            {call.to ? (
              <h3>tried to call on {call.to}</h3>
            ) : (
              <h3> tried to call on Unknown</h3>
            )}
            {showCallDetails === call.id && (
              <div>{call.duration === 0 ? null : call.duration}</div>
            )}
            {showCallDetails === call.id && <div>{call.call_type}</div>}
            {showCallDetails === call.id && (
              <button
                onClick={() => {
                  archiveCall(call.id);
                }}
              >
                Archive
              </button>
            )}
            <div>{call.created_at}</div>
          </div>
        ))}
        {/* <Footer /> */}
    </div>
  );
};

export default ActivityFeed;
