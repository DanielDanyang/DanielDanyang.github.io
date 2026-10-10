import { defineSiteConfig } from "./src/config/site";

export const siteConfig = defineSiteConfig({
  author: "Danyang Chen",
  title: "Danyang Chen (陈丹阳)",
  siteUrl: "https://danieldanyang.github.io",
  description: "Danyang Chen (陈丹阳), an undergraduate at CUHK-Shenzhen (The Chinese University of Hong Kong, Shenzhen), currently a WeLM pretraining infrastructure intern at Tencent WXG (WeChat Group).",
  keywords: ["Danyang Chen", "陈丹阳", "large-scale pretraining infrastructure", "WeLM", "Tencent WXG"],
  hero: {
    headline: "Focused on large-scale pretraining infrastructure.",
    subheadline: "I am currently a WeLM pretraining infrastructure intern at Tencent WXG (WeChat Group). This summer, I interned on pretraining infrastructure at Kling.",
    profileImage: "/profile.jpg",
    profileImageWidth: 413,
    profileImageHeight: 531,
    profileAlt: "Portrait of Danyang Chen",
  },
  affiliations: [{ role: "Undergraduate", department: "Computer Science", institution: "CUHK-Shenzhen (The Chinese University of Hong Kong, Shenzhen)" }],
  researchInterests: [],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/DanielDanyang", icon: "i-mdi:github" },
    { label: "Email", href: "mailto:danyangchen@link.cuhk.edu.cn", icon: "i-mdi:email-outline" },
  ],
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/experience/", label: "经历" },
    { href: "/personal/", label: "Personal" },
  ],
  ogImage: "/profile.jpg",
  ogImageAlt: "Portrait of Danyang Chen",
  ogImageWidth: 413,
  ogImageHeight: 531,
  footer: { showAuthor: true, showProfileLinks: false },
  pageTitles: {
    about: { title: "About", description: "A little about my academic background and research experience." },
    researches: { title: "Publications", description: "Research on GPU fabrics and machine learning systems." },
    projects: { title: "Projects", description: "Selected research and open-source contributions." },
  },
  homeBlocks: {
    hero: { enabled: true },
    showcase: { enabled: false, title: "Selected Projects", description: "Research & open source" },
    publications: { enabled: false, title: "Selected Publication", description: "GPU fabrics and LLM systems" },
    posts: { enabled: false },
  },
});
export default siteConfig;
