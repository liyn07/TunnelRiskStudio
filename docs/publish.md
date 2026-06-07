# 发布说明 / Publishing Guide

本项目是纯静态 Web 工程，可直接发布到 GitHub。  
This project is a pure static Web project and can be published directly to GitHub.

## 准备 / Prerequisites

确认本地安装：  
Make sure the following tools are installed:

- Git
- GitHub CLI，也可以使用 GitHub Desktop 或网页上传。 / GitHub CLI, or GitHub Desktop / browser upload.
- 一个可用的 GitHub 账号。 / A valid GitHub account.

## 命令行发布 / Command-line Publishing

推荐使用项目内置脚本：  
Recommended project script:

```powershell
cd F:\TunnelRiskStudio
.\scripts\publish-github.ps1
```

也可以手动执行：  
Or run manually:

```powershell
cd F:\TunnelRiskStudio
git init
git branch -M main
git add .
git commit -m "Initial release of TunnelRiskStudio"
gh repo create TunnelRiskStudio --public --source . --remote origin --push
```

如果没有安装 GitHub CLI，也可以：  
If GitHub CLI is not installed:

1. 在 GitHub 新建空仓库 `TunnelRiskStudio`。 / Create an empty `TunnelRiskStudio` repository on GitHub.
2. 本地执行： / Run locally:

```powershell
git remote add origin https://github.com/YOUR_NAME/TunnelRiskStudio.git
git push -u origin main
```

## GitHub Pages

1. 打开仓库页面。 / Open the repository page.
2. 进入 `Settings`。 / Go to `Settings`.
3. 点击 `Pages`。 / Click `Pages`.
4. Source 选择 `Deploy from a branch`。 / Set Source to `Deploy from a branch`.
5. Branch 选择 `main`，目录选择 `/root`。 / Select branch `main` and folder `/root`.
6. 保存后等待部署。 / Save and wait for deployment.

部署完成后，访问地址通常为：  
After deployment, the URL is usually:

```text
https://YOUR_NAME.github.io/TunnelRiskStudio/
```

## README 封面图 / README Cover Image

发布后建议补充截图：  
After publishing, add a dashboard screenshot:

1. 打开 GitHub Pages 页面。 / Open the GitHub Pages page.
2. 截图保存为 `assets/screenshot-dashboard.png`。 / Save a screenshot as `assets/screenshot-dashboard.png`.
3. 在 README 顶部加入： / Add this near the top of README:

```markdown
![TunnelRiskStudio dashboard](assets/screenshot-dashboard.png)
```

## 版本标签 / Version Tags

首次发布后可创建标签：  
Create a tag after the first release:

```powershell
git tag v0.2.0
git push origin v0.2.0
```

建议版本规则：  
Suggested versioning:

- `v0.1.x`：原型修复。 / Prototype fixes.
- `v0.2.x`：数据导入与导出能力。 / Data import and export features.
- `v0.3.x`：BIM/IFC 或报告导出增强。 / BIM/IFC or report export improvements.
- `v1.0.0`：形成可复用的工程应用框架。 / A reusable engineering application framework.
