/**
 * Easy-IndexedDB - A simple and easy-to-use IndexedDB wrapper library
 * @version 1.0.2
 */

/**
 * Easy-IndexedDB Class - Main class for IndexedDB operations
 */
class EasyIndexedDB {
    constructor() {
        this.dbName = '';
        this.version = 1;
        this.db = null;
        this.stores = new Map();
    }

    /**
     * Create or open a database
     * @param {string} dbName - Database name
     * @param {number} version - Database version (optional)
     * @returns {Promise<IDBDatabase>} Database instance
     */
    async createDatabase(dbName, version = 1) {
        return new Promise((resolve, reject) => {
            this.dbName = dbName;
            this.version = version;

            const request = indexedDB.open(dbName, version);

            request.onerror = () => {
                reject(new Error(`Failed to open database: ${request.error}`));
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log(`✅ Database '${dbName}' opened successfully`);
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                console.log(`🔄 Database '${dbName}' created/upgraded to version ${version}`);
                
                // Create stores that were defined before opening
                this.stores.forEach((storeConfig, storeName) => {
                    if (!this.db.objectStoreNames.contains(storeName)) {
                        this.createObjectStore(storeName, storeConfig);
                    }
                });
            };
        });
    }

    /**
     * Define a table (object store) structure
     * @param {string} storeName - Store name
     * @param {Object} config - Store configuration
     * @param {string|Array} config.keyPath - Primary key path
     * @param {boolean} config.autoIncrement - Auto increment primary key
     * @param {Array} config.indexes - Array of indexes to create
     */
    defineStore(storeName, config = {}) {
        const storeConfig = {
            keyPath: config.keyPath || 'id',
            autoIncrement: config.autoIncrement || false,
            indexes: config.indexes || []
        };

        this.stores.set(storeName, storeConfig);

        // If database is already open, create the store immediately
        if (this.db && !this.db.objectStoreNames.contains(storeName)) {
            this.createObjectStore(storeName, storeConfig);
        }

        console.log(`📋 Store '${storeName}' defined`);
    }

    /**
     * Create object store in the database
     * @param {string} storeName - Store name
     * @param {Object} config - Store configuration
     */
    createObjectStore(storeName, config) {
        if (!this.db) {
            throw new Error('Database not opened. Call createDatabase() first.');
        }

        const store = this.db.createObjectStore(storeName, {
            keyPath: config.keyPath,
            autoIncrement: config.autoIncrement
        });

        // Create indexes
        config.indexes.forEach(index => {
            if (typeof index === 'string') {
                store.createIndex(index, index, { unique: false });
            } else if (typeof index === 'object') {
                store.createIndex(index.name, index.keyPath, {
                    unique: index.unique || false
                });
            }
        });

        console.log(`🗂️ Object store '${storeName}' created`);
    }

    /**
     * Add a record to a store
     * @param {string} storeName - Store name
     * @param {Object} data - Data to add
     * @returns {Promise<any>} Added record with generated ID
     */
    async addRecord(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not opened. Call createDatabase() first.'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            const request = store.add(data);

            request.onsuccess = () => {
                const result = { ...data };
                if (this.stores.get(storeName).autoIncrement) {
                    result.id = request.result;
                }
                console.log(`✅ Record added to '${storeName}'`);
                resolve(result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to add record: ${request.error}`));
            };
        });
    }

    /**
     * Update a record in a store
     * @param {string} storeName - Store name
     * @param {Object} data - Updated data (must include key)
     * @returns {Promise<Object>} Updated record
     */
    async updateRecord(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not opened. Call createDatabase() first.'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            const request = store.put(data);

            request.onsuccess = () => {
                console.log(`🔄 Record updated in '${storeName}'`);
                resolve(data);
            };

            request.onerror = () => {
                reject(new Error(`Failed to update record: ${request.error}`));
            };
        });
    }

    /**
     * Delete a record from a store
     * @param {string} storeName - Store name
     * @param {any} key - Record key to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteRecord(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not opened. Call createDatabase() first.'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`🗑️ Record deleted from '${storeName}'`);
                resolve(true);
            };

            request.onerror = () => {
                reject(new Error(`Failed to delete record: ${request.error}`));
            };
        });
    }

    /**
     * Get a record by key
     * @param {string} storeName - Store name
     * @param {any} key - Record key
     * @returns {Promise<Object|null>} Record data
     */
    async getRecord(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not opened. Call createDatabase() first.'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result || null);
            };

            request.onerror = () => {
                reject(new Error(`Failed to get record: ${request.error}`));
            };
        });
    }

    /**
     * Get all records from a store
     * @param {string} storeName - Store name
     * @returns {Promise<Array>} All records
     */
    async getAllRecords(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not opened. Call createDatabase() first.'));
                return;
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);

            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(new Error(`Failed to get all records: ${request.error}`));
            };
        });
    }

    /**
     * Close the database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log(`🔒 Database '${this.dbName}' closed`);
        }
    }
}

/**
 * Welcome function to greet users
 * @returns {void}
 */
function welcome() {
    console.log('Welcome to EasyIndexedDB! v1.0.2');
    console.log('A simple and powerful IndexedDB wrapper for JavaScript');
}

// Export the class and welcome function
module.exports = {
    EasyIndexedDB,
    welcome
};