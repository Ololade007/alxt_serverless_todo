import * as AWS  from 'aws-sdk'


import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoUpdate } from '../models/TodoUpdate';


import { Types } from 'aws-sdk/clients/s3';
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

import { Todo  } from '../models/TodoItem'


export class TodoAccess {
 constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly ItemsTable = process.env.TODOS_TABLE,
    private readonly s3: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.ATTACHMENT_BUCKET 
    ) {
  }

  async getAllTodos(userId : string): Promise<Todo[]> {
    const user = userId
    const result = await this.docClient.query({
      TableName: this.ItemsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': user
      },ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as Todo[]
  }

  async generateSignedUrl(todoId: string) : Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      key : todoId,
      Expires : 1000
    })
  }

  async createTodo(Todo: Todo): Promise<Todo> {
   await this.docClient.put({
      TableName: this.ItemsTable,
      Item: Todo
    }).promise()

    return Todo
  }

  async deleteTodo(todoId: string, userId : string): Promise<string> {
    const id = todoId
    const user = userId
    await this.docClient.delete({
      TableName: this.ItemsTable,
      Key: {
        todoId: id,
        userId: user
      }
    }).promise()
    return "" as string;
}
async updateTodo(Todo: TodoUpdate , userId: string, todoId: string): Promise< TodoUpdate > {
 const result = await this.docClient.update({
    TableName: this.ItemsTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: "set #name=:name, #dueDate=:dueDate, #done=:done",
    ExpressionAttributeValues:{
        ":name": Todo.name,
        ":dueDate": Todo.dueDate,
        ":done": Todo.done
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#dueDate" : "duedate",
      "#done" : "done"
    },
    ReturnValues: "ALL_NEW"
  }).promise()
  const attributes = result.Attributes
  return attributes as TodoUpdate;
}
}


