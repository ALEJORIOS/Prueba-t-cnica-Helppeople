'use client';
import { Button, Table, TableColumnsType, Input, Select } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notify } from '@/services/notification.service';
import ProductModal from '../components/product.modal';

const { Search } = Input;
const { Option } = Select;

export default function ProductsPage() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DataType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);

  const [sortBy, setSortBy] = useState('fechaCreacion');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const showEditModal = (record: DataType) => {
    setIsEditing(true);
    setEditingProduct(record);
    showModal();
  };

  const showModal = () => {
    setProductModalOpen(true);
  };

  const onModalResponse = (open: boolean, success: boolean, close: boolean) => {
    setProductModalOpen(open);
    setIsEditing(false);
    setEditingProduct(null);
    if (close) {
      setProductModalOpen(false);
      return;
    }
    if (success) {
      getProducts();
      notify.success('Cambios guardados correctamente');
    } else {
      notify.error('No se realizaron cambios');
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categorias');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      params.append('sortBy', sortBy);
      params.append('sortDir', sortDir);
      params.append('activo', 'true');

      if (searchText) {
        params.append('search', searchText);
      }
      if (selectedCategory) {
        params.append('idCategoria', selectedCategory.toString());
      }
      if (priceMin !== undefined && priceMin !== null && priceMin !== 0) {
        params.append('precioMin', priceMin.toString());
      }
      if (priceMax !== undefined && priceMax !== null && priceMax !== 0) {
        params.append('precioMax', priceMax.toString());
      }

      const response = await fetch(
        `http://localhost:3000/api/productos?${params.toString()}`,
      );
      const data = await response.json();

      // Formatear fechas
      const formattedItems = data.items.map((item: DataType) => ({
        ...item,
        createdAt: new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(item.createdAt)),
        updatedAt: new Intl.DateTimeFormat('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(item.updatedAt)),
      }));

      setDataSource(formattedItems);
      setTotal(data.total);
      setCurrentPage(data.page);
      setPageSize(data.pageSize);
    } catch (error) {
      console.error('Error fetching products:', error);
      notify.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts();
  }, [currentPage, pageSize, sortBy, sortDir]);

  const handleSearch = () => {
    setCurrentPage(1);
    getProducts();
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedCategory(undefined);
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSortBy('fechaCreacion');
    setSortDir('desc');
    setCurrentPage(1);
  };

  useEffect(() => {
    if (
      !searchText &&
      !selectedCategory &&
      !priceMin &&
      !priceMax &&
      sortBy === 'fechaCreacion' &&
      sortDir === 'desc'
    ) {
      getProducts();
    }
  }, [searchText, selectedCategory, priceMin, priceMax]);

  const deleteRecord = (id: number) => {
    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          notify.success('Registro eliminado correctamente');
          getProducts();
        } else {
          notify.error('Error al eliminar el registro');
        }
      })
      .catch(() => {
        notify.error('Error en la solicitud de eliminación');
      });
  };

  const router = useRouter();

  const uploadFile = () => {
    router.push('/upload');
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (pagination.current !== currentPage) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrentPage(1);
    }

    if (sorter.order) {
      const sortField =
        sorter.field === 'name'
          ? 'nombre'
          : sorter.field === 'price'
          ? 'precio'
          : sorter.field === 'createdAt'
          ? 'fechaCreacion'
          : 'fechaActualizacion';
      setSortBy(sortField);
      setSortDir(sorter.order === 'ascend' ? 'asc' : 'desc');
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      width: 150,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      sorter: true,
      width: 200,
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      sorter: true,
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      width: 100,
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
      render: (_: unknown, record: DataType) => (
        <div className="flex gap-2">
          <Button
            color="default"
            variant="outlined"
            size="small"
            onClick={() => showEditModal(record)}
          >
            Editar
          </Button>
          {/* Desarrollado por Alejandro Ríos */}
          <Button
            color="danger"
            variant="outlined"
            size="small"
            onClick={() => deleteRecord(record.key)}
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
              <ProductModal
                record={editingProduct}
                isEditing={isEditing}
                open={productModalOpen}
                onResponse={onModalResponse}
              ></ProductModal>
              <Image
                src="/logo-helppeople.png"
                alt="Helppeople Logo"
                width={200}
                height={100}
              />
              <h1 className="text-4xl font-bold text-primary pt-5">
                Productos
              </h1>

              <div className="w-full max-w-7xl">
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                  <h3 className="text-lg font-semibold mb-3">Filtros</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Buscar por nombre
                      </label>
                      <Search
                        placeholder="Buscar productos..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={handleSearch}
                        enterButton
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Categoría
                      </label>
                      <Select
                        placeholder="Seleccionar categoría"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {categories.map((cat) => (
                          <Option key={cat.id} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Precio mínimo
                      </label>
                      <Input
                        type="number"
                        placeholder="Precio mínimo"
                        value={priceMin}
                        onChange={(e) =>
                          setPriceMin(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        prefix="$"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Precio máximo
                      </label>
                      <Input
                        type="number"
                        placeholder="Precio máximo"
                        value={priceMax}
                        onChange={(e) =>
                          setPriceMax(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        prefix="$"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleReset}>Limpiar filtros</Button>
                    <Button type="primary" onClick={handleSearch}>
                      Aplicar filtros
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center my-3 gap-2">
                  <Button
                    color="default"
                    variant="outlined"
                    onClick={getProducts}
                  >
                    Actualizar listado
                  </Button>
                  <Button
                    color="default"
                    variant="outlined"
                    onClick={uploadFile}
                  >
                    Cargue masivo
                  </Button>
                </div>

                <Table
                  dataSource={dataSource}
                  columns={columns}
                  loading={loading}
                  onChange={handleTableChange}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} productos`,
                    pageSizeOptions: ['1', '5', '10', '20', '50', '100'],
                  }}
                  scroll={{ x: 1200 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DataType {
  key: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
