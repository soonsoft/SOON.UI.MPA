[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://github.com/996icu/996.ICU)

# SOON.UI.MPA
基于SOON.UI构建前后端分离的，前端多页应用工程模板

## 安装依赖库
```
npm install
```

## 启动和调试
```
// 构建dll和外部依赖（只需执行一次）
npm run build-soonui;
// 启动调试
npm run run;
```

## 构建发布
```
// 编译
npm run build;
// 构建dll和外部依赖（执行完build指令会删除dist目录，需要重新创建dll）
npm run build-soonui;
```