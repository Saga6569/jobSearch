import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// type RootStackParamList = {
//   Home: undefined;
//   MovieDetail: { movie: Movie };
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const ShiftCard = React.memo(({ item }: { item: ShiftItem }) => {
  let workTypesText: string | undefined;
  if (Array.isArray(item.workTypes)) {
    if (item.workTypes.length > 0 && typeof item.workTypes[0] === 'object') {
      workTypesText = (item.workTypes as WorkType[])
        .map(w => w.name)
        .filter(Boolean)
        .join(', ');
    } else {
      workTypesText = (item.workTypes as string[]).join(', ');
    }
  } else if (typeof item.workTypes === 'string') {
    workTypesText = item.workTypes;
  }

  const progress = (() => {
    const current = typeof item.currentWorkers === 'number' ? item.currentWorkers : 0;
    const plan = typeof item.planWorkers === 'number' && item.planWorkers > 0 ? item.planWorkers : 0;
    if (!plan) return 0;
    const p = Math.min(100, Math.round((current / plan) * 100));
    return p;
  })();

  const renderStars = (rating?: number) => {
    if (typeof rating !== 'number') return null;
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return (
      <Text className="text-xs text-yellow-500">
        {'★'.repeat(full)}{half ? '☆' : ''}{'✩'.repeat(Math.max(0, empty - (half ? 1 : 0)))}
      </Text>
    );
  };

  return (
    <TouchableOpacity className="w-full mb-4 p-3 bg-white rounded-xl shadow border border-gray-100">
      <View className="flex-row items-start">
        {item.logo ? (
          <Image
            source={{ uri: item.logo }}
            className="w-16 h-16 rounded-md mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-md mr-3 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500 text-xs text-center">Лого</Text>
          </View>
        )}

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-base font-semibold flex-1 mr-2" numberOfLines={1}>
              {item.companyName || 'Компания'}
            </Text>
            {typeof item.priceWorker === 'number' ? (
              <View className="px-2 py-1 bg-blue-50 rounded-lg">
                <Text className="text-sm font-bold text-blue-600">{item.priceWorker} ₽</Text>
              </View>
            ) : null}
          </View>
          {workTypesText ? (
            <Text className="text-[11px] text-gray-500 mt-0.5" numberOfLines={1}>
              {workTypesText}
            </Text>
          ) : null}
          <Text className="text-xs text-gray-600 mt-1" numberOfLines={2}>📍 {item.address || 'Адрес не указан'}</Text>
        </View>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-xs text-gray-700">🗓 {item.dateStartByCity}  ⏰ {item.timeStartByCity}–{item.timeEndByCity}</Text>
        <View className="flex-row items-center">
          {renderStars(item.customerRating)}
          {item.customerFeedbacksCount ? (
            <Text className="text-[11px] text-gray-500 ml-1">{item.customerFeedbacksCount}</Text>
          ) : null}
        </View>
      </View>

      <View className="mt-3">
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress}%` }}
            className={`h-2 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
          />
        </View>
        <View className="mt-1 flex-row justify-between">
          <Text className="text-xs text-gray-600">
            Набрано: {item.currentWorkers ?? 0}/{item.planWorkers ?? 0}
          </Text>
          {typeof item.customerRating !== 'number' && item.customerFeedbacksCount ? (
            <Text className="text-[11px] text-gray-500">{item.customerFeedbacksCount}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RenderItemsList = ({ data = [], isLoading = false }: { data: ShiftItem[]; isLoading?: boolean; }) => {
  const renderItem = React.useCallback(
    ({ item }: { item: ShiftItem }) => <ShiftCard item={item} />,
    [],
  );

  const keyExtractor = (item: ShiftItem, index: number) =>
    `${(item.id ?? index).toString()}_${index}`;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-700 text-lg">Загрузка...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Ничего не найдено</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RenderItemsList;
