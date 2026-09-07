## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。

## 2025-03-29 - [Prototype Pollution Protection] Use Object.prototype.hasOwnProperty.call for Property Checks
**Vulnerability:** `LibOption` 内で `this.optionsInstance.hasOwnProperty(...)` や `this.gestureHash.hasOwnProperty(...)` を直接呼び出していたため、プロトタイププロパティの参照（`toString` や `constructor` など）に対する誤判定や、プロパティのオーバーライドによる不具合・セキュリティ上の懸念が存在していた。
**Learning:** オブジェクトのプロパティ存在チェックを行う際、インスタンスの `.hasOwnProperty` メソッドを直接呼び出すと、プロトタイプチェーン上のメソッド参照やオーバーライドの影響を受ける可能性がある。
**Prevention:** オブジェクトのプロパティ検証には常に `Object.prototype.hasOwnProperty.call(obj, prop)` を使用して安全に判定を行う。

## 2026-03-30 - [URL Validation Bypass Fix] Reject Relative URLs in Tab Creation
**Vulnerability:** `chromeTabs.ts` 内の `isSafeTabUrl` で `new URL(url, 'chrome-extension://dummy/')` を使用していたため、プロトコル相対URL（`//evil.com`）やパス相対URL（`/path`）がベースURLのスキームである `chrome-extension:` に解決され、安全なプロトコルチェックを通過してしまう問題が存在していた。
**Learning:** URLの検証において `new URL(url, base)` を使用してベースURLを指定する場合、相対URLがベースURLの安全なプロトコル（例: `chrome-extension:`）を継承して不適切に検証を通過する可能性がある。
**Prevention:** 外部入力からのタブ作成URLを検証する際は、ベースURL解析前に `startsWith('//')` や `startsWith('/')` などの相対パターンを明示的に拒否するか、絶対URLのみを受け入れる設計にする。
