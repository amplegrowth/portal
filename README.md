# AmplWealth - Wealth Growth Prototype

A high-performance, minimal static website prototype built for **AmplWealth**. It communicates money/wealth growth through an interactive scrolling visual interface.

## 🚀 Key Features

*   **Wealth Growth Theme**: Features a high-contrast dark theme with emerald green (`#10b981`) and gold (`#eab308`) accents to represent financial growth and harvest.
*   **Dynamic Scroll Transition**: Displays `static/image1.jpeg` on load, and smoothly transitions to `static/image2.jpeg` as the user scrolls down, symbolizing the ample growth of customer wealth.
*   **Highly Performant**: Hand-crafted vanilla CSS and Javascript. Zero styling libraries or heavy frameworks, optimized for rapid load speeds and Core Web Vitals.
*   **Progressive Enhancement**: Uses modern native CSS Scroll-driven Animations (`animation-timeline`) with automatic Javascript listener fallbacks to ensure compatibility on browsers like Firefox.
*   **Accessibility (a11y)**: Built with semantic markup, ARIA roles, proper keyboard navigation structures, and accessible error validation.
*   **Clean Consultation Form**: Users can submit their investment goals directly with responsive floating-label form inputs.

---

## 💻 Local Development

Run the website locally using one of the following methods:

### Option 1: Direct HTML Open
Double-click [index.html](file:///Users/nagapavank/work/freelance/amplwealth/portal/index.html) to open in any web browser.

### Option 2: Live Local Server
If Node.js is installed, run:
```bash
npx vite
```
If Python is installed, run:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 📂 Project Structure

*   [index.html](file:///Users/nagapavank/work/freelance/amplwealth/portal/index.html) — Structural semantic tags and metadata.
*   [style.css](file:///Users/nagapavank/work/freelance/amplwealth/portal/style.css) — Custom layouts, variables, responsive design, and scroll timelines.
*   [script.js](file:///Users/nagapavank/work/freelance/amplwealth/portal/script.js) — Interactive elements, navigation sync, validation, and browser fallbacks.
*   [static/](file:///Users/nagapavank/work/freelance/amplwealth/portal/static) — Contains local images `image1.jpeg` and `image2.jpeg` demonstrating growth.
