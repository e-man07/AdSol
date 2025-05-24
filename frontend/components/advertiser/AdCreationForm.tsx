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
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

// Pinata SDK for IPFS uploads (mock implementation)
const pinFileToIPFS = async (file: File): Promise<string> => {
  // In a real app, this would use the Pinata SDK to upload the file
  console.log('Uploading file to IPFS:', file.name);
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock CID
  return 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Form schema with validation
const formSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  slotKey: z.string().min(32, 'Slot Public Key must be a valid 32-byte hex string'),
  mediaFile: z.instanceof(FileList).refine(files => files.length > 0, {
    message: 'Media file is required',
  }).transform(files => files[0]).refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'].includes(file.type),
    {
      message: 'File must be an image (JPEG, PNG, GIF) or video (MP4, WebM)',
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface AdCreationFormProps {
  onSuccess: () => void;
}

export const AdCreationForm: FC<AdCreationFormProps> = ({ onSuccess }) => {
  const { connected } = useWalletConnection();
  const { createAd } = useAdProgram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adId: '',
      slotKey: '',
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload file to IPFS
      const file = data.mediaFile as File;
      if (!file) {
        toast.error('Please select a media file');
        setIsSubmitting(false);
        return;
      }
      
      toast.info('Uploading media to IPFS...');
      
      try {
        const cid = await pinFileToIPFS(file);
        
        // Call the program to create the ad
        const result = await createAd(
          data.adId,
          data.slotKey,
          cid
        );
        
        if (result.success) {
          toast.success('Ad created successfully!');
          reset(); // Reset form
          setSelectedFile(null);
          onSuccess(); // Trigger refresh of ad list
        }
      } catch (error: any) {
        toast.error(`IPFS upload failed: ${error.message}`);
        console.error('Error uploading to IPFS:', error);
      }
    } catch (error: any) {
      toast.error(`Failed to create ad: ${error.message}`);
      console.error('Error creating ad:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-white">Create New Ad</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ad ID */}
          <div className="space-y-2">
            <Label htmlFor="adId" className="text-white">Ad ID</Label>
            <Input
              id="adId"
              placeholder="Enter a unique identifier for your ad"
              {...register('adId')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.adId && (
              <p className="text-red-500 text-sm">{errors.adId.message}</p>
            )}
          </div>
          
          {/* Slot Public Key */}
          <div className="space-y-2">
            <Label htmlFor="slotKey" className="text-white">Slot Public Key</Label>
            <Input
              id="slotKey"
              placeholder="Enter the public key of the ad slot"
              {...register('slotKey')}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.slotKey && (
              <p className="text-red-500 text-sm">{errors.slotKey.message}</p>
            )}
          </div>
          
          {/* Media File */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mediaFile" className="text-white">Media File</Label>
            <Input
              id="mediaFile"
              type="file"
              accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
              {...register('mediaFile')}
              onChange={handleFileChange}
              className="bg-gray-700 border-gray-600 text-white"
              disabled={!connected || isSubmitting}
            />
            {errors.mediaFile && (
              <p className="text-red-500 text-sm">{errors.mediaFile.message as string}</p>
            )}
            {selectedFile && (
              <div className="mt-2 p-2 bg-gray-700 rounded-md">
                <p className="text-sm text-white">Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!connected || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Ad'}
          </Button>
          
          {!connected && (
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-yellow-500 text-sm">
                Please connect your wallet to create ads
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdCreationForm;
