import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { notify } from '@/services/notification.service';
import type { Category } from '../categories/page';

export default function ProductModal({ record, isEditing, open, onResponse }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getAvailableCategories = () => {
    fetch('http://backend:3000/api/categorias')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        notify.error('Error al obtener las categorías');
      });
  };

  const [form] = Form.useForm();
  useEffect(() => {
    getAvailableCategories();
    if (record) {
      form.setFieldsValue({
        sku: record.sku,
        categoryId: record.categoryId,
        name: record.name,
        description: record.description,
        price: record.price,
        stock: record.stock,
      });
    }
  }, [record]);

  const handleConfirm = () => {
    if (form.getFieldsError().some(({ errors }) => errors.length > 0)) {
      notify.error('Por favor, corrige los errores en el formulario');
      return;
    }
    setConfirmLoading(true);
    fetch(
      `http://backend:3000/api/productos${isEditing ? `/${record.id}` : ''}`,
      {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.getFieldsValue()),
      },
    )
      .then((response) => {
        setConfirmLoading(false);
        if (!response.ok) {
          notify.error('Error al guardar el producto');
        }
        return response.json();
      })
      .then(() => {
        setConfirmLoading(false);
        onResponse(false, true, false);
      })
      .catch(() => {
        setConfirmLoading(false);
        notify.error('Error al guardar el producto');
        onResponse(false, false, false);
      });
  };

  return (
    <Modal
      title={'Editar producto' + (isEditing && record ? ` ${record.name}` : '')}
      open={open}
      onOk={handleConfirm}
      confirmLoading={confirmLoading}
      onCancel={() => onResponse(false, false, true)}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="SKU"
          name="sku"
          initialValue={record?.sku}
          rules={[{ required: true, message: 'El SKU es obligatorio' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Categoría"
          name="categoryId"
          initialValue={record?.categoryId}
        >
          <Select
            options={categories.map((category: Category) => ({
              label: category.name,
              value: category.id,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item
          label="Nombre"
          name="name"
          initialValue={record?.name}
          rules={[{ required: true, message: 'El nombre es obligatorio' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="description"
          initialValue={record?.description}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="Precio"
          name="price"
          initialValue={record?.price}
          rules={[
            {
              type: 'number',
              min: 0,
              message: 'El valor mínimo es cero',
            },
          ]}
        >
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item
          label="Stock"
          name="stock"
          initialValue={record?.stock}
          rules={[
            {
              type: 'number',
              min: 0,
              message: 'El stock mínimo es cero',
            },
          ]}
        >
          <InputNumber></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
}
