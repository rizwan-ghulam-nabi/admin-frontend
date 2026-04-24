'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import CategoryForm from '@/components/forms/CategoryForm';
import { useCategoryStore } from '@/store/categoryStore';
import { usePermissions } from '@/lib/permissions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Loader from '@/components/common/Loader';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;
  
  const {
    selectedCategory,
    categoryTree,
    fetchCategory,
    fetchCategoryTree,
    updateCategory,
    loading,
    clearSelected,
  } = useCategoryStore();
  
  const { canUpdateCategories } = usePermissions();
  const [submitting, setSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchCategory(categoryId),
          fetchCategoryTree(),
        ]);
      } catch (error) {
        router.push('/categories');
      } finally {
        setFetchLoading(false);
      }
    };
    
    loadData();
    
    return () => clearSelected();
  }, [categoryId]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updateCategory(categoryId, data);
      router.push('/categories');
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (!canUpdateCategories) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don&apos;t have permission to update categories.</p>
        </div>
      </Layout>
    );
  }

  if (fetchLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/categories"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Categories
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">Edit Category</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <CategoryForm
            initialData={selectedCategory}
            categories={categoryTree}
            onSubmit={handleSubmit}
            loading={submitting || loading}
            excludeId={categoryId}
          />
        </div>
      </div>
    </Layout>
  );
}