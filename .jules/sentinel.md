## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。

## 2025-03-29 - [Prototype Pollution Protection] Use Object.prototype.hasOwnProperty.call for Property Checks
**Vulnerability:** `LibOption` 内で `this.optionsInstance.hasOwnProperty(...)` や `this.gestureHash.hasOwnProperty(...)` を直接呼び出していたため、プロトタイププロパティの参照（`toString` や `constructor` など）に対する誤判定や、プロパティのオーバーライドによる不具合・セキュリティ上の懸念が存在していた。
**Learning:** オブジェクトのプロパティ存在チェックを行う際、インスタンスの `.hasOwnProperty` メソッドを直接呼び出すと、プロトタイプチェーン上のメソッド参照やオーバーライドの影響を受ける可能性がある。
**Prevention:** オブジェクトのプロパティ検証には常に `Object.prototype.hasOwnProperty.call(obj, prop)` を使用して安全に判定を行う。

## 2025-05-18 - [Tab URL Validation] Prevent Relative URL Bypass in isSafeTabUrl
**Vulnerability:** `isSafeTabUrl` で `new URL(url, 'chrome-extension://dummy/')` を用いてURL検証を行う際、`//evil.com` や `/path` などの相対URLがプロトコルに `chrome-extension:` を引き継ぎ、プロトコルチェックをバイパスできる脆弱性が存在していた。
**Learning:** ベースURLを指定して `new URL(url, base)` で検証する際、相対パスやプロトコル相対URL（`//`）はベースURLのスキームを継承するため、許可されたプロトコル判定を突破してしまう。
**Prevention:** URL検証時には事前に文字列を `trim()` し、`/` や `//` で始まる相対URLを明示的に拒否してから `new URL()` による検証を行う。
