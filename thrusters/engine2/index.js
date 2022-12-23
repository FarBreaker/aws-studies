import { ReceiveMessageCommand, DeleteMessageCommand, SQSClient } from "@aws-sdk/client-sqs"
const client = new SQSClient({ region: process.env.REGION })
const queueUrl = process.env.FIFOURL;
const params = {
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: 10,
    MessagesAttributeNames: ["All"],
    QueueUrl: queueUrl,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
}

export async function handler() {
    try {
        const data = await client.send(new ReceiveMessageCommand(params));
        if (data.Messages) {
            let deleteParams = {
                QueueUrl: queueUrl,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            }
            try {
                const data = await client.send(new DeleteMessageCommand(deleteParams))
                console.log("Message deleted", data)
            } catch (err) {
                console.log("Error", err)
            }
        } else {
            console.log("No messages to delete")
        }
        return data
    } catch (err) {
        console.log("Receive Error", err)
    }
}
