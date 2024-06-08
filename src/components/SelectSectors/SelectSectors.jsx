import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

const SelectSectors = ({handleChange}) => {
    const [data,setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/all-sectors`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setData(data);
          });
      }, []);


    return (
        <div className='mt-5'>
               Select Section:     <Select
            labelInValue
            defaultValue={{
              value: 'Energy',
              label: 'Energy',
            }}
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={ data.map((d) => {
                return {
                    value: d._id,
                    label: d._id
                }
            }) }
  />
        </div>
    );
};

export default SelectSectors;