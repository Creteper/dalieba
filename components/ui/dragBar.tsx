import { useState } from "react";

export default function DragBar({ data = 0, setData, className }: { data?: number, setData: (height: number) => void, className?: string }) {
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        const startY = e.clientY;
        const startHeight = data;

        const handleMouseMove = (event: MouseEvent) => {
            const delta = startY - event.clientY;
            setData(Math.max(250, startHeight + delta));
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className={"sticky top-0 z-50 bg-background w-full h-10 content-center cursor-grab " + className} onMouseDown={handleMouseDown}>
            <div
                className={"w-1/4 h-2 mx-auto rounded-full bg-foreground/25"}
            />
        </div>
    );
}
