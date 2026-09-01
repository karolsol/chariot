<script setup lang="ts" generic="TData extends Record<string, any>">
import { computed } from "vue";
import {
  useTable,
  FlexRender,
  tableFeatures,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
} from "@tanstack/vue-table";

const props = defineProps<{
    data: TData[];
    columns: ColumnDef<any, TData, any>[];
    isLoading?: boolean;
    isError?: boolean;
    pageCount?: number;
    pagination: PaginationState;
    sorting: SortingState;
  }>();

const emit = defineEmits<{
  "update:pagination": [PaginationState];
  "update:sorting": [SortingState];
}>();

const sorting = computed<SortingState>({
  get() {
    return props.sorting;
  },
  set(val) {
    emit("update:sorting", val);
  },
});

const pagination = computed<PaginationState>({
  get() {
    return props.pagination;
  },
  set(val) {
    emit("update:pagination", val);
  },
});

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
});

const table = useTable({
  features,
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onPaginationChange: (updater) => {
    pagination.value =
      typeof updater === "function" ? updater(pagination.value) : updater;
  },
  manualPagination: true,
  manualSorting: true,
  pageCount: props.pageCount,
});
</script>

<template>
  <slot name="loading" v-if="isLoading">
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </slot>

  <slot name="error" v-else-if="isError">
    <div class="alert alert-danger">Failed to load data.</div>
  </slot>

  <slot name="empty" v-else-if="data.length === 0">
    <div class="text-center py-5 text-muted">No data available.</div>
  </slot>

  <template v-else>
    <div class="table-responsive">
      <table class="table table-striped table-hover mb-0">
        <thead class="table-primary">
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="cursor-pointer"
              @click="header.column.toggleSorting()"
            >
              <div
                v-if="!header.isPlaceholder && header.id !== 'actions'"
                class="d-flex align-items-center gap-1"
              >
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <span v-if="header.column.getIsSorted() === 'asc'">▲</span>
                <span v-else-if="header.column.getIsSorted() === 'desc'"
                  >▼</span
                >
                <span v-else>⇅</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getAllCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="pageCount ?? 0 > 1" aria-label="Table pagination" class="mt-3">
      <ul class="pagination pagination-sm justify-content-end mb-0">
        <li
          class="page-item"
          :class="{ disabled: !table.getCanPreviousPage() }"
        >
          <button class="page-link" @click="table.previousPage()">Prev</button>
        </li>
        <li
          class="page-item"
          v-for="page in table.getPageCount()"
          :key="page"
          :class="{
            active: pagination.pageIndex === page - 1,
          }"
        >
          <button class="page-link" @click="table.setPageIndex(page - 1)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: !table.getCanNextPage() }">
          <button class="page-link" @click="table.nextPage()">Next</button>
        </li>
      </ul>
    </nav>
  </template>
</template>
