'use client';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Helper to flatten category tree for select options
const flattenCategories = (categories, level = 0, excludeId = null) => {
  let result = [];
  
  categories.forEach((category) => {
    if (category._id !== excludeId) {
      result.push({
        _id: category._id,
        name: '—'.repeat(level) + ' ' + category.name,
      });
      
      if (category.children && category.children.length > 0) {
        result = result.concat(flattenCategories(category.children, level + 1, excludeId));
      }
    }
  });
  
  return result;
};

export default function CategoryForm({ initialData, categories = [], onSubmit, loading, excludeId = null }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      parent: '',
      isActive: true,
      order: 0,
    },
  });

  const flatCategories = flattenCategories(categories, 0, excludeId);

  const onFormSubmit = (data) => {
    // Convert empty string to null for parent
    if (data.parent === '') {
      data.parent = null;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Input
        label="Category Name"
        {...register('name', { required: 'Category name is required' })}
        error={errors.name?.message}
      />

      <Input
        label="Slug"
        {...register('slug')}
        placeholder="auto-generated if empty"
        error={errors.slug?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          {...register('description')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
        <select
          {...register('parent')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="">None (Top Level)</option>
          {flatCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            {...register('isActive')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>

        <Input
          label="Display Order"
          type="number"
          {...register('order')}
          error={errors.order?.message}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}