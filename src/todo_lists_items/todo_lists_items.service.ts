import { v4 as uuid } from 'uuid';
import { HttpException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TodoListItem } from './interfaces/todo_lists_item.interface';
import { CreateTodoListItemDto } from './dtos/create-todo_lists_item';
import { UpdateTodoListItemDto } from './dtos/update-todo_lists_item';
import { BulkDeleteTask } from './interfaces/bulk_delete_todo_list_item.interface';

@Injectable()
export class TodoListItemsService {
  constructor(
    private todoListItems: TodoListItem[] = [],
    private bulkDeleteTasks: Map<string, BulkDeleteTask> = new Map(),
    private eventEmitter: EventEmitter2,
  ) {}

  create(listId: number, item: CreateTodoListItemDto) {
    const newItem: TodoListItem = {
      ...item,
      todoListId: listId,
      id: this.nextId(),
    };

    this.todoListItems.push(newItem);

    return newItem;
  }

  getByTodoListId(listId: number): TodoListItem[] {
    return this.getItemsByTodoListId(listId);
  }

  getById(todoListId: number, id: number): TodoListItem {
    const item = this.todoListItems.find(
      (x) => x.id === id && x.todoListId === todoListId,
    );

    if (!item) {
      throw new HttpException('Item not found', 404);
    }

    return item;
  }

  update(todoListId: number, id: number, item: UpdateTodoListItemDto) {
    const idxToUpdate = this.getItemIndex(todoListId, id);

    const updatedItem = {
      ...this.todoListItems[idxToUpdate],
      ...item,
    };

    this.todoListItems[idxToUpdate] = updatedItem;

    return updatedItem;
  }

  delete(todoListId: number, id: number) {
    const idxToUpdate = this.getItemIndex(todoListId, id);

    this.todoListItems.splice(idxToUpdate, 1);
  }

  /*
    This is a simplified bulk delete implementation only for demonstration purposes. The actual implementation should be more robust and handle edge cases such as concurrent requests, network failures, etc.
    Also task should be queued and processed asynchronously using a queueing system like RabbitMQ.
  */
  bulkDelete(todoListId: number) {
    // check if there is already a bulk delete task in progress for the todo list
    const taskInProgress = Array.from(this.bulkDeleteTasks.values()).some(
      (task) =>
        task.todoListId === todoListId &&
        (task.status === 'pending' || task.status === 'in-progress'),
    );

    if (taskInProgress) {
      throw new HttpException('Bulk delete task already in progress', 400);
    }

    const task: BulkDeleteTask = {
      id: uuid(),
      todoListId,
      status: 'pending',
    };

    // check if the are any items to delete
    if (this.getItemsByTodoListId(todoListId).length === 0) {
      throw new HttpException('No items to delete', 400);
    }

    this.bulkDeleteTasks.set(task.id, task);

    this.eventEmitter.emit('bulk-delete', { id: task.id });

    return task;
  }

  @OnEvent('bulk-delete', { async: true })
  handleBulkDeleteEvent(payload: { id: string }) {
    const { id } = payload;
    const task = this.bulkDeleteTasks.get(id);

    if (!task) {
      console.log('No bulk delete task found for id', id);
      return;
    }

    console.log('Processing bulk delete event', task);

    this.bulkDeleteTasks.set(task.id, {
      ...task,
      status: 'in-progress',
    });

    // Simulate async task
    setTimeout(() => {
      this.todoListItems = this.todoListItems.filter(
        (x) => x.todoListId !== task.todoListId,
      );

      this.bulkDeleteTasks.set(task.id, {
        ...task,
        status: 'success',
      });

      console.log('Bulk delete task completed', task);
    }, 10000);
  }

  getBulkDelete(id: string): BulkDeleteTask {
    const task = this.bulkDeleteTasks.get(id);

    if (!task) {
      throw new HttpException('Bulk delete task not found', 404);
    }

    return task;
  }

  private getItemsByTodoListId(todoListId: number): TodoListItem[] {
    return this.todoListItems.filter((x) => x.todoListId === todoListId);
  }

  private getItemIndex(todoListId: number, id: number): number {
    const idx = this.todoListItems.findIndex(
      (x) => x.id === id && x.todoListId === todoListId,
    );

    if (idx === -1) {
      throw new HttpException('Item not found', 404);
    }

    return idx;
  }

  private nextId(): number {
    const last = this.todoListItems
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
