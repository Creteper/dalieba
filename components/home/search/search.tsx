/*
 * @Author: Creteper 7512254@qq.com
 * @Date: 2025-03-25 09:04:24
 * @LastEditors: ceteper 75122254@qq.com
 * @LastEditTime: 2025-04-11 14:45:42
 * @FilePath: \dalieba\components\home\search\search.tsx
 * @Description: 用于显示搜索框
 */

"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Flame, MapPin, Clock, ArrowLeft } from "lucide-react";
import * as React from "react";
import ScenicSpot from "@/lib/scenic-spot";
import { RecommendScenicSpotResponse, ScenicSpotResponse } from "@/types/article";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export default function SearchBox({
  ...prop
}: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const [recommendScenicSpot, setRecommendScenicSpot] = useState<RecommendScenicSpotResponse>({ sights: [] });
  const scenicSpot = new ScenicSpot();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ScenicSpotResponse>({ sights: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  // 获取推荐景点
  useEffect(() => {
    async function getRecommendScenicSpot() {
      try {
        const res = await scenicSpot.recommendScenicSpot<RecommendScenicSpotResponse>();
        if (res && res.sights) {
          setRecommendScenicSpot(res);
        }
      } catch (error) {
        console.error("获取推荐景点失败:", error);
      }
    }
    getRecommendScenicSpot();
  }, []);

  // 创建和更新防抖函数
  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      console.log("执行防抖搜索:", query);
      handleSearch(query);
    }, 500);

    return () => {
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel();
      }
    };
  }, []);

  // 处理搜索
  const handleSearch = useCallback(async (keyword: string) => {
    if (!keyword || !keyword.trim()) {
      setSearchResults({ sights: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await scenicSpot.keywordSearch<any>(keyword);
      console.log("搜索API返回:", response);
      
      if (!response || typeof response !== 'object') {
        console.warn("API返回格式无效:", response);
        setSearchResults({ sights: [] });
        return;
      }
      
      setSearchResults(response);
    } catch (error) {
      console.error("搜索失败:", error);
      setSearchResults({ sights: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 如果输入为空，立即清除结果
    if (!value || !value.trim()) {
      setSearchResults({ sights: [] });
      setHasSearched(false);
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel();
      }
      return;
    }
    
    // 使用防抖函数进行搜索
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(value);
    }
  };

  // 处理景点点击
  const handleSpotClick = (id: number) => {
    setOpen(false);
    router.push(`/${id}`);
  };

  // 打开搜索时自动聚焦
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 打开搜索时重置
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // 重置所有状态
      setSearchQuery("");
      setSearchResults({ sights: [] });
      setHasSearched(false);
      if (debouncedSearchRef.current) {
        debouncedSearchRef.current.cancel();
      }
    }
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 如果没有搜索结果，不处理键盘导航
    if (!searchResults?.sights || !Array.isArray(searchResults.sights) || searchResults.sights.length === 0) {
      setSelectedIndex(-1);
      return;
    }

    const maxIndex = searchResults.sights.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex <= maxIndex) {
          const selectedSpot = searchResults.sights[selectedIndex];
          handleSpotClick(selectedSpot.id);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  // 当搜索结果变化时重置选中索引
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // 确保选中项可见
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultsRef.current) {
      const container = searchResultsRef.current;
      const selectedElement = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      
      if (selectedElement) {
        // 计算是否需要滚动
        const containerRect = container.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();
        
        // 如果选中项在容器可视区域外，滚动到可视区域
        if (selectedRect.top < containerRect.top) {
          selectedElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } else if (selectedRect.bottom > containerRect.bottom) {
          selectedElement.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
      }
    }
  }, [selectedIndex]);

  return (
    <div className={cn("md:w-1/2 w-[150px] sm:w-[150px]", prop.className)}>
      {isMobile ? (
        <Button
          variant="outline"
          className="justify-start w-full text-muted-foreground hover:scale-100 border-muted/60 hover:border-muted"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 text-muted-foreground/70" />
          <span className="text-muted-foreground/90">搜索景点</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="justify-start w-full text-muted-foreground hover:scale-100 border-muted/60 hover:border-muted"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4 text-muted-foreground/70" />
          <span className="text-muted-foreground/90">搜索景点、地址、区域...</span>
        </Button>
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="p-0 gap-0 max-w-[300px] overflow-hidden border border-border/40 shadow-lg rounded-lg">
          <VisuallyHidden>
            <DialogTitle>搜索景点</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center px-3 py-2 border-b border-border/30 bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-7 w-7 rounded-full hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="搜索景点..."
                className="pl-7 h-8 text-sm bg-background/60 border-muted/50 focus-visible:ring-primary/30"
              />
            </div>
          </div>
          
          <div className="py-1.5 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent" ref={searchResultsRef}>
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-2 text-xs text-muted-foreground">搜索中...</span>
              </div>
            )}
            
            {hasSearched && !isSearching && (!searchResults?.sights || searchResults.sights.length === 0) && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted/50 p-2.5 mb-2">
                  <Search className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground">未找到相关景点</p>
                <p className="text-xs text-muted-foreground/70 mt-1">请尝试其他关键词</p>
              </div>
            )}
            
            {/* 搜索结果 */}
            {searchResults?.sights && Array.isArray(searchResults.sights) && searchResults.sights.length > 0 && (
              <div className="space-y-1 px-1">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground/90">
                  搜索结果 ({searchResults.sights.length})
                </div>
                <div>
                  {searchResults.sights.map((spot, index) => (
                    <Button
                      key={spot.id || Math.random().toString()}
                      data-index={index}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-2 py-1.5 h-auto text-left rounded-md transition-all duration-200",
                        selectedIndex === index 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-muted/70 text-foreground"
                      )}
                      onClick={() => handleSpotClick(spot.id)}
                    >
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5 flex-shrink-0">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{spot.name || '未命名景点'}</span>
                          <span className="text-xs text-muted-foreground/80 line-clamp-1 mt-0.5">{spot.address || '无地址信息'}</span>
                          {(spot.adname || spot.city_name) && (
                            <span className="text-xs text-muted-foreground/60 mt-0.5">
                              {spot.adname || ''} {spot.adname && spot.city_name ? '·' : ''} {spot.city_name || ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* 热门推荐 - 只在没有搜索内容或结果时显示 */}
            {(!searchQuery || (searchResults?.sights?.length === 0 && !isSearching)) && (
              <div className="space-y-3 px-1">
                <div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground/90">
                    热门推荐
                  </div>
                  <div className="mt-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto text-sm rounded-md hover:bg-muted/70"
                      onClick={() => router.push("/createplan")}
                    >
                      <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" />
                      <span>AI生成旅行攻略</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-auto text-sm rounded-md hover:bg-muted/70"
                      onClick={() => router.push("/allScenicSpotCard")}
                    >
                      <MapPin className="mr-2 h-3.5 w-3.5 text-green-500" />
                      <span>所有哈尔滨景点</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground/90">
                    热门榜单
                  </div>
                  <div className="mt-1">
                    {recommendScenicSpot?.sights?.slice(0, 3).map((spot, index) => (
                      <Button
                        key={spot.id}
                        variant="ghost"
                        className="w-full justify-start px-2 py-1.5 h-auto text-sm rounded-md hover:bg-muted/70"
                        onClick={() => handleSpotClick(spot.id)}
                      >
                        <div className="mr-2 flex-shrink-0 rounded-full bg-orange-500 h-4 w-4 flex items-center justify-center">
                          <span className={`text-[10px] font-medium text-white bg-orange-500}`}>{index + 1}</span>
                        </div>
                        <span className="truncate">{spot.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-muted-foreground px-2 py-1 border-t border-border/20 mt-2">
                  <div className="flex items-center space-x-1">
                    <span>提示:</span>
                    <span>↑↓</span>
                    <span>选择</span>
                    <span>·</span>
                    <span>Enter</span>
                    <span>确认</span>
                  </div>
                  <div>Esc 关闭</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
