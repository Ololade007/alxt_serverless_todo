

import { Todo  } from '../models/TodoItem'

import { TodoAccess} from '../dataLayer/todosAccess'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils';

const uuidv4 = require('uuid/v4');
const todoAccess = new TodoAccess();

export async function getAllTodos(jwtToken : string): Promise<Todo[]> {
  const userId = parseUserId(jwtToken);
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<Todo> {

  const s3BucketName =  process.env.ATTACHMENT_BUCKET 
  const userId = parseUserId(jwtToken);
  const itemId = uuidv4();
  return await todoAccess.createTodo({
      todoId: itemId,
      userId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${itemId}`,
      ...createTodoRequest,
  })
}

export async function generateSignedUrl(todoId: string): Promise<string> {
    const url = await todoAccess.generateSignedUrl(todoId);
    return url
  }

export async function updateTodo(
  jwtToken: string,
    todoId: string,
    updateTodoRequest : UpdateTodoRequest
  ): Promise<void> {

    const userId = parseUserId(jwtToken);
    await todoAccess.updateTodo(updateTodoRequest,userId,todoId)
  }


export async function deleteTodo (todoId: string, jwtToken : string) : Promise<string> {
    const userId = parseUserId(jwtToken);
    return await todoAccess.deleteTodo(todoId,userId)
}