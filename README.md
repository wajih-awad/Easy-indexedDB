# Easy-IndexedDB

A simple and easy-to-use IndexedDB wrapper library for JavaScript and TypeScript.

## Features

- 🚀 Simple and intuitive API
- 📦 TypeScript support
- 🔧 Easy database and table creation
- ⚡ Full CRUD operations
- 🎯 Promise-based operations
- 🛡️ Error handling

## Installation

```bash
npm install @wajih-awad/easy-indexeddb
```

## Usage

### Basic Setup

```javascript
const { EasyIndexedDB } = require('@wajih-awad/easy-indexeddb');

// Create an instance
const db = new EasyIndexedDB();

// Create database and define tables
async function setupDatabase() {
    try {
        // 1. Create database
        await db.createDatabase('MyAppDB', 1);
        
        // 2. Define table structure
        db.defineStore('users', {
            keyPath: 'id',
            autoIncrement: true,
            indexes: ['name', 'email', { name: 'email_unique', keyPath: 'email', unique: true }]
        });
        
        db.defineStore('products', {
            keyPath: 'id',
            autoIncrement: true,
            indexes: ['name', 'category', 'price']
        });
        
        console.log('Database setup complete!');
    } catch (error) {
        console.error('Database setup failed:', error);
    }
}
```

### CRUD Operations

```javascript
// Add records
async function addUser() {
    try {
        const user = await db.addRecord('users', {
            name: 'John Doe',
            email: 'john@example.com',
            age: 30
        });
        console.log('User added:', user);
    } catch (error) {
        console.error('Failed to add user:', error);
    }
}

// Update records
async function updateUser() {
    try {
        const updatedUser = await db.updateRecord('users', {
            id: 1,
            name: 'John Smith',
            email: 'johnsmith@example.com',
            age: 31
        });
        console.log('User updated:', updatedUser);
    } catch (error) {
        console.error('Failed to update user:', error);
    }
}

// Get records
async function getUser() {
    try {
        const user = await db.getRecord('users', 1);
        console.log('User:', user);
        
        // Get all users
        const allUsers = await db.getAllRecords('users');
        console.log('All users:', allUsers);
    } catch (error) {
        console.error('Failed to get user:', error);
    }
}

// Delete records
async function deleteUser() {
    try {
        const success = await db.deleteRecord('users', 1);
        console.log('User deleted:', success);
    } catch (error) {
        console.error('Failed to delete user:', error);
    }
}
```

### Complete Example

```javascript
const { EasyIndexedDB } = require('@wajih-awad/easy-indexeddb');

async function main() {
    const db = new EasyIndexedDB();
    
    try {
        // Setup database
        await db.createDatabase('MyAppDB', 1);
        
        // Define stores
        db.defineStore('users', {
            keyPath: 'id',
            autoIncrement: true,
            indexes: ['name', 'email']
        });
        
        // Add some data
        const user1 = await db.addRecord('users', {
            name: 'Alice',
            email: 'alice@example.com'
        });
        
        const user2 = await db.addRecord('users', {
            name: 'Bob',
            email: 'bob@example.com'
        });
        
        // Get all users
        const users = await db.getAllRecords('users');
        console.log('Users:', users);
        
        // Update user
        await db.updateRecord('users', {
            id: user1.id,
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com'
        });
        
        // Get specific user
        const updatedUser = await db.getRecord('users', user1.id);
        console.log('Updated user:', updatedUser);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        db.close();
    }
}

main();
```

### React/Next.js Example

```jsx
import { useEffect, useState } from 'react';
import { EasyIndexedDB } from '@wajih-awad/easy-indexeddb';

function UserManager() {
    const [db, setDb] = useState(null);
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        const initDB = async () => {
            const database = new EasyIndexedDB();
            await database.createDatabase('MyAppDB', 1);
            database.defineStore('users', {
                keyPath: 'id',
                autoIncrement: true,
                indexes: ['name', 'email']
            });
            setDb(database);
            
            // Load existing users
            const existingUsers = await database.getAllRecords('users');
            setUsers(existingUsers);
        };
        
        initDB();
    }, []);
    
    const addUser = async (userData) => {
        if (db) {
            const newUser = await db.addRecord('users', userData);
            setUsers([...users, newUser]);
        }
    };
    
    const deleteUser = async (userId) => {
        if (db) {
            await db.deleteRecord('users', userId);
            setUsers(users.filter(user => user.id !== userId));
        }
    };
    
    return (
        <div>
            <h1>User Manager</h1>
            {users.map(user => (
                <div key={user.id}>
                    {user.name} - {user.email}
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
```

## API Reference

### Easy-IndexedDB Class

#### `constructor()`
Creates a new EasyIndexedDB instance.

#### `createDatabase(dbName, version?)`
Creates or opens a database.
- `dbName` (string): Database name
- `version` (number, optional): Database version (default: 1)
- Returns: `Promise<IDBDatabase>`

#### `defineStore(storeName, config?)`
Defines a table structure.
- `storeName` (string): Store name
- `config` (StoreConfig, optional): Store configuration
  - `keyPath` (string|string[]): Primary key path (default: 'id')
  - `autoIncrement` (boolean): Auto increment primary key (default: false)
  - `indexes` (Array): Array of indexes to create

#### `addRecord(storeName, data)`
Adds a record to a store.
- `storeName` (string): Store name
- `data` (Object): Data to add
- Returns: `Promise<any>`

#### `updateRecord(storeName, data)`
Updates a record in a store.
- `storeName` (string): Store name
- `data` (Object): Updated data (must include key)
- Returns: `Promise<Object>`

#### `deleteRecord(storeName, key)`
Deletes a record from a store.
- `storeName` (string): Store name
- `key` (any): Record key to delete
- Returns: `Promise<boolean>`

#### `getRecord(storeName, key)`
Gets a record by key.
- `storeName` (string): Store name
- `key` (any): Record key
- Returns: `Promise<Object|null>`

#### `getAllRecords(storeName)`
Gets all records from a store.
- `storeName` (string): Store name
- Returns: `Promise<Array>`

#### `close()`
Closes the database connection.

## Browser Support

- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+

## License

MIT

## Version

1.0.2# Easy-indexedDB
