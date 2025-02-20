import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

interface RenderSettingsProps {
  onRender: () => void;
}

export const RenderSettings = ({ onRender }: RenderSettingsProps) => {
  return (
    <div className="settings-panel space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Quality</Label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Resolution</Label>
          <Select defaultValue="1080p">
            <SelectTrigger>
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="720p">720p</SelectItem>
              <SelectItem value="1080p">1080p</SelectItem>
              <SelectItem value="4k">4K</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Render Mode</Label>
          <Select defaultValue="rtx">
            <SelectTrigger>
              <SelectValue placeholder="Select render mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rtx">RTX Real-Time</SelectItem>
              <SelectItem value="path">RTX Path Tracing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Lighting Intensity</Label>
          <Slider
            defaultValue={[50]}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={onRender}
      >
        <Play className="w-4 h-4 mr-2" />
        Start Render
      </Button>
    </div>
  );
};