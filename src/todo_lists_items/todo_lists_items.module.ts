import { Module } from '@nestjs/common';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';
import { TodoListItemsController } from './todo_lists_items.controller';
import { TodoListItemsService } from './todo_lists_items.service';

@Module({
  imports: [TodoListsModule],
  controllers: [TodoListItemsController],
  providers: [
    { provide: TodoListItemsService, useValue: new TodoListItemsService([]) },
  ],
})
export class TodoListItemsModule {}
