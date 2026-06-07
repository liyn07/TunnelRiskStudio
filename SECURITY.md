# 安全策略 / Security Policy

TunnelRiskStudio 是静态浏览器原型，不会把工程数据发送到服务器。  
TunnelRiskStudio is a static browser prototype. It does not send engineering data to a server.

## 敏感工程数据 / Sensitive Engineering Data

请勿公开发布：  
Do not publish:

- 真实项目坐标或线路细节。 / Real project coordinates or alignment details.
- 私有监测数据。 / Private monitoring data.
- 合同阈值或未发布设计文件。 / Contract thresholds or unreleased design files.
- 建筑业主、资产或应急响应信息。 / Building owner, asset, or emergency response information.
- 未获授权的 IFC、CAD、GIS 或测量文件。 / IFC, CAD, GIS, or survey files that are not cleared for public release.

## 报告问题 / Reporting a Concern

如 GitHub 支持，请通过 Security Advisories 私下报告；也可以创建不暴露敏感数据的 Issue。  
Use GitHub security advisories if available, or create an issue that describes the concern without exposing sensitive data.

## 数据处理 / Data Handling

CSV 导入和报告导出都在浏览器本地运行。导出文件由用户浏览器生成，本项目不会上传数据。  
CSV import and report export run locally in the browser. Exported files are created by the user's browser and are not uploaded by this project.
