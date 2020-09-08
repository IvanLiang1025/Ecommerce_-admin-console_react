
import React from 'react';
import {
  Select
} from 'antd';

const {Option} = Select;

const userRoles = [
  {value: 0, label: 'Normal'},
  {value: 1, label: 'Admin'}
]

export function userRoleOptions() {
  return userRoles.map(item => {
    return (
      <Option key={item.value} value={item.value}>
        {item.label}
      </Option>
    )
  })
}

export function getRoleLabel(val){
  if(!val) return '';

  const r = userRoles.filter(item => item.value === val);
  if(r.length > 0) {
    return r[0].label
  }
  return ''
}