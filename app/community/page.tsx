import ArticleCard from "./components/articleCard";

export default function Community() {
    return (
        <div className="flex p-10 h-screen justify-center">
            <div className="h-full w-full md:w-2xl flex flex-col">
                <ArticleCard
                    userName="牛逼666"
                    userAvatar="/img.jpg"
                    articleTitle="一个特别有含金量的帖子"
                    articleDescription="这是一个真的非常有水平的帖子，看了后就如同醍醐灌顶一般，对旅行会有一个全新的认知，不知道你信不信，反正打开看的人都暴富了"
                    articleClasses="旅行干货"
                    articleImg="/img.jpg"
                    viewCounts="1.5k"
                    likeCounts="348"
                    collectCounts="52"
                    shareCounts="3.2k"
                />
            </div>
        </div>
    )
}