// === REELS ANALYTICS DATA ===

export const reelsOverview = {
  totalReels: 47,
  totalViews: 2_845_000,
  totalLikes: 312_400,
  totalComments: 18_760,
  totalShares: 45_200,
  totalSaves: 67_800,
  avgEngagementRate: 5.8,
  avgRetention: 62,
};

export const reelsPerformance = [
  { name: "1 Мар", views: 82000, likes: 9200, shares: 1800, saves: 2400 },
  { name: "3 Мар", views: 95000, likes: 11000, shares: 2100, saves: 3100 },
  { name: "5 Мар", views: 74000, likes: 8100, shares: 1500, saves: 2000 },
  { name: "7 Мар", views: 120000, likes: 14500, shares: 3200, saves: 4800 },
  { name: "9 Мар", views: 108000, likes: 12800, shares: 2800, saves: 3900 },
  { name: "11 Мар", views: 67000, likes: 7400, shares: 1200, saves: 1700 },
  { name: "13 Мар", views: 145000, likes: 17200, shares: 4100, saves: 5600 },
  { name: "15 Мар", views: 132000, likes: 15600, shares: 3600, saves: 5100 },
  { name: "17 Мар", views: 89000, likes: 10100, shares: 2000, saves: 2800 },
  { name: "19 Мар", views: 156000, likes: 18900, shares: 4500, saves: 6200 },
  { name: "21 Мар", views: 178000, likes: 21000, shares: 5200, saves: 7100 },
  { name: "23 Мар", views: 143000, likes: 16800, shares: 3900, saves: 5300 },
  { name: "25 Мар", views: 198000, likes: 23500, shares: 5800, saves: 8200 },
  { name: "27 Мар", views: 210000, likes: 25000, shares: 6100, saves: 8800 },
  { name: "29 Мар", views: 248000, likes: 29300, shares: 7200, saves: 9800 },
];

export const topReels = [
  { id: 1, title: "Утренняя рутина", views: 248000, likes: 29300, comments: 1840, shares: 7200, retention: 78, date: "29 Мар" },
  { id: 2, title: "Тренировка дома", views: 210000, likes: 25000, comments: 1560, shares: 6100, retention: 72, date: "27 Мар" },
  { id: 3, title: "Рецепт дня", views: 198000, likes: 23500, comments: 1420, shares: 5800, retention: 69, date: "25 Мар" },
  { id: 4, title: "Лайфхак для дома", views: 178000, likes: 21000, comments: 1280, shares: 5200, retention: 65, date: "21 Мар" },
  { id: 5, title: "Путешествие в горы", views: 156000, likes: 18900, comments: 1100, shares: 4500, retention: 71, date: "19 Мар" },
];

export const retentionData = [
  { second: "0с", retention: 100 },
  { second: "3с", retention: 92 },
  { second: "5с", retention: 84 },
  { second: "10с", retention: 72 },
  { second: "15с", retention: 62 },
  { second: "20с", retention: 51 },
  { second: "25с", retention: 43 },
  { second: "30с", retention: 38 },
];

export const reachSources = [
  { name: "Рекомендации", value: 58, color: "#E1306C" },
  { name: "Подписчики", value: 22, color: "#833AB4" },
  { name: "Поиск", value: 12, color: "#F77737" },
  { name: "Поделились", value: 8, color: "#FCAF45" },
];

// === AUDIENCE DEMOGRAPHICS DATA ===

export const ageData = [
  { age: "13-17", male: 3, female: 5 },
  { age: "18-24", male: 18, female: 24 },
  { age: "25-34", male: 15, female: 19 },
  { age: "35-44", male: 6, female: 5 },
  { age: "45-54", male: 2, female: 2 },
  { age: "55+", male: 0.5, female: 0.5 },
];

export const genderData = [
  { name: "Женщины", value: 55.5, color: "#E1306C" },
  { name: "Мужчины", value: 41.5, color: "#833AB4" },
  { name: "Другое", value: 3, color: "#5B51D8" },
];

export const topCities = [
  { city: "Москва", percentage: 28.4 },
  { city: "Санкт-Петербург", percentage: 14.2 },
  { city: "Казань", percentage: 6.8 },
  { city: "Новосибирск", percentage: 5.1 },
  { city: "Екатеринбург", percentage: 4.7 },
  { city: "Краснодар", percentage: 3.9 },
  { city: "Нижний Новгород", percentage: 3.2 },
  { city: "Самара", percentage: 2.8 },
];

export const topCountries = [
  { country: "Россия", percentage: 72.5, flag: "🇷🇺" },
  { country: "Казахстан", percentage: 8.3, flag: "🇰🇿" },
  { country: "Беларусь", percentage: 5.1, flag: "🇧🇾" },
  { country: "Украина", percentage: 4.2, flag: "🇺🇦" },
  { country: "Узбекистан", percentage: 3.1, flag: "🇺🇿" },
  { country: "Германия", percentage: 2.4, flag: "🇩🇪" },
  { country: "США", percentage: 1.8, flag: "🇺🇸" },
  { country: "Турция", percentage: 1.4, flag: "🇹🇷" },
];

export const activeHours = [
  { hour: "00", activity: 12 },
  { hour: "02", activity: 5 },
  { hour: "04", activity: 3 },
  { hour: "06", activity: 8 },
  { hour: "08", activity: 25 },
  { hour: "09", activity: 42 },
  { hour: "10", activity: 55 },
  { hour: "11", activity: 48 },
  { hour: "12", activity: 65 },
  { hour: "13", activity: 72 },
  { hour: "14", activity: 58 },
  { hour: "15", activity: 45 },
  { hour: "16", activity: 38 },
  { hour: "17", activity: 52 },
  { hour: "18", activity: 78 },
  { hour: "19", activity: 92 },
  { hour: "20", activity: 100 },
  { hour: "21", activity: 88 },
  { hour: "22", activity: 62 },
  { hour: "23", activity: 35 },
];

export const followerGrowth = [
  { date: "1 Мар", followers: 124500 },
  { date: "5 Мар", followers: 125800 },
  { date: "9 Мар", followers: 127200 },
  { date: "13 Мар", followers: 129100 },
  { date: "17 Мар", followers: 130800 },
  { date: "21 Мар", followers: 133500 },
  { date: "25 Мар", followers: 136200 },
  { date: "29 Мар", followers: 139800 },
];
