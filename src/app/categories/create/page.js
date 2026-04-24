'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import CategoryForm from '@/components/forms/CategoryForm';
import { useCategoryStore } from '@/store/categoryStore';
import { usePermissions } from '@/lib/permissions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateCategoryPage() {
  const router = useRouter();
  const { createCategory, loading, fetchCategoryTree, categoryTree } = useCategoryStore();
  const { canCreateCategories } = usePermissions();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategoryTree();
  }, []);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createCategory(data);
      router.push('/categories');
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (!canCreateCategories) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">You don&apos;t have permission to create categories.</p>
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
          <h1 className="text-2xl font-semibold text-gray-900 mt-2">Create New Category</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <CategoryForm
            categories={categoryTree}
            onSubmit={handleSubmit}
            loading={submitting || loading}
          />
        </div>
      </div>
    </Layout>
  );
}