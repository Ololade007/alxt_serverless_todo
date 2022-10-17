import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { generateSignedUrl } from '../../businessLogic/todos'


export const handler : APIGatewayProxyHandler  = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const uploadUrl = await generateSignedUrl(todoId);

    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Credentials': true,
       },
      body: JSON.stringify({
        item : uploadUrl
      })
    }
  }



