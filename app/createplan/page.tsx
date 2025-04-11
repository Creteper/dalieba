
/*
 * @Author: ceteper 75122254@qq.com
 * @Date: 2025-04-11 08:35:21
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 12:24:13
 * @FilePath: \dalieba\app\createplan\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Minus, MapPin, Calendar, Wallet, Heart, Home } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ControlBar from "@/components/ui/control-bar";
import AiChat from "@/lib/ai-chat";
import { CreatePlanResponse } from "@/types/article";
type Preference = "游玩" | "综合" | "观景" | "美食";

const preferenceIcons = {
  "游玩": "🎮",
  "综合": "🌟",
  "观景": "🏞️",
  "美食": "🍜"
};

const ScenicSpot = `
只允许存在以下景点

哈尔滨中央大街
哈尔滨极地公园
哈尔滨融创文旅城
哈尔滨极地公园·极地馆
东北虎林园
银河欢乐世界
哈尔滨音乐公园
音乐长廊
索菲亚广场
哈尔滨防洪纪念塔广场
圣·索菲亚教堂
哈尔滨热雪奇迹
哈尔滨市人民防洪胜利纪念塔
松花江湿地
哈尔滨市兆麟公园
群力音乐公园大雪人
关东古巷
中华巴洛克风情街
松花江索道
斯大林公园
哈尔滨博物馆
新区中心公园
枫叶小镇温泉度假村
哈尔滨极地公园·海洋馆
虎园
哈尔滨冰雪大世界四季游乐馆
金河湾湿地植物园
人民广场
黑龙江省博物馆
沙滩部落.冰雪欢乐岛
太阳岛绿色运动公园
市政府广场
极乐寺
体育公园
哈药六版画博物馆
冰雪大世界梦幻冰雪馆
火车主题广场
龙塔
音乐主题广场
丁香公园
清真寺
哈尔滨群力外滩生态湿地公园
九站公园
波塞冬旅游度假区
世界欢乐城
哈尔滨音乐博物馆
阿拉伯广场
中东铁路桥头堡
音乐公园音乐长廊
巧克力星人博物馆
波塞冬海底世界
劳动公园
哈尔滨文庙
太阳岛风景区俄罗斯风情小镇
侵华日军第七三一部队遗址
松花江观光索道-太阳城堡站
东北烈士纪念馆
金河公园
哈尔滨市儿童公园
哈尔滨工业大学博物馆
黑龙江哈尔滨太阳岛国家湿地公园
哈尔滨市少年宫
哈尔滨市长青公园
外滩雪人码头大雪人
哈尔滨冰雪大世界-大阪城(日本)
湘江公园
东北林业大学中国(哈尔滨)森林博物馆
雨阳公园
靖宇公园
侵华日军第七三一部队罪证陈列馆
萧红故居
哈尔滨市道外区古梨园
梦想大舞台
伯特利教堂
乐松广场(太平桥店)
道外巴洛克博物馆
激情广场
黛秀湖公园
冰雪大世界(暂停开放)
太阳岛风景区
哈尔滨融创乐园(暂停开放)
钻石海(暂停开放)
太阳岛风景区-太阳岛雪博会(暂停开放)
外滩雪人码头
建国公园
太阳岛西区外滩湿地公园
黑龙江省博物馆新馆(装修中)
上坞沙滩戏雪乐园
圣清观
火车主题广场-中东铁路印象馆
天恒山冰雪运动大世界(暂停营业)`

export default function CreatePlanPage() {
  const router = useRouter();
  const [budget, setBudget] = useState<string>("");
  const [preference, setPreference] = useState<Preference>("综合");
  const [days, setDays] = useState<number>(3);
  const [isEditingDays, setIsEditingDays] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const aiChat = new AiChat();
  const handleDaysChange = (value: number) => {
    if (value < 1) {
      toast.error("最少需要1天");
      return;
    }
    if (value > 7) {
      toast.error("最多支持7天");
      return;
    }
    setDays(value);
  };

  const handleSubmit = async () => {
    if (!budget) {
      toast.error("请输入预算");
      return;
    }
    setIsSubmitting(true);
    // TODO: 调用AI生成攻略
    const userId = localStorage.getItem("user_id") || "";
    if (userId === "") {
      toast.error("请先登录");
      setIsSubmitting(false);
      router.push("/login");
      return;
    }
    const message = `哈尔滨${days}天攻略 ${budget}元预算，偏好:“${preference}”`;
    const res = await aiChat.createPlan<CreatePlanResponse>(userId, message, "哈尔滨市", message);
    if (res.status === 200) {
      toast.success("攻略生成成功");
      router.push("/createplan/" + message);
    } else {
      toast.error("攻略生成失败");
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      className="w-full h-screen flex items-center justify-center bg-[url('/images/bg-all-jd.png')] bg-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-full h-screen bg-black/70 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container max-w-2xl mx-auto py-8 px-4 relative"
        >
          <ControlBar variant="reversalDefault" />
          {/* 返回主页按钮 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="absolute top-0 left-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-sm font-medium">返回主页</span>
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl text-white font-bold mb-8 text-center"
          >
            创建AI攻略
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* 预算输入 */}
            <motion.div 
              whileHover={{ scale: 1 }}
              className="space-y-2 p-4 rounded-lg bg-card backdrop-blur-sm border border-border/50"
            >
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <Label className="text-lg">预算（元）</Label>
              </div>
              <Input
                type="number"
                placeholder="请输入您的预算"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="h-12 text-lg"
              />
            </motion.div>

            {/* 偏好选择 */}
            <motion.div 
              whileHover={{ scale: 1 }}
              className="space-y-2 p-4 rounded-lg bg-card backdrop-blur-sm border border-border/50"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <Label className="text-lg">偏好</Label>
              </div>
              <RadioGroup
                value={preference}
                onValueChange={(value) => setPreference(value as Preference)}
                className="grid grid-cols-2 gap-4"
              >
                {["游玩", "综合", "观景", "美食"].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <RadioGroupItem value={item} id={item} />
                    <Label htmlFor={item} className="text-lg cursor-pointer flex items-center gap-2">
                      <span className="text-2xl">{preferenceIcons[item as Preference]}</span>
                      {item}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </motion.div>

            {/* 天数选择 */}
            <motion.div 
              whileHover={{ scale: 1 }}
              className="space-y-2 p-4 rounded-lg bg-card backdrop-blur-sm border border-border/50"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <Label className="text-lg">天数</Label>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDaysChange(days - 1)}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  <Minus className="h-6 w-6" />
                </motion.button>
                
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {isEditingDays ? (
                      <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Input
                          type="number"
                          value={days}
                          onChange={(e) => handleDaysChange(Number(e.target.value))}
                          onBlur={() => setIsEditingDays(false)}
                          className="w-20 h-12 text-center text-2xl"
                          autoFocus
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="display"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="w-20 h-12 flex items-center justify-center text-2xl font-bold cursor-pointer"
                        onClick={() => setIsEditingDays(true)}
                      >
                        {days}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDaysChange(days + 1)}
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  <Plus className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>

            {/* 地点显示 */}
            <motion.div 
              whileHover={{ scale: 1 }}
              className="space-y-2 p-4 rounded-lg bg-card backdrop-blur-sm border border-border/50"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <Label className="text-lg">地点</Label>
              </div>
              <motion.div 
                whileHover={{ scale: 1 }}
                className="h-12 flex items-center justify-center text-xl font-bold text-primary bg-primary/10 rounded-lg"
              >
                哈尔滨
              </motion.div>
            </motion.div>

            {/* 提交按钮 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 text-lg bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
                      />
                      生成中...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      生成攻略
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}