"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { cn } from "@/lib/utils"

function AlwaysDrawerContent({
    className,
    children,
    title = "Drawer",
    triggerContent, // 添加新的prop
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
    title?: string,
    triggerContent?: React.ReactNode
}) {
    const [isOpen, setIsOpen] = React.useState(false)  // 修改默认值为false

    return (
        <DrawerPrimitive.Root modal={false} open={isOpen} onOpenChange={setIsOpen}>
            {/* 将 Trigger 移到 Content 外部 */}
            <DrawerPrimitive.Trigger asChild>
                {triggerContent}
            </DrawerPrimitive.Trigger>

            <DrawerPrimitive.Portal>
                <DrawerPrimitive.Content
                    data-slot="drawer-content"
                    className={cn(
                        "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
                        "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
                        className
                    )}
                    {...props}
                >
                    {/* 添加可访问性标题 */}
                    <DrawerPrimitive.Title className="sr-only">
                        {title}
                    </DrawerPrimitive.Title>
                    <div className="bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full" />
                    {children}
                </DrawerPrimitive.Content>
            </DrawerPrimitive.Portal>
        </DrawerPrimitive.Root>
    )
}

function AlwaysDrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn("flex flex-col gap-1.5 p-4", className)}
            {...props}
        />
    )
}

function AlwaysDrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn("mt-auto flex flex-col gap-2 p-4", className)}
            {...props}
        />
    )
}

function AlwaysDrawerTitle({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-title"
            className={cn("text-foreground font-semibold", className)}
            {...props}
        />
    )
}

function AlwaysDrawerDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

const AlwaysDrawerTrigger = DrawerPrimitive.Trigger;

export {
    AlwaysDrawerContent,
    AlwaysDrawerHeader,
    AlwaysDrawerFooter,
    AlwaysDrawerTitle,
    AlwaysDrawerDescription,
    AlwaysDrawerTrigger  // 添加 Trigger 的导出
}