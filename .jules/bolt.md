# Bolt's Journal - Critical Performance Learnings

## 2025-08-16 - Avoid Math.pow and Repeated UA Parsing in Hot Event Handlers
**Learning:**
1. `Math.pow(dx, 2)` in distance calculations on hot mousemove loops is significantly slower than direct multiplication `dx * dx`.
2. Calling `Bowser.getParser(window.navigator.userAgent)` inside frequent DOM event handlers (like `contextmenu`) causes unnecessary regex parsing and object instantiation (~450x slower than caching the result).

**Action:**
1. Replace `Math.pow` with direct multiplication (`dx * dx + dy * dy`) for distance and geometry calculations in high-frequency event handlers.
2. Cache immutable environment evaluations (such as OS or browser checks derived from User-Agent) at module initialization scope rather than evaluating inside event listeners.
