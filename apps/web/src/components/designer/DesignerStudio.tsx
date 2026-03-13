'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type, Image, Square, Circle, Triangle, Star, Trash2,
  RotateCcw, RotateCw, Copy, Layers, ZoomIn, ZoomOut,
  Download, Save, Eye, Undo2, Redo2, AlignLeft, AlignCenter,
  AlignRight, Bold, Italic, Underline, Palette, Move,
  Maximize2, Minus, Plus, ChevronUp, ChevronDown, Lock,
  Unlock, ChevronLeft, ChevronRight, Grid, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// Dynamic import to avoid SSR issues with Fabric.js
const CanvasEditor = dynamic(() => import('./CanvasEditor'), { ssr: false });
const ProductMockup = dynamic(() => import('./ProductMockup'), { ssr: false });

interface DesignLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  name: string;
  visible: boolean;
  locked: boolean;
}

const FONT_LIST = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Courier New',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Roboto',
  'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display',
  'Dancing Script', 'Pacifico', 'Lobster', 'Anton', 'Bebas Neue',
];

const PRODUCT_VIEWS = [
  { id: 'front', label: 'Front', icon: '👕' },
  { id: 'back', label: 'Back', icon: '👕' },
  { id: 'left', label: 'Left', icon: '👔' },
  { id: 'right', label: 'Right', icon: '👔' },
];

export function DesignerStudio() {
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'shapes' | 'templates' | 'layers'>('templates');
  const [selectedView, setSelectedView] = useState('front');
  const [showMockup, setShowMockup] = useState(false);
  const [layers, setLayers] = useState<DesignLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasRef, setCanvasRef] = useState<any>(null);

  // Text properties
  const [textProps, setTextProps] = useState({
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#000000',
    fontWeight: 'normal' as 'normal' | 'bold',
    fontStyle: 'normal' as 'normal' | 'italic',
    underline: false,
    textAlign: 'left' as 'left' | 'center' | 'right',
  });

  const sidebarTabs = [
    { id: 'templates', icon: Grid, label: 'Templates' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'images', icon: Image, label: 'Images' },
    { id: 'shapes', icon: Square, label: 'Shapes' },
    { id: 'layers', icon: Layers, label: 'Layers' },
  ] as const;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Design saved successfully!');
    } catch {
      toast.error('Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    toast.success('Downloading design preview...');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 z-20">
        <div className="flex items-center gap-3">
          <a href="/" className="text-white font-bold text-lg">PrintShoppy</a>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 text-sm">Custom T-Shirt Design</span>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-700 mx-2" />

          {/* Zoom */}
          <button
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-gray-300 text-sm w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMockup(!showMockup)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              showMockup
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            )}
          >
            <Eye className="w-4 h-4" />
            {showMockup ? '2D Edit' : '3D Preview'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-700">
            {sidebarTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-white bg-gray-700 border-b-2 border-primary-500'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'templates' && <TemplatesPanel />}
            {activeTab === 'text' && (
              <TextPanel textProps={textProps} onTextPropsChange={setTextProps} />
            )}
            {activeTab === 'images' && <ImagesPanel />}
            {activeTab === 'shapes' && <ShapesPanel />}
            {activeTab === 'layers' && <LayersPanel layers={layers} selectedId={selectedLayerId} onSelect={setSelectedLayerId} />}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Product View Selector */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-750 border-b border-gray-700">
            {PRODUCT_VIEWS.map(view => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  selectedView === view.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                )}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Canvas / Mockup */}
          <div className="flex-1 flex items-center justify-center bg-gray-900 overflow-hidden p-8">
            {showMockup ? (
              <ProductMockup />
            ) : (
              <CanvasEditor zoom={zoom} view={selectedView} onLayersChange={setLayers} />
            )}
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold text-sm">Properties</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplatesPanel() {
  const templates = [
    { id: '1', name: 'Bold Minimal', emoji: '⬛', category: 'Text' },
    { id: '2', name: 'Floral Design', emoji: '🌸', category: 'Art' },
    { id: '3', name: 'Geometric', emoji: '🔷', category: 'Abstract' },
    { id: '4', name: 'Vintage Badge', emoji: '🏅', category: 'Badge' },
    { id: '5', name: 'Typography', emoji: '✒️', category: 'Text' },
    { id: '6', name: 'Nature', emoji: '🌿', category: 'Art' },
  ];

  return (
    <div>
      <input
        type="search"
        placeholder="Search templates..."
        className="w-full px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg text-sm border border-gray-600 focus:outline-none focus:border-primary-500 mb-3"
      />
      <div className="grid grid-cols-2 gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            className="aspect-square bg-gray-700 rounded-xl flex flex-col items-center justify-center hover:bg-gray-600 hover:ring-2 hover:ring-primary-500 transition-all"
          >
            <span className="text-3xl mb-1">{template.emoji}</span>
            <span className="text-xs text-gray-300">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TextPanel({ textProps, onTextPropsChange }: any) {
  return (
    <div className="space-y-4">
      <button className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-4 h-4" /> Add Text
      </button>
      <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
        <Type className="w-4 h-4" /> Add Heading
      </button>
      <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
        <Type className="w-4 h-4" /> Add Subheading
      </button>

      <div className="border-t border-gray-700 pt-4">
        <label className="text-gray-400 text-xs mb-2 block">Font Family</label>
        <select
          value={textProps.fontFamily}
          onChange={e => onTextPropsChange({ ...textProps, fontFamily: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg text-sm border border-gray-600 focus:outline-none focus:border-primary-500"
        >
          {FONT_LIST.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-gray-400 text-xs mb-2 block">Font Size</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTextPropsChange({ ...textProps, fontSize: Math.max(8, textProps.fontSize - 2) })}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            value={textProps.fontSize}
            onChange={e => onTextPropsChange({ ...textProps, fontSize: parseInt(e.target.value) })}
            className="flex-1 text-center bg-gray-700 text-white border border-gray-600 rounded-lg py-1 text-sm focus:outline-none"
          />
          <button
            onClick={() => onTextPropsChange({ ...textProps, fontSize: Math.min(200, textProps.fontSize + 2) })}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onTextPropsChange({ ...textProps, fontWeight: textProps.fontWeight === 'bold' ? 'normal' : 'bold' })}
          className={cn('flex-1 py-2 rounded-lg text-sm font-bold transition-colors', textProps.fontWeight === 'bold' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}
        >
          <Bold className="w-4 h-4 mx-auto" />
        </button>
        <button
          onClick={() => onTextPropsChange({ ...textProps, fontStyle: textProps.fontStyle === 'italic' ? 'normal' : 'italic' })}
          className={cn('flex-1 py-2 rounded-lg text-sm transition-colors', textProps.fontStyle === 'italic' ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}
        >
          <Italic className="w-4 h-4 mx-auto" />
        </button>
        <button
          onClick={() => onTextPropsChange({ ...textProps, underline: !textProps.underline })}
          className={cn('flex-1 py-2 rounded-lg text-sm transition-colors', textProps.underline ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}
        >
          <Underline className="w-4 h-4 mx-auto" />
        </button>
      </div>

      <div>
        <label className="text-gray-400 text-xs mb-2 block">Text Alignment</label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map(align => (
            <button
              key={align}
              onClick={() => onTextPropsChange({ ...textProps, textAlign: align })}
              className={cn('flex-1 py-2 rounded-lg transition-colors', textProps.textAlign === align ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')}
            >
              {align === 'left' ? <AlignLeft className="w-4 h-4 mx-auto" /> : align === 'center' ? <AlignCenter className="w-4 h-4 mx-auto" /> : <AlignRight className="w-4 h-4 mx-auto" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs mb-2 block">Text Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={textProps.fill}
            onChange={e => onTextPropsChange({ ...textProps, fill: e.target.value })}
            className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-600 bg-transparent"
          />
          <input
            type="text"
            value={textProps.fill}
            onChange={e => onTextPropsChange({ ...textProps, fill: e.target.value })}
            className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
        <div className="grid grid-cols-8 gap-1 mt-2">
          {['#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6',
            '#ec4899', '#14b8a6', '#64748b', '#92400e', '#166534', '#1e40af', '#6d28d9', '#be185d'].map(color => (
            <button
              key={color}
              onClick={() => onTextPropsChange({ ...textProps, fill: color })}
              className="w-6 h-6 rounded-full hover:scale-110 transition-transform border border-gray-600"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImagesPanel() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer',
          isDragging ? 'border-primary-500 bg-primary-500/10' : 'border-gray-600 hover:border-gray-500'
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Upload Image</p>
        <p className="text-xs text-gray-600 mt-1">PNG, JPG, SVG up to 50MB</p>
        <input type="file" className="hidden" accept="image/*" />
      </div>

      <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Free Cliparts</div>
      <div className="grid grid-cols-3 gap-2">
        {['🌟', '🎨', '🦋', '🌈', '🎭', '🏆', '🎪', '🌺', '🎸'].map((emoji, i) => (
          <button
            key={i}
            className="aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center text-2xl hover:scale-105 transition-all"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShapesPanel() {
  const shapes = [
    { icon: Square, name: 'Rectangle' },
    { icon: Circle, name: 'Circle' },
    { icon: Triangle, name: 'Triangle' },
    { icon: Star, name: 'Star' },
    { icon: Move, name: 'Arrow' },
    { icon: Minus, name: 'Line' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {shapes.map(shape => (
          <button
            key={shape.name}
            className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors group"
          >
            <shape.icon className="w-6 h-6 text-gray-300 group-hover:text-white" />
            <span className="text-xs text-gray-400 group-hover:text-gray-200">{shape.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LayersPanel({ layers, selectedId, onSelect }: any) {
  if (layers.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-8">
        <Layers className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p>No layers yet</p>
        <p className="text-xs mt-1">Add text, images or shapes to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {layers.map((layer: DesignLayer) => (
        <div
          key={layer.id}
          onClick={() => onSelect(layer.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors',
            selectedId === layer.id ? 'bg-primary-600/20 text-primary-300 border border-primary-600/40' : 'hover:bg-gray-700 text-gray-300'
          )}
        >
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xs opacity-60">
              {layer.type === 'text' ? '📝' : layer.type === 'image' ? '🖼️' : '⬛'}
            </span>
            <span className="truncate">{layer.name}</span>
          </div>
          <button className="opacity-60 hover:opacity-100">
            {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 line-through" />}
          </button>
          <button className="opacity-60 hover:opacity-100">
            {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>
      ))}
    </div>
  );
}

function PropertiesPanel() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <label className="text-gray-400 text-xs block mb-2">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-500 block mb-1">X</span>
            <input type="number" className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-lg text-xs border border-gray-600 focus:outline-none" defaultValue={100} />
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">Y</span>
            <input type="number" className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-lg text-xs border border-gray-600 focus:outline-none" defaultValue={100} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-2">Size</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-500 block mb-1">W</span>
            <input type="number" className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-lg text-xs border border-gray-600 focus:outline-none" defaultValue={200} />
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">H</span>
            <input type="number" className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-lg text-xs border border-gray-600 focus:outline-none" defaultValue={200} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-2">Rotation</label>
        <input type="range" min={-180} max={180} defaultValue={0} className="w-full" />
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-2">Opacity</label>
        <input type="range" min={0} max={100} defaultValue={100} className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-xs transition-colors">
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </button>
          <button className="flex items-center justify-center gap-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
