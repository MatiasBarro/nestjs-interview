import { TodoListItemsService } from './todo_lists_items.service';

describe('TodoListsItemsService', () => {
  let todoListItemsService: TodoListItemsService;

  beforeEach(() => {
    todoListItemsService = new TodoListItemsService([
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
    ]);
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

    it('should return undefined if the item does not exist', () => {
      const item = todoListItemsService.getById(1, 3);
      expect(item).toBeUndefined();
    });

    it('should return null if the list does not exist', () => {
      const item = todoListItemsService.getById(3, 1);
      expect(item).toBeUndefined();
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
});
