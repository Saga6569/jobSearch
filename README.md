# JobSearch (React Native CLI)

Небольшое приложение на React Native (без Expo), которое показывает список доступных смен по текущей геолокации пользователя и экран с деталями выбранной смены.

## Возможности

- Запрос точной геолокации при первом запуске
- Загрузка списка смен по координатам пользователя
- Отображение карточек со сводной информацией
- Экран деталей без повторного запроса (данные берутся из уже загруженного списка)
- Кеширование результатов запроса на 5 минут (по координатам)
- Переключение вакансий на экране деталей (MobX), анимация смены карточки

## Стек

- React Native 0.81 (CLI)
- React 19
- TypeScript
- Навигация: `@react-navigation/native`, `@react-navigation/native-stack`
- Состояние: MobX 6 (`mobx`, `mobx-react-lite`)
- Геолокация: `react-native-geolocation-service`
- Safe Area: `react-native-safe-area-context`
- Стили: NativeWind/Tailwind классы

## Установка и запуск

1. Установите зависимости

```bash
npm install
```

2. Подготовьте окружение RN CLI (Android SDK / Xcode)
3. Запустите Metro

```bash
npm run start -- --reset-cache
```

4. Соберите и запустите приложение

```bash
npm run android
# или
npm run ios
```

## Структура проекта (основное)

```
src/
  Components/
    ListWork.tsx         # список смен (карточки)
  pages/
    Main.tsx             # главный экран (список)
    ShiftDetail.tsx      # экран деталей смены
  store/
    shiftsStore.ts       # MobX-стор: загрузка, кеширование, выбор текущей
  api/
    api.ts               # вызов API (через util)
    mockData.ts          # фолбэк-данные
  utiliti/
    getLocation.ts       # получение координат
```

## Скрипты

```json
{
  "start": "react-native start",
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "lint": "eslint .",
  "test": "jest"
}
```
