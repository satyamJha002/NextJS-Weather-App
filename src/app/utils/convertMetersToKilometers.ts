import * as React from "react";

export default function convertMetersToKilometers(
  visibilityInMeters: number
): string {
  const visibilityInKilometers = visibilityInMeters / 1000;
  return `${visibilityInKilometers.toFixed(0)}km`;
}
