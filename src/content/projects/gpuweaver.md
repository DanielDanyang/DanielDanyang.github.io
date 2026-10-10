---
title: GPUWeaver
subtitle: GPU fabric scheduling for LLM systems
summary: Research on shared GPU interconnects and communication scheduling, published at APSys 2026.
status: past
period: "2026"
order: 2
featured: false
badges: [APSys 2026]
tech: [GPU Systems, LLM Serving]
highlights:
  - Characterizing contention across GPU fabrics.
  - Runtime communication scheduling for LLM applications.
metadata:
  - label: Role
    value: Co-author
links:
  - label: Paper
    href: https://yunmingxiao.github.io/publication/26apsys-gpuweaver/apsys26-gpuweaver.pdf
  - label: Publication details
    href: https://yunmingxiao.github.io/publication/26apsys-gpuweaver/
---

## Research

LLM systems move data across PCIe, NVLink, and RDMA fabrics. Concurrent transfers can contend for shared resources, affecting compute progress and host–device data movement.

GPUWeaver studies this contention and introduces a lightweight runtime framework that detects it and regulates communication injection to match application needs.

## Publication

**Unlocking Software-defined GPU Fabric Scheduling in the LLM Era** — Danyang Chen, Yufeng Gu, Yibo Huang, Chengxuan Pei, Peichun Hua, Yang Zhou, and Yunming Xiao. APSys 2026.
