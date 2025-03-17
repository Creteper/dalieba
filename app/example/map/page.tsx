'use client'

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
    ssr: false
});

export default function ExampleMap() {
    return <MapComponent />;
}