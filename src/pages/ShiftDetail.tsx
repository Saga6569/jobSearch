import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { shiftsStore } from '../store/shiftsStore';

type WorkType = {
  id: number | string;
  name: string;
  nameGt5?: string;
  nameLt5?: string;
  nameOne?: string;
};

type ShiftItem = {
  id?: string | number;
  logo?: string;
  address?: string;
  companyName?: string;
  dateStartByCity?: string;
  timeStartByCity?: string;
  timeEndByCity?: string;
  currentWorkers?: number;
  planWorkers?: number;
  workTypes?: WorkType[] | string[] | string;
  priceWorker?: number;
  customerFeedbacksCount?: number | string;
  customerRating?: number;
};

const ShiftDetail = observer(() => {
  const route = useRoute<any>();
  const routeItem: ShiftItem = route.params?.item ?? {};
  const item: ShiftItem = shiftsStore.current ?? routeItem;

  const workTypesText = Array.isArray(item.workTypes)
    ? (typeof item.workTypes[0] === 'object'
        ? (item.workTypes as WorkType[]).map(w => w.name).filter(Boolean)
        : (item.workTypes as string[])
      ).join(', ')
    : (item.workTypes as string | undefined);

  const progress = (() => {
    const current =
      typeof item.currentWorkers === 'number' ? item.currentWorkers : 0;
    const plan =
      typeof item.planWorkers === 'number' && item.planWorkers > 0
        ? item.planWorkers
        : 0;
    if (!plan) return 0;
    return Math.min(100, Math.round((current / plan) * 100));
  })();

  const currentIndex =
    shiftsStore.selectedIndex >= 0
      ? shiftsStore.selectedIndex
      : shiftsStore.items.findIndex((it) => it.id === item.id);
  const isFirst = currentIndex <= 0;
  const isLast =
    shiftsStore.items.length > 0 && currentIndex >= shiftsStore.items.length - 1;

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center">
          {item.logo ? (
            <Image
              source={{ uri: item.logo }}
              className="w-32 h-32 rounded-2xl"
            />
          ) : (
            <View className="w-32 h-32 rounded-2xl bg-gray-200 items-center justify-center">
              <Text className="text-gray-500 text-sm">Лого</Text>
            </View>
          )}
        </View>

        <View className="w-full h-[1px] bg-gray-200 mt-4 mb-3" />

        <View className="mt-5">
          <Text
            className="text-3xl font-semibold text-center"
            numberOfLines={2}
          >
            {item.companyName || 'Компания'}
          </Text>
          {workTypesText ? (
            <Text
              className="text-lg text-gray-500 mt-1 text-center"
              numberOfLines={2}
            >
              {workTypesText}
            </Text>
          ) : null}
        </View>

        {typeof item.priceWorker === 'number' ? (
          <View className="mt-4 p-3 bg-blue-50 rounded-xl">
            <Text className="text-2xl font-bold text-blue-700">
              Оплата: {item.priceWorker} ₽
            </Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Text className="text-lg text-gray-700">
            📍 {item.address || 'Адрес не указан'}
          </Text>
          <Text className="text-lg text-gray-700 mt-1">
            🗓 {item.dateStartByCity}
          </Text>
          <Text className="text-lg text-gray-700 mt-1">
            ⏰ {item.timeStartByCity}–{item.timeEndByCity}
          </Text>
        </View>

        <View className="mt-4">
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              style={{ width: `${progress}%` }}
              className={`h-2 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            />
          </View>
          <Text className="mt-1 text-lg text-gray-700">
            Набрано: {item.currentWorkers ?? 0}/{item.planWorkers ?? 0}
          </Text>
        </View>

        <View className="mt-4 flex-row items-center">
          {typeof item.customerRating === 'number' ? (
            <Text className="text-lg text-gray-800">
              Рейтинг: {item.customerRating}
            </Text>
          ) : null}
          {item.customerFeedbacksCount ? (
            <Text className="text-lg text-gray-500 ml-2">
              {item.customerFeedbacksCount}
            </Text>
          ) : null}
        </View>

        {/* Переключение вакансий — перенесено в конец */}
        <View className="flex-row justify-between items-center mt-8 mb-2">
          {isFirst ? <View /> : (
            <TouchableOpacity
              onPress={() => shiftsStore.selectPrev()}
              className="px-4 py-3 rounded-lg bg-gray-100"
            >
              <Text className="text-base">Предыдущая</Text>
            </TouchableOpacity>
          )}
          {isLast ? <View /> : (
            <TouchableOpacity
              onPress={() => shiftsStore.selectNext()}
              className="px-4 py-3 rounded-lg bg-gray-100"
            >
              <Text className="text-base">Следующая</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
});

export default ShiftDetail;
