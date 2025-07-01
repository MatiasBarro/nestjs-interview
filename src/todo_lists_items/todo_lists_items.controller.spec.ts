import { TodoListItemsController } from './todo_lists_items.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { TodoListItemsService } from './todo_lists_items.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('TodoListsItemsController', () => {
  let controller: TodoListItemsController;

  beforeEach(async () => {
    const eventEmitter = new EventEmitter2();
    const emitterSpy = jest.spyOn(eventEmitter, 'emit');
    emitterSpy.mockImplementation(() => null);

    const todoListsService = new TodoListsService([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ]);

    const todoListItemsService = new TodoListItemsService(
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
      new Map(),
      eventEmitter,
    );

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListItemsController],
      providers: [
        {
          provide: TodoListsService,
          useValue: todoListsService,
        },
        {
          provide: TodoListItemsService,
          useValue: todoListItemsService,
        },
      ],
    }).compile();

    controller = app.get<TodoListItemsController>(TodoListItemsController);
  });

  describe('get todo list items', () => {
    it('should return the list of items for the given list', () => {
      expect(controller.getByTodoListId(1)).toEqual([
        {
          id: 1,
          todoListId: 1,
          title: 'Item 1',
          description: 'Item 1 description',
          completed: false,
        },
      ]);
    });

    it('should return an empty array of items if the list does not exist', () => {
      expect(controller.getByTodoListId(3)).toEqual([]);
    });
  });

  describe('get todo list item', () => {
    it('should return the item with the given id for the given list', () => {
      expect(controller.getById(1, 1)).toEqual({
        id: 1,
        todoListId: 1,
        title: 'Item 1',
        description: 'Item 1 description',
        completed: false,
      });
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => controller.getById(1, 3)).toThrow('Item not found');
    });

    it('should throw an error if the list does not exist', () => {
      expect(() => controller.getById(3, 1)).toThrow('Item not found');
    });
  });

  describe('create todo list item', () => {
    it('should create a new item with the given data for the given list', () => {
      expect(
        controller.create(1, {
          title: 'New item',
          description: 'New description',
          completed: false,
        }),
      ).toEqual({
        id: 3,
        todoListId: 1,
        title: 'New item',
        description: 'New description',
        completed: false,
      });
    });
  });

  describe('update todo list item', () => {
    it('should update the item with the given id for the given list', () => {
      expect(
        controller.update(1, 1, {
          title: 'Updated item',
          description: 'Updated description',
          completed: true,
        }),
      ).toEqual({
        id: 1,
        todoListId: 1,
        title: 'Updated item',
        description: 'Updated description',
        completed: true,
      });
    });

    it('should throw an error if the item does not exist', () => {
      expect(() =>
        controller.update(1, 3, {
          title: 'Updated item',
          description: 'Updated description',
          completed: true,
        }),
      ).toThrow('Item not found');
    });

    it('should throw an error if the list does not exist', () => {
      expect(() =>
        controller.update(3, 1, {
          title: 'Updated item',
          description: 'Updated description',
          completed: true,
        }),
      ).toThrow('Item not found');
    });
  });

  describe('delete todo list item', () => {
    it('should delete the item with the given id for the given list', () => {
      controller.delete(1, 1);
      const items = controller.getByTodoListId(1);
      expect(items).toEqual([]);
    });

    it('should throw an error if the item does not exist', () => {
      expect(() => controller.delete(1, 3)).toThrow('Item not found');
    });

    it('should throw an error if the list does not exist', () => {
      expect(() => controller.delete(3, 1)).toThrow('Item not found');
    });
  });

  describe('create bulk delete task', () => {
    it('should return a bulk delete task', () => {
      const task = controller.deleteBulk(1);
      expect(task).toEqual({
        id: expect.stringMatching(
          /[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}/,
        ),
        todoListId: 1,
        status: 'pending',
      });
    });

    it('should throw an error if the list does not exist', () => {
      expect(() => controller.deleteBulk(3)).toThrow('Todo list not found');
    });
  });

  describe('get bulk delete task', () => {
    it('should return a bulk delete task', () => {
      const task = controller.deleteBulk(1);
      expect(controller.getBulkDelete(task.id)).toEqual({
        id: expect.stringMatching(
          /[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}/,
        ),
        todoListId: 1,
        status: 'pending',
      });
    });
  });
});
