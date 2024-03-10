#!/usr/bin/node

const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { pwdHashed } = require('./utils');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    const dbUrl = `mongodb://${host}:${port}`;
    this.connected = false;
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.error('Failed to connect to the database:', err);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const users = await this.client.db(this.database).collection('users').countDocuments();
      return users;
    } catch (err) {
      console.error('Error retrieving the number of users:', err);
      throw err;
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const files = await this.client.db(this.database).collection('files').countDocuments();
      return files;
    } catch (err) {
      console.error('Error retrieving the number of files:', err);
      throw err;
    }
  }

  async createUser(email, password) {
    try {
      const hashedPwd = pwdHashed(password);
      await this.client.connect();
      const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedPwd });
      return user;
    } catch (err) {
      console.error('Error creating a user:', err);
      throw err;
    }
  }

  async getUser(email) {
    try {
      await this.client.connect();
      const user = await this.client.db(this.database).collection('users').findOne({ email });
      return user;
    } catch (err) {
      console.error('Error retrieving a user:', err);
      throw err;
    }
  }

  async getUserById(id) {
    try {
      const _id = new mongo.ObjectID(id);
      await this.client.connect();
      const user = await this.client.db(this.database).collection('users').findOne({ _id });
      return user;
    } catch (err) {
      console.error('Error retrieving a user by ID:', err);
      throw err;
    }
  }

  async userExists(email) {
    try {
      const user = await this.getUser(email);
      return !!user;
    } catch (err) {
      console.error('Error checking if a user exists:', err);
      throw err;
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
