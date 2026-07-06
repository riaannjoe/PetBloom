export interface WeatherData {
  tempF: number;
  tempC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Snowy' | 'Windy';
  uvIndex: number;
  walkRecommendation: string;
  isSafeForWalk: boolean;
}

export const weatherService = {
  async getCurrentWeather(_zipOrCoords?: string): Promise<WeatherData> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      tempF: 74,
      tempC: 23.3,
      condition: 'Sunny',
      uvIndex: 4,
      walkRecommendation: 'Perfect weather for a walk! UV index is moderate; standard exercise durations are safe.',
      isSafeForWalk: true,
    };
  },
};
