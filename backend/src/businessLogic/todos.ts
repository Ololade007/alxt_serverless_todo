import * as uuid from 'uuid'

import { Todo  } from '../models/TodoItem'

import { TodoAccess} from '../dataLayer/todosAccess'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'

import {UpdateTodoRequest } from '../requests/UpdateTodoRequest'

import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId : string): Promise<Todo[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<Todo> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
      todoId: itemId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
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