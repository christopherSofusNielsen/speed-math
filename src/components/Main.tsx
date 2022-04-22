import React, { useState, useEffect, useCallback, useRef } from "react";
import { Feedback } from "./Feedback";

enum State {
  WAITING,
  COUNT_DOWN,
  STARTED,
  DONE,
}

type Operator = "+" | "-" | "*";

export type Expr = {
  p1: number;
  p2: number;
  operator: Operator;
  result: number;
  answer?: number;
};

const MAX_CALC = 10;

export const Main = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const buttonEl = useRef<HTMLButtonElement>(null);
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
  const [failed, setFailed] = useState([] as Expr[]);
  const [timeStarted, setTimeStarted] = useState(0);
  const [timeEnd, setTimeEnd] = useState(0);

  const onBtnClick = () => {
    if (state === State.STARTED || state === State.COUNT_DOWN) {
      setState(State.WAITING);
    } else {
      setState(State.COUNT_DOWN);
      inputEl.current && inputEl.current.focus();
      setCounter(3);
    }
  };

  const initGame = useCallback(() => {
    inputEl.current && inputEl.current.focus();
    setState(State.STARTED);
    setCalcCnt(MAX_CALC);
    updateCalc();
    setValue("");
    setTimeStarted(new Date().getTime());
    setFailed([]);
  }, []);

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
  }, [state, counter, initGame]);

  const updateCalc = () => {
    setCalc(getCalculation());
    setValue("");
  };

  const onInputKeyUp = (e: React.KeyboardEvent) => {
    if (state !== State.STARTED) return;
    if (e.key === "Enter" || e.key === " ") {
      const parsedVal = parseInt(value);
      if (isNaN(parsedVal) || parsedVal !== calc.result) {
        //Store result
        calc.answer = parsedVal;
        setFailed((a) => [...a, calc]);
      }

      if (calcCnt === 1) {
        setState(State.DONE);
        setValue("");
        setTimeEnd(new Date().getTime());
        buttonEl.current && buttonEl.current.focus();
      } else {
        updateCalc();

        //subtract from calcCnt
        setCalcCnt((c) => c - 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-gray-50">
      <h1 className="m-10 text-5xl">SPEED MATH</h1>
      <div className="flex flex-col items-center p-5">
        {state === State.WAITING && (
          <p className="pb-4 text-2xl italic">Press start to get started!</p>
        )}
        {state === State.COUNT_DOWN && (
          <p className="pb-4 text-xl">Be ready in {counter} s</p>
        )}

        {state === State.STARTED && (
          <p className="text-2xl underline">Expression</p>
        )}
        {state === State.STARTED && (
          <p className="p-2 pb-4 text-2xl">{`${calc.p1} ${calc.operator} ${calc.p2}`}</p>
        )}
        <input
          ref={inputEl}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          onKeyUp={onInputKeyUp}
          type="text"
          name="result"
          placeholder="Result"
          className="block p-4 text-2xl text-center text-black bg-white border-0 border-r-0 outline-none placeholder:italic"
        />
        <p>
          Use <strong>space</strong> or <strong>enter</strong> to confirm!
        </p>
        <div className="p-6 pt-12">
          <button
            autoFocus
            ref={buttonEl}
            onClick={onBtnClick}
            className="p-2 bg-white w-36 text-md hover:bg-cyan-200 focus:outline-none"
          >
            {state === State.WAITING || state === State.DONE
              ? "Start"
              : "Reset"}
          </button>
        </div>
        {state === State.DONE && (
          <Feedback
            failed={failed}
            totalCalc={MAX_CALC}
            timeS={(timeEnd - timeStarted) / 1000}
          />
        )}
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
