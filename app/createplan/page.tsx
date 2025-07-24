"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Http } from "@/lib/axios";
import ControlBar from "@/components/ui/control-bar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import MapComponent from "@/components/map/MapComponent";
import { ReplaceParentheses } from "@/lib/scenic-spot";
import {
  Loader2,
  DollarSign,
  Calendar,
  BrainCircuit,
  Sparkles,
  LayoutIcon,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Home,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyzeRoute from "@/lib/analyze-route";
import { RouteData } from "@/types/article";
import { Route } from "@/components/map/MapComponent";
import {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineSeparator,
  TimelineDate,
  TimelineIndicator,
  TimelineContent,
} from "@/components/ui/timeline";
import { ServerConfig } from "@/lib/site";
import { showFakeData } from "@/lib/data-static";
// 移除滚动条样式对象
export default function CreatePlan() {
  const router = useRouter();
  const [data, setData] = useState({});
  const http = new Http("http://localhost:3000/api");
  const [showRightTravelBox, setShowRightTravelBox] = useState(false);
  const [analyzeRoute, setAnalyzeRoute] = useState<AnalyzeRoute | null>(null);
  const [dayRoutes, setDayRoutes] = useState<{ [key: number]: Route[] }>({});
  const [activeTab, setActiveTab] = useState("0");
  const [generatingDay, setGeneratingDay] = useState(0); // 当前正在生成第几天的数据
  const [generationComplete, setGenerationComplete] = useState(false); // 是否全部生成完成
  const [totalDays, setTotalDays] = useState(3); // 总天数，默认3天

  useEffect(() => {
    async function getTravel() {

      const routeData = JSON.parse(showFakeData);
      const analyzeRoute = new AnalyzeRoute(routeData as RouteData);
      setAnalyzeRoute(analyzeRoute);
    }
    getTravel();
  }, []);

  useEffect(() => {
    if (analyzeRoute && activeTab && generatingDay >= parseInt(activeTab) + 1) {
      const day = parseInt(activeTab) + 1;
      if (!dayRoutes[day]) {
        async function fetchRoutes() {
          try {
            console.log(`获取第${day}天路线数据`);
            const routes = (await analyzeRoute?.getDayRoutes(day)) || [];
            console.log(`第${day}天路线数据:`, routes);
            setDayRoutes((prev) => ({ ...prev, [day]: routes }));
          } catch (error) {
            console.error(`获取第${day}天路线数据失败:`, error);
            setDayRoutes((prev) => ({ ...prev, [day]: [] }));
          }
        }
        fetchRoutes();
      }
    }
  }, [analyzeRoute, activeTab, dayRoutes, generatingDay]);

  // 监听生成天数变化，逐步生成每天的路线
  useEffect(() => {
    if (generatingDay > 0 && generatingDay <= totalDays && analyzeRoute) {
      async function generateDayRoute() {
        try {
          console.log(`生成第${generatingDay}天路线数据`);
          const routes =
            (await analyzeRoute?.getDayRoutes(generatingDay)) || [];
          console.log(`第${generatingDay}天路线数据:`, routes);
          setDayRoutes((prev) => ({ ...prev, [generatingDay]: routes }));

          // 检查是否已生成所有天数的数据
          if (generatingDay === totalDays) {
            setGenerationComplete(true);
          }
        } catch (error) {
          console.error(`生成第${generatingDay}天路线数据失败:`, error);
          setDayRoutes((prev) => ({ ...prev, [generatingDay]: [] }));
        }
      }
      generateDayRoute();
    }
  }, [generatingDay, totalDays, analyzeRoute]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="w-full h-screen overflow-hidden p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/")}
            className="h-9 w-9"
          >
            <Home className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">行程规划</h1>
        </div>
        <ControlBar className="static" />
      </div>
      <div
        className={cn(
          "w-full h-[calc(100%-3rem)] grid gap-4 mr-4",
          showRightTravelBox
            ? "grid-cols-[400px_calc(100%-400px)]"
            : "grid-cols-[1fr_0]"
        )}
      >
        <div className="h-full w-[400px] rounded-md bg-background shadow-sm border-border border-1 dark:bg-muted flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-xl font-bold">
              <Typewriter words={["行程规划"]} typeSpeed={100} />
            </div>
          </div>
          {/* 内容区域 - 将消息列表和交互区域放在此处 */}
          <CreateMessage
            title="嘿，我的朋友！👋"
            setShowRightTravelBox={setShowRightTravelBox}
            showRightTravelBox={showRightTravelBox}
            setGeneratingDay={setGeneratingDay}
            setTotalDays={setTotalDays}
          />
        </div>
        <AnimatePresence mode="wait">
          {showRightTravelBox && (
            <motion.div
              className="h-full w-full rounded-md bg-background shadow-sm border-border border-1 dark:bg-muted overflow-y-auto custom-scrollbar"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-full justify-between flex items-center border-border border-b-1 p-4">
                <div className="text-xl font-bold">
                  <Typewriter words={["查看规划行程"]} typeSpeed={100} />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowRightTravelBox(false)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 w-full">
                <div className="w-full p-4 bg-blue-100 dark:bg-blue-500 rounded-md border-border border-1">
                  <h1 className="text-2xl font-bold">哈尔滨{totalDays}日游</h1>
                  <p className="text-sm text-foreground mt-2">
                    此行程为您规划了{totalDays}
                    天的哈尔滨之旅，总预算¥5000，涵盖了城市最著名的景点和体验。
                  </p>
                </div>
              </div>
              <div className="w-full p-4">
                <Tabs
                  defaultValue="0"
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-lg mb-4 dark:bg-background">
                    {Array.from({ length: totalDays }).map((_, index) => (
                      <TabsTrigger
                        key={index}
                        value={index.toString()}
                        disabled={index + 1 > generatingDay}
                        className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all dark:data-[state=active]:bg-orange-500 dark:data-[state=active]:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Day {index + 1}
                        {index + 1 > generatingDay && (
                          <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Array.from({ length: totalDays }).map((_, index) => (
                    <TabsContent
                      key={index}
                      value={index.toString()}
                      className="animate-in fade-in-50 duration-300"
                    >
                      {index + 1 <= generatingDay ? (
                        <>
                          <div className="w-full rounded-lg overflow-hidden border border-border shadow-sm bg-card mb-4">
                            <div className="p-3 border-b bg-muted/30">
                              <h3 className="text-lg font-medium">
                                第{index + 1}天地图导览
                              </h3>
                            </div>
                            <div className="w-full h-[350px] rounded-b-md overflow-hidden">
                              <MapComponent
                                maxZoom={18}
                                minZoom={13}
                                layOutisPoints={false}
                                className="w-full h-full"
                                markers={analyzeRoute?.getDayMakers(index + 1)}
                                routes={dayRoutes[index + 1] || []}
                              />
                            </div>
                          </div>

                          <div className="w-full rounded-lg overflow-hidden border border-border shadow-sm bg-card">
                            <div className="p-3 border-b bg-muted/30">
                              <h3 className="text-lg font-medium">
                                第{index + 1}天行程安排
                              </h3>
                            </div>
                            <div className="p-4">
                              <Timeline>
                                {analyzeRoute
                                  ?.getDayDetailData(index + 1)
                                  ?.trip.map((trip, tripIndex) => (
                                    <TimelineItem
                                      key={`trip-${index}-${trip.id}`}
                                      step={tripIndex + 1}
                                      className="group-data-[orientation=vertical]/timeline:ms-10"
                                    >
                                      <TimelineHeader>
                                        <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                                        <TimelineDate className="mt-0.5 text-xs rounded-full">
                                          {trip.arrivalTime}
                                        </TimelineDate>
                                        <TimelineTitle className="mt-0.5 font-medium mb-4">
                                          {trip.name}
                                        </TimelineTitle>
                                        <TimelineIndicator className="bg-primary/10 text-primary group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                                          {tripIndex + 1}
                                        </TimelineIndicator>
                                      </TimelineHeader>
                                      <TimelineContent>
                                        <div className="p-3 bg-muted/50 rounded-lg shadow-sm hover:bg-muted/70 transition-colors cursor-pointer">
                                          <div className="flex items-start gap-3">
                                            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border border-border/50 shadow-sm">
                                              <img
                                                src={`${
                                                  ServerConfig.userApiUrl
                                                }/img/${ReplaceParentheses(
                                                  trip.name
                                                )}.jpg`}
                                                alt={trip.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <div className="text-sm text-foreground/90 line-clamp-2 mb-2">
                                                {trip.description}
                                              </div>
                                              {trip.nextSpot && (
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 inline-flex items-center">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="w-3 h-3 mr-1"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                                      />
                                                    </svg>
                                                    {
                                                      trip.nextSpot.travelMode
                                                        .mode
                                                    }
                                                  </span>
                                                  <span className="text-xs bg-yellow-500/10 text-yellow-500 rounded-full px-2 py-0.5 inline-flex items-center">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="w-3 h-3 mr-1"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                      />
                                                    </svg>
                                                    {
                                                      trip.nextSpot.travelMode
                                                        .travelTime
                                                    }
                                                    分钟
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </TimelineContent>
                                    </TimelineItem>
                                  ))}
                              </Timeline>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full p-12 flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground">
                            正在生成第{index + 1}天行程，请稍候...
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 添加全局CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>
    </div>
  );
}

// 消息类型定义
type MessageType = {
  id: string;
  content: string;
  type: "system" | "user" | "input" | "loading" | "toggle";
  inputType?: "budget" | "days";
  selected?: string | number;
  loadingStage?: "thinking" | "planning" | "generating";
  icon?: React.ReactNode;
  onClick?: () => void;
};

export function CreateMessage({
  title,
  setShowRightTravelBox,
  showRightTravelBox,
  setGeneratingDay,
  setTotalDays,
}: {
  title: string;
  setShowRightTravelBox: (show: boolean) => void;
  showRightTravelBox: boolean;
  setGeneratingDay: (day: number) => void;
  setTotalDays: (days: number) => void;
}) {
  const [createPlanIsLoading, setCreatePlanIsLoading] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [showDaysSelector, setShowDaysSelector] = useState(false);
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState(0);
  const [showStartButton, setShowStartButton] = useState(true);
  const [planningStage, setPlanningStage] = useState<
    "idle" | "thinking" | "planning" | "generating"
  >("idle");
  const [planComplete, setPlanComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentGeneratingDay, setCurrentGeneratingDay] = useState(0); // 当前生成的天数
  const [messageIdCounter, setMessageIdCounter] = useState(1); // 添加消息ID计数器

  // 生成唯一ID的函数 - 使用随机数，避免重复key
  const generateUniqueId = (): string => {
    // 使用时间戳 + 随机数 + 计数器确保唯一性
    const id = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}-${messageIdCounter}`;
    setMessageIdCounter((prev) => prev + 1);
    return id;
  };

  // 消息历史记录
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "initial-message",
      content:
        "想去 哈尔滨 旅游，但是不知道怎么规划行程，需要我帮您规划一下吗？",
      type: "system",
    },
  ]);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 组件挂载时和窗口尺寸变化时确保滚动正常
  useEffect(() => {
    scrollToBottom();
    window.addEventListener("resize", scrollToBottom);
    return () => {
      window.removeEventListener("resize", scrollToBottom);
    };
  }, []);

  // 当加载状态改变时，如果处于加载中状态，设置3秒后显示预算输入
  useEffect(() => {
    if (createPlanIsLoading) {
      const timer = setTimeout(() => {
        setCreatePlanIsLoading(false);
        setShowBudgetInput(true);
        setShowStartButton(false);

        // 添加系统消息
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            content: "请告诉我您的预算是多少？",
            type: "system",
            inputType: "budget",
          },
        ]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [createPlanIsLoading]);

  // 切换右侧面板显示/隐藏
  const toggleRightPanel = () => {
    setShowRightTravelBox(!showRightTravelBox);
  };

  // 监控规划阶段变化
  useEffect(() => {
    if (planningStage === "thinking") {
      // AI思考阶段
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content: "正在分析您的需求...",
          type: "loading",
          loadingStage: "thinking",
          icon: (
            <BrainCircuit className="h-5 w-5 text-blue-500 animate-pulse" />
          ),
        },
      ]);

      // 2秒后进入构思计划阶段
      const timer = setTimeout(() => {
        setPlanningStage("planning");
      }, 2000);

      return () => clearTimeout(timer);
    } else if (planningStage === "planning") {
      // 构思计划阶段
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content: "正在构思最佳行程方案...",
          type: "loading",
          loadingStage: "planning",
          icon: <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />,
        },
      ]);

      // 在planning阶段就显示右侧面板
      setShowRightTravelBox(true);

      // 2秒后进入生成计划阶段
      const timer = setTimeout(() => {
        setPlanningStage("generating");
      }, 2000);

      return () => clearTimeout(timer);
    } else if (planningStage === "generating") {
      // 生成计划阶段
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content: "正在生成详细行程规划...",
          type: "loading",
          loadingStage: "generating",
          icon: <LayoutIcon className="h-5 w-5 text-green-500 animate-pulse" />,
        },
      ]);

      // 开始逐天生成行程数据
      setCurrentGeneratingDay(1);

      // 完成后将阶段设置为idle，防止重复触发
      setPlanningStage("idle");
    }
  }, [planningStage, setShowRightTravelBox]);

  // 监控当前生成的天数，逐步生成内容
  useEffect(() => {
    if (currentGeneratingDay > 0 && currentGeneratingDay <= days) {
      // 模拟第currentGeneratingDay天数据生成
      const generateTimer = setTimeout(() => {
        // 添加消息提示当前正在生成的天数
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            content: `正在生成第${currentGeneratingDay}天行程安排...`,
            type: "system",
          },
        ]);

        // 通知父组件当前正在生成第几天
        setGeneratingDay(currentGeneratingDay);

        // 生成完一天后，继续生成下一天，直到全部天数生成完毕
        if (currentGeneratingDay < days) {
          setCurrentGeneratingDay(currentGeneratingDay + 1);
        } else {
          // 全部生成完毕
          setPlanComplete(true);
          // 添加完成消息，可点击切换右侧面板
          setMessages((prev) => [
            ...prev,
            {
              id: generateUniqueId(),
              content: "行程规划已完成，点击切换右侧详细安排！",
              type: "toggle",
              onClick: toggleRightPanel,
            },
          ]);
        }
      }, 4000);

      return () => clearTimeout(generateTimer);
    }
  }, [currentGeneratingDay, days, setMessages, setGeneratingDay]);

  const handleBudgetSelect = (amount: string) => {
    setBudget(amount);
  };

  const handleBudgetConfirm = () => {
    if (budget) {
      setShowBudgetInput(false);
      setShowDaysSelector(true);

      // 添加用户预算选择消息
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          content: `我的预算是 ${budget} 元`,
          type: "user",
          selected: budget,
        },
        {
          id: generateUniqueId(),
          content: "您计划游玩几天？",
          type: "system",
          inputType: "days",
        },
      ]);
    }
  };

  const handleDaysSelect = (selectedDays: number) => {
    setDays(selectedDays);
    setTotalDays(selectedDays);
    setShowDaysSelector(false);

    // 添加用户天数选择消息
    setMessages((prev) => [
      ...prev,
      {
        id: generateUniqueId(),
        content: `我计划游玩 ${selectedDays} 天`,
        type: "user",
        selected: selectedDays,
      },
    ]);

    // 开始三阶段加载过程
    setPlanningStage("thinking");
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* 消息历史记录区域 - 可滚动 */}
      <div className="absolute inset-0 top-0 bottom-[80px] overflow-y-auto px-4 pt-4 pb-2 custom-scrollbar">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 p-4 bg-background rounded-xl border-border border-1 dark:bg-muted">
            <div className="text-xl font-bold">{title}</div>
            <div className="text-sm">{messages[0].content}</div>
          </div>

          {messages.slice(1).map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-xl",
                message.type === "user"
                  ? "bg-primary ml-auto max-w-[85%]"
                  : message.type === "loading"
                  ? "bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  : message.type === "toggle"
                  ? "bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/30 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  : "bg-background border-border border-1 dark:bg-muted"
              )}
              onClick={message.onClick}
            >
              <div
                className={
                  message.type === "user"
                    ? "text-background"
                    : message.type === "toggle"
                    ? "text-green-800 dark:text-green-300"
                    : "text-foreground"
                }
              >
                {message.type === "loading" && message.icon && (
                  <div className="flex items-center gap-2 mb-1">
                    {message.icon}
                    <div className="font-medium text-sm">
                      <Typewriter
                        words={
                          message.loadingStage === "thinking"
                            ? ["AI思考分析"]
                            : message.loadingStage === "planning"
                            ? ["构思行程方案"]
                            : ["生成行程规划"]
                        }
                        cursor={true}
                      />
                    </div>
                  </div>
                )}
                {message.type === "toggle" ? (
                  <div className="flex items-center justify-between">
                    <span>{message.content}</span>
                    {showRightTravelBox ? (
                      <ChevronLeft className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    )}
                  </div>
                ) : message.type === "system" ? (
                  <Typewriter words={[message.content]} cursor={true} />
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入区域 - 固定在底部 */}
      <div className={cn("absolute bottom-0 left-0 right-0 p-4")}>
        <div className="flex flex-col gap-3">
          {showStartButton && (
            <CreatePlanButton
              createPlanIsLoading={createPlanIsLoading}
              setCreatePlanIsLoading={setCreatePlanIsLoading}
            />
          )}

          {showBudgetInput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 p-4 bg-background rounded-xl border-border border-1 dark:bg-muted"
            >
              <div className="relative">
                <Input
                  type="number"
                  placeholder="输入您的预算"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-8"
                />
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              <Button
                className="w-full mt-2"
                onClick={handleBudgetConfirm}
                disabled={!budget}
              >
                确认预算
              </Button>
            </motion.div>
          )}

          {showDaysSelector && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 p-4 bg-background rounded-xl border-border border-1 dark:bg-muted"
            >
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map((dayOption) => (
                  <Button
                    key={dayOption}
                    variant={days === dayOption ? "default" : "outline"}
                    onClick={() => handleDaysSelect(dayOption)}
                  >
                    <Calendar className="h-5 w-5 mb-1" />
                    <span>{dayOption} 天</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {planComplete && !showBudgetInput && !showDaysSelector && (
            <Button
              variant="outline"
              className="w-full"
              onClick={toggleRightPanel}
            >
              {showRightTravelBox ? "隐藏行程详情" : "显示行程详情"}
              {showRightTravelBox ? (
                <ChevronLeft className="h-4 w-4 ml-2" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-2" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreatePlanButton({
  createPlanIsLoading,
  setCreatePlanIsLoading,
}: {
  createPlanIsLoading: boolean;
  setCreatePlanIsLoading: (isLoading: boolean) => void;
}) {
  return (
    <Button
      variant="default"
      className="w-full"
      disabled={createPlanIsLoading}
      onClick={() => setCreatePlanIsLoading(true)}
    >
      {createPlanIsLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          规划中...
        </div>
      ) : (
        "帮我规划一下"
      )}
    </Button>
  );
}
