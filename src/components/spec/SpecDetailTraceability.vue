<template>
    <div class="traceability-container fit">
        <!-- 工具栏 -->
        <div class="bg-white">
            <div class="row q-gutter-sm">
                <q-btn dense icon="zoom_in" @click="zoomIn" />
                <q-btn dense icon="zoom_out" @click="zoomOut" />
                <q-btn dense icon="filter_center_focus" @click="centerView" />
            </div>
        </div>

        <!-- 图形展示区域 -->
        <div ref="treeContainer" id="tree-container" class="fit"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as d3 from 'd3'

interface Node {
    id: string
    name: string
    type: string
    group: string
    x?: number
    y?: number
    fx?: number | null
    fy?: number | null
}

interface Link {
    source: string
    target: string
}

interface Group {
    id: string
    label: string
    color: string
}

const treeContainer = ref<HTMLElement | null>(null)

// d3 相关所需的全局选择器
let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
let gRoot: d3.Selection<SVGGElement, unknown, HTMLElement, any>
let zoomBehavior: d3.ZoomBehavior<Element, unknown>
let simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>

// 测试数据
const graphData = {
    nodes: [
        { id: "SR001", name: "当前item", type: "软件需求", group: "软件需求" },
        { id: "SA001", name: "上游item1", type: "系统架构", group: "系统架构" },
        { id: "SR002", name: "上游item2", type: "系统需求", group: "系统需求" },
        { id: "SD001", name: "下游item", type: "软件设计", group: "软件设计" }
    ],
    links: [
        { source: "SA001", target: "SR001" },
        { source: "SR002", target: "SR001" },
        { source: "SR001", target: "SD001" }
    ],
    groups: [
        { id: "系统需求", label: "系统需求", color: "#e3f2fd" },
        { id: "系统架构", label: "系统架构", color: "#f3e5f5" },
        { id: "软件需求", label: "软件需求", color: "#e8f5e9" },
        { id: "软件设计", label: "软件设计", color: "#fff3e0" }
    ]
}

const initializeGraph = (width: number, height: number) => {
    if (!treeContainer.value) return

    // 清空容器内的内容
    d3.select(treeContainer.value).selectAll("*").remove()

    // 创建并配置 SVG
    svg = d3.select(treeContainer.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // 根容器
    gRoot = svg.append("g")

    // 设置缩放行为
    zoomBehavior = d3.zoom()
        .scaleExtent([0.5, 2])  // 指定缩放的range
        .on("zoom", (event) => {  // 注册缩放的回调函数
            gRoot.attr("transform", event.transform)  // 实时更新元素的位置和大小，实现平滑的缩放效果
        })

    // 定义的缩放行为应用到 SVG 元素上
    svg.call(zoomBehavior)

    // 创建一个 D3.js 的力导向图模拟器，用于实现节点和连线的自动布局
    simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])  // 创建模拟器
        .force("link", d3.forceLink(graphData.links) // 连接力,创建节点之间的链接关系
            .id((d: any) => d.id) // 确保链接的 source 和 target 能够正确匹配节点的 id
            .distance(150) // 设置连接线的理想长度为 150 像素
        )
        .force("charge", d3.forceManyBody().strength(-1000))  // 排斥力, 负值表示排斥力，正值表示吸引力, -1000 表示较强的排斥力，节点会相互远离
        .force("center", d3.forceCenter(width / 2, height / 2)) // 中心力, 将整个图形拉向画布中心
        .force("collision", d3.forceCollide().radius(80))  // 碰撞力, 防止节点重叠

    // 先渲染分组背景
    const groupSelection = gRoot.selectAll(".group") // 选择所有类名为 "group" 的元素, 初始时可能没有任何元素被选中
        .data(graphData.groups) // 将数据数组 graphData.groups 与选中的元素进行绑定, 每个数据项将对应一个 DOM 元素, D3 会自动计算需要添加、更新或删除的元素
        .enter()  // 选择那些"需要新创建"的元素
        .append("g")  // 每个新数据项创建一个 SVG group 元素（<g>）
        .attr("class", "group")  // 给每个新创建的元素添加 "group" 类名

    // 为每个分组添加一个矩形背景
    groupSelection.append("rect")            // 为每个 group 元素添加一个 <rect> 子元素
        .attr("class", "group-container")    // 给每个矩形添加 "group-container" 类名
        .attr("fill", d => d.color)          // 设置填充颜色
        .attr("opacity", 0.5)                // 设置透明度0.2（20%不透明）

	// 为每个分组添加文本标签
    groupSelection.append("text")      // 为每个分组添加文本标签
        .attr("class", "group-label")  // 给文本元素添加 "group-label" 类名
        .attr("dy", 20)                // 设置垂直偏移, 本会向下偏移 20 像素
        .text(d => d.label)            // 数据中的 label 属性作为显示文本

    // 绘制连线 (使用贝塞尔曲线)
    const linkSelection = gRoot.selectAll(".link") // 选择所有类名为 "link" 的元素,
        .data(graphData.links)  // 绑定数据
        .enter()                // 选择新建的数据（根据data和当前元素，需要新建的数据）
        .append("path")         // 为每个新数据添加一个 SVG path 元素
        .attr("class", "link")  // 为新创建的每个 path 元素添加一个 CSS 类名 "link"

    // 绘制节点
    const nodeSelection = gRoot.selectAll(".node")  // 选择所有类名为 "node" 的元素,
        .data(graphData.nodes)    // 绑定数据
        .enter()                  // 选择新建的数据
        .append("g")
        .attr("class", "node")
        .call(              
            d3.drag<any, Node>()  // 拖拽功能
                .on("start", (event, d) => {   // 拖拽开始
                    if (!event.active) simulation.alphaTarget(0.3).restart()
                    d.fx = d.x
                    d.fy = d.y
                })
                .on("drag", (event, d) => {    // 拖拽过程
                    d.fx = event.x
                    d.fy = event.y
                })
                .on("end", (event, d) => {     // 拖拽结束
                    if (!event.active) simulation.alphaTarget(0)
                    d.fx = null                // 清除节点的固定位置(设为 null),允许节点再次自由移动
                    d.fy = null
                })
        )

    nodeSelection.append("circle")    // 为之前创建的每个节点组(g元素)添加一个 SVG circle 元素
        .attr("r", 8)                 // 设置圆的半径为 8 像素
        .attr("fill", d => {          // 设置圆的填充颜色
            const gObj = graphData.groups.find(g => g.id === d.group)   // 找到对应的组，使用该组的颜色(gObj.color)
            return gObj ? gObj.color : "#fff"            // 如果没找到，默认使用白色("#fff")作为填充色
        })
        .attr("stroke", "#666")      // 设置圆的轮廓颜色为深灰色(#666)
        .attr("stroke-width", 2)     // 设置圆的轮廓宽度为 2 像素

    nodeSelection.append("text")     // 在每个节点的 g 元素中添加一个 SVG text 元素
        .attr("dx", 12)              // 设置为 12 表示文本会向右偏移 12 像素
        .attr("dy", ".35em")         // 用于使文本在垂直方向上与圆形中心对齐
        .text(d => d.name)           // 显示数据中的 name 属性作为节点标签
        .attr("font-size", 12)

    // 创建箭头标记
    svg.append("defs").selectAll("marker")
        .data(["end"])      // 绑定data，data固定为["end"]
        .enter()
        .append("marker")   // 创建 marker 元素，用于定义箭头的形状和属性
        .attr("id", d => d)  // 设置 marker 的 id 为 "end" (数据内容)
        .attr("viewBox", "0 -5 10 10")  // 设置viewBox
        .attr("refX", 20)   // 开始绘制的x的坐标
        .attr("refY", 0)    // 开始绘制的y的坐标
        .attr("markerWidth", 6)   // 尺寸
        .attr("markerHeight", 6)  // 尺寸
        .attr("orient", "auto")   // 方向自动
        .append("path")           // 路径绘制
        .attr("d", "M0,-5L10,0L0,5")  // 绘制的具体路径（开始的坐标->0,-5 -> 10,0 -> 0,5 -> 开始的坐标）
        .attr("fill", "#999")

    linkSelection.attr("marker-end", "url(#end)")  // 在link的末端添加上面的mark， id为end

    // 每帧更新位置
    simulation.on("tick", () => {
        // 更新连线位置
        linkSelection.attr("d", (d: any) => {
            const dx = d.target.x - d.source.x
            const dy = d.target.y - d.source.y
            const dr = Math.sqrt(dx * dx + dy * dy)
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
        })

        // 更新节点位置
        nodeSelection.attr("transform", (d: any) => `translate(${d.x},${d.y})`)

        // 更新分组背景位置和大小
        const padding = 40
        graphData.groups.forEach(group => {
            const groupNodes = graphData.nodes.filter(n => n.group === group.id)
            if (groupNodes.length > 0) {
                const minX = d3.min(groupNodes, (n: any) => n.x) - padding
                const maxX = d3.max(groupNodes, (n: any) => n.x) + padding
                const minY = d3.min(groupNodes, (n: any) => n.y) - padding
                const maxY = d3.max(groupNodes, (n: any) => n.y) + padding
                const w = (maxX || 0) - (minX || 0)
                const h = (maxY || 0) - (minY || 0)

                const currentGroup = groupSelection.filter(d => d.id === group.id)
                currentGroup.select("rect")
                    .attr("x", minX || 0)
                    .attr("y", minY || 0)
                    .attr("width", w < 0 ? 0 : w)
                    .attr("height", h < 0 ? 0 : h)

                currentGroup.select("text")
                    .attr("x", (minX || 0) + 10)
                    .attr("y", (minY || 0))
            }
        })
    })
	
    // 在布局结束后再调用一次居中
    simulation.on("end", () => {
        centerView()
    })
}

// 放大
const zoomIn = () => {
    svg.transition().call(zoomBehavior.scaleBy, 1.2)
}

// 缩小
const zoomOut = () => {
    svg.transition().call(zoomBehavior.scaleBy, 0.8)
}

// 居中视图
const centerView = () => {
    if (!treeContainer.value) return

    const containerWidth = treeContainer.value.offsetWidth
    const containerHeight = treeContainer.value.offsetHeight
    const bounds = gRoot.node()?.getBBox()
    if (!bounds) return

    const padding = 40
    const scale = Math.min(
        containerWidth / (bounds.width + padding * 2),
        containerHeight / (bounds.height + padding * 2),
        1.5
    )
    const translateX = (containerWidth - bounds.width * scale) / 2 - bounds.x * scale
    const translateY = (containerHeight - bounds.height * scale) / 2 - bounds.y * scale

    svg.transition()
        .duration(750)
        .call(
            zoomBehavior.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        )
}

// 监听挂载和卸载
onMounted(() => {
    if (!treeContainer.value) return

    // 初始加载
    const containerWidth = treeContainer.value.offsetWidth
    const containerHeight = 800 // 可根据需要动态修改
    initializeGraph(containerWidth, containerHeight)

    // 只在 resize 时，更新 SVG 宽高并重新居中
    const onResize = () => {
        const newWidth = treeContainer.value?.offsetWidth || containerWidth
        const newHeight = treeContainer.value?.offsetHeight || 800
        svg.attr("width", newWidth).attr("height", newHeight)
        centerView()
    }
    window.addEventListener("resize", onResize)

    onUnmounted(() => {
        window.removeEventListener("resize", onResize)
    })
})
</script>

<style>
.traceability-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.node {
    cursor: pointer;
}

.node:hover circle {
    fill: #f5f5f5;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}

.group-container {
    /* fill: #f0f0f0; */
    /* stroke: #dee2e6; */
    /* stroke-width: 1px; */
    rx: 8;
    ry: 8;
}

.group-label {
    font-size: 14px;
    font-weight: bold;
    fill: #495057;
}
</style>