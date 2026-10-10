import { defineSiteConfig } from "./src/config/site";

export const siteConfig = defineSiteConfig({
  author: "Danyang Chen",
  title: "Danyang Chen · 陈丹阳",
  siteUrl: "https://danieldanyang.github.io",
  description: "Danyang Chen (陈丹阳), an undergraduate at CUHK-Shenzhen working on machine learning systems, GPU communication, and LLM infrastructure.",
  keywords: ["Danyang Chen", "陈丹阳", "ML systems", "GPU communication", "LLM infrastructure"],
  hero: {
    headline: "Building efficient systems for machine learning.",
    subheadline: "I am an undergraduate in Computer Science at The Chinese University of Hong Kong, Shenzhen. My interests lie in machine learning systems, with a focus on GPU communication, distributed training, and LLM serving. I contribute to UCCL and study how GPU fabrics shape system performance.",
    profileImage: "/profile.svg",
    profileAlt: "DC monogram for Danyang Chen",
  },
  affiliations: [{ role: "Undergraduate", institution: "CUHK-Shenzhen" }],
  researchInterests: ["GPU Communication", "Distributed Training", "LLM Serving"],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/DanielDanyang", icon: "i-mdi:github" },
    { label: "Email", href: "mailto:danyangchen@link.cuhk.edu.cn", icon: "i-mdi:email-outline" },
  ],
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/researches/", label: "Publications" },
    { href: "/projects/", label: "Projects" },
    { href: "/about/", label: "About" },
    { href: "/personal/", label: "Personal" },
  ],
  footer: { showAuthor: true, showProfileLinks: false },
  pageTitles: {
    about: { title: "About", description: "A little about my academic background and research experience." },
    researches: { title: "Publications", description: "Research on GPU fabrics and machine learning systems." },
    projects: { title: "Projects", description: "Selected research and open-source contributions." },
  },
  homeBlocks: {
    hero: { enabled: true },
    showcase: { enabled: true, title: "Selected Projects", description: "Research & open source" },
    publications: { enabled: true, title: "Selected Publication", description: "GPU fabrics and LLM systems" },
    posts: { enabled: false },
  },
});
export default siteConfig;
