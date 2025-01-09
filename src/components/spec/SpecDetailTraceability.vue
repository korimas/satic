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
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
            gRoot.attr("transform", event.transform)
        })

    // 将缩放效果应用于 SVG
    svg.call(zoomBehavior)

    // 创建力导向图
    simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(graphData.links)
            .id((d: any) => d.id)
            .distance(150)
        )
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(80))

    // 先渲染分组背景
    const groupSelection = gRoot.selectAll(".group")
        .data(graphData.groups)
        .enter()
        .append("g")
        .attr("class", "group")

    groupSelection.append("rect")
        .attr("class", "group-container")
        .attr("fill", d => d.color)
        .attr("opacity", 0.2)

    groupSelection.append("text")
        .attr("class", "group-label")
        .attr("dy", 20)
        .text(d => d.label)

    // 绘制连线 (使用贝塞尔曲线)
    const linkSelection = gRoot.selectAll(".link")
        .data(graphData.links)
        .enter()
        .append("path")
        .attr("class", "link")

    // 绘制节点
    const nodeSelection = gRoot.selectAll(".node")
        .data(graphData.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(
            d3.drag<any, Node>()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart()
                    d.fx = d.x
                    d.fy = d.y
                })
                .on("drag", (event, d) => {
                    d.fx = event.x
                    d.fy = event.y
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0)
                    d.fx = null
                    d.fy = null
                })
        )

    nodeSelection.append("circle")
        .attr("r", 8)
        .attr("fill", d => {
            const gObj = graphData.groups.find(g => g.id === d.group)
            return gObj ? gObj.color : "#fff"
        })
        .attr("stroke", "#666")
        .attr("stroke-width", 2)

    nodeSelection.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.name)
        .attr("font-size", 12)

    // 创建箭头标记
    svg.append("defs").selectAll("marker")
        .data(["end"])
        .enter()
        .append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#999")

    linkSelection.attr("marker-end", "url(#end)")

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
    fill: #f0f0f0;
    stroke: #dee2e6;
    stroke-width: 1px;
    rx: 8;
    ry: 8;
}

.group-label {
    font-size: 14px;
    font-weight: bold;
    fill: #495057;
}
</style>