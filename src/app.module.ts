import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoListItemsModule } from './todo_lists_items/todo_lists_items.module';

@Module({
  imports: [TodoListsModule, TodoListItemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
