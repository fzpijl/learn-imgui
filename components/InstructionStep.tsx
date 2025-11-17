
import React from 'react';
import { InstructionStepData } from '../types';
import CodeBlock from './CodeBlock';

interface InstructionStepProps {
  step: InstructionStepData;
  index: number;
}

const InstructionStep: React.FC<InstructionStepProps> = ({ step, index }) => {
    // Function to parse the description and style backticked text
    const formatDescription = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <code key={i} className="bg-gray-700/50 text-cyan-300 font-mono py-0.5 px-1.5 rounded-md text-sm">
                        {part.slice(1, -1)}
                    </code>
                );
            }
            return part;
        });
    };


  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 shadow-lg">
        {index}
      </div>
      <div className="flex-1 w-full">
        <h2 className="text-2xl font-semibold text-cyan-200 mb-3">{step.title}</h2>
        <p className="text-gray-300 leading-relaxed mb-4">
            {formatDescription(step.description)}
        </p>
        {step.code && step.language && (
          <CodeBlock code={step.code} language={step.language} />
        )}
      </div>
    </div>
  );
};

export default InstructionStep;
