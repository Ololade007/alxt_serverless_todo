import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'


import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler : APIGatewayProxyHandler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const jwtToken = getUserId(event)
    const update = await updateTodo( todoId, jwtToken ,updatedTodo)
    return {
      statusCode: 204,
      headers: {
      'Access-Control-Allow-Origin': '*',
      
    },
      body: JSON.stringify({
        "item": update
      })
    }
  }



