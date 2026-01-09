'use client';
import { useState, useRef } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  Info,
  Package,
} from 'lucide-react';
import Image from 'next/image';

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const goToProducts = () => {
    router.push('/products');
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (!validTypes.includes(file.type)) {
      alert('Solo puedes subir archivos Excel (.xlsx, .xls) o CSV');
      return;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      alert('El archivo debe ser menor a 10MB');
      return;
    }

    setFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo primero');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadResult(null);

    try {
      const response = await fetch('http://backend:3000/api/productosMasivo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadResult({
          success:
            data.totalProcessed === data.totalInserted
              ? 'complete'
              : data.totalInserted > 0
              ? 'incomplete'
              : 'failed',
          data: data,
        });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(data.message || 'Error al cargar los productos');
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadResult({
        success: 'failed',
        error: (error as Error).message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = `categoryId,name,description,sku,price,stock
        1,Laptop Dell XPS,Laptop de alta gama con procesador i7,LAP-001,1299.99,25
        2,Mouse Logitech MX,Mouse inalambrico ergonómico,MOU-001,89.99,100
        3,Teclado Mecanico,Teclado RGB switches cherry,TEC-001,149.50,50`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_productos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Image
                src="/logo-helppeople.png"
                alt="Icon"
                height={100}
                width={200}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Carga Masiva de Productos
            </h1>
            <p className="text-gray-600">
              Sube tu archivo Excel o CSV para importar productos
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Formato del archivo
              </h3>
              <p className="text-sm text-blue-800 mb-2">
                Tu archivo debe contener las siguientes columnas:
              </p>
              <code className="bg-white px-3 py-1.5 rounded text-xs sm:text-sm text-blue-900 border border-blue-200 inline-block">
                categoryId, name, description, sku, price, stock
              </code>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-blue-600 hover:text-blue-700 !text-sm font-medium !ml-3 underline"
              >
                Ver detalles
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  Descripción de campos
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Campo
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">
                        Descripción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs">
                        categoryId
                      </td>
                      <td className="py-2 px-3">
                        ID de la categoría (número entero)
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs">name</td>
                      <td className="py-2 px-3">
                        Nombre del producto (obligatorio)
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs">
                        description
                      </td>
                      <td className="py-2 px-3">Descripción del producto</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs">sku</td>
                      <td className="py-2 px-3">
                        Código SKU único (obligatorio)
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-mono text-xs">price</td>
                      <td className="py-2 px-3">
                        Precio del producto (decimal)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-xs">stock</td>
                      <td className="py-2 px-3">
                        Cantidad en inventario (número entero)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Drag and Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer
              transition-all duration-200 mb-6
              ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
              className="hidden"
              disabled={uploading}
            />

            <div className="flex flex-col items-center">
              <div
                className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
              `}
              >
                <Upload
                  className={`w-8 h-8 ${
                    isDragging ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
              </div>

              {file ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4 w-full max-w-md">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1 text-left overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                      disabled={uploading}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Haz clic o arrastra el archivo aquí
                  </p>
                  <p className="text-gray-500 text-sm">
                    Formatos soportados: .xlsx, .xls, .csv (máx. 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`
                px-6 py-3 rounded-lg font-semibold flex items-center gap-2
                transition-all duration-200 shadow-md
                ${
                  !file || uploading
                    ? 'bg-gray-300 !text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 !text-white hover:bg-blue-700 hover:shadow-lg'
                }
              `}
            >
              <Upload className="w-5 h-5" />
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>

            <button
              onClick={downloadTemplate}
              className="px-6 py-3 cursor-pointer rounded-lg font-semibold flex items-center gap-2 border-2 border-gray-300 !text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Descargar Plantilla
            </button>

            <button
              onClick={goToProducts}
              className="px-6 py-3 cursor-pointer rounded-lg font-semibold flex items-center gap-2 border-2 border-gray-300 !text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Package />
              Ir a Productos
            </button>
          </div>

          {/* Rresultado de la subida */}
          {uploadResult && (
            <div className="mt-6">
              {uploadResult.success === 'complete' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-1">
                      ¡Carga exitosa!
                    </h3>
                    <p className="text-sm text-green-800 mb-1">
                      <strong>Total procesado:</strong>{' '}
                      {uploadResult.data?.totalProcessed} productos
                    </p>
                    <p className="text-sm text-green-800">
                      <strong>Total insertado:</strong>{' '}
                      {uploadResult.data?.totalInserted} productos
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadResult(null)}
                    className="text-green-700 hover:text-green-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {uploadResult.success === 'incomplete' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                  <WarningOutlined className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-1">
                      Carga parcialmente exitosa
                    </h3>
                    <p className="text-sm text-amber-800 mb-1">
                      <strong>Total procesado:</strong>{' '}
                      {uploadResult.data?.totalProcessed} productos
                    </p>
                    <p className="text-sm text-amber-800">
                      <strong>Total insertado:</strong>{' '}
                      {uploadResult.data?.totalInserted} productos
                    </p>
                    <p className="text-sm text-amber-800">
                      <strong>SKU de productos con error:</strong>{' '}
                      {uploadResult.data?.failed
                        ?.map((f) => f.row.sku)
                        .join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadResult(null)}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {uploadResult.success === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">
                      Error en la carga
                    </h3>
                    <p className="text-sm text-red-800">{uploadResult.error}</p>
                  </div>
                  <button
                    onClick={() => setUploadResult(null)}
                    className="text-red-700 hover:text-red-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading Indicator */}
          {uploading && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Procesando archivo...</span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Instrucciones
          </h3>
          <ol className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 flex-shrink-0">
                1.
              </span>
              <span>Verifica que las categorías existan y estén correctas</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 flex-shrink-0">
                2.
              </span>
              <span>Descarga la plantilla de ejemplo o prepara tu archivo</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 flex-shrink-0">
                3.
              </span>
              <span>
                Arrastra el archivo a la zona de carga o haz clic para
                seleccionarlo
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 flex-shrink-0">
                4.
              </span>
              <span>
                Verifica que el archivo cumpla con el formato requerido
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-blue-600 flex-shrink-0">
                5.
              </span>
              <span>
                Haz clic en &quot;Subir Archivo&quot; y espera la confirmación
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

interface UploadResult {
  success: 'complete' | 'incomplete' | 'failed';
  data?: {
    totalProcessed: number;
    totalInserted: number;
    failed?: failedRow[];
  };
  error?: string;
}

interface failedRow {
  error: string;
  row: {
    categoryId: number;
    name: string;
    description: string;
    sku: string;
    price: number;
    stock: number;
  };
}
