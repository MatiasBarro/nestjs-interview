import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoListItemService } from './todo_list_item.service';
import { TodoListsService } from './todo_lists.service';
import { CreateTodoListItemDto } from './dtos/create-todo_list_item';
import { TodoListItem } from 'src/interfaces/todo_list_item.interface';
import { UpdateTodoListItemDto } from './dtos/update-todo_list_item';

@Controller('api/todolists/:todoListId/items')
export class TodoListItemController {
  constructor(
    private readonly todoListItemService: TodoListItemService,
    private readonly todoListService: TodoListsService,
  ) {}

  @Post('')
  create(
    @Param('todoListId') todoListId: number,
    @Body() dto: CreateTodoListItemDto,
  ): TodoListItem {
    const todoList = this.todoListService.get(todoListId);

    if (!todoList) {
      throw new HttpException('Todo list not found', 400);
    }

    return this.todoListItemService.create(todoListId, dto);
  }

  @Get('')
  getByTodoListId(@Param('todoListId') todoListId: number): TodoListItem[] {
    return this.todoListItemService.getByTodoListId(todoListId);
  }

  @Get('/:itemId')
  getById(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
  ): TodoListItem {
    const item = this.todoListItemService.getById(Number(todoListId), itemId);

    if (!item) {
      throw new HttpException('Item not found', 404);
    }

    return item;
  }

  @Patch('/:itemId')
  update(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
    @Body() dto: UpdateTodoListItemDto,
  ) {
    return this.todoListItemService.update(todoListId, itemId, dto);
  }

  @Delete('/:itemId')
  delete(
    @Param('todoListId') todoListId: number,
    @Param('itemId') itemId: number,
  ) {
    this.todoListItemService.delete(todoListId, itemId);
  }
}
