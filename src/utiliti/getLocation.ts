import { PermissionsAndroid } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';

export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number | null;
  heading?: number;
  speed?: number;
};

export type LocationResponse = {
  timestamp: number;
  mocked?: boolean;
  provider?: string;
  coords: Coordinates;
};

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const getLocation = async (): Promise<LocationResponse> => {
  try {
    const hasPermission = await requestLocationPermission();

    if (hasPermission) {
      return new Promise<LocationResponse>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: GeoPosition) => {
            const { coords, timestamp, mocked } = position as any;
            resolve({
              timestamp,
              mocked,
              coords: {
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy,
                altitude: coords.altitude,
                altitudeAccuracy: (coords as any).altitudeAccuracy ?? null,
                heading: coords.heading,
                speed: coords.speed,
              },
            });
          },
          (error: GeoError) => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      });
    } else {
      throw new Error('Location permission denied');
    }
  } catch (error) {
    console.error('Error in getLocation:', error);
    throw error;
  }
};

export default getLocation;
