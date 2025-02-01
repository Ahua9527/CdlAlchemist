# CDLAlchemist

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Ahua9527/CdlAlchemist)](https://github.com/Ahua9527/CdlAlchemist/blob/main/LICENSE)
![GitHub stars](https://img.shields.io/github/stars/Ahua9527/CdlAlchemist)

🎨 从ALE到CDL，炼出色彩真金

[English](./README.en.md) · 简体中文 · [在线体验](https://cdl-alchemist.ahua.space)

</div>

CDLAlchemist 是一个专业的色彩工作流工具，可以将 Avid Log Exchange (ALE) 文件中的色彩分级数据转换为标准的 ASC-CDL 格式。

## ✨ 功能特性

- 🎯 支持 ALE 到 CDL 的精准转换
- 🔄 批量处理多个色彩分级数据
- ⚡ 本地化处理，保护数据隐私
- 📱 支持 PWA，可离线使用
- 🌓 自适应深色模式
- 💫 流畅的动画效果

## 🚀 快速入门

### 基础工作流

1. Resolve输出含有CDL数据的ALE文件
2. 上传 ALE 文件：支持拖拽或点击上传
3. 转换处理：自动提取色彩分级数据并生成 CDL 文件
4. 下载结果：每个色彩分级数据都会生成独立的 CDL 文件，并打包成 ZIP 格式

### 技术规范

#### ALE 文件要求
- 必需包含的列：
  - Name：用于 CDL 文件命名
  - ASC_SOP：Slope, Offset, Power 参数
  - ASC_SAT：饱和度参数

#### CDL 输出格式
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ColorDecisionList xmlns="urn:ASC:CDL:v1.01">
    <ColorDecision>
        <ColorCorrection>
            <SOPNode>
                <Description>Clip Name</Description>
                <Slope>1.0000 1.0000 1.0000</Slope>
                <Offset>0.0000 0.0000 0.0000</Offset>
                <Power>1.0000 1.0000 1.0000</Power>
            </SOPNode>
            <SATNode>
                <Saturation>1.0000</Saturation>
            </SATNode>
        </ColorCorrection>
    </ColorDecision>
</ColorDecisionList>
```

## 🛠️ 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- JSZip
- Lucide Icons
- PWA Support

## 📦 安装与使用

1. 克隆项目

```bash
git clone https://github.com/Ahua9527/CdlAlchemist.git
cd CdlAlchemist
```

2. 安装依赖

```bash
npm install
```

3. 本地开发

```bash
npm run dev
```

4. 构建项目

```bash
npm run build
```


## 🌈 开发者说明

### 项目结构

```
CdlAlchemist/
├── src/
│   ├── components/     # React 组件
│   ├── context/       # React Context
│   ├── utils/         # 工具函数
│   ├── styles/        # 样式文件
│   └── App.tsx        # 主应用组件
├── public/            # 静态资源
└── ...配置文件
```

## 📃 许可证

[MIT License](LICENSE)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 👨‍💻 作者

[哆啦Ahua🌱 ](https://github.com/Ahua9527)