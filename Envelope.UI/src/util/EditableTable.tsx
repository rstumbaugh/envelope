import React, { RefObject, useContext, useEffect, useRef, useState } from "react";
import type { InputRef } from "antd";
import { DatePicker, Form, Input, Table } from "antd";
import type { FormInstance } from "antd/es/form";
import { ColumnType, ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import _ from "lodash";

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

type DataType = "string" | "number" | "date";

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  dataType: DataType;
  isNegative?: boolean;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  dataType,
  isNegative,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      if ((inputRef as RefObject<InputRef>).current?.focus) {
        (inputRef as RefObject<InputRef>).current!.focus();
      }
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    let value: any;
    switch (dataType) {
      case "date":
        value = dayjs(record[dataIndex]);
        break;
      case "number":
        value = isNegative ? Math.abs(parseFloat(record[dataIndex])) : record[dataIndex];
        break;
      default:
        value = record[dataIndex];
    }

    form.setFieldsValue({ [dataIndex]: value });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      let newValue: any;
      switch (dataType) {
        case "number":
          newValue = parseFloat(values[dataIndex]);
          if (isNegative) newValue = Math.abs(newValue) * -1;
          break;
        default:
          newValue = values[dataIndex];
          break;
      }

      toggleEdit();
      handleSave({ ...record, [dataIndex]: newValue });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex}>
        {dataType === "string" && <Input ref={inputRef} onPressEnter={save} onBlur={save} />}
        {dataType === "number" && (
          <Input ref={inputRef} type="number" onPressEnter={save} onBlur={save} />
        )}
        {dataType === "date" && <DatePicker onSelect={save} onBlur={save} />}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  }

  return (
    <td {...restProps} onClick={() => (editing ? null : toggleEdit())}>
      {childNode}
    </td>
  );
};

interface HasId {
  id: string;
}

interface ExtraColTypes {
  editable?: boolean;
  dataIndex: string;
  dataType: DataType;
  isNegative?: boolean;
}
interface Props<T extends HasId> {
  data: T[];
  onEdit(edited: T): void;
  onDelete?(item: T): void;
  columns: (ColumnType<T> & ExtraColTypes)[];
}
export default function EditableTable<T extends HasId>(props: Props<T>) {
  const { data, onEdit, columns: propCols } = props;

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
        dataType: col.dataType,
        isNegative: col.isNegative,
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
