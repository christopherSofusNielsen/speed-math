import React, { useState, useEffect } from "react";

enum State {
  WAITING,
  COUNT_DOWN,
  STARTED,
  DONE,
}

type Operator = "+" | "-" | "*";

type Expr = {
  p1: number;
  p2: number;
  operator: Operator;
  result: number;
};

export const Main = () => {
  const [state, setState] = useState(State.WAITING);
  const [counter, setCounter] = useState(0);
  const [calcCnt, setCalcCnt] = useState(0);
  const [value, setValue] = useState("");
  const [calc, setCalc] = useState({
    operator: "+",
    p1: 0,
    p2: 0,
    result: 0,
  } as Expr);

  const onBtnClick = () => {
    if (state === State.STARTED || state === State.COUNT_DOWN) {
      setState(State.WAITING);
    } else {
      setState(State.COUNT_DOWN);
      setCounter(3);
    }
  };

  useEffect(() => {
    if (state !== State.COUNT_DOWN) return;

    if (counter === 0) {
      initGame();
      return;
    }

    const timeout = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state, counter]);

  const initGame = () => {
    setState(State.STARTED);
    setCalcCnt(3);
    updateCalc();
  };

  const updateCalc = () => {
    setCalc(getCalculation());
  };

  const onInputKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      //Do something with the value!
      //Store result
      //Update calc
      //subtract from calcCnt
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-5xl m-10">SPEED MATH</h1>
      <div className="flex flex-col items-center p-5">
        {state === State.WAITING && (
          <p className="text-2xl pb-4 italic">Press start to get started!</p>
        )}
        {state === State.COUNT_DOWN && (
          <p className="text-xl pb-4">Be ready in {counter} s</p>
        )}

        {state === State.STARTED && (
          <p className="text-2xl underline">Expression</p>
        )}
        {state === State.STARTED && (
          <p className="text-2xl p-2 pb-4">{`${calc.p1} ${calc.operator} ${calc.p2}`}</p>
        )}
        <input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          onKeyUp={onInputKeyUp}
          type="text"
          name="result"
          placeholder="Result"
          className="block border-r-0 border-0 text-2xl text-black placeholder:italic bg-white  p-4 outline-none text-center"
        />
        <p>
          Use <strong>space</strong> or <strong>enter</strong> to confirm!
        </p>
        <div className="p-6 pt-12">
          <button
            autoFocus
            onClick={onBtnClick}
            className="bg-white p-2 w-36 text-md hover:bg-cyan-200 focus:outline-none"
          >
            {state === State.WAITING || state === State.DONE
              ? "Start"
              : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getCalculation = (): Expr => {
  const MAX_P_VAL = 10;
  const MIN_P_VAL = 0;

  const calc: Expr = {
    p1: getValue(MIN_P_VAL, MAX_P_VAL),
    p2: getValue(MIN_P_VAL, MAX_P_VAL),
    operator: getOperator(),
    result: 0,
  };

  switch (calc.operator) {
    case "+":
      calc.result = calc.p1 + calc.p2;
      break;
    case "-":
      calc.result = calc.p1 - calc.p2;
      break;
    case "*":
      calc.result = calc.p1 * calc.p2;
      break;
  }

  return calc;
};

const getValue = (min: number, max: number): number => {
  const diff = max - min;
  const value = Math.random() * diff + min;
  return Math.round(value);
};

const getOperator = (): Operator => {
  const select = Math.ceil(Math.random() * 3);

  switch (select) {
    case 1:
      return "+";
    case 2:
      return "*";
    case 3:
      return "-";
    default:
      throw new Error("Unknown operator");
  }
};
