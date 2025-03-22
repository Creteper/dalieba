/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-19 13:59:54
 * @LastEditors: Creteper 7512254@qq.com
 * @LastEditTime: 2025-03-21 17:49:47
 * @FilePath: \dalieba\app\login\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { User, Lock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import UserClient from "@/lib/use-client"
import { toast } from "sonner"

export default function Login() {
    const { setTheme } = useTheme()
    const router = useRouter()
    const userClient = new UserClient()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        setTheme('dark')

        const checkToken = async () => {
            const isValid = await userClient.verifyToken();
            if (isValid) {
                // 如果token无效，可以选择重定向或其他操作
                router.push("/home")
            }
        };

        checkToken();
    }, [setTheme])

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    })

    const validateUserName = (username: string) => {
        if (!username) {
            return '请输入手机号'
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

    const handleInputChange = (field: 'username' | 'password', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // 实时验证
        if (field === 'username') {
            setErrors(prev => ({
                ...prev,
                username: validateUserName(value)
            }))
            setUsername(value)
        } else {
            setErrors(prev => ({
                ...prev,
                password: validatePassword(value)
            }))
            setPassword(value)
        }
    }

    const handleSubmit = async () => {
        // 提交时验证
        const userNameError = validateUserName(formData.username)
        const passwordError = validatePassword(formData.password)

        setErrors({
            username: userNameError,
            password: passwordError
        })

        if (!userNameError && !passwordError) {
            // TODO: 处理登录逻辑
            try {
                const response = await userClient.Login(formData.username, formData.password);
                if (response.status === 200) {
                    toast.success("登录成功, 一秒后跳转主页")
                    // console.log(response.data.token)
                    localStorage.setItem("token", response.data.token)
                    setTimeout(() => {
                        router.push("/home")
                    }, 1000)
                }
            } catch (error: any) {
                toast.error(error.response.data.error)
            }
        }
    }

    return (
        <div className="min-h-screen w-full overflow-hidden relative" data-theme="dark">
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
                className="relative flex flex-col items-center justify-center h-screen max-w-sm mx-auto px-4 gap-12 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="text-center">
                    <div className="w-full flex items-center justify-center mb-2">
                        <img src="/images/logo.svg" alt="GO TOGETHER!" className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-bold">
                        Go! Together
                    </h1>
                    <p className="text-muted-foreground mt-2">规划行程，结伴而行</p>
                </div>

                {/* 登录表单 - 添加半透明背景提高可读性 */}
                <div className="w-full space-y-6 p-6 ">
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

                    <div className="mb-12">
                        <Button
                            className="w-full h-12"
                            onClick={handleSubmit}
                        >
                            登录
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="text-muted-foreground text-sm absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 p-4 rounded-full">
                            Or
                        </div>
                        <Separator />
                    </div>

                    <div className="flex justify-center flex-col gap-2">
                        <Button variant="link" className="text-muted-foreground" onClick={() => router.push('/register')}>
                            没有账号？注册
                        </Button>
                        <Button variant="link" className="text-muted-foreground">
                            忘记密码？
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="text-muted-foreground text-xs fixed bottom-12 left-0 right-0 text-center z-10">
                <p>登录即表示同意<Link href="/terms" className="hover:text-primary transition-colors">《用户协议》</Link>和<Link href="/privacy" className="hover:text-primary transition-colors">《隐私政策》</Link></p>
            </div>
        </div>
    )
}
