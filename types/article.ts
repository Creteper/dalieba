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
  }[]
}

export type ScenicSpotResponse = {
  sights: {
    id: number;
    pname: string;
    city_name: string;
    adname: string;
    name: string;
    address: string;
    localtion: string;
  }[]
}

export type GuideScenicSpotResponse = {
  data: string,
  status: number,
  message: string,
}

export type CreatePlanResponse = {
  data: {
    Summarize: {
      final: string
    },
    music: {
      weather: string,
      weather_notic: string
    },
    name: string,
    plan: {
      name: string,
      result: string
    }[]
  },
  status: number,
}

export type PlanResponse = {
  Summarize: {
    final: string
  },
  music: {
    weather: string,
    weather_notic: string
  },
  name: string,
  plan: {
    name: string,
    result: string
  }[]
}

export type PlanDetailResponse = {
  data : {
    city: string,
    create_at: string,
    id: number,
    message: string,
    response: string,
    title: string,
    user_id: number,
  }[],
  status: number,
}
