# 🤰 孕妇饮食查询APP

一个专门为准妈妈准备的饮食查询工具，买菜做饭时随时查询食材安全性。

## ✨ 功能特点

- 🔍 **智能搜索**：支持搜索单个或多个食材（逗号分隔）
- 📊 **三级分类**：推荐食用 / 谨慎食用 / 禁止食用
- 🗂️ **食材分类**：按蔬菜、水果、肉类等9大类别浏览
- 📖 **详细信息**：每种食材包含简介、营养价值、注意事项、推荐做法
- ❤️ **收藏功能**：收藏常用食材，方便查看
- 🍳 **菜谱推荐**：每日推荐4道孕妇菜谱，可换一批
- 📱 **响应式设计**：手机端完美适配

## 🚀 快速部署（3分钟搞定）

### 方案一：Vercel 部署（推荐，最简单）

**步骤：**

1. 访问 https://vercel.com
2. 用 GitHub/GitLab/Bitbucket 账号登录
3. 点击 "Add New..." → "Project"
4. 把 `pregnant-food-guide` 整个文件夹拖拽到上传区域
5. 点击 "Deploy" 按钮
6. 等待30秒，部署完成！
7. 获得一个类似 `https://xxx.vercel.app` 的网址

**优点：**
- ✅ 完全免费
- ✅ 无需代码，拖拽即可
- ✅ 全球CDN加速，手机访问很快
- ✅ 自动HTTPS

---

### 方案二：Netlify 部署

**步骤：**

1. 访问 https://www.netlify.com
2. 注册账号并登录
3. 在 "Sites" 页面，找到底部的 "Drag and drop your site output folder here"
4. 把 `pregnant-food-guide` 文件夹拖拽进去
5. 部署完成！获得一个 `xxx.netlify.app` 网址

---

### 方案三：GitHub Pages

**步骤：**

1. 在 GitHub 创建一个新仓库
2. 上传所有文件到仓库
3. 进入仓库 Settings → Pages
4. Source 选择 "main" 分支，点击 Save
5. 等待几分钟，访问 `https://你的用户名.github.io/仓库名/`

---

## 📱 添加到手机桌面

部署后，在手机浏览器打开网址：

### iPhone (Safari)
1. 点击底部的分享按钮 📤
2. 选择 "添加到主屏幕"
3. 点击 "添加"
4. 桌面就有APP图标了！

### Android (Chrome)
1. 点击右上角菜单 ⋮
2. 选择 "添加到主屏幕" 或 "安装应用"
3. 点击 "添加"

## 🖥️ 本地运行

```bash
cd pregnant-food-guide

# 方法1：使用Node.js
npm run dev
# 访问 http://localhost:3000

# 方法2：使用Python
python -m http.server 8000
# 访问 http://localhost:8000
```

## 📁 项目结构

```
pregnant-food-guide/
├── index.html       # 主页面
├── app.js           # 应用逻辑
├── food-data.js     # 食材数据库
├── recipe-data.js   # 菜谱数据库
├── package.json     # 项目配置
├── vercel.json      # Vercel部署配置
└── README.md        # 说明文档
```

## 🎨 UI特点

- 🌿 低饱和度配色，温暖护眼
- 💎 毛玻璃质感，现代美观
- 📱 专为手机端优化

---

**祝准妈妈们孕期顺利，宝宝健康成长！ 👶💖**
