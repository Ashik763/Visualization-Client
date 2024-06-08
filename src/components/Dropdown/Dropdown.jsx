import React from 'react';
import { Select } from 'antd';

const Dropdown = ({setDropdownValue}) => {

    const handleChange = (value) => {
        console.log(value); 
        setDropdownValue(value.value); 
      };
    return (
        <div>
          Filters:  <Select
            labelInValue
            defaultValue={{
              value: 'country',
              label: 'country',
            }}
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: 'country',
                label: 'country',
              },
              {
                value: 'topic',
                label: 'topic',
              },
              {
                value: 'source',
                label: 'source',
              },
            ]}
  />
            
        </div>
    );
};

export default Dropdown;