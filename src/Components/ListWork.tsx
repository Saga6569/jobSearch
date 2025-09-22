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

const ShiftCard = React.memo(({ item, onPress }: { item: ShiftItem; onPress?: (it: ShiftItem) => void }) => {
  let workTypesText: string | undefined;
  let workTypeNames: string[] = [];
  if (Array.isArray(item.workTypes)) {
    if (item.workTypes.length > 0 && typeof item.workTypes[0] === 'object') {
      workTypeNames = (item.workTypes as WorkType[])
        .map(w => w.name)
        .filter(Boolean) as string[];
      workTypesText = workTypeNames.join(', ');
    } else {
      workTypeNames = item.workTypes as string[];
      workTypesText = workTypeNames.join(', ');
    }
  } else if (typeof item.workTypes === 'string') {
    workTypeNames = [item.workTypes];
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
    <TouchableOpacity className="w-full mb-5 p-4 bg-white rounded-2xl shadow border border-gray-100" onPress={() => onPress?.(item)}>
      <View className="flex-row items-start">
        {item.logo ? (
          <Image
            source={{ uri: item.logo }}
            className="w-20 h-20 rounded-lg mr-4"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-lg mr-4 bg-gray-200 items-center justify-center">
            <Text className="text-gray-500 text-sm text-center">Лого</Text>
          </View>
        )}

        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-semibold flex-1 mr-2" numberOfLines={1}>
              {item.companyName || 'Компания'}
            </Text>
            {typeof item.priceWorker === 'number' ? (
              <View className="px-2.5 py-1.5 bg-blue-50 rounded-lg">
                <Text className="text-lg font-bold text-blue-600">{item.priceWorker} ₽</Text>
              </View>
            ) : null}
          </View>
          {workTypeNames.length > 0 ? (
            <View className="mt-1 flex-row flex-wrap gap-1">
              {workTypeNames.slice(0, 6).map((name, idx) => (
                <View
                  key={`${name}_${idx}`}
                  className="px-2 py-0.5 rounded-full bg-gray-100"
                >
                  <Text className="text-xs text-gray-700">{name}</Text>
                </View>
              ))}
              {workTypeNames.length > 6 && (
                <View className="px-2 py-0.5 rounded-full bg-gray-100">
                  <Text className="text-xs text-gray-700">+{workTypeNames.length - 6}</Text>
                </View>
              )}
            </View>
          ) : null}
          <Text className="text-base text-gray-600 mt-1.5" numberOfLines={2}>📍 {item.address || 'Адрес не указан'}</Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-base text-gray-700">🗓 {item.dateStartByCity}  ⏰ {item.timeStartByCity}–{item.timeEndByCity}</Text>
        <View className="flex-row items-center">
          {renderStars(item.customerRating)}
          {item.customerFeedbacksCount ? (
            <Text className="text-sm text-gray-500 ml-1">{item.customerFeedbacksCount}</Text>
          ) : null}
        </View>
      </View>

      <View className="mt-4">
        <View className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progress}%` }}
            className={`h-2.5 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
          />
        </View>
        <View className="mt-1.5 flex-row justify-between">
          <Text className="text-base text-gray-600">
            Набрано: {item.currentWorkers ?? 0}/{item.planWorkers ?? 0}
          </Text>
          {typeof item.customerRating !== 'number' && item.customerFeedbacksCount ? (
            <Text className="text-sm text-gray-500">{item.customerFeedbacksCount}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const RenderItemsList = ({ data = [], isLoading = false, onPressItem }: { data: ShiftItem[]; isLoading?: boolean; onPressItem?: (it: ShiftItem) => void; }) => {
  const memoContentPadding = React.useMemo(() => ({ paddingBottom: 24 }), []);

  const renderItem = React.useCallback(
    ({ item }: { item: ShiftItem }) => <ShiftCard item={item} onPress={onPressItem} />,
    [onPressItem],
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
        contentContainerStyle={memoContentPadding}
        initialNumToRender={8}
        windowSize={10}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RenderItemsList;
