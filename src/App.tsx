import React from 'react';
import JoggingSimulation from './components/JoggingSimulation';
import JoggingFlowchart from './components/JoggingFlowchart';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="bg-slate-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Jogging Simulation
              </h1>
              <p className="text-slate-400 text-sm mt-1">Interactive Human Locomotion Visualizer</p>
            </div>
            <div className="hidden md:block">
              <span className="px-3 py-1 bg-indigo-600 rounded-full text-xs font-semibold uppercase tracking-wider">v1.2.0</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 space-y-16">

        {/* Interactive Simulation Section */}
        <section>
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-800">Interactive Simulation</h2>
          </div>
          <JoggingSimulation />
        </section>

        <hr className="border-slate-200" />

        {/* Flowchart Section */}
        <section>
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-8 w-1 bg-emerald-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-slate-800">Movement Mechanics</h2>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <JoggingFlowchart />
          </div>
        </section>

        {/* Theory Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
            <h3 className="text-xl font-bold mb-4 text-indigo-900 flex items-center">
              <span className="bg-indigo-200 p-2 rounded-lg mr-3">🦵</span>
              Lower Body Mechanics
            </h3>
            <ul className="space-y-3">
              {['Alternating leg movements', 'Push-off phase efficiency', 'Flight phase stability', 'Soft landing absorption'].map((item, i) => (
                <li key={i} className="flex items-center text-indigo-800">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <h3 className="text-xl font-bold mb-4 text-emerald-900 flex items-center">
              <span className="bg-emerald-200 p-2 rounded-lg mr-3">💪</span>
              Upper Body Coordination
            </h3>
            <ul className="space-y-3">
              {['Counter-balance arm swing', 'Torso anti-rotation', 'Upright posture maintenance', 'Gaze stability'].map((item, i) => (
                <li key={i} className="flex items-center text-emerald-800">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Human Locomotion Project. Built with React & TypeScript.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;