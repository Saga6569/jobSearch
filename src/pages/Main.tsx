import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import RenderItemsList from '../Components/ListWork';
import { useNavigation } from '@react-navigation/native';
import { shiftsStore } from '../store/shiftsStore';

const Main = () => {
  const navigation = useNavigation<any>();
  const [isLoding, setIsLoading] = useState(false);
  const [work, setWork] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      await shiftsStore.loadForCurrentLocation();
      setWork(shiftsStore.items);
      setIsLoading(false);
    };
    run();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {isLoding && (
        <View className="flex-1 items-center justify-center">
          <Text>Загрузка</Text>
        </View>
      )}
      {!isLoding && (
        <View className="w-full h-full">
          <RenderItemsList
            data={work}
            isLoading={isLoding}
            onPressItem={(item: any) => {
              const index = shiftsStore.items.findIndex((it) => it.id === item?.id);
              if (index >= 0) {
                shiftsStore.selectByIndex(index);
              }
              navigation.navigate('Detail', { item });
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Main;
