import React from "react";
import Image from "next/image";
import { cn } from "../utils/cn";

type Props = {};

export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
  // http://openweathermap.org/img/wn/02d@4x.png
  return (
    <div {...props} className={cn("relative h-20 w-20")}>
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="relative"
        src={`http://openweathermap.org/img/wn/${props.iconName}@4x.png`}
      />
    </div>
  );
}
