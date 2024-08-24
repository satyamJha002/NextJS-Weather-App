import React from "react";
import { BsEye } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { ImMeter } from "react-icons/im";
import { WiSunrise } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}
export default function WeatherDetails({
  windSpeed = "7 km/h",
  visability = "25km",
  humidity = "61%",
  airPressure = "1012 hPa",
  sunrise = "6.20",
  sunset = "18.48",
}: WeatherDetailProps) {
  return (
    <>
      <SingleWeatherDetail
        icon={<BsEye />}
        information="Visablity"
        value={visability}
      />
      <SingleWeatherDetail
        icon={<WiHumidity />}
        information="Humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<FaWind />}
        information="WindSpeed"
        value={windSpeed}
      />
      <SingleWeatherDetail
        icon={<ImMeter />}
        information="Air pressure"
        value={airPressure}
      />
      <SingleWeatherDetail
        icon={<WiSunrise />}
        information="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<WiSunset />}
        information="Sunset"
        value={sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
