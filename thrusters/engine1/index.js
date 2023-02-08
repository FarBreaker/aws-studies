import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export async function handler(event) {
    let number1 = JSON.parse(event.body).number1
    let number2 = JSON.parse(event.body).number2
    let sum = number1 + number2
    // function MakeId(length) {
    //     let result = '';
    //     let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let charactersLength = characters.length;
    //     for (let i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }
    const params = {
        MessageAttributes: {
            Title: {
                DataType: "String",
                StringValue: "Function Entry"
            }
        },
        MessageBody: JSON.stringify({
            number1: number1,
            number2: number2,
            sum: sum,
            ip: event.requestContext.http.sourceIp,
            timestamp: Date()
        }),
        QueueUrl: process.env.FIFOURL,
        DelaySeconds: 4,
        VisibilityTimeout: 60
    }
    const client = new SQSClient({ region: process.env.REGION })
    try {
        const data = await client.send(new SendMessageCommand(params))
        console.log("Success, message sent. MessageID: ", data)
        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: "The sum is: " + sum + " Success, message ID: " + data.MessageId
        }
    } catch (err) {
        return err.toString()
    }
}