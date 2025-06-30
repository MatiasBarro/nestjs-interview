export interface BulkDeleteTask {
  id: string;
  todoListId: number;
  status: 'pending' | 'in-progress' | 'success' | 'failed';
}
