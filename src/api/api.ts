const get_work = async (latitude: string, longitude: string) => {
  const url = `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Данные получены:', data);
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
};

export default get_work;
