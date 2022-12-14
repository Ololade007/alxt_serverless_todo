import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler : APIGatewayProxyHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const token = getUserId(event)
    const newItem = await createTodo(newTodo, token)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item : newItem
      })
    }
  }


