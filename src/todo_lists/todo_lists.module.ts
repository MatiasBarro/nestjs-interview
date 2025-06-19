import { Module } from '@nestjs/common';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';
import { TodoListItemController } from './todo_list_item.controler';
import { TodoListItemService } from './todo_list_item.service';

@Module({
  imports: [],
  controllers: [TodoListsController, TodoListItemController],
  providers: [
    { provide: TodoListsService, useValue: new TodoListsService([]) },
    { provide: TodoListItemService, useValue: new TodoListItemService([]) },
  ],
})
export class TodoListsModule {}
