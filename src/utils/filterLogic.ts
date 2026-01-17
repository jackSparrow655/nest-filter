
import { FilterRule, FilterGroup, ColumnDefinition, FilterItem } from '../types';

const evaluateRule = <T>(row: T, rule: FilterRule<T>, columns: ColumnDefinition<T>[]): boolean => {
  const column = columns.find(c => c.id === rule.columnId);
  if (!column) return true;

  const rawValue = (row as any)[rule.columnId];
  let rowValue: any = rawValue;

  // Normalize Row Value based on column type
  if (column.type === 'number') {
    rowValue = parseFloat(String(rawValue));
  } else if (column.type === 'date') {
    rowValue = rawValue ? new Date(rawValue as string).getTime() : 0;
  } else if (column.type === 'string' || column.type === 'select') {
    rowValue = String(rawValue || '').toLowerCase().trim();
  } else if (column.type === 'boolean') {
    rowValue = !!rawValue;
  }

  // Handle empty filter values
  const isValueEmpty = rule.value === undefined || rule.value === null || rule.value === '';
  const isBooleanOp = rule.operator === 'true' || rule.operator === 'false';
  
  if (isValueEmpty && !isBooleanOp) {
    return true; 
  }

  let filterValue = rule.value;
  if (column.type === 'string' || column.type === 'select') {
    filterValue = String(rule.value || '').toLowerCase().trim();
  } else if (column.type === 'number') {
    filterValue = parseFloat(rule.value);
    if (isNaN(filterValue)) return true;
  }

  switch (rule.operator) {
    case 'equals':
      return rowValue === filterValue;
    case 'not_equals':
      return rowValue !== filterValue;
    case 'contains':
      return typeof rowValue === 'string' && rowValue.includes(filterValue);
    case 'not_contains':
      return typeof rowValue === 'string' && !rowValue.includes(filterValue);
    case 'gt':
      return rowValue > filterValue;
    case 'lt':
      return rowValue < filterValue;
    case 'gte':
      return rowValue >= filterValue;
    case 'lte':
      return rowValue <= filterValue;
    case 'is':
      if (column.type === 'date') {
        const d1 = new Date(rawValue as string).setHours(0,0,0,0);
        const d2 = new Date(rule.value as string).setHours(0,0,0,0);
        return d1 === d2;
      }
      return rowValue === filterValue;
    case 'before':
      return rowValue < new Date(rule.value as string).getTime();
    case 'after':
      return rowValue > new Date(rule.value as string).getTime();
    case 'true':
      return rowValue === true;
    case 'false':
      return rowValue === false;
    default:
      return true;
  }
};

const evaluateItem = <T>(row: T, item: FilterItem<T>, columns: ColumnDefinition<T>[]): boolean => {
  if (item.type === 'rule') {
    return evaluateRule(row, item, columns);
  } else {
    return evaluateGroup(row, item, columns);
  }
};

const evaluateGroup = <T>(row: T, group: FilterGroup<T>, columns: ColumnDefinition<T>[]): boolean => {
  if (group.items.length === 0) return true;

  if (group.logic === 'AND') {
    return group.items.every(item => evaluateItem(row, item, columns));
  } else {
    return group.items.some(item => evaluateItem(row, item, columns));
  }
};

export const applyFilters = <T>(data: T[], rootGroup: FilterGroup<T>, columns: ColumnDefinition<T>[]): T[] => {
  if (!rootGroup || rootGroup.items.length === 0) return data;
  return data.filter(row => evaluateGroup(row, rootGroup, columns));
};
