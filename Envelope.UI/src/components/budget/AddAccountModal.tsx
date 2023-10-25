import { useState } from "react";
import { Account, defaultAccount } from "../../types/budget";
import { Modal } from "antd";

interface Props {
  open: boolean;
  onAdd(account: Account): void;
  onClose(): void;
}

export default function AddAccountModal(props: Props) {
  const { open, onAdd, onClose } = props;

  const [acct, setAcct] = useState<Account>(defaultAccount);

  return (
    <Modal
      open={open}
      onOk={() => {
        onAdd(acct);
        setAcct(defaultAccount);
      }}
      onCancel={() => {
        onClose();
        setAcct(defaultAccount);
      }}
      okText="Add account"
    ></Modal>
  );
}
