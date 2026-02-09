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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
  const buildings = useRef(Array.from({ length: 8 }, () => ({
    height: Math.random() * 150 + 100,
    width: Math.random() * 40 + 50,
    windows: Math.floor(Math.random() * 4) + 3,
    color: Math.random() > 0.5 ? '#334155' : '#475569'
  }))).current;

  // Calculate fitness metrics
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        // Update steps (2 steps per second at normal speed)
        setSteps(prev => prev + speed * 0.4);
        
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
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, steps, weight]);

  const drawBackground = (ctx: CanvasRenderingContext2D, offset: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    if (theme === 'light') {
        skyGradient.addColorStop(0, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
    } else {
        skyGradient.addColorStop(0, '#0f172a'); // Slate 900
        skyGradient.addColorStop(1, '#312e81'); // Indigo 900
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Draw Moon/Sun
    ctx.beginPath();
    if (theme === 'light') {
        ctx.fillStyle = '#FDB813'; // Sun yellow
        ctx.arc(width - 100, 80, 40, 0, Math.PI * 2);
    } else {
        ctx.fillStyle = '#F4F4F5'; // Moon white
        ctx.arc(width - 100, 80, 30, 0, Math.PI * 2);
    }
    ctx.fill();


    // Draw buildings relative to scroll
    buildings.forEach((building, index) => {
      const spacing = 200;
      // Calculate position with parallax scrolling
      const x = ((index * spacing + offset) % (width + spacing * 2)) - spacing;
      const y = height * 0.6 - building.height;

      // Building body
      ctx.fillStyle = theme === 'light' ? building.color : '#1e293b'; // Darker buildings in dark mode
      ctx.fillRect(x, y, building.width, building.height);
      
      // Building border
      ctx.lineWidth = 1;
      ctx.strokeStyle = theme === 'dark' ? '#334155' : 'transparent';
      ctx.strokeRect(x, y, building.width, building.height);

      // Windows
      const windowSize = 10;
      const windowGap = 15;
      const windowRows = Math.floor(building.height / windowGap) - 1;

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < building.windows; col++) {
          const windowX = x + (col + 1) * windowGap;
          const windowY = y + (row + 1) * windowGap;
          
          if (windowX + windowSize < x + building.width && windowY + windowSize < y + building.height) {
            // Randomly lit windows
            const isLit = (Math.sin(index * 13 + row * 7 + col * 3) + 1) / 2 > 0.4;
            
            if (theme === 'light') {
                 ctx.fillStyle = '#94a3b8'; // Unlit by default in day (reflection)
                 if (isLit) ctx.fillStyle = '#bae6fd'; // Sky reflection
            } else {
                ctx.fillStyle = isLit ? '#fbbf24' : '#0f172a'; // Yellow light or dark in night
            }
            
            ctx.fillRect(windowX, windowY, windowSize, windowSize);
          }
        }
      }
    });

    // Draw road
    const roadGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
    roadGradient.addColorStop(0, '#334155');
    roadGradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, height * 0.6, width, height * 0.4);

    // Draw road markings
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.setLineDash([40, 40]);
    // Animate markings by adding offset to lineDashOffset (scrolling effect)
    ctx.lineDashOffset = -offset; 

    ctx.beginPath();
    // Perspective lines
    // Bottom lane
    ctx.moveTo(0, height * 0.85);
    ctx.lineTo(width, height * 0.85);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  };

  const drawStickFigure = (ctx: CanvasRenderingContext2D, time: number) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height * 0.75;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Background moves opposite to running direction
    drawBackground(ctx, -time * speed * 30);
    
    const frequency = speed * 1.5;
    const amplitude = Math.PI / 4;
    const bounce = Math.sin(time * frequency * 2) * bounceHeight;
    const legAngle = Math.sin(time * frequency) * amplitude;
    const armAngle = -Math.sin(time * frequency) * amplitude;
    
    // Draw shadow
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 65, 20 + Math.abs(bounce/2), 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
    
    const figureY = centerY + bounce;
    
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Stick Figure Colors
    const figureColor = theme === 'dark' ? '#60a5fa' : '#2563eb'; // Lighter blue in dark mode
    const limbColor = theme === 'dark' ? '#93c5fd' : '#1d4ed8';

    // Draw Head
    ctx.strokeStyle = figureColor;
    ctx.fillStyle = figureColor;
    ctx.beginPath();
    ctx.arc(centerX, figureY - 65, figure.head.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw Torso
    ctx.beginPath();
    ctx.moveTo(centerX, figureY - 50);
    ctx.lineTo(centerX, figureY);
    ctx.stroke();
    
    // Draw Legs
    ctx.strokeStyle = limbColor;
    // Right Leg (Back)
    ctx.beginPath();
    ctx.moveTo(centerX, figureY);
    ctx.lineTo(
      centerX + Math.sin(-legAngle) * figure.legs.right.length,
      figureY + Math.cos(-legAngle) * figure.legs.right.length
    );
     // Right Knee to Foot
    ctx.lineTo(
        centerX + Math.sin(-legAngle) * figure.legs.right.length + Math.sin(-legAngle - 0.2) * 35,
        figureY + Math.cos(-legAngle) * figure.legs.right.length + Math.cos(-legAngle - 0.2) * 35
    );
    ctx.stroke();

     // Left Leg (Front)
    ctx.strokeStyle = figureColor; 
    ctx.beginPath();
    ctx.moveTo(centerX, figureY);
    ctx.lineTo(
      centerX + Math.sin(legAngle) * figure.legs.left.length,
      figureY + Math.cos(legAngle) * figure.legs.left.length
    );
    // Left Knee to Foot
     ctx.lineTo(
        centerX + Math.sin(legAngle) * figure.legs.left.length + Math.sin(legAngle - 0.4) * 35,
        figureY + Math.cos(legAngle) * figure.legs.left.length + Math.cos(legAngle - 0.4) * 35
    );
    ctx.stroke();
    
    // Draw Arms
    ctx.strokeStyle = limbColor; // Back Arm
    ctx.beginPath();
    ctx.moveTo(centerX, figureY - 45); // Shoulder
    ctx.lineTo(
      centerX + Math.sin(-armAngle) * figure.arms.right.length,
      figureY - 45 + Math.cos(-armAngle) * figure.arms.right.length
    );
     // Elbow to Hand
    ctx.lineTo(
      centerX + Math.sin(-armAngle) * figure.arms.right.length + Math.sin(-armAngle + 1) * 25,
      figureY - 45 + Math.cos(-armAngle) * figure.arms.right.length + Math.cos(-armAngle + 1) * 25
    );
    ctx.stroke();

    ctx.strokeStyle = figureColor; // Front Arm
    ctx.beginPath();
    ctx.moveTo(centerX, figureY - 45); // Shoulder
    ctx.lineTo(
      centerX + Math.sin(armAngle) * figure.arms.left.length,
      figureY - 45 + Math.cos(armAngle) * figure.arms.left.length
    );
     // Elbow to Hand
    ctx.lineTo(
      centerX + Math.sin(armAngle) * figure.arms.left.length + Math.sin(armAngle + 1) * 25,
      figureY - 45 + Math.cos(armAngle) * figure.arms.left.length + Math.cos(armAngle + 1) * 25
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
      } else {
         // Keep drawing static frame if paused
         drawStickFigure(ctx, 0); 
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, bounceHeight, theme]);

  const handleReset = () => {
    setSpeed(5);
    setBounceHeight(10);
    setIsPlaying(true);
    setSteps(0);
    setDistance(0);
    setCalories(0);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900/50 p-4 rounded-xl' : ''}`}>
      <div className={`p-6 rounded-lg shadow-md transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
        
        {/* Theme Toggle & Canvas Header */}
        <div className="flex justify-between items-center mb-4">
             <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Visualizer
             </h3>
             <div className="flex bg-gray-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                <div className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${theme === 'light' ? 'bg-white shadow text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Light City</div>
                <div className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${theme === 'dark' ? 'bg-indigo-600 shadow text-white' : 'text-gray-500'}`}>Dark City</div>
             </div>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className={`w-full border rounded-lg shadow-inner ${theme === 'dark' ? 'border-slate-600' : 'border-gray-200'}`}
        />
        
        {/* Fitness Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-blue-50 text-gray-800'} p-4 rounded-lg flex items-center space-x-3 shadow-sm transition-colors`}>
            <Footprints className="text-blue-500" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Steps</p>
              <p className="text-xl font-bold font-mono">{Math.floor(steps).toLocaleString()}</p>
            </div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-blue-50 text-gray-800'} p-4 rounded-lg flex items-center space-x-3 shadow-sm transition-colors`}>
            <Route className="text-green-500" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Distance</p>
              <p className="text-xl font-bold font-mono">{distance.toFixed(2)} <span className="text-sm font-normal">mi</span></p>
            </div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-blue-50 text-gray-800'} p-4 rounded-lg flex items-center space-x-3 shadow-sm transition-colors`}>
            <Weight className="text-orange-500" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Weight</p>
              <div className="flex items-baseline">
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                    className="w-16 text-xl font-bold font-mono bg-transparent outline-none border-b border-transparent focus:border-blue-500"
                /> 
                <span className="text-sm">lbs</span>
              </div>
            </div>
          </div>
          
          <div className={`${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-blue-50 text-gray-800'} p-4 rounded-lg flex items-center space-x-3 shadow-sm transition-colors`}>
            <Sliders className="text-red-500" />
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Calories</p>
              <p className="text-xl font-bold font-mono">{calories}</p>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className={`mt-6 p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-750' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-4 rounded-full shadow-lg transform active:scale-95 transition-all ${
                    theme === 'dark' 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                    : 'bg-white hover:bg-gray-50 text-blue-600 border border-gray-100'
                }`}
              >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
              </button>
              <button
                onClick={handleReset}
                className={`p-4 rounded-full shadow-lg transform active:scale-95 transition-all ${
                    theme === 'dark' 
                    ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                    : 'bg-white hover:bg-gray-50 text-gray-500 border border-gray-100'
                }`}
                title="Reset Simulation"
              >
                <RotateCcw size={24} />
              </button>
            </div>
            
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <div className="flex justify-between">
                         <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Speed
                        </label>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-slate-900 text-indigo-400' : 'bg-blue-100 text-blue-700'}`}>
                            {speed}x
                        </span>
                    </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-slate-600 accent-indigo-500"
                  />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between">
                         <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Bounce
                        </label>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-slate-900 text-indigo-400' : 'bg-blue-100 text-blue-700'}`}>
                            {bounceHeight}px
                        </span>
                    </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={bounceHeight}
                    onChange={(e) => setBounceHeight(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-slate-600 accent-indigo-500"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoggingSimulation;