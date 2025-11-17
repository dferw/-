import React, { useState, useCallback } from 'react';
import Wizard from './components/Wizard';
import ResultsDisplay from './components/ResultsDisplay';
import { getMenuRecommendation } from './services/geminiService';
import type { FormData, GeminiResponse } from './types';

const Header = () => (
  <header className="absolute top-0 left-0 right-0 p-4 z-10">
    <div className="container mx-auto flex justify-center md:justify-start">
      <h1 className="text-2xl font-bold text-white font-orbitron tracking-widest text-shadow-glow">
        오늘뭐<span className="text-cyan-400">먹지?</span>
      </h1>
    </div>
  </header>
);

const Footer = () => (
  <footer className="w-full text-center p-4 mt-8">
    <p className="text-gray-500 text-sm">AI가 추천하는 우리 가족 외식 메뉴</p>
  </footer>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center text-center text-white">
      <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-2 border-2 border-pink-500 rounded-full animate-ping"></div>
      </div>
      <h2 className="text-2xl font-orbitron mb-2 tracking-wider">메뉴 생성 중...</h2>
      <p className="text-gray-400">AI가 최고의 메뉴를 분석하고 있습니다!</p>
  </div>
);


function App() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [results, setResults] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: FormData) => {
    setFormData(data);
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await getMenuRecommendation(data);
      setResults(response);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setFormData(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="text-center text-white bg-red-900/50 border border-red-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4 font-orbitron">추천 생성 오류</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 font-bold text-black bg-cyan-400 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.6)] hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300"
          >
            다시 시도
          </button>
        </div>
      );
    }
    if (results) {
      return <ResultsDisplay results={results} onReset={handleReset} />;
    }
    return (
        <>
            <div className="text-center mb-8 md:mb-12 text-white">
                <h1 className="text-4xl md:text-6xl font-black mb-3 font-orbitron drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    더 이상 저녁 메뉴로 고민하지 마세요
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    몇 가지 질문에 답하고 AI 셰프에게 완벽한 가족 메뉴를 추천 받으세요.
                </p>
            </div>
            <Wizard onSubmit={handleSubmit} />
        </>
    );
  };


  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: "url('https://picsum.photos/seed/familydinner/1920/1080')" }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4 pt-24 pb-12">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;