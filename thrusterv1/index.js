const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient()

async function createItem(params) {
    try {
        await docClient.put(params).promise()
    } catch (err) {
        return err
    }
}
exports.handler = async (event) => {
    let params = {
        TableName: process.env.DATABASE_TABLE,
        Item: {
            ID: Math.random().toString(),
            number1: JSON.parse(event.body).number1,
            number2: JSON.parse(event.body).number2,
            timestamp: Date(),
            ip: event.requestContext.http.sourceIp,
        }
    }
    try {
        await createItem(params)
        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: "Item successfully inserted"
        }
    } catch (err) {
        return { error: err }
    }
}
