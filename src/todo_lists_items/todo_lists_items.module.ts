import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TodoListsModule } from 'src/todo_lists/todo_lists.module';
import { TodoListItemsController } from './todo_lists_items.controller';
import { TodoListItemsService } from './todo_lists_items.service';

@Module({
  imports: [TodoListsModule],
  controllers: [TodoListItemsController],
  providers: [
    {
      provide: TodoListItemsService,
      useFactory: (eventEmmiter: EventEmitter2) => {
        return new TodoListItemsService([], new Map(), eventEmmiter);
      },
      inject: [EventEmitter2],
    },
  ],
})
export class TodoListItemsModule {}
