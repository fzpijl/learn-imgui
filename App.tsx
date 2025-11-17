
import React, { useState, useEffect } from 'react';
import { InstructionStepData } from './types';
import { fetchImGuiGuide } from './services/geminiService';
import Header from './components/Header';
import InstructionStep from './components/InstructionStep';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [steps, setSteps] = useState<InstructionStepData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const guideSteps = await fetchImGuiGuide();
        setSteps(guideSteps);
      } catch (err) {
        if (err instanceof Error) {
            setError(`Failed to generate guide: ${err.message}. Please check your Gemini API key and try again.`);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGuide();
  }, []);

  const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg text-gray-300">Generating your ImGui on WSL guide with Gemini...</p>
        <p className="text-sm text-gray-500">This may take a moment.</p>
    </div>
  );

  const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center text-center p-8">
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg max-w-lg" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{message}</span>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        {!isLoading && !error && (
          <div className="space-y-12">
            {steps.map((step, index) => (
              <InstructionStep key={index} step={step} index={index + 1} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
