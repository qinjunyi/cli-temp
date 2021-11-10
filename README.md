<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [cli-temp](#cli-temp)
  - [简介](#简介)
  - [功能](#功能)
  - [如何使用](#如何使用)
  - [TODO](#todo)

# cli-temp

## 简介

用于开发脚手架的基础模版


## 功能

- ts+prettier+eslint
- gulp管理开发、打包构建，e.g:`yarn dev`,`yarn build`
- 内置脚手架版本自动检测，可选是否升级最新版本
- node版本检测+限制
- 提供配套脚手架使用的高自由度rc配置机制，支持增删改查，便于管理脚手架
- 封装不同级别的错误日志输出，暂有warn、error、log、info四个级别
- 提供脚手架一键release功能，包括提交代码、更新changelog、打tag以及发布，e.g:`yarn release`或`npm run release`

## 如何使用

- package.json中name、bin、description字段修改实际使用的脚手架名称、简要指令、描述等，engines修改成你想要限制的node版本

- 关于脚手架版本版本更新检查

  - 版本检查的原理是对比本地脚手架的版本和npm源中的版本，因此涉及npm源的设置，请在[RC_DEFAULTS](https://github.com/qinjunyi/cli-temp/blob/master/src/constants/index.ts)中配置你理想的npm源或者通过`xx config set REGISTRY xxx`在本地磁盘中的rc配置文件中配置npm源。


- 关于内置的一键release功能（若需要使用该功能）

  - 按需修改[release.js](https://github.com/qinjunyi/cli-temp/blob/master/build/release.js)的`mainBranch`为脚手架仓库的主分支，默认为master
  - [release.js](https://github.com/qinjunyi/cli-temp/blob/master/build/release.js)中的publish方法，需要修改脚手架发布的npm源地址为你理想的地址，且为了避免每次发版都npm login，该模板使用token去登录npm，所以需要你先登录一次npm，然后在本地的.npmrc中找到`_authToken`并替换对应的值
  
  

## TODO

- [ ] 异常日志本地存储
- [ ] npm源支持可配置
