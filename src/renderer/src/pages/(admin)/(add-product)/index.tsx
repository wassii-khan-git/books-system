import React, { JSX, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn/ui form components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ProductFormValues, productSchema } from './validations'
import Spinner from '@/components/shared/spinner'
import { useQuery } from '@tanstack/react-query'
import { Combobox } from '@/components/ui/combobox'
import { Category } from '../(categories)/columns'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { CompanyTypes } from '../(companies)/columns'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { ResponseTypes } from 'src/main/types'
import { AddProductTypes } from 'src/main/services/product.services'

export default function AddProductPage(): JSX.Element {
  // get url params
  const [searchParams] = useSearchParams()
  // navigate
  const navigate = useNavigate()

  const productId = searchParams.get('productId') || ''

  // get the product
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const result = await window.api?.getProductById(Number(productId))
      console.log('resulttt-from get proiduct by--', result)
      return result
    },
    enabled: !!productId
  })

  console.log('productIdd---', productId)

  // form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.data?.id || undefined,
      companyId: product?.data?.companyId,
      categoryId: product?.data?.categoryId,
      title: product?.data?.title,
      author: product?.data?.author,
      description: product?.data?.description,
      price: product?.data?.price,
      originalPrice: product?.data?.originalPrice,
      discountedPrice: product?.data?.discountedPrice,
      quantity: product?.data?.quantity,
      isbn: product?.data?.isbn,
      pages: product?.data?.pages,
      language: product?.data?.language,
      publisher: product?.data?.publisher,
      inStock: product?.data?.inStock,
      off: product?.data?.off || 0
    }
  })

  // get categoryId
  const [categoryId, setCategoryId] = useState<number>(0)
  // percentage
  const [percentage, setPercentage] = useState<number>(0)

  // on submit
  async function onSubmit(values): Promise<void> {
    try {
      console.log('company data to submit:', values)
      // result
      let result: ResponseTypes = {
        success: false,
        message: 'default message'
      }
      // check if productId is provided
      if (productId) {
        // data
        const data = {
          id: productId,
          ...values
        }
        result = await window.api?.updateProduct(data as AddProductTypes)
      } else {
        result = await window.api?.addProduct(values as AddProductTypes)
      }

      console.log('result---adding--product:--', result)
      if (result.success) {
        // Reset form after successful submission
        setCategoryId(0)
        toast.success(
          result.message || productId
            ? 'Product updated successfully'
            : 'Product added successfully'
        )
        navigate('/dashboard/products')
      } else {
        toast.error(result.message || 'Error adding company. Please try again.')
      }
    } catch (error) {
      console.error('Error adding company:', error)
      toast.error('Error adding company. Please try again.')
    }
  }

  // get categories
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const result = await window.api?.getCompanies({ page: 1, limit: 50 })
      return result
    }
  })

  // get categories
  const { data: categories } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: async () => {
      const result = await window.api?.getCategoryById(categoryId)
      if (result.success) {
        if (result?.data?.length > 0) {
          return result
        } else {
          return { ...result, data: [result?.data] }
        }
      }
    },
    enabled: categoryId > 0
  })

  // Helper to handle company selection
  const handleCompanySelect = (selectedId: number): void => {
    // Update form state for companyId
    form.setValue('companyId', selectedId)

    // Find the actual company object to get its categoryId
    const selectedCompany = companies?.data?.find((c: CompanyTypes) => Number(c.id) === selectedId)

    if (selectedCompany?.categoryId) {
      const newCatId = selectedCompany.categoryId
      setCategoryId(newCatId)
      setPercentage(selectedCompany?.percentage)
      // Auto-set the category field in the form as well
      form.setValue('categoryId', newCatId)
    }
  }

  useEffect(() => {
    if (product) {
      // form
      form.reset({
        companyId: product?.data?.companyId,
        categoryId: product?.data?.categoryId,
        title: product?.data?.title,
        author: product?.data?.author,
        description: product?.data?.description,
        price: product?.data?.price,
        originalPrice: product?.data?.originalPrice,
        quantity: product?.data?.quantity,
        isbn: String(product?.data?.isbn),
        pages: product?.data?.pages,
        language: product?.data?.language,
        publisher: product?.data?.publisher,
        inStock: product?.data?.inStock,
        off: product?.data?.off
      })
      console.log('product---', product)
    }
  }, [product, form])

  // console.log('categorgyr---iidd==', categoryId)
  // console.log('0000categories--', categories)
  console.log('product====', product)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">Add Product</h1>
            {productId && (
              <Link to={'/dashboard/products'}>
                <Button size="sm">
                  <ChevronLeft /> Go Back
                </Button>
              </Link>
            )}
          </div>
          <div className={cn('mx-6')}>
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company */}
                      <FormField
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                          <FormItem className=" flex flex-col">
                            <FormLabel>Company *</FormLabel>
                            <FormControl className="flex">
                              <Combobox
                                items={
                                  companies?.data?.map((c: CompanyTypes) => ({
                                    label: c.name,
                                    value: c.id
                                  })) || []
                                }
                                value={field.value}
                                // Trigger our custom logic on select
                                onSelect={(val) => handleCompanySelect(val)}
                                placeholder="Select a company"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Category */}
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem className=" flex flex-col">
                            <FormLabel>Category *</FormLabel>
                            <FormControl className="flex">
                              <Combobox
                                // Map your API data to label/value pairs
                                items={
                                  categories?.data?.map((cat: Category) => ({
                                    label: cat.title,
                                    value: cat.id
                                  })) || []
                                }
                                value={field.value}
                                onSelect={field.onChange} // Updates React Hook Form state
                                placeholder="Select a category"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Author */}
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Publisher */}
                      <FormField
                        control={form.control}
                        name="publisher"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publisher *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter publisher name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Quantity */}
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter product description"
                              className="min-h-25"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field: { value, onChange, ...otherProps } }) => (
                          <FormItem>
                            <FormLabel>Current Price * ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={value || ''}
                                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => {
                                  if (value === 0) {
                                    e.target.select()
                                  }
                                }}
                                {...otherProps}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field: { value, onChange, ...otherProps } }) => (
                          <FormItem>
                            <FormLabel>Original Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={value || ''}
                                onChange={(e) =>
                                  onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                                }
                                onFocus={(e) => {
                                  if (value === 0) {
                                    e.target.select()
                                  }
                                }}
                                {...otherProps}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="off"
                        render={({ field: { value, onChange, ...otherProps } }) => (
                          <FormItem>
                            <FormLabel>Percentage (%)</FormLabel>
                            <FormControl>
                              <Input
                                value={percentage || value}
                                type="number"
                                max="100"
                                placeholder="0"
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0
                                  setPercentage(val)
                                  onChange(val)
                                }}
                                onFocus={(e) => {
                                  if (value === 0) {
                                    e.target.select()
                                  }
                                }}
                                {...otherProps}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* language */}
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem className=" flex flex-col">
                            <FormLabel>Language *</FormLabel>
                            <FormControl className="flex">
                              <Combobox
                                // Map your API data to label/value pairs
                                items={
                                  ['English', 'Urdu', 'Arabic'].map((lan) => ({
                                    label: lan,
                                    value: lan
                                  })) || []
                                }
                                value={field.value}
                                onSelect={field.onChange} // Updates React Hook Form state
                                placeholder="Select a category"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Isbn */}
                      <FormField
                        control={form.control}
                        name="isbn"
                        render={({ field: { value, onChange, ...otherProps } }) => (
                          <FormItem>
                            <FormLabel>Isbn *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="097-32324233"
                                value={value ?? ''}
                                {...otherProps}
                                onChange={(e) => {
                                  const val = e.target.value
                                  onChange(val === '' ? undefined : String(val))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pages */}
                      <FormField
                        control={form.control}
                        name="pages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pages *</FormLabel>
                            <FormControl className="w-full">
                              <Input
                                type="number"
                                min="1"
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Inventory */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">In Stock</FormLabel>
                              <FormDescription>
                                Is this product currently available?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={form.formState.isSubmitting}
                        className="hover:text-primary"
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="bg-primary"
                      >
                        {form.formState.isSubmitting ? (
                          <Spinner isPageLoader={false} size={25} className="text-white" />
                        ) : productId ? (
                          'Update product'
                        ) : (
                          'Add product'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
