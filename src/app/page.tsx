"use client";
import React, { useState } from "react";
import Input from "./component/Input";
import Current from "./component/Current";
import WeakForecast from "./component/WeakForecast";
import WeatherDetails from "./component/WeatherDetails";

const Home = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [err, setErr] = useState("");

  const url = `https://api.weatherapi.com/v1/forecast.json?key=d0400663cf4945c18c1200720240106&q=${location}&days=10&aqi=yes&alerts=yes
  `;

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
          throw new Error("Something problem in fetching");
        }

        const data = await response.json();
        setData(data);
        setLocation("");
        setErr("");
      } catch (error) {
        setErr("City not found");
        setData({});
      }
    }
  };

  let content;
  if (Object.keys(data).length === 0 && err === "") {
    content = (
      <div className="text-white text-center h-screen mt-[5rem]">
        <h2 className="text-3xl font-semibold mb-4">
          Welcome to the weather app
        </h2>
        <p className="text-xl">Enter a city name to get the weather forecast</p>
      </div>
    );
  } else if (err !== "") {
    content = (
      <div className="text-white text-center h-screen mt-[5rem]">
        <h2 className="text-3xl font-semibold mb-4">City not found</h2>
        <p className="text-xl">Enter the valid city</p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 ">
          <Current data={data} />
          <WeakForecast data={data} />
        </div>
        <div className="mt-[-10px]">
          <WeatherDetails data={data} />
        </div>
      </>
    );
  }

  return (
    <div className="bg-cover bg-gradient-to-r from-blue-500 to-blue-300 h-screen overflow-auto">
      <div className=" flex flex-col h-screen">
        {/* INPUT and LOGO */}
        <div className="flex flex-col md:flex-row justify-between items-center p-12">
          <Input handleSearch={handleSearch} setLocation={setLocation} />
          <h1 className="mb-8 md:mb-0 order-1 text-white py-2 px-4 rounded-xl italic font-bold">
            Weather App.
          </h1>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Home;
