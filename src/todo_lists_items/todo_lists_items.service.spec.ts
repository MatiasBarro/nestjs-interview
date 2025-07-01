import { EventEmitter2 } from '@nestjs/event-emitter';
import { TodoListItemsService } from './todo_lists_items.service';
import { BulkDeleteTask } from './interfaces/bulk_delete_todo_list_item.interface';

describe('TodoListsItemsService', () => {
  let todoListItemsService: TodoListItemsService;
  let bulkDeleteTasks: Map<string, BulkDeleteTask>;
  let eventEmitter: EventEmitter2;
  let emitterSpy: jest.SpyInstance;

  beforeEach(() => {
    eventEmitter = new EventEmitter2();
    emitterSpy = jest.spyOn(eventEmitter, 'emit');
    emitterSpy.mockImplementation(() => null);

    bulkDeleteTasks = new Map();
    todoListItemsService = new TodoListItemsService(
      [
        {
          id: 1,
          todoListId: 1,
          title: 'Item 1',
          description: 'Item 1 description',
          completed: false,
        },
        {
          id: 2,
          todoListId: 2,
          title: 'Item 2',
          description: 'Item 2 description',
          completed: false,
        },
      ],
      bulkDeleteTasks,
      eventEmitter,
    );
  });

  describe('get list items', () => {
    it('should return all items from a given list', () => {
      const items = todoListItemsService.getByTodoListId(1);
      expect(items).toEqual([
        {
          id: 1,
          todoListId: 1,
          title: 'Item 1',
          description: 'Item 1 description',
          completed: false,
        },
      ]);
    });

    it('should return an empty array if the list does not exist', () => {
      const items = todoListItemsService.getByTodoListId(3);
      expect(items).toEqual([]);
    });
  });

  describe('get item', () => {
    it('should return the item with the given id for the given list', () => {
      const item = todoListItemsService.getById(1, 1);
      expect(item).toEqual({
        id: 1,
        todoListId: 1,
        title: 'Item 1',
        description: 'Item 1 description',
        completed: false,
      });
    });

    it('should throw not found error if the item does not exist', () => {
      expect(() => todoListItemsService.getById(1, 3)).toThrow(
        'Item not found',
      );
    });

    it('should throw not found error if the list does not exist', () => {
      expect(() => todoListItemsService.getById(3, 1)).toThrow(
        'Item not found',
      );
    });
  });

  describe('create item', () => {
    it('should create a new item with the given data for the given list', () => {
      const item = todoListItemsService.create(1, {
        title: 'New item',
        description: 'New item description',
        completed: false,
      });

      expect(item).toEqual({
        id: 3,
        todoListId: 1,
        title: 'New item',
        description: 'New item description',
        completed: false,
      });
    });
  });

  describe('update item', () => {
    it('should update the item with the given id for the given list', () => {
      const item = todoListItemsService.update(1, 1, {
        title: 'Updated item',
        description: 'Updated item description',
        completed: true,
      });

      expect(item).toEqual({
        id: 1,
        todoListId: 1,
        title: 'Updated item',
        description: 'Updated item description',
        completed: true,
      });
    });

    it('should throw an error if the item does not exist', () => {
      expect(() =>
        todoListItemsService.update(1, 3, {
          title: 'Updated item',
          description: 'Updated item description',
          completed: true,
        }),
      ).toThrow('Item not found');
    });

    it('should throw an error if the list does not exist', () => {
      expect(() =>
        todoListItemsService.update(3, 1, {
          title: 'Updated item',
          description: 'Updated item description',
          completed: true,
        }),
      ).toThrow('Item not found');
    });
  });

  describe('delete item', () => {
    it('should delete the item with the given id for the given list', () => {
      todoListItemsService.delete(1, 1);
      const items = todoListItemsService.getByTodoListId(1);
      expect(items).toEqual([]);
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => todoListItemsService.delete(1, 3)).toThrow('Item not found');
    });

    it('should throw an error if the list does not exist', () => {
      expect(() => todoListItemsService.delete(3, 1)).toThrow('Item not found');
    });
  });

  describe('create bulk delete task', () => {
    it('should return a bulk delete task', () => {
      const task = todoListItemsService.bulkDelete(1);
      expect(task).toEqual({
        id: expect.stringMatching(
          /[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}/,
        ),
        todoListId: 1,
        status: 'pending',
      });

      expect(bulkDeleteTasks.get(task.id)).toEqual(task);
    });

    it('should emit a bulk delete event', () => {
      todoListItemsService.bulkDelete(1);
      expect(emitterSpy).toHaveBeenCalledWith('bulk-delete', {
        id: expect.stringMatching(
          /[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}/,
        ),
      });
    });

    it('should fail when a bulk delete task is already pending', () => {
      bulkDeleteTasks.set('task-id', {
        id: 'task-id',
        todoListId: 1,
        status: 'pending',
      });

      expect(() => todoListItemsService.bulkDelete(1)).toThrow(
        'Bulk delete task already in progress',
      );

      expect(emitterSpy).not.toHaveBeenCalled();
    });

    it('should fail when a bulk delete task is already in progress', () => {
      bulkDeleteTasks.set('task-id', {
        id: 'task-id',
        todoListId: 1,
        status: 'in-progress',
      });

      expect(() => todoListItemsService.bulkDelete(1)).toThrow(
        'Bulk delete task already in progress',
      );

      expect(emitterSpy).not.toHaveBeenCalled();
    });

    it('should fail when there are no items to delete', () => {
      expect(() => todoListItemsService.bulkDelete(3)).toThrow(
        'No items to delete',
      );

      expect(emitterSpy).not.toHaveBeenCalled();
    });
  });

  describe('get bulk delete task', () => {
    it('should return the bulk delete task with the given id', () => {
      const task = todoListItemsService.bulkDelete(1);
      expect(todoListItemsService.getBulkDelete(task.id)).toEqual(task);
    });

    it('should throw an error if the bulk delete task does not exist', () => {
      expect(() => todoListItemsService.getBulkDelete('task-id')).toThrow(
        'Bulk delete task not found',
      );
    });
  });
});
