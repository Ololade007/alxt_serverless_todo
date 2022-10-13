import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userid = getUserId(event)
    const newItem = await updateTodo( todoId,userid,updatedTodo)
    return {
      statusCode: 204,
      body: JSON.stringify({
        newItem
      })
    }
  }
)

handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)
