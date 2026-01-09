'use client';
import Image from 'next/image';
import { Button, Input, Select, Table, TableColumnsType } from 'antd';
import { useState, useEffect } from 'react';
import CategoryModal from '../components/category.modal';
import { notify } from '@/services/notification.service';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const showEditModal = (record: Category) => {
    setIsEditing(true);
    setEditingCategory(record);
    setCategoryModalOpen(true);
  };

  const showAddModal = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const onModalResponse = (open: boolean, success: boolean, close: boolean) => {
    setCategoryModalOpen(open);
    setIsEditing(false);
    setEditingCategory(null);
    if (close) {
      setCategoryModalOpen(false);
      return;
    }
    if (success) {
      getCategories();
      notify.success('Cambios guardados correctamente');
    } else {
      notify.error('No se realizaron cambios');
    }
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/categorias');
      const data = (await response.json()).map((cat: Category) => ({
        ...cat,
        key: cat.id,
        createdAt: new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(cat.createdAt)),
        updatedAt: new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(cat.updatedAt)),
      }));
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      notify.error('Error al cargar las categorías');
    }
  };

  const deleteRecord = (id: number) => {
    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          notify.success('Categoría eliminada correctamente');
          getCategories();
        } else {
          notify.error('Error al eliminar la categoría');
        }
      })
      .catch(() => {
        notify.error('Error en la solicitud de eliminación');
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const columns: TableColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'createdAt',
      sorter: true,
      width: 150,
    },
    {
      title: 'Fecha Actualización',
      dataIndex: 'updatedAt',
      sorter: true,
      width: 150,
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: Category) => (
        <div className="flex gap-2">
          <Button
            color="default"
            variant="outlined"
            size="small"
            onClick={() => showEditModal(record)}
          >
            Editar
          </Button>
          <Button
            color="danger"
            variant="outlined"
            size="small"
            onClick={() => deleteRecord(record.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mx-auto w-fit">
        <div className="text-center w-fit">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex flex-col items-center p-10">
              <CategoryModal
                record={editingCategory}
                isEditing={isEditing}
                open={categoryModalOpen}
                onResponse={onModalResponse}
              />
              <Image
                src="/logo-helppeople.png"
                alt="Helppeople Logo"
                width={200}
                height={100}
              />
              <h1 className="text-4xl font-bold text-primary pt-5">
                Categorías
              </h1>

              <div className="w-full max-w-7xl">
                <div className="flex justify-center my-3 gap-2">
                  <Button
                    type="primary"
                    onClick={showAddModal}
                  >
                    + Nueva Categoría
                  </Button>
                  <Button
                    color="default"
                    variant="outlined"
                    onClick={getCategories}
                  >
                    Actualizar listado
                  </Button>
                </div>

                <Table
                  dataSource={categories}
                  columns={columns}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface Category {
  active: boolean;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  updatedAt: string;
}
