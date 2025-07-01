import { PipeTransform, Injectable, HttpException } from '@nestjs/common';
import { TodoListsService } from '../../todo_lists/todo_lists.service';

@Injectable()
export class ParseAndValidateTodoListIdPipe
  implements PipeTransform<string, Promise<number>>
{
  // Note: returns a Promise<number> because it's async
  constructor(private readonly todoListService: TodoListsService) {}

  async transform(value: string): Promise<number> {
    const todoListId = parseInt(value, 10);
    if (isNaN(todoListId)) {
      throw new HttpException(
        `Validation failed. '${value}' is not a valid integer for list ID.`,
        400,
      );
    }

    const todoList = await this.todoListService.get(todoListId);
    if (!todoList) {
      throw new HttpException(
        `Todo List with ID ${todoListId} not found.`,
        404,
      );
    }

    return todoListId;
  }
}
