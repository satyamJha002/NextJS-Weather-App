import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "../utils/convertKelvinToCelsius";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

export interface ForeCastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

const WeakForecast = (props: ForeCastWeatherDetailProps) => {
  const {
    weatherIcon = "02d",
    date = "19.09",
    day = "Saturday",
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
  } = props;
  return (
    <div className="w-full bg-white border rounded-xl flex py-4 shadow-sm">
      <section className="flex gap-4 item-center px-4">
        <div className="flex flex-col gap-1 items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>
        <div className="flex flex-col px-4 items-center">
          <span className="text-5xl">{convertKelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs whitespace-nowrap space-x-1">
            <span>Feels like</span>
            <span>{convertKelvinToCelsius(feels_like ?? 0)}°</span>
            <div className="flex gap-2">
              <span className="flex">
                {convertKelvinToCelsius(temp_min ?? 0)}° <BiDownArrow />
              </span>
              <span className="flex">
                {convertKelvinToCelsius(temp_max ?? 0)}° <BiUpArrow />
              </span>
            </div>
          </p>
          <p className="capitalize text-center">{description}</p>
        </div>
      </section>

      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails {...props} />
      </section>
    </div>
  );
};

export default WeakForecast;
