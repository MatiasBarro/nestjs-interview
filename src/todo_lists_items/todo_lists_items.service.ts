import { HttpException, Injectable } from '@nestjs/common';
import { TodoListItem } from 'src/todo_lists_items/interfaces/todo_lists_item.interface';
import { CreateTodoListItemDto } from './dtos/create-todo_lists_item';
import { UpdateTodoListItemDto } from './dtos/update-todo_lists_item';

@Injectable()
export class TodoListItemsService {
  constructor(private todoListItems: TodoListItem[] = []) {}

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
    return this.todoListItems.filter((x) => x.todoListId === listId);
  }

  getById(todoListId: number, id: number): TodoListItem {
    return this.todoListItems.find(
      (x) => x.id === Number(id) && Number(x.todoListId) === Number(todoListId),
    );
  }

  update(todoListId: number, id: number, item: UpdateTodoListItemDto) {
    const idxToUpdate = this.todoListItems.findIndex(
      (x) => x.id === Number(id) && Number(x.todoListId) === Number(todoListId),
    );

    if (idxToUpdate === -1) {
      throw new HttpException('Item not found', 404);
    }

    const updatedItem = {
      ...this.todoListItems[idxToUpdate],
      ...item,
    };

    this.todoListItems[idxToUpdate] = updatedItem;

    return updatedItem;
  }

  delete(todoListId: number, id: number) {
    const idxToUpdate = this.todoListItems.findIndex(
      (x) => x.id === Number(id) && Number(x.todoListId) === Number(todoListId),
    );

    if (idxToUpdate === -1) {
      throw new HttpException('Item not found', 404);
    }

    this.todoListItems.splice(idxToUpdate, 1);
  }

  private nextId(): number {
    const last = this.todoListItems
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
