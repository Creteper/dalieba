"use client"

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import('./Map'), {
    ssr: false
});

export default function Map666() {
    return (
        <div className="w-full h-screen">
            <MapComponent />
        </div>
    )
}