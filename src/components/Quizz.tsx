import {useState } from 'react';
import React from 'react';
import quizData from '../data/quizRickandMorty.json';
import Confetti from 'react-confetti'

export default function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const[isAnswerLocked, setIsAnswerLocked] = useState(false);
    const [delayDuration, setDelayDuration] = useState(1000);

   
    const handleAnswerClick = (option: string) => {
        if(isAnswerLocked) return;
        setSelectedAnswer(option);
        setIsAnswerLocked(true);
        const isCorrect = option === quizData.questions[currentQuestion].correctAnswer;
        if(isCorrect){
            setScore(score + 1);
            console.log(score)
        }
       
        setTimeout (() => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData.questions.length) {
            setCurrentQuestion(nextQuestion);
            setSelectedAnswer(null);
            setIsAnswerLocked(false);
        } else {
            setShowScore(true);
        }
    },delayDuration);
    
    };
    const getButtonClass = (option:string) =>{
        if(selectedAnswer === null ){
            return "bg-gray-700 text-white p-4 rounded-lg hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 "
        }
        if(option === quizData.questions[currentQuestion].correctAnswer ){
            return "bg-green-500 text-white p-4 rounded-lg transition-all duration-300";
        }
        if(selectedAnswer === option && option !== quizData.questions[currentQuestion].correctAnswer){
            return "bg-red-500 text-white p-4 rounded-lg transition-all duration-300"
        }

        return "bg-gray-700 text-white p-4 rounded-lg transition-all duration-300 opacity-50"
    }

    const resetQuiz = () => {
      setSelectedAnswer(null);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
    };
  
    return (
      <div className="w-full">
        {showScore ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center shadow-2xl">
            {score === quizData.questions.length && <Confetti />}
            <p className="text-2xl text-white mb-6">
              You scored {score} / {quizData.questions.length}
            </p>
    <a className='className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"' href='/PageQuiz'>Try Again
    </a>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-blue-400 text-xl">
                Question {currentQuestion + 1}/{quizData.questions.length}
              </span>
            </div>
            
            <div className="mb-8">
              <div className="flex flex-col items-center space-y-4">
                <img 
                  src={quizData.questions[currentQuestion].image}
                  alt="Question character"
                  className="w-48 h-48 rounded-full border-4 border-green-400 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-white text-center">
                  {quizData.questions[currentQuestion].question}
                </h2>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizData.questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerClick(
                    option)}
                  className={getButtonClass(option)}
                >
                  {option}
                </button>

            
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
