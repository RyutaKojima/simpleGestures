## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** innerHTML was being used to render action and command names to the DOM, presenting a risk of XSS if inputs weren't explicitly sanitized.
**Learning:** In a chrome extension rendering a small content script overlay, innerHTML should be strictly avoided in favor of textContent for textual variables to prevent any DOM-based script injection.
**Prevention:** We should always use textContent instead of innerHTML when printing dynamic data to elements, effectively rendering input safely.
