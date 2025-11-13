
import React, { useState } from 'react';
import type { FormData } from '../types';

interface WizardProps {
  onSubmit: (formData: FormData) => void;
}

const wizardSteps = [
  { id: 1, title: "인원" },
  { id: 2, title: "음식 종류" },
  { id: 3, title: "고려사항" },
  { id: 4, title: "분위기" },
];

const options = {
  members: ["성인", "어린이", "청소년", "어르신"],
  cuisines: ["한식", "중식", "일식", "양식", "아시안", "분식", "패스트푸드", "아무거나!"],
  restrictions: ["채식", "비건", "글루텐-프리", "유제품-프리", "견과류 알러지", "저탄수화물"],
  occasions: ["평범한 저녁", "특별한 기념일", "빠르고 간편하게", "건강하고 가볍게", "새로운 맛 탐험"],
};

const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-8">
        {wizardSteps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.id ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.8)]' : 'bg-gray-800 border-gray-600'}`}>
                    <span className={`text-lg md:text-xl font-bold font-orbitron ${currentStep >= step.id ? 'text-black' : 'text-gray-400'}`}>{step.id}</span>
                </div>
                <p className={`mt-2 text-xs md:text-sm font-semibold transition-colors duration-300 ${currentStep >= step.id ? 'text-cyan-400' : 'text-gray-500'}`}>{step.title}</p>
            </div>
        ))}
    </div>
);


const Wizard: React.FC<WizardProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    members: [],
    cuisines: [],
    restrictions: [],
    occasion: "",
  });

  const handleMultiSelect = (category: 'members' | 'cuisines' | 'restrictions', value: string) => {
    setFormData(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return { ...prev, [category]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentValues, value] };
      }
    });
  };

  const handleSingleSelect = (value: string) => {
    setFormData(prev => ({ ...prev, occasion: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, wizardSteps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const isNextDisabled = () => {
      switch(currentStep) {
          case 1: return formData.members.length === 0;
          case 2: return formData.cuisines.length === 0;
          case 4: return formData.occasion === "";
          default: return false;
      }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MultiSelectStep title="누구와 함께 식사하시나요?" options={options.members} selected={formData.members} onSelect={(val) => handleMultiSelect('members', val)} />;
      case 2:
        return <MultiSelectStep title="어떤 종류의 음식을 원하세요?" options={options.cuisines} selected={formData.cuisines} onSelect={(val) => handleMultiSelect('cuisines', val)} />;
      case 3:
        return <MultiSelectStep title="특별히 고려할 점이 있나요? (선택)" options={options.restrictions} selected={formData.restrictions} onSelect={(val) => handleMultiSelect('restrictions', val)} />;
      case 4:
        return <SingleSelectStep title="어떤 분위기의 식사를 원하세요?" options={options.occasions} selected={formData.occasion} onSelect={handleSingleSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-black/40 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl shadow-black/50">
      <StepIndicator currentStep={currentStep} />
      <div className="min-h-[250px] md:min-h-[300px] flex flex-col justify-center">
        {renderStepContent()}
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 font-bold text-gray-400 transition-colors duration-300 rounded-lg hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft /> 이전
        </button>
        {currentStep < wizardSteps.length ? (
          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className="flex items-center gap-2 px-6 py-3 font-bold text-black bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none"
          >
            다음 <ChevronRight />
          </button>
        ) : (
          <button
            onClick={() => onSubmit(formData)}
            disabled={isNextDisabled()}
            className="px-6 py-3 font-bold text-black bg-pink-500 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.6)] hover:bg-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none font-orbitron tracking-wider"
          >
            추천 받기!
          </button>
        )}
      </div>
    </div>
  );
};


interface StepProps<T> {
    title: string;
    options: string[];
    selected: T;
    onSelect: (value: string) => void;
}

const MultiSelectStep: React.FC<StepProps<string[]>> = ({ title, options, selected, onSelect }) => (
    <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-orbitron">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onSelect(opt)}
                    className={`px-4 py-2 text-sm md:text-base border-2 rounded-full transition-all duration-300 font-semibold ${selected.includes(opt) ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.7)]' : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

const SingleSelectStep: React.FC<StepProps<string>> = ({ title, options, selected, onSelect }) => (
    <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-orbitron">{title}</h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onSelect(opt)}
                    className={`px-4 py-2 text-sm md:text-base border-2 rounded-full transition-all duration-300 font-semibold ${selected === opt ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.7)]' : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default Wizard;