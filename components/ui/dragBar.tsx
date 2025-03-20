import { useState } from "react";

export default function DragBar({ data = 0, setData, className }: { data?: number, setData: (height: number) => void, className?: string }) {
    const [dragging, setDragging] = useState(false);

    const handleStart = (startY: number) => {
        setDragging(true);
        const startHeight = data;

        const handleMove = (currentY: number) => {
            const delta = startY - currentY;
            setData(Math.max(250, startHeight + delta));
        };

        const handleEnd = () => {
            setDragging(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("mouseup", handleEnd);
            document.removeEventListener("touchend", handleEnd);
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
        const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("mouseup", handleEnd);
        document.addEventListener("touchend", handleEnd);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleStart(e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        handleStart(e.touches[0].clientY);
    };

    return (
        <div
            className={"sticky top-0 z-50 bg-muted w-full h-10 content-center cursor-grab " + className}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className={"w-1/4 h-2 mx-auto rounded-full bg-foreground/25"} />
        </div>
    );
}
