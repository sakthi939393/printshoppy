'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';

interface CanvasEditorProps {
  zoom: number;
  view: string;
  onLayersChange: (layers: any[]) => void;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export default function CanvasEditor({ zoom, view, onLayersChange }: CanvasEditorProps) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Print area mask (visual guide)
    const printMask = new fabric.Rect({
      left: 50,
      top: 50,
      width: 400,
      height: 400,
      fill: 'transparent',
      stroke: '#3b82f6',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      selectable: false,
      evented: false,
      name: 'print-mask',
    });
    canvas.add(printMask);

    // Print area label
    const label = new fabric.Text('Print Area', {
      left: 50,
      top: 30,
      fontSize: 12,
      fill: '#3b82f6',
      selectable: false,
      evented: false,
      name: 'print-label',
    });
    canvas.add(label);

    canvas.renderAll();

    // Event listeners
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:cleared', handleSelectionCleared);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricRef.current) return;
      const activeObj = fabricRef.current.getActiveObject();
      if (!activeObj) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          fabricRef.current.remove(activeObj);
          fabricRef.current.renderAll();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        // Copy handled by clipboard
      }
      if (e.key === 'ArrowUp' && activeObj) {
        activeObj.set('top', (activeObj.top ?? 0) - (e.shiftKey ? 10 : 1));
        fabricRef.current.renderAll();
      }
      if (e.key === 'ArrowDown' && activeObj) {
        activeObj.set('top', (activeObj.top ?? 0) + (e.shiftKey ? 10 : 1));
        fabricRef.current.renderAll();
      }
      if (e.key === 'ArrowLeft' && activeObj) {
        activeObj.set('left', (activeObj.left ?? 0) - (e.shiftKey ? 10 : 1));
        fabricRef.current.renderAll();
      }
      if (e.key === 'ArrowRight' && activeObj) {
        activeObj.set('left', (activeObj.left ?? 0) + (e.shiftKey ? 10 : 1));
        fabricRef.current.renderAll();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, []);

  // Update zoom
  useEffect(() => {
    if (!fabricRef.current) return;
    const scale = zoom / 100;
    fabricRef.current.setZoom(scale);
    fabricRef.current.setWidth(CANVAS_WIDTH * scale);
    fabricRef.current.setHeight(CANVAS_HEIGHT * scale);
    fabricRef.current.renderAll();
  }, [zoom]);

  function updateLayers() {
    if (!fabricRef.current) return;
    const objects = fabricRef.current.getObjects()
      .filter(obj => obj.name !== 'print-mask' && obj.name !== 'print-label')
      .map((obj, index) => ({
        id: obj.name || `layer-${index}`,
        type: obj.type === 'i-text' || obj.type === 'text' ? 'text' : obj.type === 'image' ? 'image' : 'shape',
        name: obj.name || `Layer ${index + 1}`,
        visible: obj.visible ?? true,
        locked: !obj.selectable,
      }));
    onLayersChange(objects);
  }

  function handleSelection() {
    // Handle selection updates
  }

  function handleSelectionCleared() {
    // Handle deselection
  }

  // Expose methods via ref
  useEffect(() => {
    // Add global helper functions for toolbar buttons
    (window as any).__fabricCanvas = fabricRef.current;

    (window as any).addText = () => {
      if (!fabricRef.current) return;
      const text = new fabric.IText('Your Text Here', {
        left: 150,
        top: 200,
        fontSize: 32,
        fill: '#000000',
        fontFamily: 'Arial',
        name: `text-${Date.now()}`,
      });
      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      text.enterEditing();
      fabricRef.current.renderAll();
    };

    (window as any).addImage = (url: string) => {
      if (!fabricRef.current) return;
      fabric.FabricImage.fromURL(url).then(img => {
        img.scaleToWidth(200);
        img.set({ left: 150, top: 150, name: `image-${Date.now()}` });
        fabricRef.current!.add(img);
        fabricRef.current!.setActiveObject(img);
        fabricRef.current!.renderAll();
      });
    };

    (window as any).addShape = (type: string) => {
      if (!fabricRef.current) return;
      let shape: fabric.Object;
      const opts = { left: 200, top: 200, fill: '#3b82f6', name: `shape-${Date.now()}` };

      if (type === 'rect') shape = new fabric.Rect({ ...opts, width: 100, height: 100 });
      else if (type === 'circle') shape = new fabric.Circle({ ...opts, radius: 50 });
      else if (type === 'triangle') shape = new fabric.Triangle({ ...opts, width: 100, height: 100 });
      else return;

      fabricRef.current.add(shape);
      fabricRef.current.setActiveObject(shape);
      fabricRef.current.renderAll();
    };

    (window as any).getCanvasJson = () => fabricRef.current?.toJSON();
    (window as any).getCanvasDataUrl = () => fabricRef.current?.toDataURL({ format: 'png', quality: 1 });
  }, []);

  return (
    <div className="relative shadow-2xl">
      {/* Canvas with product background */}
      <div
        className="relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='1'%3E%3Cpath d='M0 0h10v10H0zM10 10h10v10H10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <canvas ref={canvasEl} />
      </div>
    </div>
  );
}
