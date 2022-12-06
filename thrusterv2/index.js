const { DynamoDBClient, ListTablesCommand } = require("@aws-sdk/client-dynamodb");

exports.handler = async (event) => {
    const client = new DynamoDBClient({ region: "eu-central-1" });
    const command = new ListTablesCommand({});
    try {
        const results = await client.send(command);
        console.log(results.TableNames.join("\n"));
        return results
    } catch (err) {
        console.error(err);
    }
}