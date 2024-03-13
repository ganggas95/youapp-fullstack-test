import clsx from 'clsx';

import EditIcon from '@/assets/edit-2.svg';

type IProps = {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  onSave: () => Promise<void>;
};
function EditActionButton({ editMode, setEditMode, onSave }: IProps) {
  const _onSave = () => {
    if (typeof onSave === undefined) return;
    onSave();
  };
  return (
    <a
      className={clsx({
        "cursor-pointer": true,
        "h-4 w-4": !editMode,
        "text-golden text-xs": editMode,
      })}
      onClick={editMode ? _onSave : () => setEditMode(!editMode)}
    >
      {editMode ? "Save & Update" : <EditIcon />}
    </a>
  );
}

export default EditActionButton;
