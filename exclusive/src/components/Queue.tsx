import React, { FunctionComponent, useEffect, useState } from "react";
import { Progress } from "react95";

interface Props {
  position: number;
}

export const Queue: FunctionComponent<Props> = ({ position }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        const diff = 5;
        return Math.min(previousPercent + diff, 100);
      });
    }, 500);
    return () => {
      setPercent(0);
      clearInterval(timer);
    };
  }, [position]);

  return (
    <div>
      <p>
        Server busy! People in front of you: {position}. Estimated Wait:
        <span> {position * 10}</span> seconds
      </p>
      <Progress variant="tile" value={Math.floor(percent)} />
    </div>
  );
};
