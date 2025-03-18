'use client'

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ModeToggle } from "@/components/theme/ThemeToggle";
import { useRouter } from "next/navigation";

export default function Main() {

    function alt() {
        alert("Hello world")
    }

    const router = useRouter();

    const goMap = () => {
        router.push("/example/map666");
    }

    return (
        <div className="flex items-center justify-center">
            <Button size="icon" onClick={alt}>
                <Home />
            </Button>
            <ModeToggle />
            <Button onClick={goMap}>click me to map</Button>
        </div>
    );
}