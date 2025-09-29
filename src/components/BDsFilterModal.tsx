import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface BehaviorDescriptor {
  id: number;
  selected: boolean;
  date: string;
  time: string;
  source: string;
  action: string;
  trigger: string;
  context: string;
  gco_classification: string;
  created_at: string;
  iep_goal?: {
    id: number;
    description?: string | null;
    gco?: string | null;
  };
  video_url?: string;
}

interface BDsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: BDFilters) => void;
  onClearFilters: () => void;
  behaviorDescriptors: BehaviorDescriptor[];
  title: string;
}

export interface BDFilters {
  trigger: string;
  source: string;
  context: string;
  startDate: string;
  endDate: string;
  gcoClassification: string;
  hasAction: boolean;
  hasTrigger: boolean;
}

const defaultFilters: BDFilters = {
  trigger: '',
  source: 'all',
  context: '',
  startDate: '',
  endDate: '',
  gcoClassification: 'all',
  hasAction: false,
  hasTrigger: false
};

export function BDsFilterModal({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  onClearFilters,
  behaviorDescriptors,
  title 
}: BDsFilterModalProps) {
  const [filters, setFilters] = useState<BDFilters>(defaultFilters);

  // Get unique values for select options
  const uniqueSources = Array.from(new Set(behaviorDescriptors.map(bd => bd.source).filter(Boolean)));
  const uniqueGCOs = Array.from(new Set(behaviorDescriptors.map(bd => bd.gco_classification).filter(Boolean)));

  const handleFilterChange = (key: keyof BDFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    onClearFilters();
    onClose();
  };

  const handleClose = () => {
    setFilters(defaultFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'white', zIndex: 9999 }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold" style={{ color: '#3C3C3C' }}>
            Filter {title}
          </DialogTitle>
          <DialogDescription style={{ color: '#6C757D' }}>
            Use the filters below to narrow down the behavior descriptors based on your criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Source Filter */}
          <div>
            <Label htmlFor="source-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
              Source
            </Label>
            <Select value={filters.source} onValueChange={(value) => handleFilterChange('source', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent className="z-[10000] bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-gray-100 focus:bg-gray-100">All Sources</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source} className="hover:bg-gray-100 focus:bg-gray-100">
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trigger Filter */}
          <div>
            <Label htmlFor="trigger-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
              Trigger
            </Label>
            <Input
              id="trigger-filter"
              type="text"
              placeholder="Filter by trigger..."
              value={filters.trigger}
              onChange={(e) => handleFilterChange('trigger', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs mt-1" style={{ color: '#6C757D' }}>
              Example: "during playtime", "when asked to clean up", "at meal time"
            </p>
          </div>

          {/* Context Filter */}
          <div>
            <Label htmlFor="context-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
              Context
            </Label>
            <Input
              id="context-filter"
              type="text"
              placeholder="Filter by context..."
              value={filters.context}
              onChange={(e) => handleFilterChange('context', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs mt-1" style={{ color: '#6C757D' }}>
              Example: "During free play", "In the classroom", "At circle time", "During transitions"
            </p>
          </div>

          {/* GCO Classification Filter */}
          <div>
            <Label htmlFor="gco-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
              GCO Classification
            </Label>
            <Select value={filters.gcoClassification} onValueChange={(value) => handleFilterChange('gcoClassification', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select GCO" />
              </SelectTrigger>
              <SelectContent className="z-[10000] bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-gray-100 focus:bg-gray-100">All GCOs</SelectItem>
                {uniqueGCOs.map((gco) => (
                  <SelectItem key={gco} value={gco} className="hover:bg-gray-100 focus:bg-gray-100">
                    GCO {gco}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                Start Date
              </Label>
              <Input
                id="start-date-filter"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date-filter" className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
                End Date
              </Label>
              <Input
                id="end-date-filter"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Checkbox Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium" style={{ color: '#3C3C3C' }}>
              Additional Filters
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-action"
                  checked={filters.hasAction}
                  onCheckedChange={(checked) => handleFilterChange('hasAction', checked as boolean)}
                />
                <Label htmlFor="has-action" className="text-sm" style={{ color: '#3C3C3C' }}>
                  Only show entries with actions
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-trigger"
                  checked={filters.hasTrigger}
                  onCheckedChange={(checked) => handleFilterChange('hasTrigger', checked as boolean)}
                />
                <Label htmlFor="has-trigger" className="text-sm" style={{ color: '#3C3C3C' }}>
                  Only show entries with triggers
                </Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-6"
            style={{ 
              borderColor: '#BDC3C7',
              color: '#3C3C3C'
            }}
          >
            Clear All
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6"
              style={{ 
                borderColor: '#BDC3C7',
                color: '#3C3C3C'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="px-6"
              style={{ 
                backgroundColor: '#e65039', 
                color: 'white',
                borderColor: '#e65039'
              }}
            >
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
