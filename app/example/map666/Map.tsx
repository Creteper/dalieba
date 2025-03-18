import { useRef, useEffect } from "react";
import AMapLoader from '@amap/amap-jsapi-loader'

export default function Map666() {
    const mapRef = useRef<any>(null);

    var stylesArray = [
        {
            icon: { //图标样式
                img: "https://a.amap.com/jsapi_demos/static/resource/img/men3.png",
                size: [25, 25], //图标的原始大小
                anchor: "bottom-center", //锚点位置
                fitZoom: 14, //最合适的级别 在此级别显示为图标原始大小
                scaleFactor: 2, //地图放大一级的缩放比例系数
                maxScale: 2, //图片的最大放大比例，随着地图放大图标会跟着放大，最大为2
                minScale: 1, //图片的最小缩小比例，随着地图缩小图标会跟着缩小，最小为1
            },
            label: { //文本标注
                content: "百花殿", //文本内容
                position: "BM", //文本位置相对于图标的基准点，"BM"为底部中央
                minZoom: 15, //label的最小显示级别，即文本标注在地图15级及以上，才会显示
            },
        },
        {
            icon: {
                img: "https://a.amap.com/jsapi_demos/static/resource/img/tingzi.png",
                size: [250, 250],
                anchor: "bottom-center",
                fitZoom: 17.5,
                scaleFactor: 2,
                maxScale: 2,
                minScale: 0.125,
            },
            label: {
                content: "万寿亭",
                position: "BM",
                minZoom: 15,
            },
        },
    ];

    var zoomStyleMapping = {
        14: 0, //14-17级使用样式 0
        15: 0,
        16: 0,
        17: 0,
        18: 0, //18-20级使用样式 1
        19: 0,
        20: 0,
    };

    useEffect(() => {
        const loadMap = async () => {
            const AMap = await AMapLoader.load({
                key: "8202a002a6aa596a0269506beb30fe27",
                version: '2.0',
                plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.ElasticMarker']
            })

            var elasticMarker = new AMap.ElasticMarker({
                position: [116.405562, 39.881166], //点标记位置
                styles: stylesArray, //指定样式列表
                zoomStyleMapping: zoomStyleMapping, //指定 zoom 与样式的映射
            });

            // 创建地图实例
            const map = new AMap.Map('container', {
                zoom: 11,
                center: [116.397428, 39.90923]
            })

            map.add(elasticMarker); //添加到地图上
            map.setFitView(); //缩放地图到合适的视野级别

            mapRef.current = map
        }

        loadMap()
        return () => {
            if (mapRef.current) mapRef.current.destroy();
        };
    }, [])

    return (
        <div id="container" className="w-full h-full" />
    )
}