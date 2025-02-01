# CDLAlchemist

<div align="center">

[![GitHub license](https://img.shields.io/github/license/Ahua9527/CdlAlchemist)](https://github.com/Ahua9527/CdlAlchemist/blob/main/LICENSE)
![GitHub stars](https://img.shields.io/github/stars/Ahua9527/CdlAlchemist)

🎨 Transform ALE to CDL, Extract Color's True Gold

[English](./README.en.md) · [简体中文](./README.md) · [Live Demo](https://cdl-alchemist.ahua.space)

</div>

CDLAlchemist is a professional color workflow tool that converts color grading data from Avid Log Exchange (ALE) files into standard ASC-CDL format.

## ✨ Features

- 🎯 Precise conversion from ALE to CDL
- 🔄 Batch processing of multiple color grading data
- ⚡ Local processing for data privacy
- 📱 PWA support for offline use
- 🌓 Adaptive dark mode
- 💫 Smooth animations

## 🚀 Quick Start

### Basic Workflow

1. Export ALE file with CDL data from Resolve
2. Upload ALE file: Support drag & drop or click to upload
3. Convert: Automatically extract color grading data and generate CDL files
4. Download: Each color grading data generates an independent CDL file, packaged in ZIP format

### Technical Specifications

#### ALE File Requirements
- Required columns:
  - Name: Used for CDL file naming
  - ASC_SOP: Slope, Offset, Power parameters
  - ASC_SAT: Saturation parameter

#### CDL Output Format
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

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- JSZip
- Lucide Icons
- PWA Support

## 📦 Installation and Usage

1. Clone the project

```bash
git clone https://github.com/Ahua9527/CdlAlchemist.git
cd CdlAlchemist
```

2. Install dependencies

```bash
npm install
```

3. Local development

```bash
npm run dev
```

4. Build the project

```bash
npm run build
```

## 🌈 Developer Guide

### Project Structure

```
CdlAlchemist/
├── src/
│   ├── components/     # React components
│   ├── context/       # React Context
│   ├── utils/         # Utility functions
│   ├── styles/        # Style files
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── ...config files
```

## 📃 License

[MIT License](LICENSE)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 👨‍💻 Author

[哆啦Ahua🌱 ](https://github.com/Ahua9527)