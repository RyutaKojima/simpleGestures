## 2024-11-20 - [XSS Fix] Replace innerHTML with textContent
**Vulnerability:** actionやcommandの名前をDOMに描画する際にinnerHTMLが使用されており、入力が明示的にサニタイズされていない場合、XSSのリスクが存在していた。
**Learning:** 小さなコンテンツスクリプトのオーバーレイを描画するChrome拡張機能において、テキスト変数に対してはinnerHTMLの使用を厳密に避け、DOMベースのスクリプトインジェクションを防ぐためにtextContentを採用すべきである。
**Prevention:** 動的なデータを要素に出力する際は、常に入力を安全にレンダリングするtextContentをinnerHTMLの代わりに使用すべきである。
