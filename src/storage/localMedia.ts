/**
 * Local media storage using IndexedDB.
 *
 * IMPORTANT:
 * - Binary data is stored ONLY in IndexedDB, never in presets or localStorage.
 * - Keys are scoped per mediaId (we will use presetId as mediaId at call sites).
 * - Existing remote / Pinterest / YouTube pipelines are NOT touched here.
 */

const DB_NAME = 'nzxtesc_local_media';
const DB_VERSION = 1;
const STORE_NAME = 'media';

export interface LocalMediaRecord {
  id: string;
  blob: Blob;
  mime: string;
  createdAt: number;
  fileName: string;
}

/**
 * Opens the local media IndexedDB database, creating object store if needed.
 * This helper is intentionally small and self-contained so it does not affect
 * other storage systems (localStorage / preset export, etc.).
 */
function openLocalMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('id', 'id', { unique: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open local media database'));
    };
  });
}

/**
 * Computes the storage key for a given mediaId.
 * Call sites are expected to pass presetId as mediaId so that each preset
 * can have at most one local media record.
 */
export function getLocalMediaKey(mediaId: string): string {
  return `local_media_${mediaId}`;
}

/**
 * Saves (or overwrites) local media for the given mediaId.
 *
 * NOTE:
 * - Overwrite is intentionally silent: existing records with the same id
 *   are replaced without any prompt, as required by FAZ-3.
 */
export async function saveLocalMedia(file: File, mediaId: string): Promise<void> {
  const db = await openLocalMediaDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const record: LocalMediaRecord = {
    id: getLocalMediaKey(mediaId),
    blob: file,
    mime: file.type || 'application/octet-stream',
    createdAt: Date.now(),
    fileName: file.name,
  };

  await new Promise<void>((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to save local media'));
  });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Transaction failed while saving local media'));
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted while saving local media'));
  });

  db.close();
}

/**
 * Retrieves local media record for the given mediaId.
 *
 * @returns LocalMediaRecord or undefined if not found.
 */
export async function getLocalMedia(mediaId: string): Promise<LocalMediaRecord | undefined> {
  const db = await openLocalMediaDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const key = getLocalMediaKey(mediaId);

  const record = await new Promise<LocalMediaRecord | undefined>((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => {
      resolve((request.result as LocalMediaRecord | undefined) || undefined);
    };
    request.onerror = () => reject(request.error || new Error('Failed to read local media'));
  });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Transaction failed while reading local media'));
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted while reading local media'));
  });

  db.close();
  return record;
}

/**
 * Deletes local media record for the given mediaId.
 * This is a no-op if the record does not exist.
 */
export async function deleteLocalMedia(mediaId: string): Promise<void> {
  const db = await openLocalMediaDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const key = getLocalMediaKey(mediaId);

  await new Promise<void>((resolve, reject) => {
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to delete local media'));
  });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Transaction failed while deleting local media'));
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted while deleting local media'));
  });

  db.close();
}

/**
 * Checks if local media exists for the given mediaId.
 */
export async function hasLocalMedia(mediaId: string): Promise<boolean> {
  const db = await openLocalMediaDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const key = getLocalMediaKey(mediaId);

  const exists = await new Promise<boolean>((resolve, reject) => {
    const request = store.getKey(key);
    request.onsuccess = () => {
      resolve(request.result !== undefined && request.result !== null);
    };
    request.onerror = () => reject(request.error || new Error('Failed to check local media existence'));
  });

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Transaction failed while checking local media existence'));
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted while checking local media existence'));
  });

  db.close();
  return exists;
}


