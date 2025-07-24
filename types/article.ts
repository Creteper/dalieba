export type Article = {
  userName: string;
  userAvatar: string;
  articleTitle: string;
  articleImg: string;
  viewCounts?: string;
  likeCounts: string;
  collectCounts: string;
  shareCounts: string;
  isLiked?: boolean;
  isStarred?: boolean;
  width: number;
  height: number;
};

export type RegisterResponse = {
  code: number;
  message: string;
};

export type LoginResponse = {
  code: number;
  message: string;
  token: string;
  user_id: number;
};

export type UserInfoResponse = {
  user_id: number;
  username: string;
  email: string;
  account_number: string;
};

export type RecommendScenicSpotResponse = {
  sights: {
    id: number;
    pname: string;
    city_name: string;
    adname: string;
    name: string;
    address: string;
    localtion: string;
  }[];
};

export type ScenicSpotResponse = {
  sights: {
    id: number;
    pname: string;
    city_name: string;
    adname: string;
    name: string;
    address: string;
    localtion: string;
  }[];
};

export type GuideScenicSpotResponse = {
  data: {
    text: string;
    audio: {
      url: string;
      file_size: number;
      voice_type: string;
      segments: number;
    };
    tts_status: string;
  };
  status: number;
  message?: string;
};

export type CreatePlanResponse = {
  data: {
    Summarize: {
      final: string;
    };
    music: {
      weather: string;
      weather_notic: string;
    };
    name: string;
    plan: {
      name: string;
      result: string;
    }[];
  };
  status: number;
};

export type PlanResponse = {
  Summarize: {
    final: string;
  };
  music: {
    weather: string;
    weather_notic: string;
  };
  name: string;
  plan: {
    name: string;
    result: string;
  }[];
};

export type PlanDetailResponse = {
  data: {
    city: string;
    create_at: string;
    id: number;
    message: string;
    response: string;
    title: string;
    user_id: number;
  }[];
  status: number;
};

export type StarredScenicSpotResponse = {
  id: number;
  user_id: number | null;
  gd_id: number | null;
  pname: string;
  city_name: string;
  adname: string;
  name: string;
  address: string;
  localtion: string;
};

export type RouteData = {
  id: number; // 路线ID 唯一索引
  title: string; // 路线名称
  days: number; // 旅行天数
  startTime: string; // 开始时间 yy-mm-dd hh-mm
  night: number; // 过夜数量
  city: string; // 游玩城市
  center: number[]; // 中心点 经纬度
  spots: {
    // 景点
    day: number; // 天
    trip: {
      // 计划
      id: number; // 每天游玩景点唯一索引
      type: string; // 标识 start 为起始点 || end 为结束点 || spot 景点
      arrivalTime: string; // 当天计划开始时间
      name: string; // 景点名称
      rating: number; // 景点分数
      address: string; // 景点地址
      description: string; // 景点介绍
      location: [number, number]; // 景点经纬度
      beforeSpot: {
        // 之前景点
        name: string; // 名称
        address: string; // 地址
        location: [number, number]; // 经纬度
        travelMode: {
          // 出行
          mode: string; // 出行方式
          travelTime: number; // 出行时间
          distance: number; // 距离
          price: number; // 价格
        };
      };
      nextSpot: {
        // 下一景点
        name: string; // 名称
        address: string; // 地址
        location: [number, number]; // 经纬度
        travelMode: {
          // 出行
          mode: string; // 出行方式
          travelTime: number; // 出行时间
          distance: number; // 距离
          price: number; // 价格
        };
      };
      hotelType: string | null; // 当type 为 end 时 可使用hotel
      hotelRating: number | null; // 酒店分数
    }[];
  }[];
};

export type SpotData = {
  // 景点
  day: number; // 天
  trip: {
    // 计划
    id: number; // 每天游玩景点唯一索引
    type: string; // 标识 start 为起始点 || end 为结束点 || spot 景点
    arrivalTime: string; // 当天计划开始时间
    name: string; // 景点名称
    rating: number; // 景点分数
    address: string; // 景点地址
    description: string; // 景点介绍
    location: [number, number]; // 景点经纬度
    beforeSpot: {
      // 之前景点
      name: string; // 名称
      address: string; // 地址
      location: [number, number]; // 经纬度
      travelMode: {
        // 出行
        mode: string; // 出行方式
        travelTime: number; // 出行时间
        distance: number; // 距离
        price: number; // 价格
      };
    };
    nextSpot: {
      // 下一景点
      name: string; // 名称
      address: string; // 地址
      location: [number, number]; // 经纬度
      travelMode: {
        // 出行
        mode: string; // 出行方式
        travelTime: number; // 出行时间
        distance: number; // 距离
        price: number; // 价格
      };
    };
    hotelType: string | null; // 当type 为 end 时 可使用hotel
    hotelRating: number | null; // 酒店分数
  }[];
};

export type TripData = {
  // 计划
  id: number; // 每天游玩景点唯一索引
  type: string; // 标识 start 为起始点 || end 为结束点 || spot 景点
  arrivalTime: string; // 当天计划开始时间
  name: string; // 景点名称
  rating: number; // 景点分数
  address: string; // 景点地址
  description: string; // 景点介绍
  location: [number, number]; // 景点经纬度
  beforeSpot: {
    // 之前景点
    name: string; // 名称
    address: string; // 地址
    location: [number, number]; // 经纬度
    travelMode: {
      // 出行
      mode: string; // 出行方式
      travelTime: number; // 出行时间
      distance: number; // 距离
      price: number; // 价格
    };
  };
  nextSpot: {
    // 下一景点
    name: string; // 名称
    address: string; // 地址
    location: [number, number]; // 经纬度
    travelMode: {
      // 出行
      mode: string; // 出行方式
      travelTime: number; // 出行时间
      distance: number; // 距离
      price: number; // 价格
    };
  };
  hotelType: string | null; // 当type 为 end 时 可使用hotel
  hotelRating: number | null; // 酒店分数
};

export type nextSpotData = {
  // 下一景点
  name: string; // 名称
  address: string; // 地址
  location: [number, number]; // 经纬度
  travelMode: {
    // 出行
    mode: string; // 出行方式
    travelTime: number; // 出行时间
    distance: number; // 距离
    price: number; // 价格
  };
};

export type beforeSpotData = {
  // 之前景点
  name: string; // 名称
  address: string; // 地址
  location: [number, number]; // 经纬度
  travelMode: {
    // 出行
    mode: string; // 出行方式
    travelTime: number; // 出行时间
    distance: number; // 距离
    price: number; // 价格
  };
};

export interface PathBoxResponse {
  destination_name: string;
  origin_name: string;
  route_ponit: RoutePonit[];
  [property: string]: any;
}

export interface RoutePonit {
  destination_localtion: string;
  destination_name: string;
  destination_poi_id: string;
  location_box: string;
  origin_localtion: string;
  origin_name: string;
  origin_poi_id: string;
  path_id: number;
  segment_id: number;
  [property: string]: any;
}
