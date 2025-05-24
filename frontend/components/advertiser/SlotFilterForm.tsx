"use client";

import { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SlotFilterFormProps {
  category: string;
  setCategory: (category: string) => void;
  minAudienceSize: string;
  setMinAudienceSize: (size: string) => void;
}

export const SlotFilterForm: FC<SlotFilterFormProps> = ({
  category,
  setCategory,
  minAudienceSize,
  setMinAudienceSize
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">Filter Slots</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white">Category</Label>
          <Input
            id="category"
            placeholder="e.g., tech, gaming, finance"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400">Filter by slot category</p>
        </div>
        
        {/* Minimum Audience Size */}
        <div className="space-y-2">
          <Label htmlFor="minAudienceSize" className="text-white">Minimum Audience Size</Label>
          <Input
            id="minAudienceSize"
            type="number"
            placeholder="e.g., 5000"
            value={minAudienceSize}
            onChange={(e) => setMinAudienceSize(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            min="0"
          />
          <p className="text-xs text-gray-400">Filter by minimum audience reach</p>
        </div>
      </div>
    </div>
  );
};

export default SlotFilterForm;
