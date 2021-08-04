interface Language {
    Japanese: string;
    English: string;
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
    'Japanese': '全ての設定を初期状態に戻します。実行しますか？',
    'English': 'Reset all settings. Is it OK?',
  },
  'gesture': {
    'gesture_close_tab': {
      'Japanese': 'タブを閉じる',
      'English': 'tab close',
    },
    'gesture_new_tab': {
      'Japanese': '新しいタブ/新しいタブでリンクを開く',
      'English': 'New tab/Open the link in a new tab',
    },
    'gesture_new_tab_background': {
      'Japanese': '新しいタブ/新しいタブでリンクを開く(バックグラウンドで開く)',
      'English': 'New tab/Open the link in a new tab(in the background)',
    },
    'gesture_pin_tab': {
      'Japanese': 'タブを固定/解除',
      'English': 'pin the tabs',
    },
    'gesture_reload': {
      'Japanese': 'ページを再読み込み',
      'English': 'reload',
    },
    'gesture_forward': {
      'Japanese': '進む',
      'English': 'forward',
    },
    'gesture_back': {
      'Japanese': '戻る',
      'English': 'back',
    },
    'gesture_scroll_top': {
      'Japanese': 'ページの先頭までスクロール',
      'English': 'scroll top',
    },
    'gesture_scroll_bottom': {
      'Japanese': 'ページの最後までスクロール',
      'English': 'scroll bottom',
    },
    'gesture_last_tab': {
      'Japanese': '閉じたタブを開く',
      'English': 'open last tab',
    },
    'gesture_reload_all': {
      'Japanese': '全てのページを再読み込み',
      'English': 'reload all',
    },
    'gesture_next_tab': {
      'Japanese': '次のタブ',
      'English': 'next tab',
    },
    'gesture_prev_tab': {
      'Japanese': '前のタブ',
      'English': 'prev tab',
    },
    'gesture_close_right_tab_without_pinned': {
      'Japanese': '右のタブを閉じる(固定されたタブを除く）',
      'English': 'Close the right tab (without pinned)',
    },
    'gesture_close_right_tab': {
      'Japanese': '右のタブを閉じる',
      'English': 'Close the right tab',
    },
    'gesture_close_left_tab_without_pinned': {
      'Japanese': '左のタブを閉じる(固定されたタブを除く）',
      'English': 'Close the left tab (without pinned)',
    },
    'gesture_close_left_tab': {
      'Japanese': '左のタブを閉じる',
      'English': 'Close the left tab',
    },
    'gesture_close_all_background': {
      'Japanese': '同一ウィンドウの他のタブを閉じる',
      'English': 'close all background tab',
    },
    'gesture_close_all': {
      'Japanese': '同一ウィンドウの全てのタブを閉じる',
      'English': 'close all tab',
    },
    'gesture_open_option': {
      'Japanese': 'simpleGestureの設定を開く',
      'English': 'open simpleGesture option page',
    },
    'gesture_open_extension': {
      'Japanese': 'Google Chromeの「拡張機能」ページを開く',
      'English': 'open chrome extension page',
    },
    'gesture_restart': {
      'Japanese': 'Google Chromeを再起動する',
      'English': 'restart google chrome',
    },
  },
};


export default lang;
