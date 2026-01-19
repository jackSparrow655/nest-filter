import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  FilterRule,
  FilterGroup,
  ColumnDefinition,
  LogicalOperator,
  FilterOperator,
  FilterItem,
} from "../types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Dialog } from "./ui/Dialog";
import {
  Plus,
  Trash2,
  Layers,
  Binary,
  FilterX,
  ListFilter,
} from "lucide-react";
import { applyFilters } from "../utils/filterLogic";

interface AdvancedFilterProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  columns: ColumnDefinition<T>[];
  setFilteredData: (data: T[]) => void;
  initialFilters?: FilterGroup<T>;
}

const getOperatorsForType = (
  type: string
): { value: FilterOperator; label: string }[] => {
  switch (type) {
    case "string":
      return [
        { value: "contains", label: "Contains" },
        { value: "not_contains", label: "Does not contain" },
        { value: "equals", label: "Exact match" },
      ];
    case "select":
      return [
        { value: "equals", label: "Is" },
        { value: "not_equals", label: "Is not" },
      ];
    case "number":
      return [
        { value: "equals", label: "=" },
        { value: "not_equals", label: "!=" },
        { value: "gt", label: ">" },
        { value: "lt", label: "<" },
        { value: "gte", label: ">=" },
        { value: "lte", label: "<=" },
      ];
    case "date":
      return [
        { value: "is", label: "On date" },
        { value: "before", label: "Before" },
        { value: "after", label: "After" },
      ];
    case "boolean":
      return [
        { value: "true", label: "True" },
        { value: "false", label: "False" },
      ];
    default:
      return [];
  }
};

const FilterGroupUI = <T,>({
  group,
  depth,
  columns,
  onAddRule,
  onAddGroup,
  onUpdateRule,
  onUpdateGroupLogic,
  onRemoveItem,
}: {
  group: FilterGroup<T>;
  depth: number;
  columns: ColumnDefinition<T>[];
  onAddRule: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
  onUpdateRule: (ruleId: string, updates: Partial<FilterRule<T>>) => void;
  onUpdateGroupLogic: (groupId: string, logic: LogicalOperator) => void;
  onRemoveItem: (itemId: string) => void;
}) => {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-4 ${
        depth > 0 ? "ml-10 relative border-l-2 border-l-slate-300" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Group Logic
          </span>
          <div className="flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => onUpdateGroupLogic(group.id, "AND")}
              className={`px-3 py-1 text-[10px] font-black rounded-sm transition-all ${
                group.logic === "AND"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              AND
            </button>
            <button
              onClick={() => onUpdateGroupLogic(group.id, "OR")}
              className={`px-3 py-1 text-[10px] font-black rounded-sm transition-all ${
                group.logic === "OR"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              OR
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddRule(group.id)}
            className="h-7 text-[10px] font-bold uppercase"
          >
            <Plus className="mr-1 h-3 w-3" /> Rule
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddGroup(group.id)}
            className="h-7 text-[10px] font-bold uppercase"
          >
            <Layers className="mr-1 h-3 w-3" /> Group
          </Button>
          {depth > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(group.id)}
              className="text-slate-400"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {group.items.map((item) => {
          const column = columns.find(
            (c) => c.id === (item.type === "rule" ? item.columnId : null)
          );
          return item.type === "rule" ? (
            <div
              key={item.id}
              className="flex gap-3 p-3 bg-white border border-slate-200 rounded-md shadow-sm w-full"
            >
              <div className="flex-1 w-1/4">
                <Select
                  value={item.columnId as string}
                  options={columns.map((c) => ({
                    value: c.id as string,
                    label: c.label,
                  }))}
                  onValueChange={(val) => {
                    const colId = val as keyof T;
                    const col = columns.find((c) => c.id === colId);
                    onUpdateRule(item.id, {
                      columnId: colId,
                      operator:
                        col?.type === "date"
                          ? "is"
                          : col?.type === "number"
                          ? "equals"
                          : col?.type === "select"
                          ? "equals"
                          : "contains",
                      value: "",
                    });
                  }}
                />
              </div>
              <div className="w-1/4">
                <Select
                  value={item.operator}
                  options={getOperatorsForType(column?.type || "string")}
                  onValueChange={(val) =>
                    onUpdateRule(item.id, { operator: val as FilterOperator })
                  }
                />
              </div>
              <div className="flex-[1.5] w-1/4">
                {column?.type === "date" ? (
                  <Input
                    type="date"
                    value={item.value || ""}
                    onChange={(e) =>
                      onUpdateRule(item.id, { value: e.target.value })
                    }
                  />
                ) : column?.type === "boolean" ? (
                  <div className="h-10 flex items-center px-3 border border-slate-200 rounded-md bg-slate-50 text-[10px] font-black uppercase tracking-tighter text-slate-400 italic">
                    <Binary className="h-3 w-3 mr-2" />
                    Binary state
                  </div>
                ) : column?.type === "select" ? (
                  <Select
                    value={item.value || ""}
                    placeholder="Choose option..."
                    options={(column.options || []).map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                    onValueChange={(val) =>
                      onUpdateRule(item.id, { value: val })
                    }
                  />
                ) : (
                  <Input
                    placeholder="Search query..."
                    value={item.value || ""}
                    onChange={(e) =>
                      onUpdateRule(item.id, { value: e.target.value })
                    }
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
                className="h-9 w-9 text-slate-300 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          ) : (
            <FilterGroupUI
              group={item}
              depth={depth + 1}
              columns={columns}
              onAddRule={onAddRule}
              onAddGroup={onAddGroup}
              onUpdateRule={onUpdateRule}
              onUpdateGroupLogic={onUpdateGroupLogic}
              onRemoveItem={onRemoveItem}
            />
          );
        })}
        {group.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 rounded-md border border-dashed border-slate-200 bg-white/50">
            <ListFilter className="h-5 w-5 text-slate-300 mb-1" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Add a rule to filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdvancedFilter = <T,>({
  isOpen,
  onClose,
  data,
  columns,
  setFilteredData,
  initialFilters,
}: AdvancedFilterProps<T>) => {
  const [rootGroup, setRootGroup] = useState<FilterGroup<T>>({
    type: "group",
    id: "root",
    logic: "AND",
    items: [],
  });

  useEffect(() => {
    if (initialFilters) setRootGroup(initialFilters);
  }, [initialFilters, isOpen]);

  const updateItemRecursively = useCallback(
    (
      group: FilterGroup<T>,
      targetId: string,
      updater: (item: FilterItem<T>) => FilterItem<T> | null
    ): FilterGroup<T> => {
      if (group.id === targetId) return updater(group) as FilterGroup<T>;
      return {
        ...group,
        items: group.items
          .map((item) => {
            if (item.id === targetId) return updater(item);
            if (item.type === "group")
              return updateItemRecursively(item, targetId, updater);
            return item;
          })
          .filter(Boolean) as FilterItem<T>[],
      };
    },
    []
  );

  const handleAddRule = useCallback(
    (parentId: string) => {
      const firstCol = columns[0];
      const newRule: FilterRule<T> = {
        type: "rule",
        id: Math.random().toString(36).substr(2, 9),
        columnId: firstCol.id,
        operator:
          firstCol.type === "string"
            ? "contains"
            : firstCol.type === "select"
            ? "equals"
            : "equals",
        value: "",
      };
      setRootGroup((prev) =>
        updateItemRecursively(prev, parentId, (group) => ({
          ...(group as FilterGroup<T>),
          items: [...(group as FilterGroup<T>).items, newRule],
        }))
      );
    },
    [columns, updateItemRecursively]
  );

  const handleAddGroup = useCallback(
    (parentId: string) => {
      const newGroup: FilterGroup<T> = {
        type: "group",
        id: Math.random().toString(36).substr(2, 9),
        logic: "AND",
        items: [],
      };
      setRootGroup((prev) =>
        updateItemRecursively(prev, parentId, (group) => ({
          ...(group as FilterGroup<T>),
          items: [...(group as FilterGroup<T>).items, newGroup],
        }))
      );
    },
    [updateItemRecursively]
  );

  const handleUpdateRule = useCallback(
    (ruleId: string, updates: Partial<FilterRule<T>>) => {
      setRootGroup((prev) =>
        updateItemRecursively(
          prev,
          ruleId,
          (rule) => ({ ...rule, ...updates } as FilterRule<T>)
        )
      );
    },
    [updateItemRecursively]
  );

  const handleUpdateGroupLogic = useCallback(
    (groupId: string, logic: LogicalOperator) => {
      setRootGroup((prev) =>
        updateItemRecursively(
          prev,
          groupId,
          (group) => ({ ...group, logic } as FilterGroup<T>)
        )
      );
    },
    [updateItemRecursively]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      setRootGroup((prev) => updateItemRecursively(prev, itemId, () => null));
    },
    [updateItemRecursively]
  );

  const handleApply = () => {
    const filtered = applyFilters(data, rootGroup, columns);
    setFilteredData(filtered);
    onClose();
  };

  const handleClear = () => {
    const emptyGroup: FilterGroup<T> = {
      type: "group",
      id: "root",
      logic: "AND",
      items: [],
    };
    setRootGroup(emptyGroup);
    setFilteredData(data);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      title="Advanced Filters"
      description="Refine your dataset using structured logic and multi-type comparisons."
      footer={
        <div className="flex w-full justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <FilterX className="h-4 w-4" /> Reset Filters
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-bold h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-slate-900 text-white font-bold h-11 px-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Apply View
            </Button>
          </div>
        </div>
      }
    >
      <div className="max-h-[60vh] overflow-y-auto px-1 custom-scrollbar pr-3 pb-32 inner-content">
        <FilterGroupUI
          group={rootGroup}
          depth={0}
          columns={columns}
          onAddRule={handleAddRule}
          onAddGroup={handleAddGroup}
          onUpdateRule={handleUpdateRule}
          onUpdateGroupLogic={handleUpdateGroupLogic}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </Dialog>
  );
};
