/** Type definitions for easy-indexeddb 1.0.2 */

/**
 * Configuration for IndexedDB object store
 */
interface StoreConfig {
    /** Primary key path */
    keyPath?: string | string[];
    /** Auto increment primary key */
    autoIncrement?: boolean;
    /** Array of indexes to create */
    indexes?: (string | IndexConfig)[];
}

/**
 * Configuration for IndexedDB index
 */
interface IndexConfig {
    /** Index name */
    name: string;
    /** Index key path */
    keyPath: string | string[];
    /** Unique constraint */
    unique?: boolean;
}

/**
 * EasyIndexedDB Class - Main class for IndexedDB operations
 */
declare class EasyIndexedDB {
    constructor();

    /**
     * Create or open a database
     * @param dbName - Database name
     * @param version - Database version (optional)
     * @returns Promise<IDBDatabase> Database instance
     */
    createDatabase(dbName: string, version?: number): Promise<IDBDatabase>;

    /**
     * Define a table (object store) structure
     * @param storeName - Store name
     * @param config - Store configuration
     */
    defineStore(storeName: string, config?: StoreConfig): void;

    /**
     * Add a record to a store
     * @param storeName - Store name
     * @param data - Data to add
     * @returns Promise<any> Added record with generated ID
     */
    addRecord(storeName: string, data: any): Promise<any>;

    /**
     * Update a record in a store
     * @param storeName - Store name
     * @param data - Updated data (must include key)
     * @returns Promise<Object> Updated record
     */
    updateRecord(storeName: string, data: any): Promise<any>;

    /**
     * Delete a record from a store
     * @param storeName - Store name
     * @param key - Record key to delete
     * @returns Promise<boolean> Success status
     */
    deleteRecord(storeName: string, key: any): Promise<boolean>;

    /**
     * Get a record by key
     * @param storeName - Store name
     * @param key - Record key
     * @returns Promise<Object|null> Record data
     */
    getRecord(storeName: string, key: any): Promise<any | null>;

    /**
     * Get all records from a store
     * @param storeName - Store name
     * @returns Promise<Array> All records
     */
    getAllRecords(storeName: string): Promise<any[]>;

    /**
     * Close the database connection
     */
    close(): void;
}

/**
 * Prints a welcome message to the console.
 */
declare function welcome(): void;

export { EasyIndexedDB, welcome };
export as namespace easyIndexedDB;