import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Undo2 } from "lucide-react";

interface SignatureCanvasProps {
  onSignatureChange: (signature: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function SignatureCanvas({
  onSignatureChange,
  width = 400,
  height = 150,
  className = "",
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up canvas for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Set drawing styles
    ctx.strokeStyle = "#1a365d";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const getCoordinates = useCallback(
    (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const coords = getCoordinates(e);
      if (!coords) return;

      setIsDrawing(true);
      lastPointRef.current = coords;
    },
    [getCoordinates]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const coords = getCoordinates(e);
      if (!coords || !lastPointRef.current) return;

      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      lastPointRef.current = coords;
      
      // Mark as having signature immediately
      if (!hasSignature) {
        setHasSignature(true);
      }
    },
    [isDrawing, getCoordinates, hasSignature]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
    
    // Export signature after a short delay to ensure drawing is complete
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataUrl = canvas.toDataURL("image/png");
        onSignatureChange(dataUrl);
      }
    }, 50);
  }, [hasSignature, onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear the canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // Reset state
    setHasSignature(false);
    lastPointRef.current = null;
    
    // Notify parent that signature is cleared
    onSignatureChange(null);
  }, [width, height, onSignatureChange]);

  const drawTestSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas first
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw a test signature
    ctx.strokeStyle = "#1a365d";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw initials "AO" as a test signature
    ctx.beginPath();
    ctx.moveTo(30, 50);
    ctx.lineTo(30, 120);
    ctx.lineTo(70, 50);
    ctx.lineTo(70, 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.arc(115, 85, 35, 0, Math.PI * 2);
    ctx.stroke();

    // Mark as having signature
    setHasSignature(true);
    
    // Export signature
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      onSignatureChange(dataUrl);
    }, 50);
  }, [width, height, onSignatureChange]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative border-2 border-dashed border-primary/30 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="signature-canvas block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/50">
            <span className="text-sm">Sign here with mouse or touch</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={!hasSignature}
          className="flex items-center gap-1"
        >
          <Eraser className="h-4 w-4" />
          Clear Signature
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={drawTestSignature}
          className="flex items-center gap-1 text-xs"
        >
          Test Signature
        </Button>
        {hasSignature && (
          <div className="text-xs text-green-600 flex items-center">
            ✓ Signature captured
          </div>
        )}
      </div>
    </div>
  );
}
