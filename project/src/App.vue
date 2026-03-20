<script setup>
import { ref, onMounted } from 'vue'

// 控制页面进入时的动画状态
const isLoaded = ref(true)

// Vue 3 最佳实践：在组件挂载完成后改变状态，触发 CSS 过渡动画
onMounted(() => {
  // 使用 requestAnimationFrame 或极短的 setTimeout
  // 可以确保浏览器已经完成了初始渲染，让过渡动画更加丝滑
  requestAnimationFrame(() => {
    isLoaded.value = true
  })
})
</script>

<template>
  <main class="container">
    <div class="glow-bg" aria-hidden="true">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>

    <div class="noise" aria-hidden="true"></div>
    <div class="grid" aria-hidden="true"></div>

    <div class="content">
      <div class="loaded">
        <div class="badge">
          <span class="badge-icon">✨</span>
          <span class="badge-text">系统已就绪，等待注入灵魂</span>
        </div>

        <h1 class="title">这是一张<span class="highlight">空白画布</span></h1>

        <p class="subtitle">请开始构建你的项目</p>
      </div>
    </div>
  </main>
</template>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.container {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #020617;
    font-family: system-ui, -apple-system, sans-serif;
    color: #e2e8f0;
}

.glow-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}

.glow-1 {
    position: absolute;
    top: -20%;
    left: -10%;
    width: 60vw;
    height: 60vw;
    border-radius: 50%;
    background: rgba(16, 185, 129, 0.2);
    filter: blur(120px);
    mix-blend-mode: screen;
    animation: pulse 8s ease-in-out infinite;
}

.glow-2 {
    position: absolute;
    top: 20%;
    right: -20%;
    width: 50vw;
    height: 50vw;
    border-radius: 50%;
    background: rgba(6, 182, 212, 0.2);
    filter: blur(100px);
    mix-blend-mode: screen;
    animation: pulse 12s ease-in-out infinite;
    animation-delay: 2s;
}

.glow-3 {
    position: absolute;
    bottom: -20%;
    left: 20%;
    width: 70vw;
    height: 70vw;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.2);
    filter: blur(150px);
    mix-blend-mode: screen;
    animation: pulse 10s ease-in-out infinite;
    animation-delay: 4s;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

.noise {
    position: absolute;
    inset: 0;
    background: url('https://grainy-gradients.vercel.app/noise.svg');
    opacity: 0.2;
    mix-blend-mode: overlay;
    pointer-events: none;
}

.grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
}

.content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
}

.content-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 42rem;
    text-align: center;
    opacity: 0;
    transform: scale(0.95);
    transition: all 1s ease 0.3s;
}

.content-inner.loaded {
    opacity: 1;
    transform: scale(1);
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    margin-bottom: 2rem;
}

.badge-icon {
    color: #6ee7b7;
    animation: pulse 2s ease-in-out infinite;
    font-size: 0.875rem;
}

.badge-text {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
}

.title {
    font-size: 3rem;
    font-weight: 300;
    letter-spacing: -0.025em;
    color: white;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.highlight {
    font-weight: 600;
    color: #6ee7b7;
}

.subtitle {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 300;
    line-height: 1.625;
    max-width: 36rem;
}

@media (min-width: 768px) {
    .title {
        font-size: 3.75rem;
    }

    .subtitle {
        font-size: 1.25rem;
    }
}
</style>
