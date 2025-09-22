import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

type WorkType = { id: number | string; name: string; nameGt5?: string; nameLt5?: string; nameOne?: string };

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

const ShiftDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const item: ShiftItem = route.params?.item ?? {};

  const workTypesText = Array.isArray(item.workTypes)
    ? (typeof item.workTypes[0] === 'object'
        ? (item.workTypes as WorkType[]).map(w => w.name).filter(Boolean)
        : (item.workTypes as string[])
      ).join(', ')
    : (item.workTypes as string | undefined);

  const progress = (() => {
    const current = typeof item.currentWorkers === 'number' ? item.currentWorkers : 0;
    const plan = typeof item.planWorkers === 'number' && item.planWorkers > 0 ? item.planWorkers : 0;
    if (!plan) return 0;
    return Math.min(100, Math.round((current / plan) * 100));
  })();

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 flex-row items-center justify-between border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="px-3 py-2">
          <Text className="text-blue-600 font-medium">Назад</Text>
        </TouchableOpacity>
        <Text className="text-base font-semibold">Детали смены</Text>
        <View style={{ width: 64 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row items-start">
          {item.logo ? (
            <Image source={{ uri: item.logo }} className="w-20 h-20 rounded-lg mr-3" />
          ) : (
            <View className="w-20 h-20 rounded-lg mr-3 bg-gray-200 items-center justify-center">
              <Text className="text-gray-500 text-xs">Лого</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-semibold" numberOfLines={2}>{item.companyName || 'Компания'}</Text>
            {workTypesText ? (
              <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>{workTypesText}</Text>
            ) : null}
          </View>
        </View>

        {typeof item.priceWorker === 'number' ? (
          <View className="mt-4 p-3 bg-blue-50 rounded-xl">
            <Text className="text-base font-bold text-blue-700">Оплата: {item.priceWorker} ₽</Text>
          </View>
        ) : null}

        <View className="mt-4">
          <Text className="text-sm text-gray-700">📍 {item.address || 'Адрес не указан'}</Text>
          <Text className="text-sm text-gray-700 mt-1">🗓 {item.dateStartByCity}</Text>
          <Text className="text-sm text-gray-700 mt-1">⏰ {item.timeStartByCity}–{item.timeEndByCity}</Text>
        </View>

        <View className="mt-4">
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <View style={{ width: `${progress}%` }} className={`h-2 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} />
          </View>
          <Text className="mt-1 text-sm text-gray-700">Набрано: {item.currentWorkers ?? 0}/{item.planWorkers ?? 0}</Text>
        </View>

        <View className="mt-4 flex-row items-center">
          {typeof item.customerRating === 'number' ? (
            <Text className="text-sm text-gray-800">Рейтинг: {item.customerRating}</Text>
          ) : null}
          {item.customerFeedbacksCount ? (
            <Text className="text-sm text-gray-500 ml-2">{item.customerFeedbacksCount}</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShiftDetail;


