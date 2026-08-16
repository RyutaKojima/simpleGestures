/**
 *
 */
export default class MyStorage {
  storageType: string;

  /**
   * @param {string} storageType
   */
  constructor(storageType: string) {
    this.storageType = storageType;
  }

  /**
   * @return {string}
   */
  static get LOCAL_STORAGE(): string {
    return 'localStorage';
  }

  /**
   * @return {string}
   */
  static get CHROME_STORAGE_LOCAL(): string {
    return 'chrome.storage.local';
  }

  /**
   * @return {string}
   */
  static get CHROME_STORAGE_SYNC(): string {
    return 'chrome.storage.sync';
  }

  /**
   * @return {chrome.storage.StorageArea | Storage | null}
   */
  private getStorage(): chrome.storage.StorageArea | Storage | null {
    switch (this.storageType) {
      case MyStorage.CHROME_STORAGE_LOCAL:
        return chrome.storage.local;
      case MyStorage.CHROME_STORAGE_SYNC:
        return chrome.storage.sync;
      case MyStorage.LOCAL_STORAGE:
        return localStorage;
      default:
        console.error('error: invalid storageType');
        return null;
    }
  }

  /**
   * Removes all items from storage.
   */
  clear(): void {
    const storage = this.getStorage();
    if (!storage) return;

    if ('clear' in storage && typeof storage.clear === 'function') {
      storage.clear();
    }
  }

  /**
   * 指定されたアイテム１件を削除する
   *
   * @param {string} key
   */
  remove(key: string): void {
    const storage = this.getStorage();
    if (!storage) return;

    if (this.storageType === MyStorage.LOCAL_STORAGE) {
      (storage as Storage).removeItem(key);
    } else {
      (storage as chrome.storage.StorageArea).remove(key);
    }
  }

  /**
   * @param {string} key
   * @return {Promise<string>}
   */
  load(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = this.getStorage();
      if (!storage) {
        reject(new Error('error'));
        return;
      }

      if (this.storageType === MyStorage.LOCAL_STORAGE) {
        const loadData = (storage as Storage).getItem(key);
        resolve(loadData || '');
      } else {
        (storage as chrome.storage.StorageArea).get(key, (value) => {
          resolve((value[key] as string) || '');
        });
      }
    });
  }

  /**
   * @param {string} key
   * @param {string} saveData
   */
  save(key: string, saveData: string): void {
    const storage = this.getStorage();
    if (!storage) return;

    if (this.storageType === MyStorage.LOCAL_STORAGE) {
      (storage as Storage).setItem(key, saveData);
    } else {
      const saveParam: { [key:string]: string } = {
        [key]: saveData,
      };
      (storage as chrome.storage.StorageArea).set(saveParam);
    }
  }
}
