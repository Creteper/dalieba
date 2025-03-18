'use client'

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ModeToggle } from "@/components/theme/ThemeToggle";

export default function Main() {

    function alt() {
        alert("Hello world")
    }
    return (
        <div className="flex items-center justify-center">
            <Button size="icon" onClick={alt}>
                <Home />
            </Button>
            <ModeToggle />
            <p className="text-9xl font-bold">字体预览</p>
            <p className="text-9xl font-bold">Typeface</p>
        </div>
    );
}