# 贡献指南 / Contributing

欢迎基于 TunnelRiskStudio 做二次开发。为了保持项目清晰，请尽量遵循以下规则。  
Contributions to TunnelRiskStudio are welcome. Please follow these rules to keep the project clear and maintainable.

## 开发原则 / Development Principles

- 保持核心页面可直接打开，不强制引入构建工具。 / Keep the core page directly runnable without requiring a build tool.
- 新增风险指标时，同步补充单位、归一化逻辑和 README 说明。 / When adding a risk metric, also document units, normalization logic, and README notes.
- 新增参考项目时，必须补充链接和许可证提示。 / When adding a reference project, include its link and license notes.
- 不提交真实工程的敏感监测数据、坐标、合同资料或未公开图纸。 / Do not commit sensitive monitoring data, coordinates, contract information, or unreleased drawings.

## 推荐贡献方向 / Suggested Contribution Areas

- 增加监测曲线和趋势预警。 / Add monitoring curves and trend warnings.
- 增加 BIM/IFC 数据映射示例。 / Add BIM/IFC data mapping examples.
- 增加 PDF/Word 报告导出。 / Add PDF/Word report export.
- 增加更多典型工况：浅埋暗挖、盾构下穿河流、既有线邻近施工、基坑换乘站。 / Add more typical scenarios: shallow mined tunnel, shield under river, adjacent construction near existing rail, and interchange station excavation.
- 增加演示 GIF 或 GitHub Pages 在线示例。 / Add a demo GIF or GitHub Pages live example.

## 提交信息 / Commit Messages

建议格式 / Suggested format:

```text
feat: add csv monitoring importer
fix: correct surface settlement normalization
docs: expand BIM integration notes
```

## 工程安全 / Engineering Safety

本项目不替代正式设计、监测预警或专家评审。任何接近真实工程应用的改动，都需要专业人员校核。  
This project does not replace formal design, monitoring warning systems, or expert review. Any change close to real engineering use must be reviewed by qualified professionals.
