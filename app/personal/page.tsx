"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PersonalPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/personal/setting");
    }, [router]);
}