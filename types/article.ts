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
