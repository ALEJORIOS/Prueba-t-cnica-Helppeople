import { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { notify } from '@/services/notification.service';
import type { Category } from '../categories/page';

export default function CategoryModal({ record, isEditing, open, onResponse }) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        setConfirmLoading(true);
        fetch(
          `http://backend:3000/api/categorias${
            isEditing ? `/${record.id}` : ''
          }`,
          {
            method: isEditing ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          },
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error al guardar la categoría');
            }
            return response.json();
          })
          .then(() => {
            setConfirmLoading(false);
            form.resetFields();
            onResponse(false, true, false);
          })
          .catch((error) => {
            setConfirmLoading(false);
            notify.error(error.message || 'Error al guardar la categoría');
            onResponse(false, false, false);
          });
      })
      .catch(() => {
        notify.error('Por favor, completa todos los campos requeridos');
      });
  };

  return (
    <Modal
      title={
        isEditing && record
          ? `Editar categoría: ${record.name}`
          : 'Nueva categoría'
      }
      open={open}
      onOk={handleConfirm}
      confirmLoading={confirmLoading}
      onCancel={() => {
        form.resetFields();
        onResponse(false, false, true);
      }}
      okText={isEditing ? 'Guardar' : 'Crear'}
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[
            { required: true, message: 'El nombre es obligatorio' },
            { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
          ]}
        >
          <Input placeholder="Ingrese el nombre de la categoría" />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'La descripción es obligatoria' }]}
        >
          <Input.TextArea
            placeholder="Ingrese la descripción de la categoría"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
