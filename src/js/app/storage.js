/**
 * @constructor
 */
export default class MyStorage {
  /**
   * @constructor
   *
   * @param {string} storageType
   */
  constructor(storageType) {
    this.storageType = storageType;
  }

  /** @return {string} */
  static get LOCAL_STORAGE() {
    return 'localStorage';
  }

  /** @return {string} */
  static get CHROME_STORAGE_LOCAL() {
    return 'chrome.storage.local';
  }

  /** @return {string} */
  static get CHROME_STORAGE_SYNC() {
    return 'chrome.storage.sync';
  }

  /**
   * Removes all items from storage.
   */
  clear() {
    switch (this.storageType) {
      case MyStorage.CHROME_STORAGE_LOCAL:
        chrome.storage.local.clear();
        break;

      case MyStorage.CHROME_STORAGE_SYNC:
        chrome.storage.sync.clear();
        break;

      case MyStorage.LOCAL_STORAGE:
        localStorage.clear();
        break;

      default:
        console.error('error');
        break;
    }
  }

  /**
   * 指定されたアイテム１件を削除する
   *
   * @param {string} key
   */
  remove(key) {
    switch (this.storageType) {
      case MyStorage.CHROME_STORAGE_LOCAL:
        chrome.storage.local.remove(key);
        break;

      case MyStorage.CHROME_STORAGE_SYNC:
        chrome.storage.sync.remove(key);
        break;

      case MyStorage.LOCAL_STORAGE:
        localStorage.removeItem(key);
        break;

      default:
        console.error('error');
        break;
    }
  };

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  load(key) {
    return new Promise((resolve, reject) => {
      switch (this.storageType) {
        case MyStorage.CHROME_STORAGE_LOCAL:
          chrome.storage.local.get(key, (value) => {
            resolve(value[key]);
          });
          break;

        case MyStorage.CHROME_STORAGE_SYNC:
          chrome.storage.sync.get(key, (value) => {
            resolve(value[key]);
          });
          break;

        case MyStorage.LOCAL_STORAGE:
          const loadData = localStorage.getItem(key);
          resolve(loadData);
          break;

        default:
          reject(new Error('error'));
          break;
      }
    });
  };

  /**
   *
   * @param {string} key
   * @param {type} saveData
   */
  save(key, saveData) {
    const saveParam = {};
    saveParam[key] = saveData;
    switch (this.storageType) {
      case MyStorage.CHROME_STORAGE_LOCAL:
        chrome.storage.local.set(saveParam, () => {});
        break;

      case MyStorage.CHROME_STORAGE_SYNC:
        chrome.storage.sync.set(saveParam, () => {});
        break;

      case MyStorage.LOCAL_STORAGE:
        localStorage.setItem(key, saveData);
        break;

      default:
        console.error('error');
        break;
    }
  };
}
