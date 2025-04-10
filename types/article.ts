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
