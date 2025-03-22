import React from 'react';
import JoggingSimulation from './components/JoggingSimulation';
import JoggingFlowchart from './components/JoggingFlowchart';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-900">
          Human Locomotion: Jogging Simulation
        </h1>
        
        <div className="grid grid-cols-1 gap-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Interactive Simulation</h2>
            <JoggingSimulation />
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Jogging Movement Flowchart</h2>
            <JoggingFlowchart />
          </section>
          
          <section className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">Key Components of Jogging Motion</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-blue-900">Lower Body</h3>
                <ul className="list-disc list-inside space-y-3 text-blue-800">
                  <li>Alternating leg movements</li>
                  <li>Push-off phase</li>
                  <li>Flight phase</li>
                  <li>Landing phase</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-blue-900">Upper Body</h3>
                <ul className="list-disc list-inside space-y-3 text-blue-800">
                  <li>Arm swing coordination</li>
                  <li>Torso rotation</li>
                  <li>Posture maintenance</li>
                  <li>Head stability</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;