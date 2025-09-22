import { View, Text } from 'react-native';
import get_work from '../api/api';
import { useEffect, useState } from 'react';
import getLocation from '../utiliti/getLocation';
import RenderItemsList from '../Components/ListWork';
import { fallbackShifts } from '../api/mockData';

const Main = () => {
  const [work, setWork] = useState<any[]>([]);
  const [isLoding, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Получаем локацию и ждем завершения
        const locationData: any = await getLocation();

        // Затем получаем работу
        if (locationData?.coords?.latitude && locationData?.coords?.longitude) {
          const localWork = await get_work(
            locationData.coords.latitude.toString(),
            locationData.coords.longitude.toString(),
          );

          // Поддержка разных форматов ответа: массив или объект с коллекцией
          const items = Array.isArray(localWork)
            ? localWork
            : localWork?.shifts ?? localWork?.items ?? localWork?.data ?? [];

          const normalizedItems = Array.isArray(items) ? items : [];
          setWork(normalizedItems.length > 0 ? normalizedItems : fallbackShifts);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        // Фолбэк на мок-данные при ошибке запроса
        setWork(fallbackShifts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(work, 'work');

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {isLoding && (
        <View>
          <Text>Загрузка</Text>
        </View>
      )}
      {!isLoding && (
        <View className="w-full h-full">
          <RenderItemsList data={work} isLoading={isLoding} />
        </View>
      )}
    </View>
  );
};

export default Main;
