import React, { useState, useEffect } from "react";

function TimeAgo({ timestamp }: { timestamp: string }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const currentDate = new Date();
      const createdAtDate = new Date(timestamp);
      const difference = currentDate.getTime() - createdAtDate.getTime();
      const secondsAgo = Math.floor(difference / 1000);

      if (secondsAgo < 60) {
        setTimeAgo(`${secondsAgo} seconds ago`);
      } else {
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) {
          setTimeAgo(`${minutesAgo} minutes ago`);
        } else {
          const hoursAgo = Math.floor(minutesAgo / 60);
          if (hoursAgo < 24) {
            setTimeAgo(`${hoursAgo} hours ago`);
          } else {
            const daysAgo = Math.floor(hoursAgo / 24);
            if (daysAgo < 30) {
              setTimeAgo(`${daysAgo} days ago`);
            } else {
              const monthsAgo = Math.floor(daysAgo / 30);
              if (monthsAgo < 12) {
                setTimeAgo(`${monthsAgo} months ago`);
              } else {
                const yearsAgo = Math.floor(monthsAgo / 12);
                setTimeAgo(`${yearsAgo} years ago`);
              }
            }
          }
        }
      }
    };

    calculateTimeAgo();

    // Update time ago every minute
    const interval = setInterval(calculateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <p style={{ textAlign: "left", color: "gray" }}>Posted {timeAgo}</p>;
}

export default TimeAgo;
