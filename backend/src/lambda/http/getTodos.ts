import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors,httpErrorHandler } from 'middy/middlewares'

import { getAllTodos} from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todos = await getAllTodos(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos
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

