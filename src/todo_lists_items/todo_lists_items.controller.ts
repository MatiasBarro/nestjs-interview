import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TodoListItemsService } from './todo_lists_items.service';
import { CreateTodoListItemDto } from './dtos/create-todo_lists_item';
import { TodoListItem } from 'src/todo_lists_items/interfaces/todo_lists_item.interface';
import { UpdateTodoListItemDto } from './dtos/update-todo_lists_item';
import { ParseAndValidateTodoListIdPipe } from './middlewares/parse_validate_todo_list.pipe';

@Controller('api/todolists/:todoListId/items')
export class TodoListItemsController {
  constructor(private readonly todoListItemService: TodoListItemsService) {}

  @Post('')
  create(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
    @Body() dto: CreateTodoListItemDto,
  ): TodoListItem {
    return this.todoListItemService.create(todoListId, dto);
  }

  @Get('')
  getByTodoListId(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
  ): TodoListItem[] {
    return this.todoListItemService.getByTodoListId(todoListId);
  }

  @Get('/:itemId')
  getById(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): TodoListItem {
    return this.todoListItemService.getById(todoListId, itemId);
  }

  @Patch('/:itemId')
  update(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateTodoListItemDto,
  ) {
    return this.todoListItemService.update(todoListId, itemId, dto);
  }

  @Delete('/:itemId')
  delete(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    this.todoListItemService.delete(todoListId, itemId);
  }

  @Post('/bulk-delete')
  deleteBulk(
    @Param('todoListId', ParseAndValidateTodoListIdPipe) todoListId: number,
  ) {
    return this.todoListItemService.bulkDelete(todoListId);
  }

  @Get('/bulk-delete/:bulkDeleteId')
  getBulkDelete(@Param('bulkDeleteId') bulkDeleteId: string) {
    if (!bulkDeleteId) {
      throw new HttpException('Bulk delete id is required', 400);
    }

    return this.todoListItemService.getBulkDelete(bulkDeleteId);
  }
}
