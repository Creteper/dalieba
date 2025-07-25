export const parkinglotData = [
  {
    id: 1,
    name: "北广场地下停车场",
    address: "哈尔滨市道里区安宁街与地工街交叉口南60米",
    imageUrl: "/parlot/bgcdxtcc.jpg",
    rating: 4.5,
    description: "车位多",
  },
  {
    id: 2,
    name: "新一百地面停车场",
    address: "哈尔滨市道里区石头道街118号哈尔滨新一百(西北角)",
    imageUrl: "/parlot/xybdmtcc.jpg",
    rating: 4.0,
    description: "空间大",
  },
  {
    id: 3,
    name: "天竹快捷宾馆地下停车场",
    address: "哈尔滨市南岗区松花江街6号天竹宾馆(哈尔大巴店)",
    imageUrl: "/parlot/tzkjbgdxtcc.jpg",
    rating: 4.5,
    description: "免费停车",
  },
  {
    id: 4,
    name: "青年广场停车场",
    address: "哈尔滨市南岗区哈尔滨站地铁站3号口步行440米",
    imageUrl: "/parlot/qngctcc.jpg",
    rating: 4.5,
    description: "免费停车",
  },
];

export const hotelData = [
  {
    id: 1,
    name: "白玉兰酒店(哈尔滨医大一院店)",
    address: "哈尔滨市道外区南坎街56号天鹅大厦院内",
    imageUrl: "/hotel/byljd.jpg",
    rating: 4.6,
    description: "经济型",
  },
  {
    id: 2,
    name: "恒旗假日宾馆(果戈里秋林店)",
    address: "哈尔滨市南岗区人和街112号",
    imageUrl: "/hotel/hqjrbg.jpg",
    rating: 4.2,
    description: "经济型",
  },
  {
    id: 3,
    name: "鑫岭宾馆(博物馆店)",
    address: "哈尔滨市南岗区阿什河街66号",
    imageUrl: "/hotel/xljd.jpg",
    description: "经济型",
    rating: 4.7,
  },
  {
    id: 4,
    name: "如家酒店",
    address: "哈尔滨市南岗区文林街101号",
    imageUrl: "/hotel/rjjd.jpg",
    description: "经济型",
    rating: 4.3,
  },
];

export const foodData = [
  {
    id: 1,
    name: "米德维奇俄式西餐厅",
    address: "哈尔滨市道里区西六道街27号",
    imageUrl: "/food/mdwq.jpg",
    rating: 4.6,
    description: "俄餐",
  },
  {
    id: 2,
    name: "那些年记忆烧烤",
    address: "哈尔滨市道里区红霞街16号",
    imageUrl: "/food/nxnjy.jpg",
    rating: 4.2,
    description: "烧烤",
  },
  {
    id: 3,
    name: "福龙碳火烤羊腿",
    address: "哈尔滨市道里区通江街172号",
    imageUrl: "/food/flth.jpg",
    description: "烤羊腿",
    rating: 4.7,
  },
  {
    id: 4,
    name: "金汉斯",
    address: "哈尔滨市道里区哈尔滨印象城A座二楼",
    imageUrl: "/food/jhs.jpg",
    description: "烤肉",
    rating: 4.3,
  },
];

export const tripData = [
  {
    id: 1,
    title: "哈尔滨 3 日游",
    days: 3,
    location: "哈尔滨",
    bestSeason: "冬季",
    highlights: "中央大街、冰雪大世界、松花江滑雪...",
    image: "/images/bg-mountain.png",
    type: "regular" as const,
  },
  {
    id: 2,
    title: "哈尔滨 2 日游",
    days: 2,
    location: "长白山",
    bestSeason: "四季皆宜",
    highlights: "天池、瀑布群、温泉度假...",
    image: "/images/bg-all-jd.png",
    type: "regular" as const,
  },
  {
    id: 3,
    title: "City Walk：中央大街",
    days: 1,
    location: "哈尔滨",
    bestSeason: "四季皆宜",
    highlights: "中央大街、索菲亚教堂、防洪纪念塔...",
    image: "/images/djt.jpeg",
    type: "cityWalk" as const,
  },
  {
    id: 4,
    title: "City Walk：松花江畔",
    days: 1,
    location: "哈尔滨",
    bestSeason: "夏秋季",
    highlights: "斯大林公园、防洪纪念塔、松花江风光带...",
    image: "/images/210shots_so.png",
    type: "cityWalk" as const,
  },
];

export const routeData = [
  {
    id: 1,
    title: "哈尔滨冰雪文化深度3日游",
    days: 3,
    startTime: "2024-12-22 08:00",
    night: 2,
    city: "哈尔滨",
    center: [126.6167, 45.7736],
    spots: [
      {
        day: 1,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "08:00",
            name: "哈尔滨站",
            rating: 4.5,
            address: "哈尔滨市南岗区铁路街1号",
            description: "东北地区重要铁路枢纽",
            location: [126.629834, 45.760696],
            nextSpot: {
              name: "索菲亚广场",
              address: "道里区透笼街88号",
              location: [126.627215, 45.770125],
              travelMode: {
                mode: "出租车",
                travelTime: 15,
                distance: 3.5,
                price: 15,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "08:30",
            name: "索菲亚广场",
            rating: 4.8,
            address: "道里区透笼街88号",
            description: "远东最大东正教教堂",
            location: [126.627215, 45.770125],
            beforeSpot: {
              name: "哈尔滨站",
              address: "南岗区铁路街1号",
              location: [126.629834, 45.760696],
              travelMode: {
                mode: "出租车",
                travelTime: 15,
                distance: 3.5,
                price: 15,
              },
            },
            nextSpot: {
              name: "哈尔滨中央大街",
              address: "道里区",
              location: [126.617682, 45.774835],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 800,
                price: 0,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "10:00",
            name: "哈尔滨中央大街",
            rating: 4.7,
            address: "道里区",
            description: "亚洲最长步行街",
            location: [126.617682, 45.774835],
            nextSpot: {
              name: "哈尔滨市人民防洪胜利纪念塔",
              address: "松花江南岸",
              location: [126.617203, 45.780654],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
          },
          {
            id: 4,
            type: "spot",
            arrivalTime: "12:00",
            name: "哈尔滨市人民防洪胜利纪念塔",
            rating: 4.6,
            address: "松花江南岸",
            description: "纪念1957年抗洪胜利",
            location: [126.617203, 45.780654],
            nextSpot: {
              name: "松花江观光索道-太阳城堡站",
              address: "通江街218号",
              location: [126.600695, 45.785568],
              travelMode: {
                mode: "步行",
                travelTime: 5,
                distance: 300,
                price: 0,
              },
            },
          },
          {
            id: 5,
            type: "end",
            arrivalTime: "20:00",
            name: "马迭尔宾馆",
            rating: 4.9,
            address: "中央大街89号",
            description: "百年历史俄式奢华酒店",
            location: [126.619657, 45.773159],
            hotelType: "奢华型",
            hotelRating: 4.9,
            beforeSpot: {
              name: "松花江观光索道-太阳城堡站",
              address: "通江街218号",
              location: [126.600695, 45.785568],
              travelMode: {
                mode: "步行",
                travelTime: 20,
                distance: 1.5,
                price: 0,
              },
            },
          },
        ],
      },
      {
        day: 2,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "马迭尔宾馆",
            rating: 4.9,
            address: "中央大街89号",
            description: "酒店早餐后出发",
            location: [126.619657, 45.773159],
            nextSpot: {
              name: "太阳岛风景区俄罗斯风情小镇",
              address: "太阳岛景区内",
              location: [126.602722, 45.787604],
              travelMode: {
                mode: "出租车",
                travelTime: 20,
                distance: 8,
                price: 20,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:30",
            name: "太阳岛风景区俄罗斯风情小镇",
            rating: 4.5,
            address: "太阳岛景区内",
            description: "体验俄式建筑与民俗",
            location: [126.602722, 45.787604],
            nextSpot: {
              name: "哈尔滨极地公园·极地馆",
              address: "松北区太阳大道3号",
              location: [126.585969, 45.784728],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "14:00",
            name: "哈尔滨极地公园·极地馆",
            rating: 4.7,
            address: "松北区太阳大道3号",
            description: "全球首个极地演艺游乐园",
            location: [126.585969, 45.784728],
            nextSpot: {
              name: "东北虎林园",
              address: "松北区松北街88号",
              location: [126.60065, 45.817483],
              travelMode: {
                mode: "出租车",
                travelTime: 20,
                distance: 9,
                price: 25,
              },
            },
          },
          {
            id: 4,
            type: "end",
            arrivalTime: "20:00",
            name: "丽思卡尔顿酒店(富力广场店)",
            rating: 4.9,
            address: "友谊西路660号1座",
            description: "森林主题奢华酒店",
            location: [126.589151, 45.758534],
            hotelType: "主题奢华型",
            hotelRating: 4.9,
            beforeSpot: {
              name: "东北虎林园",
              address: "松北区松北街88号",
              location: [126.60065, 45.817483],
              travelMode: {
                mode: "出租车",
                travelTime: 25,
                distance: 12,
                price: 30,
              },
            },
          },
        ],
      },
      {
        day: 3,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "丽思卡尔顿酒店(富力广场店)",
            rating: 4.9,
            address: "友谊西路660号1座",
            description: "酒店早餐后出发",
            location: [126.589151, 45.758534],
            nextSpot: {
              name: "中华巴洛克风情街",
              address: "道外区南二道街",
              location: [126.640729, 45.781791],
              travelMode: {
                mode: "出租车",
                travelTime: 30,
                distance: 15,
                price: 35,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:40",
            name: "中华巴洛克风情街",
            rating: 4.6,
            address: "道外区南二道街",
            description: "中西合璧历史建筑群",
            location: [126.640729, 45.781791],
            nextSpot: {
              name: "哈尔滨文庙",
              address: "南岗区文庙街25号",
              location: [126.674916, 45.775841],
              travelMode: {
                mode: "出租车",
                travelTime: 15,
                distance: 4.5,
                price: 15,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "12:00",
            name: "哈尔滨文庙",
            rating: 4.5,
            address: "南岗区文庙街25号",
            description: "东北地区最大孔庙",
            location: [126.674916, 45.775841],
            nextSpot: {
              name: "哈尔滨站",
              address: "南岗区铁路街1号",
              location: [126.629834, 45.760696],
              travelMode: {
                mode: "出租车",
                travelTime: 10,
                distance: 3.8,
                price: 14,
              },
            },
          },
          {
            id: 4,
            type: "end",
            arrivalTime: "17:00",
            name: "哈尔滨站",
            rating: 4.5,
            address: "南岗区铁路街1号",
            description: "旅程结束返程",
            location: [126.629834, 45.760696],
            beforeSpot: {
              name: "哈尔滨文庙",
              address: "南岗区文庙街25号",
              location: [126.674916, 45.775841],
              travelMode: {
                mode: "出租车",
                travelTime: 10,
                distance: 3.8,
                price: 14,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "哈尔滨经典2日游",
    days: 2,
    startTime: "2024-12-21 09:00",
    night: 1,
    city: "哈尔滨",
    center: [126.6167, 45.7736],
    spots: [
      {
        day: 1,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "哈尔滨站",
            rating: 4.5,
            address: "哈尔滨市南岗区铁路街1号",
            description: "东北地区重要铁路枢纽",
            location: [126.629834, 45.760696],
            nextSpot: {
              name: "圣·索菲亚教堂",
              address: "哈尔滨市道里区透笼街88号",
              location: [126.627215, 45.770125],
              travelMode: {
                mode: "出租车",
                travelTime: 15,
                distance: 3.5,
                price: 15,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:30",
            name: "圣·索菲亚教堂",
            rating: 4.8,
            address: "哈尔滨市道里区透笼街88号",
            description: "远东地区最大的东正教教堂",
            location: [126.627215, 45.770125],
            beforeSpot: {
              name: "哈尔滨站",
              address: "哈尔滨市南岗区铁路街1号",
              location: [126.629834, 45.760696],
              travelMode: {
                mode: "出租车",
                travelTime: 15,
                distance: 3.5,
                price: 15,
              },
            },
            nextSpot: {
              name: "哈尔滨中央大街",
              address: "哈尔滨市道里区",
              location: [126.617682, 45.774835],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 800,
                price: 0,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "11:00",
            name: "哈尔滨中央大街",
            rating: 4.7,
            address: "哈尔滨市道里区",
            description: "亚洲最长步行街，汇集文艺复兴/巴洛克风格建筑",
            location: [126.617682, 45.774835],
            nextSpot: {
              name: "哈尔滨市人民防洪胜利纪念塔",
              address: "松花江南岸",
              location: [126.617203, 45.780654],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
          },
          {
            id: 4,
            type: "spot",
            arrivalTime: "12:00",
            name: "哈尔滨市人民防洪胜利纪念塔",
            rating: 4.6,
            address: "松花江南岸",
            description: "为纪念哈尔滨人民战胜1957年特大洪水而建",
            location: [126.617203, 45.780654],
            nextSpot: {
              name: "松花江观光索道-太阳城堡站",
              address: "通江街218号",
              location: [126.600695, 45.785568],
              travelMode: {
                mode: "步行",
                travelTime: 5,
                distance: 300,
                price: 0,
              },
            },
          },
          {
            id: 5,
            type: "end",
            arrivalTime: "20:00",
            name: "中央大街酒店",
            rating: 4.8,
            address: "中央大街附近",
            description: "市中心舒适型酒店",
            location: [126.617682, 45.774835],
            hotelType: "舒适型",
            hotelRating: 4.8,
            beforeSpot: {
              name: "松花江观光索道-太阳城堡站",
              address: "通江街218号",
              location: [126.600695, 45.785568],
              travelMode: {
                mode: "步行",
                travelTime: 20,
                distance: 1.5,
                price: 0,
              },
            },
          },
        ],
      },
      {
        day: 2,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "中央大街酒店",
            rating: 4.8,
            address: "中央大街附近",
            description: "酒店早餐后出发",
            location: [126.617682, 45.774835],
            nextSpot: {
              name: "太阳岛风景区俄罗斯风情小镇",
              address: "太阳岛风景区",
              location: [126.602722, 45.787604],
              travelMode: {
                mode: "出租车",
                travelTime: 20,
                distance: 8,
                price: 20,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:30",
            name: "太阳岛风景区俄罗斯风情小镇",
            rating: 4.5,
            address: "太阳岛风景区",
            description: "体验俄罗斯建筑与民俗文化",
            location: [126.602722, 45.787604],
            nextSpot: {
              name: "东北虎林园",
              address: "松北区松北街88号",
              location: [126.60065, 45.817483],
              travelMode: {
                mode: "出租车",
                travelTime: 25,
                distance: 12,
                price: 30,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "13:00",
            name: "东北虎林园",
            rating: 4.7,
            address: "松北区松北街88号",
            description: "世界最大东北虎繁育基地",
            location: [126.60065, 45.817483],
            nextSpot: {
              name: "哈尔滨站",
              address: "哈尔滨市南岗区铁路街1号",
              location: [126.629834, 45.760696],
              travelMode: {
                mode: "出租车",
                travelTime: 30,
                distance: 18,
                price: 40,
              },
            },
          },
          {
            id: 4,
            type: "end",
            arrivalTime: "17:00",
            name: "哈尔滨站",
            rating: 4.5,
            address: "哈尔滨市南岗区铁路街1号",
            description: "旅程结束返程",
            location: [126.629834, 45.760696],
            beforeSpot: {
              name: "东北虎林园",
              address: "松北区松北街88号",
              location: [126.60065, 45.817483],
              travelMode: {
                mode: "出租车",
                travelTime: 30,
                distance: 18,
                price: 40,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "City Walk：中央大街",
    days: 1,
    startTime: "2024-12-20 09:00",
    night: 0,
    city: "哈尔滨",
    center: [126.6207, 45.7721],
    spots: [
      {
        day: 1,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "哈尔滨站",
            rating: 4.5,
            address: "哈尔滨市南岗区铁路街1号",
            description: "东北地区重要铁路枢纽",
            location: [126.629834, 45.760696],
            nextSpot: {
              name: "圣·索菲亚教堂",
              address: "哈尔滨市道里区透笼街88号",
              location: [126.627215, 45.770125],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:30",
            name: "圣·索菲亚教堂",
            rating: 4.8,
            address: "哈尔滨市道里区透笼街88号",
            description: "远东地区最大的东正教教堂",
            location: [126.627215, 45.770125],
            beforeSpot: {
              name: "哈尔滨站",
              address: "哈尔滨市南岗区铁路街1号",
              location: [126.629834, 45.760696],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
            nextSpot: {
              name: "哈尔滨中央大街",
              address: "哈尔滨市道里区",
              location: [126.617682, 45.774835],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 0.8,
                price: 0,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "10:30",
            name: "哈尔滨中央大街",
            rating: 4.7,
            address: "哈尔滨市道里区",
            description: "亚洲最长步行街，百年建筑艺术长廊",
            location: [126.617682, 45.774835],
            nextSpot: {
              name: "哈尔滨防洪纪念塔广场",
              address: "道里区斯大林街",
              location: [126.617203, 45.780654],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.0,
                price: 0,
              },
            },
          },
          {
            id: 4,
            type: "spot",
            arrivalTime: "12:00",
            name: "哈尔滨防洪纪念塔广场",
            rating: 4.6,
            address: "道里区斯大林街",
            description: "纪念1957年哈尔滨人民战胜特大洪水",
            location: [126.617203, 45.780654],
            nextSpot: {
              name: "松花江观光索道",
              address: "道里区通江街218号",
              location: [126.610547, 45.7779],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 0.7,
                price: 0,
              },
            },
          },
          {
            id: 5,
            type: "end",
            arrivalTime: "18:00",
            name: "哈尔滨中央大街哈布斯堡江景酒店(索菲亚教堂店)",
            rating: 4.8,
            address: "哈尔滨市道里区中央大街",
            description: "毗索菲亚教堂的精品酒店",
            location: [126.612142, 45.776633],
            hotelType: "豪华型",
            hotelRating: 4.8,
            beforeSpot: {
              name: "松花江观光索道",
              address: "道里区通江街218号",
              location: [126.610547, 45.7779],
              travelMode: {
                mode: "步行",
                travelTime: 8,
                distance: 0.5,
                price: 0,
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "City Walk：松花江畔",
    days: 1,
    startTime: "2024-12-20 09:00",
    night: 0,
    city: "哈尔滨",
    center: [126.617682, 45.774835],
    spots: [
      {
        day: 1,
        trip: [
          {
            id: 1,
            type: "start",
            arrivalTime: "09:00",
            name: "哈尔滨中央大街",
            rating: 4.8,
            address: "哈尔滨市道里区",
            description: "亚洲最长步行街，汇集文艺复兴与巴洛克风格建筑",
            location: [126.617682, 45.774835],
            nextSpot: {
              name: "圣·索菲亚教堂",
              address: "哈尔滨市道里区透笼街88号",
              location: [126.627215, 45.770125],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
          },
          {
            id: 2,
            type: "spot",
            arrivalTime: "09:30",
            name: "圣·索菲亚教堂",
            rating: 4.9,
            address: "哈尔滨市道里区透笼街88号",
            description: "远东地区最大的东正教教堂，标志性历史建筑",
            location: [126.627215, 45.770125],
            beforeSpot: {
              name: "哈尔滨中央大街",
              address: "哈尔滨市道里区",
              location: [126.617682, 45.774835],
              travelMode: {
                mode: "步行",
                travelTime: 15,
                distance: 1.2,
                price: 0,
              },
            },
            nextSpot: {
              name: "哈尔滨防洪纪念塔广场",
              address: "道里区斯大林街",
              location: [126.617203, 45.780654],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 0.8,
                price: 0,
              },
            },
          },
          {
            id: 3,
            type: "spot",
            arrivalTime: "10:30",
            name: "哈尔滨防洪纪念塔广场",
            rating: 4.6,
            address: "道里区斯大林街",
            description: "纪念1957年哈尔滨人民战胜特大洪水而建",
            location: [126.617203, 45.780654],
            beforeSpot: {
              name: "圣·索菲亚教堂",
              address: "哈尔滨市道里区透笼街88号",
              location: [126.627215, 45.770125],
              travelMode: {
                mode: "步行",
                travelTime: 10,
                distance: 0.8,
                price: 0,
              },
            },
            nextSpot: {
              name: "斯大林公园",
              address: "道里区松花江南岸",
              location: [126.612799, 45.779383],
              travelMode: {
                mode: "步行",
                travelTime: 8,
                distance: 0.6,
                price: 0,
              },
            },
          },
          {
            id: 4,
            type: "end",
            arrivalTime: "16:00",
            name: "松花江湿地",
            rating: 4.5,
            address: "松北区太阳岛西侧",
            description: "自然湿地景观，可远眺松花江风光",
            location: [126.530629, 45.796348],
            beforeSpot: {
              name: "斯大林公园",
              address: "道里区松花江南岸",
              location: [126.612799, 45.779383],
              travelMode: {
                mode: "步行",
                travelTime: 25,
                distance: 2.1,
                price: 0,
              },
            },
          },
        ],
      },
    ],
  },
];

export const showFakeData = `
{
  "id": 3,
  "title": "哈尔滨经典3日深度游",
  "days": 3,
  "startTime": "2024-12-20 09:00",
  "night": 2,
  "city": "哈尔滨",
  "center": [126.617682, 45.774835],
  "spots": [
    {
      "day": 1,
      "trip": [
        {
          "id": 1,
          "type": "start",
          "arrivalTime": "09:00",
          "name": "哈尔滨中央大街",
          "rating": 4.8,
          "address": "哈尔滨市道里区",
          "description": "亚洲最长步行街，汇集文艺复兴与巴洛克风格建筑",
          "location": [126.617682, 45.774835],
          "nextSpot": {
            "name": "圣·索菲亚教堂",
            "address": "哈尔滨市道里区透笼街88号",
            "location": [126.627215, 45.770125],
            "travelMode": {
              "mode": "步行",
              "travelTime": 15,
              "distance": 1.2,
              "price": 0
            }
          }
        },
        {
          "id": 2,
          "type": "spot",
          "arrivalTime": "09:30",
          "name": "索菲亚广场",
          "rating": 4.9,
          "address": "哈尔滨市道里区透笼街88号",
          "description": "远东地区最大的东正教教堂，标志性历史建筑",
          "location": [126.627215, 45.770125],
          "beforeSpot": {
            "name": "哈尔滨中央大街",
            "address": "哈尔滨市道里区",
            "location": [126.617682, 45.774835],
            "travelMode": {
              "mode": "步行",
              "travelTime": 15,
              "distance": 1.2,
              "price": 0
            }
          },
          "nextSpot": {
            "name": "哈尔滨防洪纪念塔广场",
            "address": "道里区斯大林街",
            "location": [126.617203, 45.780654],
            "travelMode": {
              "mode": "步行",
              "travelTime": 10,
              "distance": 0.8,
              "price": 0
            }
          }
        },
        {
          "id": 3,
          "type": "end",
          "arrivalTime": "18:00",
          "name": "哈尔滨防洪纪念塔广场",
          "rating": 4.6,
          "address": "道里区斯大林街",
          "description": "纪念1957年哈尔滨人民战胜特大洪水而建",
          "location": [126.617203, 45.780654],
          "beforeSpot": {
            "name": "圣·索菲亚教堂",
            "address": "哈尔滨市道里区透笼街88号",
            "location": [126.627215, 45.770125],
            "travelMode": {
              "mode": "步行",
              "travelTime": 10,
              "distance": 0.8,
              "price": 0
            }
          }
        }
      ]
    },
    {
      "day": 2,
      "trip": [
        {
          "id": 1,
          "type": "start",
          "arrivalTime": "09:00",
          "name": "东北虎林园",
          "rating": 4.7,
          "address": "松北区松北街88号",
          "description": "全球规模最大的东北虎繁育基地",
          "location": [126.600650, 45.817483],
          "nextSpot": {
            "name": "哈尔滨极地公园·极地馆",
            "address": "松北区太阳大道3号",
            "location": [126.585969, 45.784728],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 25,
              "distance": 12,
              "price": 30
            }
          }
        },
        {
          "id": 2,
          "type": "spot",
          "arrivalTime": "10:00",
          "name": "哈尔滨极地公园",
          "rating": 4.8,
          "address": "松北区太阳大道3号",
          "description": "观赏北极熊、白鲸等极地动物",
          "location": [126.585969, 45.784728],
          "beforeSpot": {
            "name": "东北虎林园",
            "address": "松北区松北街88号",
            "location": [126.600650, 45.817483],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 25,
              "distance": 12,
              "price": 30
            }
          },
          "nextSpot": {
            "name": "太阳岛风景区",
            "address": "松北区太阳大道1号",
            "location": [126.597880, 45.791584],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 10,
              "distance": 3.5,
              "price": 15
            }
          }
        },
        {
          "id": 3,
          "type": "end",
          "arrivalTime": "17:00",
          "name": "太阳岛风景区",
          "rating": 4.6,
          "address": "松北区太阳大道1号",
          "description": "国家5A级旅游景区，冬季可体验雪博会",
          "location": [126.597880, 45.791584],
          "beforeSpot": {
            "name": "哈尔滨极地公园·极地馆",
            "address": "松北区太阳大道3号",
            "location": [126.585969, 45.784728],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 10,
              "distance": 3.5,
              "price": 15
            }
          }
        }
      ]
    },
    {
      "day": 3,
      "trip": [
        {
          "id": 1,
          "type": "start",
          "arrivalTime": "09:00",
          "name": "中华巴洛克历史文化街区",
          "rating": 4.5,
          "address": "道外区南二道街",
          "description": "融合中西建筑风格的历史文化街区",
          "location": [126.640729, 45.781791],
          "nextSpot": {
            "name": "松花江索道",
            "address": "道里区通江街218号",
            "location": [126.610547, 45.777900],
            "travelMode": {
              "mode": "公交车",
              "travelTime": 20,
              "distance": 5,
              "price": 2
            }
          }
        },
        {
          "id": 2,
          "type": "spot",
          "arrivalTime": "10:00",
          "name": "松花江湿地",
          "rating": 4.4,
          "address": "道里区通江街218号",
          "description": "俯瞰松花江全景的空中走廊",
          "location": [126.610547, 45.777900],
          "beforeSpot": {
            "name": "中华巴洛克风情街",
            "address": "道外区南二道街",
            "location": [126.640729, 45.781791],
            "travelMode": {
              "mode": "公交车",
              "travelTime": 20,
              "distance": 5,
              "price": 2
            }
          },
          "nextSpot": {
            "name": "哈尔滨音乐公园",
            "address": "道里区友谊西路",
            "location": [126.548455, 45.749011],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 15,
              "distance": 6,
              "price": 20
            }
          }
        },
        {
          "id": 3,
          "type": "end",
          "arrivalTime": "16:00",
          "name": "哈尔滨音乐公园",
          "rating": 4.3,
          "address": "道里区友谊西路",
          "description": "以音乐为主题的开放式公园",
          "location": [126.548455, 45.749011],
          "beforeSpot": {
            "name": "松花江索道",
            "address": "道里区通江街218号",
            "location": [126.610547, 45.777900],
            "travelMode": {
              "mode": "出租车",
              "travelTime": 15,
              "distance": 6,
              "price": 20
            }
          }
        }
      ]
    }
  ]
}
`;
