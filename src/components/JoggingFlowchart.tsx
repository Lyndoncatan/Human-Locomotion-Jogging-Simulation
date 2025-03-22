import React from 'react';

const JoggingFlowchart: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div className="flex flex-col items-center space-y-8">
        {/* Flowchart nodes and connections */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            Initial Position
          </div>
          <div className="h-8 w-0.5 bg-gray-400"></div>
        </div>
        
        <div className="flex justify-center space-x-32">
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              Left Leg Forward
              Right Arm Forward
            </div>
            <div className="h-8 w-0.5 bg-gray-400"></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              Right Leg Forward
              Left Arm Forward
            </div>
            <div className="h-8 w-0.5 bg-gray-400"></div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
            Push Off Ground
          </div>
          <div className="h-8 w-0.5 bg-gray-400"></div>
        </div>
        
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          Airborne Phase
        </div>
        
        <div className="flex justify-center w-full">
          <div className="border-2 border-red-500 p-4 rounded-lg">
            <p className="font-semibold">Cycle Repeats:</p>
            <ul className="list-disc list-inside">
              <li>Alternating leg movements</li>
              <li>Opposite arm swing</li>
              <li>Maintain rhythm</li>
              <li>Forward momentum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoggingFlowchart;