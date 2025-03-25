'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { User, Lock, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Http } from "@/lib/axios"
import { toast } from "sonner"

export default function Register() {
    const { setTheme } = useTheme()

    const httpClient = new Http(process.env.NEXT_PUBLIC_USER_API_URL as string)

    useEffect(() => {
        setTheme('dark')
    }, [setTheme])

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const validateUsername = (username: string) => {
        if (!username) {
            return '请输入用户名'
        }
        if (username.length < 2) {
            return '用户名长度不能小于2位'
        }
        return ''
    }

    const validatePhone = (phone: string) => {
        if (!phone) {
            return '请输入手机号'
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return '请输入正确的手机号'
        }
        return ''
    }

    const validateEmail = (email: string) => {
        if (!email) {
            return '请输入邮箱'
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return '请输入正确的邮箱'
        }
        return ''
    }

    const validatePassword = (password: string) => {
        if (!password) {
            return '请输入密码'
        }
        if (password.length < 6) {
            return '密码长度不能小于6位'
        }
        return ''
    }

    const validateConfirmPassword = (confirmPassword: string) => {
        if (!confirmPassword) {
            return '请确认密码'
        }
        if (confirmPassword !== formData.password) {
            return '两次输入的密码不一致'
        }
        return ''
    }

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        const validators = {
            username: validateUsername,
            phone: validatePhone,
            email: validateEmail,
            password: validatePassword,
            confirmPassword: validateConfirmPassword
        }

        setErrors(prev => ({
            ...prev,
            [field]: validators[field](value)
        }))
    }

    const handleSubmit = async () => {
        const newErrors = {
            username: validateUsername(formData.username),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validateConfirmPassword(formData.confirmPassword)
        }

        setErrors(newErrors)

        // username: '',
        //     phone: '',
        //         email: '',
        //             password: '',
        //                 confirmPassword: ''

        if (!Object.values(newErrors).some(error => error)) {
            try {
                const response = await httpClient.post("/register", {
                    account_password: {
                        account: formData.username,
                        password: formData.password
                    },
                    repeat_password: formData.confirmPassword,
                    username: formData.username,
                    email: formData.email
                })

                toast.success(response.data.messages)
            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    return (
        <div className="min-h-screen w-full overflow-hidden relative">
            {/* 背景动画球 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* 左上角球 */}
                <motion.div
                    className="absolute -left-32 -top-32 w-[500px] h-[400px] rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-50 blur-[200px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 右上角球 */}
                <motion.div
                    className="absolute -right-16 -top-16 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-blue-500 to-cyan-500 opacity-50 blur-[200px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -20, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 左下角球 */}
                <motion.div
                    className="absolute -left-32 -bottom-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-green-600 to-emerald-700 opacity-50 blur-[300px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* 右下角球 */}
                <motion.div
                    className="absolute -right-64 -bottom-64 w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-orange-500 to-yellow-500 opacity-50 blur-[250px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* 内容遮罩层 - 确保内容可读性 */}
            <div className="fixed inset-0 bg-background/30 backdrop-blur-xl pointer-events-none" />

            <motion.div
                className="relative flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto px-4 gap-8 z-10 py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        Go! Together
                    </h1>
                    <p className="text-muted-foreground mt-2">规划行程，结伴而行</p>
                </div>

                {/* 注册表单 */}
                <div className="w-full space-y-4">
                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <User className={cn(errors.username ? "text-destructive" : "text-muted-foreground", "absolute left-3 w-5 h-5 pointer-events-none")} />
                            <Input
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                placeholder="用户名"
                                className={cn("h-12 pl-10", errors.username && "border-destructive text-destructive")}
                            />
                        </div>
                        {errors.username && (
                            <div className="text-destructive text-sm px-1">{errors.username}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <Mail className={cn(errors.email ? "text-destructive" : "text-muted-foreground", "absolute left-3 w-5 h-5 pointer-events-none")} />
                            <Input
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="邮箱"
                                className={cn("h-12 pl-10", errors.email && "border-destructive text-destructive")}
                            />
                        </div>
                        {errors.email && (
                            <div className="text-destructive text-sm px-1">{errors.email}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <Lock className={cn(errors.password ? "text-destructive" : "text-muted-foreground", "absolute left-3 w-5 h-5 pointer-events-none")} />
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="密码"
                                className={cn("h-12 pl-10", errors.password && "border-destructive text-destructive")}
                            />
                        </div>
                        {errors.password && (
                            <div className="text-destructive text-sm px-1">{errors.password}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="relative flex items-center">
                            <Lock className={cn(errors.confirmPassword ? "text-destructive" : "text-muted-foreground", "absolute left-3 w-5 h-5 pointer-events-none")} />
                            <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                placeholder="确认密码"
                                className={cn("h-12 pl-10", errors.confirmPassword && "border-destructive text-destructive")}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <div className="text-destructive text-sm px-1">{errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="mt-8">
                        <Button
                            className="w-full h-12"
                            onClick={handleSubmit}
                        >
                            注册
                        </Button>
                    </div>

                    <div className="relative mt-8">
                        <div className="text-muted-foreground text-sm absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 p-4 rounded-full">
                            Or
                        </div>
                        <Separator />
                    </div>

                    <div className="flex justify-center">
                        <Button variant="link" className="text-muted-foreground" asChild>
                            <Link href="/login">已有账号？登录</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="text-muted-foreground text-xs fixed bottom-12 left-0 right-0 text-center z-10">
                <p>注册即表示同意<Link href="/terms" className="hover:text-primary transition-colors">《用户协议》</Link>和<Link href="/privacy" className="hover:text-primary transition-colors">《隐私政策》</Link></p>
            </div>
        </div>
    )
}
