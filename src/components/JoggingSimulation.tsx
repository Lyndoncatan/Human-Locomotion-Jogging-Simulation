import React, { useEffect, useRef, useState } from 'react';
import { Sliders, Play, Pause, RotateCcw, Footprints, Route, Weight } from 'lucide-react';

const JoggingSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [bounceHeight, setBounceHeight] = useState(10);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weight, setWeight] = useState(150); // Default weight in lbs
  
  // Initialize stick figure state
  const figure = {
    head: { x: 0, y: 0, radius: 15 },
    torso: { length: 50 },
    legs: {
      left: { angle: 0, length: 40 },
      right: { angle: Math.PI, length: 40 }
    },
    arms: {
      left: { angle: Math.PI / 4, length: 30 },
      right: { angle: -Math.PI / 4, length: 30 }
    }
  };

  // Building properties
  const buildings = Array.from({ length: 5 }, () => ({
    height: Math.random() * 100 + 100,
    width: Math.random() * 30 + 40,
    windows: Math.floor(Math.random() * 4) + 3
  }));

  // Calculate fitness metrics
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Update steps (2 steps per second at normal speed)
        setSteps(prev => prev + speed * 2);
        
        // Update distance (average stride length is about 2.5 feet)
        // Convert to miles (5280 feet per mile)
        const distanceInFeet = steps * 2.5;
        setDistance(distanceInFeet / 5280);
        
        // Calculate calories burned
        // Using rough estimate: calories/minute = (0.0175 × MET × weight in kg × minutes)
        // Jogging MET value ≈ 7
        const weightInKg = weight * 0.453592;
        const minutesElapsed = steps / (120 * speed); // 120 steps per minute at normal speed
        const caloriesBurned = 0.0175 * 7 * weightInKg * minutesElapsed;
        setCalories(Math.round(caloriesBurned));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, steps, weight]);

  const drawBackground = (ctx: CanvasRenderingContext2D, offset: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Draw buildings
    buildings.forEach((building, index) => {
      const x = ((index * 150 + offset) % (width + 300)) - 100;
      const y = height * 0.6 - building.height;

      // Building body
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, y, building.width, building.height);

      // Windows
      const windowSize = 10;
      const windowGap = 15;
      const windowRows = Math.floor(building.height / windowGap) - 1;

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < building.windows; col++) {
          const windowX = x + (col + 1) * windowGap;
          const windowY = y + (row + 1) * windowGap;
          
          if (windowX + windowSize < x + building.width && windowY + windowSize < y + building.height) {
            ctx.fillStyle = Math.random() > 0.3 ? '#FFEB3B' : '#666';
            ctx.fillRect(windowX, windowY, windowSize, windowSize);
          }
        }
      }
    });

    // Draw road
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, height * 0.6, width, height * 0.4);

    // Draw road markings
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 20]);
    ctx.beginPath();
    ctx.moveTo(0, height * 0.8);
    ctx.lineTo(width, height * 0.8);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawStickFigure = (ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height * 0.7;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawBackground(ctx, time * speed * 50);
    
    const frequency = speed;
    const amplitude = Math.PI / 4;
    const bounce = Math.sin(time * frequency * 2) * bounceHeight;
    const legAngle = Math.sin(time * frequency) * amplitude;
    const armAngle = -Math.sin(time * frequency) * amplitude;
    
    // Draw shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 80, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
    
    const figureY = centerY + bounce;
    
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';
    
    // Draw head
    ctx.beginPath();
    ctx.arc(centerX, figureY - 65, figure.head.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw face features
    ctx.beginPath();
    ctx.arc(centerX - 5, figureY - 70, 2, 0, Math.PI * 2);
    ctx.arc(centerX + 5, figureY - 70, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#2563eb';
    ctx.fill();
    
    // Draw smile
    ctx.beginPath();
    ctx.arc(centerX, figureY - 65, 8, 0, Math.PI);
    ctx.stroke();
    
    // Draw torso
    ctx.beginPath();
    ctx.moveTo(centerX, figureY - 50);
    ctx.lineTo(centerX, figureY);
    ctx.stroke();
    
    // Draw legs with gradient
    const gradient = ctx.createLinearGradient(0, figureY, 0, figureY + 100);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#1e40af');
    ctx.strokeStyle = gradient;
    
    ctx.beginPath();
    ctx.moveTo(centerX, figureY);
    ctx.lineTo(
      centerX + Math.sin(legAngle) * figure.legs.left.length,
      figureY + Math.cos(legAngle) * figure.legs.left.length
    );
    ctx.moveTo(centerX, figureY);
    ctx.lineTo(
      centerX + Math.sin(-legAngle) * figure.legs.right.length,
      figureY + Math.cos(-legAngle) * figure.legs.right.length
    );
    ctx.stroke();
    
    ctx.strokeStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(centerX, figureY - 40);
    ctx.lineTo(
      centerX + Math.sin(armAngle) * figure.arms.left.length,
      figureY - 40 + Math.cos(armAngle) * figure.arms.left.length
    );
    ctx.moveTo(centerX, figureY - 40);
    ctx.lineTo(
      centerX + Math.sin(-armAngle) * figure.arms.right.length,
      figureY - 40 + Math.cos(-armAngle) * figure.arms.right.length
    );
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      
      if (isPlaying) {
        drawStickFigure(ctx, elapsed);
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, bounceHeight]);

  const handleReset = () => {
    setSpeed(5);
    setBounceHeight(10);
    setIsPlaying(true);
    setSteps(0);
    setDistance(0);
    setCalories(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-gray-200 rounded-lg"
        />
        
        {/* Fitness Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <Footprints className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Steps</p>
              <p className="text-xl font-semibold">{Math.floor(steps).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <Route className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-xl font-semibold">{distance.toFixed(2)} mi</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <Weight className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                className="w-20 text-xl font-semibold bg-transparent"
              /> lbs
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            <Sliders className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Calories</p>
              <p className="text-xl font-semibold">{calories}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speed: {speed}x
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bounce Height: {bounceHeight}px
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={bounceHeight}
                onChange={(e) => setBounceHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoggingSimulation;