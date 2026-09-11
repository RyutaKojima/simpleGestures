## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。

## 2025-03-29 - [Prototype Pollution Protection] Use Object.prototype.hasOwnProperty.call for Property Checks
**Vulnerability:** `LibOption` 内で `this.optionsInstance.hasOwnProperty(...)` や `this.gestureHash.hasOwnProperty(...)` を直接呼び出していたため、プロトタイププロパティの参照（`toString` や `constructor` など）に対する誤判定や、プロパティのオーバーライドによる不具合・セキュリティ上の懸念が存在していた。
**Learning:** オブジェクトのプロパティ存在チェックを行う際、インスタンスの `.hasOwnProperty` メソッドを直接呼び出すと、プロトタイプチェーン上のメソッド参照やオーバーライドの影響を受ける可能性がある。
**Prevention:** オブジェクトのプロパティ検証には常に `Object.prototype.hasOwnProperty.call(obj, prop)` を使用して安全に判定を行う。

## 2025-05-17 - [URL Validation] Reject Relative Paths Before Parsing with Extension Base URL
**Vulnerability:** `isSafeTabUrl` において、`new URL(url, 'chrome-extension://dummy/')` で URL をパースしていたため、`//evil.com` や `/path` などのプロトコル相対・パス相対 URL がベース URI のスキーム (`chrome-extension:`) を継承し、プロトコル検証をバイパスして許可される問題が存在していた。
**Learning:** ダミーの拡張機能オリジン等をベース URL として `new URL(url, base)` に渡して検証する場合、相対 URL はベースのスキームを継承するため、許可対象スキームと判定されてしまう。
**Prevention:** `new URL(url, base)` で URL パースを行う前に、入力文字列を `trim()` し、`//` や `/` や `\` で始まる相対 URL を明示的に不許可とする。
