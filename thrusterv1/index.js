const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

exports.handler = async (event) => {

    let input = {
        DelaySeconds: 15,
        QueueUrl: process.env.FIFOURL,
        MessageBody: {
            number1: JSON.parse(event.body).number1,
            number2: JSON.parse(event.body).number2,
            ip: event.requestContext.http.sourceIp,
            timestamp: Date()
        }
    }
    const client = new SQSClient({ region: process.env.REGION })
    const command = new SendMessageCommand(input)
    const response = await client.send(command)
    return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: response
    }
}