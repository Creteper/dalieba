"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Article } from "@/types/article";
import { Heart } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Position = {
    top: number;
    left: number;
    width: number;
    height: number;
}

export default function WaterFall({ articles }: { articles: Article[] }) {
    // 组件ref
    const waterFallRef = useRef<HTMLDivElement>(null);

    // 以下变量与方法均为动态计算布局所需
    const [cols, setCols] = useState(0);
    const [positions, setPositions] = useState<Position[]>([]);
    const gap = 20;
    const titleHeight = 70;

    const calculateLayout = useCallback(() => {
        if (!waterFallRef.current || articles.length === 0) return;
        const waterFallWidth = waterFallRef.current.clientWidth;
        const minColWidth = 220;
        const newCols = Math.max(
            Math.floor((waterFallWidth + gap) / (minColWidth + gap)),
            window.innerWidth < 768 ? 2 : 1 // 小于768px时至少两列
        );

        const newColWidth = (waterFallWidth - gap * (newCols - 1)) / newCols;
        if (cols !== newCols) {
            setCols(newCols);
            setPositions([]);
        }

        const columnHeights = new Array(newCols).fill(0);
        const newPositions: Position[] = [];

        articles.forEach((item) => {
            const aspectRatio = item.width / item.height;
            const height = newColWidth / aspectRatio;

            const minColIndex = columnHeights.indexOf(Math.min(...columnHeights));

            const left = minColIndex * (newColWidth + gap);
            const top = columnHeights[minColIndex];

            columnHeights[minColIndex] += height + titleHeight + gap;

            newPositions.push({
                left,
                top,
                width: newColWidth,
                height: height + titleHeight,
            });
        });

        setPositions(newPositions);
    }, [articles, gap, cols]);

    useEffect(() => {
        if (!waterFallRef.current) return;
        calculateLayout();
        const observer = new ResizeObserver(calculateLayout);
        observer.observe(waterFallRef.current);

        return () => {
            observer.disconnect();
        };
    }, [calculateLayout]);

    return (
        <div ref={waterFallRef} className="relative">
            <div
                className="relative w-full"
                style={{
                    height: Math.max(...positions.map((pos) => pos.top + pos.height), 0),
                }}
            >
                {articles.map((article, index) => {
                    const position = positions[index];
                    if (!position) return null;
                    return (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                width: position.width,
                                height: position.height,
                                transform: `translate(${position.left}px, ${position.top}px)`,
                            }}
                            className="h-fit overflow-hidden flex flex-col justify-between"
                        >
                            <img
                                className="rounded-2xl border"
                                src={article.articleImg}
                                alt={article.articleTitle}
                                style={{
                                    width: "100%",
                                    height: `${position.height - titleHeight}px`,
                                    objectFit: "cover",
                                }}
                            />
                            <p className="font-bold px-3 text-sm">{article.articleTitle}</p>
                            <div className="text-muted-foreground px-3 justify-between flex items-center">
                                <div className="flex gap-1 items-center text-xs sm:text-sm">
                                    <Avatar className="w-5 h-fit">
                                        <AvatarImage src={article.userAvatar} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar >
                                    <p>{article.userName}</p>
                                </div>
                                <div className="text-xs sm:text-sm flex gap-1 items-center">
                                    <Heart size={14} />
                                    {article.likeCounts}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}