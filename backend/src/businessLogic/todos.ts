

import { Todo  } from '../models/TodoItem'

import { TodoAccess} from '../dataLayer/todosAccess'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const uuidv4 = require('uuid/v4');
const todoAccess = new TodoAccess();

export async function getAllTodos(userId : string): Promise<Todo[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<Todo> {

  const itemId = uuidv4();
  return await todoAccess.createTodo({
      todoId: itemId,
      userId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: '',
      ...createTodoRequest,
  })
}

export async function signedUrl(userId: string, todoId: string): Promise<string> {
    const url = await todoAccess.getSignedUrl(todoId)
    await todoAccess.updateUrl(userId, todoId)
  
    return url
  }

export async function updateTodo(
    userId: string,
    todoId: string,
    updateTodoRequest : UpdateTodoRequest
  ): Promise<void> {
    await todoAccess.updateTodo(updateTodoRequest,todoId,userId)
  }


export async function deleteTodo (todoId: string, userId : string) : Promise<void> {
    return await todoAccess.deleteTodo(todoId,userId)
}