## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。

## 2025-03-29 - [Prototype Pollution Protection] Use Object.prototype.hasOwnProperty.call for Property Checks
**Vulnerability:** `LibOption` 内で `this.optionsInstance.hasOwnProperty(...)` や `this.gestureHash.hasOwnProperty(...)` を直接呼び出していたため、プロトタイププロパティの参照（`toString` や `constructor` など）に対する誤判定や、プロパティのオーバーライドによる不具合・セキュリティ上の懸念が存在していた。
**Learning:** オブジェクトのプロパティ存在チェックを行う際、インスタンスの `.hasOwnProperty` メソッドを直接呼び出すと、プロトタイプチェーン上のメソッド参照やオーバーライドの影響を受ける可能性がある。
**Prevention:** オブジェクトのプロパティ検証には常に `Object.prototype.hasOwnProperty.call(obj, prop)` を使用して安全に判定を行う。

## 2026-08-29 - [Fingerprinting Prevention] Enable dynamic URLs in web_accessible_resources
**Vulnerability:** Manifest V3の `web_accessible_resources` において `use_dynamic_url` が未設定のまま `matches: ["<all_urls>"]` でリソースが公開されている場合、悪意のあるWebサイトが既知の拡張機能リソースURLを参照してインストール状況をフィンガープリント調査できる懸念が存在していた。
**Learning:** Chrome拡張機能 Manifest V3では、Webアクセス可能リソースに対して `use_dynamic_url: true` を設定することで、セッションごとに変更される動的URLが生成され、Webページからのトラッキングやフィンガープリント攻撃を防止できる。
**Prevention:** Webアクセス可能なリソース（特に `<all_urls>` にマッチするもの）を定義する際は、不要な識別子漏洩を防ぐため `use_dynamic_url: true` を指定する。
