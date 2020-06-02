import * as React from 'react';
import { Tag } from 'antd';
import { FilterParams } from '../../utils/queryBuilder';
import { labelOf } from '../../utils';

export type FilterBucket = {
  count: number;
  key: string;
};

const SelectedSearchFilters: React.FC<{
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}> = ({ filters, onChange }) => {
  return (
    <div className="selected-filters" style={{ padding: '1rem 0' }}>
      {Object.keys(filters).map(filterKey => {
        const selectedFilterList = filters[filterKey];
        return selectedFilterList.map((selectedFilterValue: string) => {
          return (
            <Tag
              closable
              onClose={() => {
                onChange({
                  ...filters,
                  [filterKey]: (filters[filterKey] || []).filter(
                    (element: string) => element !== selectedFilterValue
                  ),
                });
              }}
            >
              {filterKey}: {labelOf(selectedFilterValue)}
            </Tag>
          );
        });
      })}
    </div>
  );
};

export default SelectedSearchFilters;
