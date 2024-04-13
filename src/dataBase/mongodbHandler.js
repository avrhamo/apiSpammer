const MongoClient = require('mongodb').MongoClient;
const { ipcRenderer } = require('electron');

let client; 
let isConnectedToDB = false;

exports.isConnectedToMongoDB = () => {
    return isConnectedToDB;
};

exports.connectToMongoDBServer = async (connectionString) => {
    try {
        if(isConnectedToDB) return;
        client = new MongoClient(connectionString);
        await client.connect();
        isConnectedToDB = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        isConnectedToDB = false;
        throw error; 
    }
};

exports.getDBList = async () => {
    try {
        const adminDb = client.db('admin');
        const databases = await adminDb.admin().listDatabases();
        return databases.databases.map(db => db.name);
    } catch (error) {
        console.error('Error trying to retrieve DB names:', error);
        throw error; 
    }
};

exports.getCollectionsList = async (databaseName) => {
    try {
        const db = client.db(databaseName);
        const collections = await db.listCollections().toArray();
        return collections.map(collection => collection.name);
    } catch (error) {
        console.error(`Error retrieving collections for database ${databaseName}:`, error);
        throw error;
    }
};


exports.closeConnectionToMongoDBServer = async () => {
    try {
        if(!isConnectedToDB) return;
        await client.close();
        isConnectedToDB = false;
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error trying to close connection to MongoDB:', error);
        throw error; 
    }
};

exports.getMostRichDocument = async (dbName, collectionName) => {

    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Aggregation pipeline to project documents with their field counts
        const pipeline = [
            { $project: { fieldsCount: { $size: { $objectToArray: '$$ROOT' } }, document: '$$ROOT' } },
            { $sort: { fieldsCount: -1 } },
            { $limit: 1 }
        ];

        const result = await collection.aggregate(pipeline).toArray();
        var mostRichDocument = result.length > 0 ? result[0].document : null;
        return JSON.parse(JSON.stringify(mostRichDocument, null, 2));

    } catch (error) {
        console.error('Error retrieving the most rich document:', error);
        throw error;
    }
};
