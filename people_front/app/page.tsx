'use client';

import Image from 'next/image';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToProducts = () => {
    router.push('/products');
  };

  const goToCategories = () => {
    router.push('/categories');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mx-auto w-fit">
        <div className="flex flex-col items-center w-fit">
          <Image
            src="/logo-helppeople.png"
            alt="Helppeople Logo"
            width={200}
            height={100}
          />
          <h1 className="text-4xl font-bold text-primary">
            Catálogo de productos
          </h1>
          <div className="flex gap-2 mt-8 mb-8 justify-center">
            <Button
              type="primary"
              size="large"
              color="primary"
              variant="solid"
              onClick={goToProducts}
            >
              Productos
            </Button>
            <Button
              type="primary"
              size="large"
              color="primary"
              variant="solid"
              onClick={goToCategories}
            >
              Categorías
            </Button>
          </div>
          <span className="mt-10 text-slate-400 font-medium text-sm">
            Diseñado y desarrollado por Alejandro Ríos
          </span>
        </div>
      </div>
    </main>
  );
}
