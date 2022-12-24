import React, { useState } from "react";
import { add, format, startOfToday, subDays } from "date-fns";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { scaleTime } from "d3-scale";
import {
  SliderRail,
  Handle,
  Track,
  Tick,
} from "../SliderComponents/SliderComponents";
import { ACTIONS } from "../../App";
import { addHours } from "date-fns/esm";

const sliderStyle = {
  position: "relative",
  width: "100%",
};

// console.log(ACTIONS)

function formatTick(ms) {
  return format(new Date(ms), "hh:mma");
}

export function TimeSlider({ dispatch }) {
  const today = startOfToday();
  const oneDayAgo = subDays(today, 1);
  const quarterHour = 1000 * 60 * 15;
  const defaultValues = [oneDayAgo, today];
	const deneme = addHours(oneDayAgo,2)
  const dateTicks = scaleTime()
    .domain([oneDayAgo, today])
    .ticks(8)
    .map((d) => +d);

  const [selected, setSelected] = useState(defaultValues);
  const [updated, setUpdated] = useState(defaultValues);

  return (
    <>
      <div style={{ letterSpacing: "1.4px" }}>
        <div>
          Selected1 :{formatTick(selected[0])} ===|=== selected2:{" "}
          {formatTick(selected[1])}
        </div>
		  <br />
        <div>
          Updated1 :{formatTick(updated[0])} ===|=== updated2:{" "}
          {formatTick(updated[1])}
        </div>
      </div>

      <br />
      <br />

      <Slider
        rootStyle={sliderStyle}
        domain={[+oneDayAgo, +today]}
        step={quarterHour}
        onChange={(vals) => setSelected(vals)}
        onUpdate={(vals) => setUpdated(vals)}
        mode={3}
        values={[+deneme, +today]}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  getHandleProps={getHandleProps}
                  domain={[oneDayAgo, today]}
                  format={formatTick}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks right={false} left={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
        <Ticks values={dateTicks}>
          {({ ticks }) => (
            <div>
              {ticks.map((tick) => {
                return (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    format={formatTick}
                  />
                );
              })}
            </div>
          )}
        </Ticks>
      </Slider>
      <br />
      <br />
      <br />
      <button
        onClick={() =>
          dispatch({
            type: ACTIONS.TIME,
            payload: `${formatTick(selected[0])} - ${formatTick(selected[1])}`,
          })
        }
      >
        Create New Preshift
      </button>
    </>
  );
}
