"use client";

import React, { useContext, useState } from "react";
import { IoSunny } from "react-icons/io5";
import { MdOutlineMyLocation } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import Input from "./Input";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "../atom";
import { useAtom } from "jotai";
import { MyThemeContext } from "../store/store";

type props = { location?: string };

export default function Navbar({ location }: props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);

  const themeCtx: { isDarkMode?: boolean; toggleThemeHandler: () => void } =
    useContext(MyThemeContext);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?q=${value}&appid=${process.env.NEXT_PUBLIC_API_KEY}&cnt=56`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setPlace(city);
        setLoadingCity(false);
        setShowSuggestions(false);
      }, 3000);
    }
  }

  function toggleThemeHandler(): void {
    themeCtx.toggleThemeHandler();
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postition) => {
        const { latitude, longitude } = postition.coords;
        try {
          setLoadingCity(true);
          const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_API_KEY}&cnt=56`
          );

          setTimeout(() => {
            setLoadingCity(false);
            setPlace(response.data.name);
          }, 3000);
        } catch (error) {
          setLoadingCity(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto ">
          <p className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <IoSunny className="text-yellow-400 text-3xl mt-1" />
          </p>

          <section className="flex gap-2 items-center">
            <MdOutlineMyLocation
              title="Your current location"
              onClick={handleCurrentLocation}
              className="text-gray-400 hover:opacity-80 text-2xl cursor-pointer"
            />
            <MdLocationOn className="text-2xl cursor-pointer" />
            <p className="text-slate-900/80 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              {/* Search box */}
              <Input
                value={city}
                onSubmit={(e) => handleSubmitSearch(e)}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              <SuggestionBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error,
                }}
              />
            </div>
            <button
              type="button"
              className="py-1 sm:py-2.5 px-2 sm:px-5 mr-2 bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black rounded"
              onClick={toggleThemeHandler}
            >
              Toggle Theme
            </button>
          </section>
        </div>
      </nav>

      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          {/* Search box */}
          <Input
            value={city}
            onSubmit={(e) => handleSubmitSearch(e)}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <SuggestionBox
            {...{
              showSuggestions,
              suggestions,
              handleSuggestionClick,
              error,
            }}
          />
        </div>
      </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1">{error}</li>
          )}

          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded text-black hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
