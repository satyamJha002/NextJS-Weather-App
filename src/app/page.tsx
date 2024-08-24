"use client";

import { useQuery } from "@tanstack/react-query";
import Navbar from "./component/Navbar";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./component/Container";
import { convertKelvinToCelsius } from "./utils/convertKelvinToCelsius";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import WeatherIcon from "./component/WeatherIcon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import WeatherDetails from "./component/WeatherDetails";
import convertMetersToKilometers from "./utils/convertMetersToKilometers";
import convertSecondsToKmperHour from "./utils/convertSecondsToKmperHour";
import WeakForecast from "./component/WeakForecast";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=224380c2b19ef61207911d862bce9969&cnt=56

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

const Home = () => {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_API_KEY}&cnt=56`
      );
      return data;
    },
  });

  console.log(data);

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  console.log(uniqueDates);

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getTime();
      return entryDate === date && entryTime >= 6;
    });
  });

  console.log(firstDataForEachDate);

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">"Loading..."</p>
      </div>
    );

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        {/* Today data */}
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    {format(parseISO(firstData?.dt_txt ?? ""), "(dd.MM.yyyy)")}
                  </p>
                </h2>
                <div className="w-full bg-white border rounded-xl flex py-4 shadow-sm gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>{" "}
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="flex text-xs space-x-2">
                      <span className="flex items-center gap-1">
                        {" "}
                        {convertKelvinToCelsius(
                          firstData?.main.temp_min ?? 0
                        )}° <BiDownArrow />
                      </span>
                      <span className="flex items-center gap-1">
                        {" "}
                        {convertKelvinToCelsius(
                          firstData?.main.temp_max ?? 0
                        )}° <BiUpArrow />
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-10 sm:gap-15 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap ">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>{" "}
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {/* left */}
                <div className="bg-white border rounded-xl flex py-4 shadow-sm w-fit justify-center flex-col px-4 item-center">
                  <div className="">
                    <p className="capitalize text-center">
                      {firstData?.weather[0].description}
                    </p>

                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        firstData?.weather[0].icon ?? "",
                        firstData?.dt_txt ?? ""
                      )}
                    />
                  </div>
                </div>

                {/* /right */}
                <div className="w-full bg-white border rounded-xl flex py-4 shadow-sm bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto ">
                  <WeatherDetails
                    visability={convertMetersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={convertSecondsToKmperHour(
                      firstData?.wind.speed ?? 3.6
                    )}
                    sunrise={format(fromUnixTime(data?.city.sunrise), "H:mm")}
                    sunset={format(fromUnixTime(data?.city.sunset), "H:mm")}
                  />
                </div>
              </div>
            </section>

            {/* seven forecast data */}
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forecast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <WeakForecast
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure ?? 0}hPa`}
                  humidity={`${d?.main.humidity ?? 0}%`}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1724460515),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1724505940),
                    "H:mm"
                  )}
                  visability={`${convertMetersToKilometers(
                    d?.visibility ?? 10000
                  )}`}
                  windSpeed={`${convertSecondsToKmperHour(
                    d?.wind.speed ?? 2.02
                  )}`}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Home;
