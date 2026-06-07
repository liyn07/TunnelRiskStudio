# 开源项目调研 / Open-source Research

本文件记录本项目在构思阶段调研到的土木、建筑、隧道、岩土和 BIM 相关开源方向。为了降低授权风险，TunnelRiskStudio 没有复制第三方仓库代码，而是吸收其“问题组织方式”和“技术路线”，再用原创代码实现一个新的隧道风险研判台。  
This file records open-source directions related to civil engineering, building engineering, tunnels, geotechnics, and BIM. To reduce licensing risk, TunnelRiskStudio does not copy third-party repository code. It studies their problem framing and technical routes, then implements a new tunnel risk studio with original code.

## 项目清单 / Project List

### IfcOpenShell

- 地址 / URL: https://github.com/IfcOpenShell/IfcOpenShell
- 方向 / Direction: IFC/BIM 文件解析、几何处理、开放建筑信息模型生态。 / IFC/BIM parsing, geometry processing, and open building information modeling ecosystem.
- 可借鉴点 / What to learn: 工程对象不是孤立数据点，隧道衬砌、环片、建筑物、管线、车站围护结构都可以成为可查询资产。 / Engineering objects are not isolated data points; linings, segments, buildings, utilities, and station support structures can become queryable assets.
- 本项目创新 / Project adaptation: 当前版本先用轻量对象描述工程资产，后续可把 IFC 构件映射到监测点和风险剖面。 / The current version uses lightweight objects first; future versions can map IFC components to monitoring points and risk sections.

### PyNite

- 地址 / URL: https://github.com/JWock82/Pynite
- 方向 / Direction: 结构有限元、构件、节点、荷载、位移和内力结果。 / Structural FEM, members, nodes, loads, displacement, and internal force results.
- 可借鉴点 / What to learn: 工程软件需要给出可解释的结构响应，而不是只有漂亮界面。 / Engineering software needs explainable structural responses, not only attractive interfaces.
- 本项目创新 / Project adaptation: 把每个风险因子拆成可解释贡献条，让工程师知道分数从何而来。 / The project breaks each risk factor into explainable contribution bars so engineers can trace the score.

### pyGIMLi

- 地址 / URL: https://github.com/gimli-org/pyGIMLi
- 方向 / Direction: 地球物理建模、反演、网格和地下介质分析。 / Geophysical modeling, inversion, meshing, and underground media analysis.
- 可借鉴点 / What to learn: 隧道风险常来自“看不见”的地质异常、富水带和破碎带。 / Tunnel risk often comes from invisible geological anomalies, water-rich zones, and fractured zones.
- 本项目创新 / Project adaptation: 用“水位变化、围岩等级、掌子面压力偏差”等轻量指标预留地质资料融合入口。 / Lightweight indicators such as groundwater change, ground class, and face pressure deviation reserve an entry point for geological data fusion.

### bedrock-ge

- 地址 / URL: https://github.com/bedrock-engineer/bedrock-ge
- 方向 / Direction: 岩土工程、AGS、BIM、地下工程数据处理。 / Geotechnical engineering, AGS, BIM, and underground engineering data processing.
- 可借鉴点 / What to learn: 钻孔、地层、试验、地下资产和 BIM 数据需要统一整理。 / Boreholes, strata, tests, underground assets, and BIM data need unified organization.
- 本项目创新 / Project adaptation: 用 `data/scenarios.json` 演示场景化工程数据结构，后续可扩展为 AGS/CSV/IFC 入口。 / `data/scenarios.json` demonstrates scenario-based engineering data and can later expand to AGS/CSV/IFC inputs.

### openpile

- 地址 / URL: https://github.com/TchilDill/openpile
- 方向 / Direction: 桩基、土层、Winkler 梁、横向受力分析。 / Piles, soil layers, Winkler beams, and lateral response analysis.
- 可借鉴点 / What to learn: 支护结构和周边土体关系可以通过简化模型做快速研判。 / Support-ground interaction can be evaluated quickly with simplified models.
- 本项目创新 / Project adaptation: 暂不做复杂有限元，而是先将支护滞后、收敛和沉降作为现场响应指标。 / Instead of complex FEM first, the project uses support lag, convergence, and settlement as site response indicators.

### GeoEq

- 地址 / URL: https://geoeq.org/
- 方向 / Direction: 岩土工程公式、单位、计算透明度。 / Geotechnical formulas, units, and calculation transparency.
- 可借鉴点 / What to learn: 工程工具必须说明单位、阈值来源和适用边界。 / Engineering tools must explain units, threshold sources, and applicability boundaries.
- 本项目创新 / Project adaptation: README 明确标注指标单位、风险区间、免责声明和路线图。 / The README clearly records metric units, risk bands, disclaimers, and roadmap.

## 授权策略 / Licensing Strategy

1. 不复制第三方代码。 / Do not copy third-party code.
2. 不引入许可证不明的资源。 / Do not include resources with unclear licenses.
3. 在 README 中公开参考项目和链接。 / Disclose reference projects and links in the README.
4. 本仓库原创代码使用 MIT License。 / Release original code under the MIT License.
5. 如果未来直接调用第三方库，应在 `NOTICE` 或 README 中补充许可证说明。 / If future versions directly call third-party libraries, add license notes in `NOTICE` or README.

## 差异化方向 / Differentiation

- 从“单一计算库”转为“隧道施工监测融合台”。 / From a single calculation library to a tunnel construction monitoring fusion studio.
- 从“通用结构/岩土工具”转为“围岩-支护-建筑物-施工参数”联动。 / From generic structural/geotechnical tools to ground-support-building-construction linkage.
- 从“结果展示”转为“主控因素 + 处置建议 + 数据导出”。 / From result display to key drivers, recommendations, and data export.
- 从“重依赖专业软件”转为“浏览器零依赖演示”。 / From professional software dependency to zero-dependency browser demo.
