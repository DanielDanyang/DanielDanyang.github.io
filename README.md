# Danyang Chen · 陈丹阳

个人学术主页，基于 [Scholar Pages](https://github.com/jxpeng98/astro-theme-scholars)（MIT）。

目标网址：https://danieldanyang.github.io/

## 本地预览

使用 Node.js 24 和 pnpm（版本见 package.json）：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## 修改内容

- `site.config.ts`：姓名、简介、研究方向、联系方式、导航。
- `src/data/publications.bib`：论文。
- `src/data/about.yml`：教育、经历、助教与荣誉。
- `src/content/projects/*.md`：项目。
- `src/pages/personal.astro`：个人分页面。
- `public/profile.jpg`：首页个人照片。

仅摘录 CV 中适合展示的部分；原始 CV、手机号与详细实习数据没有包含在网站里。

## 上线到 GitHub Pages

1. 在 DanielDanyang 账号下建立公开仓库 `DanielDanyang.github.io`。
2. 将本文件夹内容上传到仓库的 `main` 分支，包含 `.github/workflows/deploy.yml` 等隐藏文件，不上传 `node_modules` 或 `dist`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 在 Actions 运行 **Deploy website**（或再次提交内容），等待 build 和 deploy 成功。
5. 打开 https://danieldanyang.github.io/。

工作流每次向 main 推送时重新构建并部署。GitHub Pages 配置参考：[官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 验证

```sh
pnpm astro check
pnpm build
```

`dist` 是构建后的静态网站。主题原有 demo 测试工具留作参考，部分断言针对原始示例内容，个人站验收以类型检查、构建和浏览器实际检查为准。
