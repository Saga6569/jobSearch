import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import getLocation from '../utiliti/getLocation';

const Main = () => {
  const [location, setLocation] = useState({});

  useEffect(() => {
    getLocation(setLocation);
  }, []);

  console.log(location, 'location');

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>{`Location latitude: ${location?.coords?.latitude}`}</Text>
      <Text>{`Location longitude: ${location?.coords?.longitude}`}</Text>
    </View>
  );
};

export default Main;
