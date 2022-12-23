import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const sqsClient = new SQSClient({ region: process.env.REGION })
const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
const queueUrl = process.env.FIFOURL;
const sqsParams = {
    MaxNumberOfMessages: 10,
    MessagesAttributeNames: ["All"],
    QueueUrl: queueUrl,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
}

function MakeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function handler() {
    let dynamoParams = {
        TableName: process.env.DATABASE_TABLE,
        Item: {
            ID: { S: MakeId(16) },
            timestamp: { S: Date() },
            status: { S: "Failed" }
        }
    }
    try {
        const data = await sqsClient.send(new ReceiveMessageCommand(sqsParams));
        if (data.Messages) {
            dynamoParams = { ...dynamoParams, status: { S: "Success" } }
            let deleteParams = {
                QueueUrl: queueUrl,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            }
            try {
                const data = await sqsClient.send(new DeleteMessageCommand(deleteParams))
                console.log("Message deleted", data)
            } catch (err) {
                console.log("Error", err)
            }
        } else {
            console.log("No messages to delete")
        } try {
            const data = await dynamoClient.send(new PutItemCommand(dynamoParams))
            console.log("Item inserted correctly ", data)
        } catch (err) {
            console.log("Error ", err)
        }
        return data
    } catch (err) {
        console.log("Receive Error", err)
    }
}