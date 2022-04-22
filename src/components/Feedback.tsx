import React from "react";
import { Expr } from "./Main";

type FeedbackProps = {
  failed: Expr[];
  totalCalc: number;
};

export const Feedback = ({ failed, totalCalc }: FeedbackProps) => {
  return (
    <div>
      <p className="p-4 text-xl">
        Missed {failed.length} out of {totalCalc}
      </p>
      {failed.map((f) => (
        <p>{`${f.p1} ${f.operator} ${f.p2} != ${f.answer}, correct ${f.result}`}</p>
      ))}
    </div>
  );
};
