// filepath: /C:/Development/BISOL/frontend/src/screens/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from "react";
import MainChart from "./components/MainChart/MainChart";
import useData from "./hooks/useData/useData";
import { useAtomValue } from "jotai";
import { usernameAtom } from "../../features/auth/atoms/auth.atoms";
import IntervalSelector from "./components/IntervalSelector/IntervalSelector";
import useScreenSize from "../../hooks/useScreenSize/useScreenSize";
import { addDays } from "date-fns";

const Dashboard: React.FC = () => {
  const isMobile = useScreenSize();
  const [shownDays, setShownDays] = useState(isMobile ? 1 : 7);
  const [startDate, setStartDate] = useState("2024-01-01T00:00:00Z");
  const [endDate, setEndDate] = useState(
    addDays(startDate, shownDays).toISOString()
  );
  const { isLoading, data } = useData({
    from_timestamp: startDate,
    to_timestamp: endDate,
  });

  const username = useAtomValue(usernameAtom);

  useEffect(() => {
    const newShownDays = isMobile ? 1 : 7;
    setShownDays(newShownDays);
    setEndDate(addDays(startDate, newShownDays).toISOString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="flex-grow-1 d-flex flex-column justify-content-center py-4">
      <h1>Pozdravljen, {username}</h1>
      <IntervalSelector
        start={startDate}
        end={endDate}
        onIntervalSelect={handleDateChange}
        shownDays={shownDays}
      />
      <div className="mt-5">
        {isLoading ? (
          <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ height: "600px" }}
          >
            <span
              className="spinner-border m-auto"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        ) : !data ? (
          <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ height: "600px" }}
          >
            <p>Ni podatkov</p>
          </div>
        ) : (
          <MainChart
            data={data}
            options={{
              price: true,
              cons: true,
              prod: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
