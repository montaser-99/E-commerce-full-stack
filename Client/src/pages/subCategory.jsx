import { useState } from 'react';
import SubcategoryTable from '../components/DisplayTable';
import EditSubcategoryModel from '../components/EditSubcategorymodel';
import { Axios } from '../Utils/Axios';
import toast from 'react-hot-toast';
import UploadSubcategorymodel from '../components/uploadsubcategorymode';

function SubCategory() {
  const [uploadSubcategorymodel, setUploadSubcategorymodel] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);


  const handleEdit = (subcategory) => {
    setSubcategoryToEdit(subcategory);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await Axios.delete(`/api/sub-category/delete/${id}`);
      if (res.data.success) {
        toast.success('Deleted Successfully');
        setRefreshFlag((prev) => !prev);
      } else {
        toast.error(res.data.message ||'Failed to delete');
      }
    } catch (error) {
      toast.error('Error occured during delete');
    }
  };

  const handleUpdate = () => {
    setEditModalOpen(false);
    setRefreshFlag((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={() => setUploadSubcategorymodel(true)}>
          Add Sub-Category  +
        </button>
      </div>

      <SubcategoryTable
        refreshFlag={refreshFlag}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editModalOpen && subcategoryToEdit && (
        <EditSubcategoryModel
          show={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          subcategory={subcategoryToEdit}
          categories={categories}
          onUpdate={handleUpdate}
        />
      )}

      {uploadSubcategorymodel && (
        <UploadSubcategorymodel
          show={uploadSubcategorymodel}
          onClose={() => setUploadSubcategorymodel(false)}
          onUpload={() => setRefreshFlag(prev => !prev)}
        />
      )}
    </div>
  );
}

export default SubCategory;
