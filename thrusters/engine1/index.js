const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

exports.handler = async (event) => {
    let number1 = JSON.parse(event.body).number1
    let number2 = JSON.parse(event.body).number2
    let input = {
        QueueUrl: process.env.FIFOURL,
        MessageGroupId: "group1",
        MessageDeduplicationId: Math.random(),
        MessageBody: {
            number1: number1,
            number2: number2,
            ip: event.requestContext.http.sourceIp,
            timestamp: Date()
        }
    }
    const client = new SQSClient({ region: process.env.REGION })
    const command = new SendMessageCommand(input)
    let sum = number1 + number2
    try {
        const response = await client.send(command)
        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: response
        }
    } catch (error) {
        return error
    }
}