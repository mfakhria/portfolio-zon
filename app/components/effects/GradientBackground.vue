<template>
  <div class="gradient-bg" aria-hidden="true">
    <!-- Base dark background -->
    <div class="gradient-base" />

    <!-- Glowing blobs — retro green/cyan/magenta -->
    <div class="blob blob-top-left" />
    <div class="blob blob-top-right" />
    <div class="blob blob-bottom-left" />
    <div class="blob blob-bottom-right" />
    <div class="blob blob-center" />

    <!-- Grid overlay (retro terminal grid) -->
    <div class="retro-grid" />

    <!-- Vignette -->
    <div class="vignette" />
  </div>
</template>

<style scoped>
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #050a05;
}

/* Base dark CRT gradient */
.gradient-base {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, #0a140a 0%, #060d06 60%, #030503 100%);
}

/* Animated blobs — retro colors */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
  animation: float 18s ease-in-out infinite;
}

.blob-top-left {
  top: -10%;
  left: -10%;
  width: 55vw;
  height: 55vw;
  max-width: 700px;
  max-height: 700px;
  background: radial-gradient(circle, hsl(120 100% 30% / 0.5) 0%, hsl(120 80% 20% / 0.3) 40%, transparent 70%);
  animation-delay: 0s;
  animation-duration: 22s;
}

.blob-top-right {
  top: -15%;
  right: -10%;
  width: 50vw;
  height: 50vw;
  max-width: 650px;
  max-height: 650px;
  background: radial-gradient(circle, hsl(180 100% 35% / 0.4) 0%, hsl(180 80% 25% / 0.3) 40%, transparent 70%);
  animation-delay: -5s;
  animation-duration: 20s;
}

.blob-bottom-left {
  bottom: -15%;
  left: -5%;
  width: 45vw;
  height: 45vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(circle, hsl(300 80% 40% / 0.3) 0%, hsl(300 60% 30% / 0.2) 40%, transparent 70%);
  animation-delay: -10s;
  animation-duration: 25s;
}

.blob-bottom-right {
  bottom: -10%;
  right: -8%;
  width: 50vw;
  height: 50vw;
  max-width: 650px;
  max-height: 650px;
  background: radial-gradient(circle, hsl(120 100% 40% / 0.35) 0%, hsl(120 80% 25% / 0.2) 40%, transparent 70%);
  animation-delay: -7s;
  animation-duration: 19s;
}

.blob-center {
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 40vw;
  height: 40vw;
  max-width: 500px;
  max-height: 500px;
  background: radial-gradient(circle, hsl(160 80% 30% / 0.2) 0%, hsl(140 60% 20% / 0.1) 50%, transparent 70%);
  animation-delay: -3s;
  animation-duration: 28s;
  opacity: 0.3;
}

/* Retro terminal grid pattern */
.retro-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(hsl(120 100% 50% / 0.03) 1px, transparent 1px),
    linear-gradient(90deg, hsl(120 100% 50% / 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%);
}

/* Soft vignette on edges */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(3, 5, 3, 0.7) 100%);
}

/* Floating animation */
@keyframes float {
  0%   { transform: translate(0px, 0px) scale(1); }
  25%  { transform: translate(20px, -30px) scale(1.05); }
  50%  { transform: translate(-15px, 20px) scale(0.97); }
  75%  { transform: translate(25px, 15px) scale(1.03); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.blob-top-left    { animation-name: float; }
.blob-top-right   { animation-name: float-reverse; }
.blob-bottom-left { animation-name: float-slow; }
.blob-bottom-right { animation-name: float; }
.blob-center       { animation-name: float-reverse; }

@keyframes float-reverse {
  0%   { transform: translateX(-50%) translate(0px, 0px) scale(1); }
  25%  { transform: translateX(-50%) translate(-20px, 25px) scale(1.04); }
  50%  { transform: translateX(-50%) translate(18px, -20px) scale(0.98); }
  75%  { transform: translateX(-50%) translate(-22px, -12px) scale(1.02); }
  100% { transform: translateX(-50%) translate(0px, 0px) scale(1); }
}

@keyframes float-slow {
  0%   { transform: translate(0px, 0px) scale(1); }
  33%  { transform: translate(30px, -20px) scale(1.06); }
  66%  { transform: translate(-20px, 30px) scale(0.96); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>
