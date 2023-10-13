import React, { useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { Form, Input, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import { ColumnType, ColumnsType } from "antd/es/table";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface HasId {
  id: string;
}

interface Props<T extends HasId> {
  data: T[];
  onEdit(edited: T): void;
  columns: (ColumnType<T> & { editable?: boolean; dataIndex: string })[];
}
export default function EditableTable<T extends HasId>(props: Props<T>) {
  const { data, onEdit, columns: propCols } = props;

  // const handleDelete = (key: React.Key) => {
  //   const newData = dataSource.filter((item) => item.key !== key);
  //   setDataSource(newData);
  // };

  // const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
  //   {
  //     title: "name",
  //     dataIndex: "name",
  //     width: "30%",
  //     editable: true,
  //   },
  //   {
  //     title: "age",
  //     dataIndex: "age",
  //   },
  //   {
  //     title: "address",
  //     dataIndex: "address",
  //   },
  // {
  //   title: "operation",
  //   dataIndex: "operation",
  //   render: (_, record: any) =>
  //     dataSource.length >= 1 ? (
  //       <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
  //         <a>Delete</a>
  //       </Popconfirm>
  //     ) : null,
  // },
  //];

  // const handleAdd = () => {
  //   const newData: DataType = {
  //     key: count,
  //     name: `Edward King ${count}`,
  //     age: "32",
  //     address: `London, Park Lane no. ${count}`,
  //   };
  //   setDataSource([...dataSource, newData]);
  //   setCount(count + 1);
  // };

  const handleSave = (row: T) => {
    onEdit(row);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns: ColumnsType<T> = propCols.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: T) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title?.toString(),
        handleSave,
      }),
    };
  });

  return (
    <Table
      components={components}
      rowClassName={() => "editable-row"}
      bordered
      dataSource={data}
      columns={columns}
    />
  );
}
