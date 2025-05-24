"use client";

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdProgram } from '@/utils/solana-program';
import useWalletConnection from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Loader2 } from 'lucide-react';

// Form schema with validation
const formSchema = z.object({
  slotId: z.string().min(1, 'Slot ID is required'),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  duration: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Duration must be a positive number',
  }),
  purchaseType: z.enum(['fixed', 'auction']),
  auctionEnd: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  audienceSize: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Audience size must be a positive number',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AdSlotFormProps {
  onSuccess: () => void;
}

export const AdSlotForm: FC<AdSlotFormProps> = ({ onSuccess }) => {
  const { connected } = useWalletConnection();
  const { createAdSlot } = useAdProgram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotId: '',
      price: '',
      duration: '',
      purchaseType: 'fixed',
      auctionEnd: '',
      category: '',
      audienceSize: '',
    },
  });
  
  const purchaseType = watch('purchaseType');
  const isAuction = purchaseType === 'auction';
  
  const onSubmit = async (data: FormValues) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert string values to appropriate types
      const price = Number(data.price) * LAMPORTS_PER_SOL; // Convert SOL to lamports
      const duration = Number(data.duration);
      const audienceSize = Number(data.audienceSize);
      
      // Convert auction end date to timestamp if auction type
      const auctionEnd = isAuction && data.auctionEnd 
        ? new Date(data.auctionEnd).getTime() / 1000 
        : null;
      
      // Validate auction end date is in the future
      if (isAuction && auctionEnd && auctionEnd <= Date.now() / 1000) {
        toast.error('Auction end date must be in the future');
        setIsSubmitting(false);
        return;
      }
      
      // Show a toast notification that the transaction is being processed
      toast.loading('Creating ad slot... Please approve the transaction in your wallet');
      
      // Call the program to create the ad slot
      const result = await createAdSlot(
        data.slotId,
        price,
        duration,
        data.purchaseType,
        auctionEnd,
        data.category,
        audienceSize
      );
      
      if (result.success) {
        toast.success('Ad slot created successfully!');
        reset(); // Reset form
        onSuccess(); // Trigger refresh of slot list
      }
    } catch (error: any) {
      toast.error(`Failed to create ad slot: ${error.message}`);
      console.error('Error creating ad slot:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Create New Ad Slot</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slot ID */}
          <div className="space-y-2">
            <Label htmlFor="slotId" className="text-white">Slot ID</Label>
            <Input
              id="slotId"
              placeholder="e.g., homepage-banner"
              {...register('slotId')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.slotId && (
              <p className="text-red-500 text-sm">{errors.slotId.message}</p>
            )}
          </div>
          
          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price (SOL)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 1.5"
              {...register('price')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="e.g., 86400 (1 day)"
              {...register('duration')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm">{errors.duration.message}</p>
            )}
          </div>
          
          {/* Purchase Type */}
          <div className="space-y-2">
            <Label htmlFor="purchaseType" className="text-white">Purchase Type</Label>
            <Select 
              onValueChange={(value) => {
                const event = { target: { name: 'purchaseType', value } };
                register('purchaseType').onChange(event);
              }}
              defaultValue="fixed"
              disabled={!connected || isSubmitting}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
              </SelectContent>
            </Select>
            {errors.purchaseType && (
              <p className="text-red-500 text-sm">{errors.purchaseType.message}</p>
            )}
          </div>
          
          {/* Auction End (conditional) */}
          {isAuction && (
            <div className="space-y-2">
              <Label htmlFor="auctionEnd" className="text-white">Auction End</Label>
              <Input
                id="auctionEnd"
                type="datetime-local"
                {...register('auctionEnd')}
                className="bg-gray-700 border-gray-600 text-white"
                disabled={!connected || isSubmitting}
              />
              {errors.auctionEnd && (
                <p className="text-red-500 text-sm">{errors.auctionEnd.message}</p>
              )}
            </div>
          )}
          
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <Input
              id="category"
              placeholder="e.g., tech, gaming, finance"
              {...register('category')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
          
          {/* Audience Size */}
          <div className="space-y-2">
            <Label htmlFor="audienceSize" className="text-white">Audience Size</Label>
            <Input
              id="audienceSize"
              type="number"
              min="1"
              placeholder="e.g., 10000"
              {...register('audienceSize')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.audienceSize && (
              <p className="text-red-500 text-sm">{errors.audienceSize.message}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!connected || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Ad Slot'
            )}
          </Button>
          
          {!connected && (
            <p className="mt-2 text-center text-yellow-500 text-sm">
              Please connect your wallet to create ad slots
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdSlotForm;
