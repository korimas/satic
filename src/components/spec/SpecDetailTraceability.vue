<template>

    <div class="container mx-auto p-4">
        <!-- 工具栏 -->
        <div class="bg-white p-4 mb-4 rounded shadow flex justify-between items-center">
            <div class="space-x-2">
                <q-btn dense icon="zoom_in" @click="zoomIn" />
                <q-btn dense icon="zoom_out" @click="zoomOut" />
                <button @click="centerView" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    居中
                </button>
            </div>
        </div>

        <!-- 图形展示区域 -->
        <div class="bg-white rounded shadow p-4">
            <div id="tree-container" class="w-full" style="height: 800px;"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted } from 'vue'
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

let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>
let g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
let zoom: d3.ZoomBehavior<Element, unknown>

const data = {
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

const initializeGraph = () => {
    // 清除现有内容  
    d3.select("#tree-container").selectAll("*").remove()

    const width = document.getElementById('tree-container')?.offsetWidth ?? 800
    const height = 800
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }

    svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    g = svg.append("g")

    zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", (event) => {
            g.attr("transform", event.transform)
        })

    svg.call(zoom)

    // 创建力导向图布局  
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(data.links)
            .id((d: any) => d.id)
            .distance(150))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(80))

    // 添加分组背景  
    const groups = g.selectAll(".group")
        .data(data.groups)
        .enter()
        .append("g")
        .attr("class", "group")

    const groupPaths = groups.append("rect")
        .attr("class", "group-container")
        .attr("fill", d => d.color)
        .attr("opacity", 0.2)

    groups.append("text")
        .attr("class", "group-label")
        .attr("dy", 20)
        .text(d => d.label)

    // 创建贝塞尔曲线连接线  
    const link = g.selectAll(".link")
        .data(data.links)
        .enter()
        .append("path")
        .attr("class", "link")

    // 添加节点  
    const node = g.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag<any, Node>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))

    node.append("circle")
        .attr("r", 8)
        .attr("fill", d => {
            const group = data.groups.find(g => g.id === d.group)
            return group ? group.color : "#fff"
        })

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.name)

    // 添加箭头标记  
    svg.append("defs").selectAll("marker")
        .data(["end"])
        .enter().append("marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#999")

    link.attr("marker-end", "url(#end)")

    // 更新力导向图  
    simulation.on("tick", () => {
        // 更新连接线位置  
        link.attr("d", (d: any) => {
            const dx = d.target.x - d.source.x
            const dy = d.target.y - d.source.y
            const dr = Math.sqrt(dx * dx + dy * dy)
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
        })

        // 更新节点位置  
        node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)

        // 更新分组背景位置和大小  
        const padding = 40
        data.groups.forEach(group => {
            const groupNodes = data.nodes.filter(n => n.group === group.id)
            if (groupNodes.length > 0) {
                const minX = d3.min(groupNodes, (n: any) => n.x) - padding
                const maxX = d3.max(groupNodes, (n: any) => n.x) + padding
                const minY = d3.min(groupNodes, (n: any) => n.y) - padding
                const maxY = d3.max(groupNodes, (n: any) => n.y) + padding
                const width = maxX! - minX!
                const height = maxY! - minY!

                groups.filter(g => g.id === group.id)
                    .select("rect")
                    .attr("x", minX)
                    .attr("y", minY)
                    .attr("width", width)
                    .attr("height", height)

                groups.filter(g => g.id === group.id)
                    .select("text")
                    .attr("x", minX! + 10)
                    .attr("y", minY)
            }
        })
    })

    function dragstarted(event: any, d: Node) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    function dragged(event: any, d: Node) {
        d.fx = event.x
        d.fy = event.y
    }

    function dragended(event: any, d: Node) {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
    }

    // 初始居中视图  
    centerView()
}

const zoomIn = () => {
    svg.transition().call(zoom.scaleBy, 1.2)
}

const zoomOut = () => {
    svg.transition().call(zoom.scaleBy, 0.8)
}

const centerView = () => {
    const width = document.getElementById('tree-container')?.offsetWidth ?? 800
    const height = 800
    svg.transition().call(
        zoom.transform,
        d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(1)
    )
}

onMounted(() => {
    initializeGraph()
    window.addEventListener('resize', initializeGraph)
})

onUnmounted(() => {
    window.removeEventListener('resize', initializeGraph)
}) 
</script>

<style>
.node {
    cursor: pointer;
}

.node circle {
    fill: #fff;
    stroke: #666;
    stroke-width: 2px;
}

.node text {
    font: 12px sans-serif;
}

.link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}

.selected circle {
    fill: #e3f2fd;
    stroke: #2196f3;
}

.node:hover circle {
    fill: #f5f5f5;
}

.group-container {
    fill: #f8f9fa;
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

.tooltip {
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    pointer-events: none;
}
</style>