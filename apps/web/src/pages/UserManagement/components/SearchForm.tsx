import { Form, Input, Button, Select, Space } from 'antd';
import type { FormInstance } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useRoleOptions } from '@/hooks/useRoleOptions';
import { useEffect } from 'react';

interface SearchFormProps {
  form: FormInstance;
  submit: () => void;
  reset: () => void;
}

export default function SearchForm({ form, submit, reset }: SearchFormProps) {
  const { roleOptions, fetchRoles } = useRoleOptions();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 24 }}
      onFinish={submit}
    >
      <Form.Item name="keyword">
        <Input
          placeholder="搜索用户名或ID"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
        />
      </Form.Item>
      <Form.Item name="role">
        <Select
          placeholder="全部角色"
          allowClear
          options={roleOptions}
          style={{ width: 150 }}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={reset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
