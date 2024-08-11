interface Language {
    English: string;
    Japanese: string;
}

interface Languages {
  [key: string]: Language
}

interface LanguageConfig {
  'confirmOptionReset': Language
  'gesture': Languages
}

const lang: LanguageConfig = {
  'confirmOptionReset': {
    'English': 'Reset all settings. Is it OK?',
    'Japanese': '全ての設定を初期状態に戻します。実行しますか？',
  },
  'gesture': {
    'gesture_back': {
      'English': 'Back',
      'Japanese': '戻る',
    },
    'gesture_close_all': {
      'English': 'Close all tabs',
      'Japanese': '同一ウィンドウの全てのタブを閉じる',
    },
    'gesture_close_all_background': {
      'English': 'Close all background tabs',
      'Japanese': '同一ウィンドウの他のタブを閉じる',
    },
    'gesture_close_left_tab': {
      'English': 'Close the left tab',
      'Japanese': '左のタブを閉じる',
    },
    'gesture_close_left_tab_without_pinned': {
      'English': 'Close the left tab (without pinned)',
      'Japanese': '左のタブを閉じる(固定されたタブを除く）',
    },
    'gesture_close_right_tab': {
      'English': 'Close the right tab',
      'Japanese': '右のタブを閉じる',
    },
    'gesture_close_right_tab_without_pinned': {
      'English': 'Close the right tab (without pinned)',
      'Japanese': '右のタブを閉じる(固定されたタブを除く）',
    },
    'gesture_close_tab': {
      'English': 'Close tab',
      'Japanese': 'タブを閉じる',
    },
    'gesture_duplicate_tab': {
      'English': 'Duplicate Tab',
      'Japanese': 'タブを複製する',
    },
    'gesture_forward': {
      'English': 'Forward',
      'Japanese': '進む',
    },
    'gesture_last_tab': {
      'English': 'Open last tab',
      'Japanese': '閉じたタブを開く',
    },
    'gesture_new_tab': {
      'English': 'New tab/Open the link in a new tab',
      'Japanese': '新しいタブ/新しいタブでリンクを開く',
    },
    'gesture_new_tab_background': {
      'English': 'New tab/Open the link in a new tab(in the background)',
      'Japanese': '新しいタブ/新しいタブでリンクを開く(バックグラウンドで開く)',
    },
    'gesture_next_tab': {
      'English': 'Go to right tab',
      'Japanese': '右のタブへ',
    },
    'gesture_open_extension': {
      'English': 'Open chrome extension page',
      'Japanese': 'Google Chromeの「拡張機能」ページを開く',
    },
    'gesture_open_option': {
      'English': 'Open simpleGesture option page',
      'Japanese': 'simpleGestureの設定を開く',
    },
    'gesture_pin_tab': {
      'English': 'Pin the tab',
      'Japanese': 'タブを固定/解除',
    },
    'gesture_prev_tab': {
      'English': 'Go to left tab',
      'Japanese': '左のタブへ',
    },
    'gesture_reload': {
      'English': 'Reload',
      'Japanese': 'ページを再読み込み',
    },
    'gesture_reload_all': {
      'English': 'Reload all tabs',
      'Japanese': '全てのページを再読み込み',
    },
    'gesture_restart': {
      'English': 'Restart google chrome',
      'Japanese': 'Google Chromeを再起動する',
    },
    'gesture_scroll_bottom': {
      'English': 'Scroll to bottom',
      'Japanese': 'ページの最後までスクロール',
    },
    'gesture_scroll_top': {
      'English': 'Scroll to top',
      'Japanese': 'ページの先頭までスクロール',
    },
    'gesture_window_maximize': {
      'English': 'Window maximize',
      'Japanese': 'ウィンドウを最大化',
    },
    'gesture_window_minimize': {
      'English': 'Window minimize',
      'Japanese': 'ウィンドウを最小化',
    },
    'gesture_window_normalize': {
      'English': 'Window size to normal',
      'Japanese': 'ウィンドウを通常サイズにする',
    },
  },
};


export default lang;
