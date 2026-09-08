## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。

## 2025-03-29 - [Prototype Pollution Protection] Use Object.prototype.hasOwnProperty.call for Property Checks
**Vulnerability:** `LibOption` 内で `this.optionsInstance.hasOwnProperty(...)` や `this.gestureHash.hasOwnProperty(...)` を直接呼び出していたため、プロトタイププロパティの参照（`toString` や `constructor` など）に対する誤判定や、プロパティのオーバーライドによる不具合・セキュリティ上の懸念が存在していた。
**Learning:** オブジェクトのプロパティ存在チェックを行う際、インスタンスの `.hasOwnProperty` メソッドを直接呼び出すと、プロトタイプチェーン上のメソッド参照やオーバーライドの影響を受ける可能性がある。
**Prevention:** オブジェクトのプロパティ検証には常に `Object.prototype.hasOwnProperty.call(obj, prop)` を使用して安全に判定を行う。

## 2026-03-30 - [Relative URL Bypass in Tab URL Validation] Explicitly Reject Relative Path Scheme Bypass
**Vulnerability:** `isSafeTabUrl` 関数において、`new URL(url, 'chrome-extension://dummy/')` を用いて URL のパースを行っていたため、プロトコル相対URL (`//evil.com`) やパス相対URL (`/path`) が渡された際に base URL である `chrome-extension://dummy/` に対して解決され、結果として `chrome-extension:` プロトコルとみなされてプロトコルチェックを通過してしまう可能性が存在した。
**Learning:** ベースURL付きで `new URL(url, base)` を使用してURLを解析・検証する場合、相対URL（`/` や `\` で始まるもの）が指定されるとベースURLのスキームが引き継がれ、安全なプロトコルであると誤認されるリスクがある。
**Prevention:** `new URL(url, base)` での検証前に、入力文字列をトリムし、`/` や `\` で始まる相対URLおよびプロトコル相対URLを明示的に拒否するか、絶対URLのみを受け入れるように設計する。
