"use client"

import { AlertDialogCancel, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export default function UpdatePwd() {

    const [changePwd, setChangePwd] = useState("")
    const [confirmChangePwd, setConfirmChangePwd] = useState("")


    const [errors, setErrors] = useState({
        changePwd: '',
        confirmChangePwd: ''
    })

    const validateChangePwd = (changePwd: string) => {
        if (!changePwd) {
            return '请输入密码'
        } else if (confirmChangePwd.length < 6) {
            return '密码长度不能小于6位'
        }
        return ''
    }

    const validateConfirmChangePwd = (confirmChangePwd: string) => {
        if (!confirmChangePwd) {
            return '请再次输入密码'
        } else if (confirmChangePwd.length < 6) {
            return '密码长度不能小于6位'
        } else if (confirmChangePwd !== changePwd) {
            return '两次输入的密码不一致'
        }
        return ''
    }

    const handleInputChange = (field: 'changePwd' | 'confirmChangePwd', value: string) => {
        if (field === 'changePwd') {
            setChangePwd(value)
        } else if (field === 'confirmChangePwd') {
            setConfirmChangePwd(value)
        }

        // 实时验证
        if (field === 'changePwd') {
            setErrors(prev => ({
                ...prev,
                changePwd: validateChangePwd(value)
            }))
            setChangePwd(value)
        } else if (field === 'confirmChangePwd') {
            setErrors(prev => ({
                ...prev,
                password: validateConfirmChangePwd(value)
            }))
            setConfirmChangePwd(value)
        }
    }

    const handleChangePwd = () => {
        const changePwdError = validateChangePwd(changePwd)
        const confirmChangePwdError = validateConfirmChangePwd(confirmChangePwd)

        setErrors({
            changePwd: changePwdError,
            confirmChangePwd: confirmChangePwdError
        })

        if (!changePwdError && !confirmChangePwdError) {
            try {
                console.log(`changePwd: ${changePwd}\nconfirmChangePwd: ${confirmChangePwd}`)
                toast.success("更新密码成功, 一秒后自动刷新页面")
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
                setChangePwd("")
                setConfirmChangePwd("")
            } catch (error: any) {
                toast.error("更新密码失败,", error.message)
                setChangePwd("")
                setConfirmChangePwd("")
                setErrors({
                    changePwd: '',
                    confirmChangePwd: ''
                })
            }
        }
    }

    return (
        <>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="changePwd">
                    输入您的新密码
                </Label>
                <Input
                    id="changePwd"
                    type="password"
                    value={changePwd}
                    onChange={(e) => {
                        handleInputChange('changePwd', e.target.value)
                    }}
                />
                {errors.changePwd && (
                    <div className="text-destructive text-sm px-1">{errors.changePwd}</div>
                )}
            </div>
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="confirmChangePwd">
                    再次输入确认您的新密码
                </Label>
                <Input
                    id="confirmChangePwd"
                    type="password"
                    value={confirmChangePwd}
                    onChange={(e) => {
                        handleInputChange('confirmChangePwd', e.target.value)
                    }}
                />
                {errors.confirmChangePwd && (
                    <div className="text-destructive text-sm px-1">{errors.confirmChangePwd}</div>
                )}
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                    setChangePwd("")
                    setConfirmChangePwd("")
                    setErrors({
                        changePwd: '',
                        confirmChangePwd: ''
                    })
                }}>
                    取消
                </AlertDialogCancel>
                <Button onClick={handleChangePwd}>
                    确认
                </Button>
            </AlertDialogFooter>
        </>
    )
}