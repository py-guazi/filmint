// lib/db.js
import Dexie from 'dexie';

export const db = new Dexie('mintdb');

// Define database schema and version
db.version(1).stores({
  accounts: '++id, address', // Primary key 'id' is auto-incremented
  collections: '++id, imageURL, name, description, nItem, contractAddress, created, accountID',
  mints: '++id, imageURL, name, description, tokenID, collectionID',
});

// Optional: Add methods to your database
db.accounts.mapToClass(class Account {
  constructor(address) {
    this.address = address;
  }
});

db.collections.mapToClass(class Collection {
  constructor(imageURL, name, description, nItem, contractAddress, created, accountID) {
    this.imageURL = imageURL;
    this.name = name;
    this.description = description;
    this.nItem = nItem;
    this.contractAddress = contractAddress;
    this.created = created;
    this.accountID = accountID;
  }
}
);

db.mints.mapToClass(class Mint {
  constructor(imageURL, name, description, tokenID, collectionID) {
    this.imageURL = imageURL;
    this.name = name;
    this.description = description;
    this.tokenID = tokenID;
    this.collectionID = collectionID;
  }
});

export default db;