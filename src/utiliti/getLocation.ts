import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

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
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const getLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    console.log('Permission result:', hasPermission);

    if (hasPermission) {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('Position obtained:', position);
            resolve(position);
          },
          error => {
            console.log('Geolocation error:', error.code, error.message);
            reject(error);
          },
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
