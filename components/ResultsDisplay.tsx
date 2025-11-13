
import React from 'react';
import type { GeminiResponse, Recommendation } from '../types';

interface ResultsDisplayProps {
  results: GeminiResponse;
  onReset: () => void;
}

const DishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0c-.454-.303-.977-.454-1.5-.454V12.5a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v3.046zM12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
);

const PeopleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);


const RecommendationCard: React.FC<{ recommendation: Recommendation, index: number }> = ({ recommendation, index }) => {
    const accentColor = ['border-pink-500', 'border-cyan-500', 'border-purple-500'][index % 3];
    const shadowColor = ['shadow-pink-500/30', 'shadow-cyan-500/30', 'shadow-purple-500/30'][index % 3];

    return (
        <div className={`bg-gray-900/50 backdrop-blur-md border-l-4 ${accentColor} rounded-lg p-6 mb-8 shadow-lg hover:${shadowColor} transition-shadow duration-300`}>
            <h2 className="text-3xl font-bold mb-2 font-orbitron text-white">{recommendation.restaurantType}</h2>
            <p className="text-gray-400 italic mb-4">"{recommendation.atmosphere}"</p>
            
            <p className="text-gray-300 mb-6">{recommendation.reasoning}</p>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center"><PeopleIcon />어른 추천 메뉴</h3>
                    <ul className="space-y-2">
                        {recommendation.adultMenu.map((item, i) => (
                            <li key={i} className="text-gray-300 bg-gray-800/40 p-2 rounded-md">{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-pink-400 mb-3 flex items-center"><DishIcon />아이 추천 메뉴</h3>
                     <ul className="space-y-2">
                        {recommendation.kidMenu.map((item, i) => (
                            <li key={i} className="text-gray-300 bg-gray-800/40 p-2 rounded-md">{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-orbitron tracking-wide">추천 메뉴가 도착했어요!</h1>
        <p className="text-gray-400 text-lg">당신의 가족을 위해 AI가 추천하는 세 가지 맞춤 메뉴입니다.</p>
      </div>

      <div>
        {results.recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} index={index} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onReset}
          className="px-8 py-4 font-bold text-black bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300 font-orbitron tracking-wider"
        >
          새로 추천받기
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;