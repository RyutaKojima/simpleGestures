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
      'English': 'back',
      'Japanese': '戻る',
    },
    'gesture_close_all': {
      'English': 'close all tab',
      'Japanese': '同一ウィンドウの全てのタブを閉じる',
    },
    'gesture_close_all_background': {
      'English': 'close all background tab',
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
      'English': 'tab close',
      'Japanese': 'タブを閉じる',
    },
    'gesture_forward': {
      'English': 'forward',
      'Japanese': '進む',
    },
    'gesture_last_tab': {
      'English': 'open last tab',
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
      'English': 'next tab',
      'Japanese': '次のタブ',
    },
    'gesture_open_extension': {
      'English': 'open chrome extension page',
      'Japanese': 'Google Chromeの「拡張機能」ページを開く',
    },
    'gesture_open_option': {
      'English': 'open simpleGesture option page',
      'Japanese': 'simpleGestureの設定を開く',
    },
    'gesture_pin_tab': {
      'English': 'pin the tabs',
      'Japanese': 'タブを固定/解除',
    },
    'gesture_prev_tab': {
      'English': 'prev tab',
      'Japanese': '前のタブ',
    },
    'gesture_reload': {
      'English': 'reload',
      'Japanese': 'ページを再読み込み',
    },
    'gesture_reload_all': {
      'English': 'reload all',
      'Japanese': '全てのページを再読み込み',
    },
    'gesture_restart': {
      'English': 'restart google chrome',
      'Japanese': 'Google Chromeを再起動する',
    },
    'gesture_scroll_bottom': {
      'English': 'scroll bottom',
      'Japanese': 'ページの最後までスクロール',
    },
    'gesture_scroll_top': {
      'English': 'scroll top',
      'Japanese': 'ページの先頭までスクロール',
    },
  },
};


export default lang;
