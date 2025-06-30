import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoListItemsModule } from './todo_lists_items/todo_lists_items.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [TodoListsModule, TodoListItemsModule, EventEmitterModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
