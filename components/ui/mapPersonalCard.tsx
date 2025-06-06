'use client'

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { motion } from "motion/react";
import { Typewriter } from 'react-simple-typewriter';

export default function MapPersonalCard({ className }: { className?: string }) {
    const [userName, setUserName] = useState("烙铁牛逼666")

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={"w-96 " + className}>
                <CardHeader className="flex justify-between">
                    <div className="flex flex-col gap-3">
                        <CardTitle>
                            @{userName}
                        </CardTitle>
                        <CardDescription>
                            <Typewriter 
                                words={['今日晴转多云，适宜出门走动，但风较大，请注意保暖!']} 
                                cursor={true}
                                typeSpeed={100}
                            />
                        </CardDescription>
                    </div>
                    <Avatar className="w-16 h-fit">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="flex justify-between">
                    <CardDescription>
                        今日气温
                    </CardDescription>
                    <CardDescription>
                        -13°C～3°C
                    </CardDescription>
                </CardContent>
            </Card>
        </motion.div>
    )
}