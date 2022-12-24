import { useReducer, useState } from "react";
import "./App.css";
import { TimeSlider } from "./Components/TimeSlider/TimeSlider";

export const ACTIONS = {
  ADD: "add",
  SHIFT: "person",
  CREATE: "create",
  TIME: "time",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.SHIFT:
      return {
        ...state,
        employees: {
          ...state.employees,
          [payload.person]: {
            ...state.employees[payload.person],
            [payload.day]: payload.shift,
          },
        },
      };
    case ACTIONS.CREATE:
      if (payload === (null || "")) return state;
      if (Object.keys(state.employees).includes(payload)) return state;
      return {
        ...state,
        employees: {
          ...state.employees,
          [payload]: { Monday: "", Tuesday: "", Wednesday: "" },
        },
      };
    case ACTIONS.TIME:
      if (state.preShifts.includes(payload)) {
        return state;
      }
      return {
        ...state,
        preShifts: [...state.preShifts, payload],
      };
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, {
    count: 1,
    employees: {
      ali: {
        Monday: "08:00AM - 04:00PM",
        Tuesday: "08:00AM - 04:00PM",
        Wednesday: "OFF",
      },
      jonathan: {
        Monday: "09:00AM - 03:00PM",
        Tuesday: "OFF",
        Wednesday: "08:00AM - 05:00PM",
      },
    },
    preShifts: ["8:00AM - 11:00PM", "11:00AM - 9:00PM", "OFF", "N/A"],
  });

  const [employee, setEmployee] = useState(""); // employee name for create new person
  const [shift, setShift] = useState(""); // editin shift manually for edit part
  const [preTime, setPreTime] = useState(""); // creating new pre-time
  const [field, setField] = useState(""); // kind a Id for edit part

  const handleAdjust = (value, shift) => {
    if (value === field) {
      setField("");
    } else {
      setField(value);
      setShift(shift);
    }
  };

  const handleChangeForAdjust = (name, day) => (e) => {
    if (e.key === "Enter") {
      let regex = new RegExp(
        /(([Nn][/][Aa])|([Oo][Ff][Ff])|((1[0-2]|0[1-9]):([0-5][0-9]) ?([AaPp][Mm])(\s)-(\s)(1[0-2]|0[1-9]):([0-5][0-9]) ?([AaPp][Mm])))/
      );
      if (shift.trim() == "") {
        dispatch({
          type: ACTIONS.SHIFT,
          payload: { person: name, shift: "", day: day },
        });
        setField("");
      } else if (regex.test(shift) == true) {
        dispatch({
          type: ACTIONS.SHIFT,
          payload: { person: name, shift: shift, day: day },
        });
        setField("");
      }
    } else if (e.key === "Escape") {
      setField("");
    }
  };

  return (
    <div className="App">
      <table className="schedule">
        <thead>
          <tr>
            <th></th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
          </tr>
        </thead>
        {/* Mapping the table for each employee */}
        <tbody>
          {Object.keys(state.employees).map((personName) => {
            const employee = state.employees[personName];
            return (
              <tr>
                <td>
                  <p>{personName.toUpperCase()}</p>
                </td>
                {Object.keys(employee).map((weekDay) => (
                  <td className="timeWrapper">
                    {employee[weekDay] ? (
                      <>
                        {/* field for editing , kinda like Id */}
                        {field === `${personName}${weekDay}` ? (
                          /*  <>
                            <input
									 format="HH:mm a"
                              value={shift.slice(0, 5)}
                              onChange={(e) =>
                                setEditTime([e.target.value, editTime.slice(1)])
                              }
                              type="time"
                            />
                            <input
                              value={shift.slice(11, 16)}
                              onChange={(e) =>
                                setEditTime([editTime.shift(), e.target.value])
                              }
                              type="time"
                            />
                          </> */
                          <input
                            className="shift-adjust"
                            type="text"
                            placeholder={shift}
                            value={shift}
                            onChange={(e) => setShift(e.target.value)}
                            onKeyDown={handleChangeForAdjust(
                              personName,
                              weekDay
                            )}
                          />
                        ) : (
                          /*   */
                          <>{employee[weekDay].toUpperCase()}</>
                        )}
                        {/* edit button */}
                        <button
                          onClick={() =>
                            handleAdjust(
                              `${personName}${weekDay}`,
                              employee[weekDay]
                            )
                          }
                          className="adjust"
                        >
                          x
                        </button>
                      </>
                    ) : (
                      //  if there is no schedule , button for pre-shifts
                      <button
                        onClick={() => {
                          dispatch({
                            type: ACTIONS.SHIFT,
                            payload: {
                              person: personName,
                              shift: preTime,
                              day: weekDay,
                            },
                          });
                        }}
                      >
                        Apply
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* TIME FOR PRE - SHIFTS BUTTON */}
      <div className="preTime">
        {state.preShifts.map((item) => (
          <button
            style={{ backgroundColor: preTime === item && "turquoise" }}
            className="preTime-button"
            onClick={() => setPreTime(item)}
          >
            {item}
          </button>
        ))}

        <button className="preTime-button" onClick={() => setPreTime("")}>
          CLEAR
        </button>
      </div>

      <div>
        <TimeSlider dispatch={dispatch} />
        <br />
        <br />
      </div>

      <div>
        <input
          className="inputStyle"
          type="text"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        />
        <button
          onClick={() =>
            dispatch({
              type: ACTIONS.CREATE,
              payload: employee.trimStart(),
            })
          }
          className="btn"
        >
          {" "}
          Add new Employee
        </button>
      </div>
    </div>
  );
}

export default App;
