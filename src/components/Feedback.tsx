import React from "react";
import { Expr } from "./Main";

type FeedbackProps = {
  failed: Expr[];
  totalCalc: number;
  timeS: number;
};

export const Feedback = ({ failed, totalCalc, timeS }: FeedbackProps) => {
  return (
    <div>
      <p className="pt-4 text-xl">
        Missed {failed.length} out of {totalCalc}
      </p>
      <p className="pb-4 text-xl text-center ">Total time {timeS}</p>
      {failed.map((f, index) => (
        <p
          className="text-center"
          key={index}
        >{`${f.p1} ${f.operator} ${f.p2} != ${f.answer}, correct ${f.result}`}</p>
      ))}
    </div>
  );
};
