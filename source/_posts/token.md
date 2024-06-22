---
abbrlink: 1ecbfe90
title: 自动化部署博客
---


# 自动化部署博客
## 配置SSH

```
git config --global user.name "bengenseo"
git config --global user.email "bengenseo@126.com"
ssh-keygen -t rsa -C "bengenseo@126.com"
```

### 空值 三次回车

```
ssh -T git@github.com
```

### 输入 yes

Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
Hi bengenseo! You've successfully authenticated, but GitHub does not provide shell access.
警告：已将“github.com”（ED25519）永久添加到已知主机列表中。
嗨 bengenseo！您已成功通过身份验证，但 GitHub 不提供 shell 访问权限。

```
ssh-keygen -t rsa -b 4096 -C "bengenseo@126.com"
```

## 插件

```
npm install gulp
npm install gulpfile
npm install gulp-clean-css
npm install gulp-uglify
npm install gulp-concat
```

## .github下创建workflows文件夹

### auto.yml

```
name: 自动部署
# 当有改动推送到master分支时，启动Action
on:
  push:
    branches:
      - main
      #2020年10月后github新建仓库默认分支改为main，注意更改
  release:
    types:
      - published

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: 检查分支
        uses: actions/checkout@v2
        with:
          ref: main

      - name: 安装 Node
        uses: actions/setup-node@v1
        with:
          node-version: "20.x"

      - name: 安装 Hexo
        run: |
          export TZ='Asia/Shanghai'
          npm install hexo-cli -g

      - name: 缓存 Hexo
        id: cache-npm
        uses: actions/cache@v3
        env:
          cache-name: cache-node-modules
        with:
          path: node_modules
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-

      - name: 安装依赖
        if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
        run: |
          npm install gulp-cli -g #全局安装gulp
          npm install --save

      - name: 生成静态文件
        run: |
          hexo clean
          hexo generate
          gulp

      - name: 部署到Github
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          token: ${{ secrets.ACTIONS_DEPLOY_KEY }}
          repository-name: bengenseo/bengenseo.github.io
          branch: main
          folder: public
          commit-message: "${{ github.event.head_commit.message }} Updated By Github Actions"
```

## 创建gulpfile.js

```js
const { src, dest, series } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const fs = require('fs');


// Minify CSS files
function minifyCSS() {
    if (fs.existsSync('source/css') && fs.readdirSync('source/css').length > 0) {
        return src('source/css/*.css')
            .pipe(cleanCSS())
            .pipe(dest('public/css'));
    } else {
        return new Promise((resolve) => {
            console.log('No CSS files to minify.');
            resolve();
        });
    }
}

// Minify JS files
function minifyJS() {
    if (fs.existsSync('source/js') && fs.readdirSync('source/js').length > 0) {
        return src('source/js/*.js')
            .pipe(uglify())
            .pipe(dest('public/js'));
    } else {
        return new Promise((resolve) => {
            console.log('No JS files to minify.');
            resolve();
        });
    }
}

// Default task
exports.default = series(minifyCSS, minifyJS);
```

## 创建CNAME

```
blog.sjooo.sbs
```

## themes/主题/创建.gitkeep

### .gitkeep

```
mkdir -p themes/*
touch themes/*/.gitkeep
```

## JSON搜索文件

### 其它插件

```
npm install hexo-generator-json-content --save
npm install hexo-generator-feed --save
```

### 根目录/_config.yml

```
#JSON搜索文件
jsonContent:
  meta: false
  pages: false
  posts:
    title: true
    date: true
    path: true
    text: true
    raw: false
    content: false
    slug: false
    updated: false
    comments: false
    link: false
    permalink: false
    excerpt: false
    categories: false
    tags: true
#RSS订阅
feed:
  type: atom
  path: atom.xml
  limit: 
  hub:
  content:
  content_limit: 
  content_limit_delim: ' '
  order_by: -date
```

## 链接配置

### 插件

```
npm install hexo-abbrlink --save
```

### _config.yml

```
abbrlink:
  alg: crc32  # 算法，可选 crc16 和 crc32
  rep: hex    # 生成的链接形式，可选 dec 和 hex
permalink: posts/:abbrlink.html
```

## 创建项目-空文件夹中运行

```
hexo init
npm install hexo-deployer-git --save
```

```
hexo d -g
```

## 运行程序

```
hexo cl
hexo g
hexo s
```

## 第一次

```
hexo cl
hexo g
git init
git remote rm origin
git remote add origin git@github.com:bengenseo/bengenseo.github.io.git
git checkout -b main
git add .
git commit -m "github action update"
git push origin main
```

## 出错

```
git pull origin main
git add .
git commit -m "Merge remote changes"
git push origin main
```

## 第二次

```
git remote rm origin
git remote add origin git@github.com:bengenseo/bengenseo.github.io.git
git checkout -b main
git add *
git commit -m "github action update"
git push origin main
```

## 强制推送

```
git remote rm origin
git remote add origin git@github.com:bengenseo/bengenseo.github.io.git
git checkout -b main
git add *
git commit -m "github action update"
git push origin main --force
```



