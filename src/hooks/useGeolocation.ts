import { useEffect, useState } from "react";

type LocationData = {
  loaded: boolean;
  coordinates?: { latitude: number; longitude: number };
  error?: { code: number; message: string };
};

export const GeolocationPositionErrorCodes = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData>({
    loaded: false,
  });

  const onSuccess: PositionCallback = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  const onError: PositionErrorCallback = (error) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return onError({
        code: 0,
        message: "Geolocation not suported",
        ...GeolocationPositionErrorCodes,
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};
