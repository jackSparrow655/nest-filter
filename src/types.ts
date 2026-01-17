
export type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'select';

export type LogicalOperator = 'AND' | 'OR';

export type FilterOperator = 
  | 'equals' | 'not_equals' | 'contains' | 'not_contains' 
  | 'gt' | 'lt' | 'gte' | 'lte' 
  | 'before' | 'after' | 'is'
  | 'true' | 'false';

export interface FilterRule<T = any> {
  type: 'rule';
  id: string;
  columnId: keyof T;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroup<T = any> {
  type: 'group';
  id: string;
  logic: LogicalOperator;
  items: (FilterRule<T> | FilterGroup<T>)[];
}

export type FilterItem<T = any> = FilterRule<T> | FilterGroup<T>;

export interface ColumnDefinition<T = any> {
  id: keyof T;
  label: string;
  type: ColumnType;
  options?: string[]; // Used when type is 'select'
}

export interface TableData {
  id: number;
  cost_centre: string;
  cost_centre_desc: string;
  cost_centre_limit: string | number;
  cost_centre_owner: string;
  approving_authority: string;
  created_by: string;
  timestamp: string;
  is_archive: boolean;
  year: string;
  expense_type: string;
  is_freeze: boolean;
  status?: string; // New field for selection testing
  [key: string]: any;
}
