export interface WeatherAlert {
  /** Name of the alert source.*/
  sender_name: string;

  /** Description of the alert*/
  description: string;

  /** Date and time of the end of the alert, Unix, UTC*/
  end: number;

  /** Date and time of the start of the alert, Unix, UTC*/
  start: number;

  /** Type of severe weather*/
  tags: string[];

  /** Alert event name*/
  event: string;
}

export enum WeatherConditionId {
  THUNDERSTORM_RAIN_LIGHT = 200,
  THUNDERSTORM_RAIN = 201,
  THUNDERSTORM_RAIN_HEAVY = 202,

  THUNDERSTORM_LIGHT = 210,
  THUNDERSTORM = 211,
  THUNDERSTORM_HEAVY = 212,

  THUNDERSTORM_RAGGED = 221,

  THUNDERSTORM_DRIZZLE_LIGHT = 230,
  THUNDERSTORM_DRIZZLE = 231,
  THUNDERSTORM_DRIZZLE_HEAVY = 232,

  DRIZZLE_LIGHT = 300,
  DRIZZLE = 301,
  DRIZZLE_HEAVY = 302,

  DRIZZLE_RAIN_LIGHT = 310,
  DRIZZLE_RAIN = 311,
  DRIZZLE_RAIN_HEAVY = 312,
  DRIZZLE_SHOWER_RAIN = 313,
  DRIZZLE_SHOWER_RAIN_HEAVY = 314,

  DRIZZLE_SHOWER = 321,

  RAIN_LIGHT = 500,
  RAIN_MODERATE = 501,
  RAIN_HEAVY = 502,
  RAIN_VERY_HEAVY = 503,
  RAIN_EXTREME = 504,

  RAIN_FREEZING = 511,

  RAIN_SHOWER_LIGHT = 520,
  RAIN_SHOWER = 521,
  RAIN_SHOWER_HEAVY = 522,

  RAIN_SHOWER_RAGGED = 531,

  SNOW_LIGHT = 600,
  SNOW = 601,
  SNOW_HEAVY = 602,

  SNOW_SLEET = 611,
  SNOW_SLEET_SHOWER_LIGHT = 612,
  SNOW_SLEET_SHOWER = 613,

  SNOW_RAIN_LIGHT = 615,
  SNOW_RAIN = 616,

  SNOW_SHOWER_LIGHT = 620,
  SNOW_SHOWER = 621,
  SNOW_SHOWER_HEAVY = 622,

  MIST = 701,

  SMOKE = 711,

  HAZE = 721,

  DUST_WHIRLS = 731,

  FOG = 741,

  SAND = 751,

  DUST = 761,
  ASH = 762,

  SQUALL = 771,

  TORNADO = 781,

  CLEAR = 800,

  CLOUDS_FEW = 801,
  CLOUDS_SCATTERED = 802,
  CLOUDS_BROKEN = 803,
  CLOUDS_OVERCAST = 804
}

export interface WeatherDescription {
  /** Weather condition id*/
  id: WeatherConditionId;

  /** Group of weather parameters (Rain, Snow etc.)*/
  main: string;

  /** Weather condition within the group*/
  description: string;

  /** Weather icon id; available at /icons/weather/{id}.png */
  icon: string;
}

export interface BasicWeatherEntry {
  /** Current time, Unix, UTC Celsius*/
  dt: number;

  /** Cloudiness, %*/
  clouds: number;

  /** Atmospheric temperature (varying according to pressure and humidity) below which water droplets begin to condense and dew can form. Celsius*/
  dew_point: number;

  /** Humidity, %*/
  humidity: number;

  /** Atmospheric pressure on the sea level, hPa*/
  pressure: number;

  /** Current UV index*/
  uvi: number;

  /** Average visibility, metres. The maximum value of the visibility is 10 km*/
  visibility: number;

  /** Wind direction, degrees (meteorological)*/
  wind_deg: number;

  /** Wind gust. metre/sec*/
  wind_gust: number;

  /** Wind speed. metre/sec*/
  wind_speed: number;

  weather: WeatherDescription[];
}

export interface WeatherCurrent extends BasicWeatherEntry {
  /** Temperature. This temperature parameter accounts for the human perception of weather. Celsius*/
  feels_like: number;

  /** Sunrise time, Unix, UTC.*/
  sunrise: number;

  /** Sunset time, Unix, UTC.*/
  sunset: number;

  /** Temperature. Celsius*/
  temp: number;
}

export interface WeatherDaily extends BasicWeatherEntry {
  feels_like: {
    /** Morning temperature.*/
    morn: number;

    /** Day temperature*/
    day: number;

    /** Evening temperature.*/
    eve: number;

    /** Night temperature.*/
    night: number;
  };

  /** Moon phase. 0 and 1 are 'new moon', 0.25 is 'first quarter moon', 0.5 is 'full moon' and 0.75 is 'last quarter moon'. The periods in between are called 'waxing crescent', 'waxing gibous', 'waning gibous', and 'waning crescent', respectively.*/
  moon_phase: number;

  /** The time of when the moon rises for this day, Unix, UTC*/
  moonrise: number;

  /** The time of when the moon sets for this day, Unix, UTC*/
  moonset: number;

  /** Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%*/
  pop: number;

  /** Human-readable description of the weather conditions for the day*/
  summary: string;

  /** Sunrise time, Unix, UTC.*/
  sunrise: number;

  /** Sunset time, Unix, UTC*/
  sunset: number;

  temp: {
    /** Morning temperature.*/
    morn: number;

    /** Day temperature.*/
    day: number;

    /** Evening temperature.*/
    eve: number;

    /** Night temperature.*/
    night: number;

    /** Min daily temperature.*/
    min: number;

    /** Max daily temperature.*/
    max: number;
  };
}

export interface WeatherHourly extends BasicWeatherEntry {
  /** Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%*/
  pop: number;

  /** Temperature. Celsius*/
  temp: number;
}

export interface WeatherMinutely {
  /** Time of the forecasted data, unix, UTC*/
  dt: number;

  /** Precipitation, mm/h.*/
  precipitation: number;
}

export interface WeatherResponse {
  alerts: WeatherAlert[];
  current: WeatherCurrent;
  daily: WeatherDaily[];
  hourly: WeatherHourly[];
  minutely: WeatherMinutely[];
}
