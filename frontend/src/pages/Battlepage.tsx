import React, { useState, useEffect } from 'react';
import { Code, Play, Send, Clock, User, Trophy, CheckCircle, XCircle, LoaderIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../libs/axios.ts';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '../store/Authstore.ts';
interface TestCase {
    input: string;
    output: string;
    passed?: boolean;
    actualOutput?: string;
}

interface StarterCode {
    language: string;
    code: string;
}

interface Question {
    _id: string; // MongoDB uses _id
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    description: string;
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    constraints: string[];
    starterCode: StarterCode[]; // Added this
    testCases: TestCase[];
}

const CodingBattlePage: React.FC = () => {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const { isCheckingAuth, Authuser } = useAuthStore();

    const [Problem, setProblem] = useState<Question | null>(null);


    const [language, setLanguage] = useState('javascript');
    const [Output, setOutput] = useState('');
    const [code, setCode] = useState(`function solution(nums, target) {
    // Write your code here
    
}`);
    const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');
    const [testResults, setTestResults] = useState<TestCase[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds


    const templates: Record<string, string> = {
        javascript: `function solution(input) {\n\n}`,
        python: `def solution(input):\n    pass`,
        java: `class Solution {\n    public static void solution() {\n    }\n}`,
        cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n}`
    };


    useEffect(() => {

        if (isCheckingAuth || !Authuser) return;
        const fetchBattleData = async () => {
            try {
                const response = await axiosInstance.post(`/battle/${sessionId}`, {}, { withCredentials: true });
                setProblem(response.data.problem);
                const starter = response.data.problem.starterCode.find((s: StarterCode) => s.language === language);
                if (starter) {
                    setCode(starter.code);
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchBattleData();
    }, [sessionId, isCheckingAuth, Authuser]);



    useEffect(() => {
        if (!sessionId) {
            navigate("/home");
        }
    }, []);



    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    if (isCheckingAuth || !Problem) {
        return <LoaderIcon className="animate-spin" />;
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRunCode = async () => {

        if (!Problem || !Problem._id) {
            console.error("Problem data not loaded yet");
            return;
        }
        try {
            setIsRunning(true);
            console.log("Sending ID:", Problem._id)
            const response = await axiosInstance.post("battle/run-code", {
                code,
                problemId: Problem._id,
                language: language
            }, { withCredentials: true });

            setTestResults(response.data.results);
        } catch (error) {
            console.error("Error running code:", error);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call to submit solution
        setTimeout(() => {
            console.log('Submitting code:', code);
            // Handle submission logic with your API
            setIsSubmitting(false);
        }, 2000);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return 'text-green-400';
            case 'MEDIUM': return 'text-yellow-400';
            case 'HARD': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-900 text-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                            <Code className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            CodeBattle
                        </span>
                    </div>
                    <div className="h-6 w-px bg-slate-600"></div>
                    <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className={`font-mono ${timeLeft < 300 ? 'text-red-400' : 'text-gray-300'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">You vs Friend</span>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center space-x-2">
                        <Trophy className="w-4 h-4" />
                        <span>View Leaderboard</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Question */}
                <div className="w-1/2 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-700">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 text-sm font-semibold transition ${activeTab === 'description'
                                ? 'text-white border-b-2 border-purple-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`px-6 py-3 text-sm font-semibold transition ${activeTab === 'submissions'
                                ? 'text-white border-b-2 border-purple-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Submissions
                        </button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {activeTab === 'description' && (
                            <>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">{Problem?.title}</h1>
                                    <span className={`text-sm font-semibold ${getDifficultyColor(Problem?.difficulty ?? '')}`}>
                                        {Problem?.difficulty}
                                    </span>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 whitespace-pre-line">{Problem?.description}</p>
                                </div>

                                <div className="space-y-4">
                                    {Problem?.examples.map((example, idx) => (
                                        <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                            <div className="font-semibold text-sm text-gray-400 mb-2">Example {idx + 1}:</div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-400">Input:</span>
                                                    <pre className="bg-slate-800 rounded p-2 mt-1 text-sm text-purple-300">{example.input}</pre>
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-400">Output:</span>
                                                    <pre className="bg-slate-800 rounded p-2 mt-1 text-sm text-green-300">{example.output}</pre>
                                                </div>
                                                {example.explanation && (
                                                    <div>
                                                        <span className="text-sm font-semibold text-gray-400">Explanation:</span>
                                                        <p className="text-sm text-gray-300 mt-1">{example.explanation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3">Constraints:</h3>
                                    <ul className="space-y-2">
                                        {Problem?.constraints.map((constraint, idx) => (
                                            <li key={idx} className="text-sm text-gray-300 flex items-start">
                                                <span className="text-purple-400 mr-2">•</span>
                                                <code className="bg-slate-900 px-2 py-0.5 rounded text-xs">{constraint}</code>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="text-center text-gray-400 py-12">
                                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No submissions yet. Submit your solution to see results!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-1/2 bg-slate-900 flex flex-col overflow-hidden">
                    {/* Editor Header */}
                    <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <select
                                value={language}
                                onChange={(e) => {
                                    const lang = e.target.value;
                                    setLanguage(lang);
                                    const starter = Problem?.starterCode.find((s: StarterCode) => s.language === lang);
                                    if (starter) {
                                        setCode(starter.code);
                                    }
                                    else {
                                        setCode("language not supported \n");
                                    }
                                }}
                                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-purple-500"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                {/* <option value="java">Java</option>
                                <option value="cpp">C++</option> */}
                            </select>
                        </div>
                        <div className="text-xs text-gray-400">
                            Auto-save enabled
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                        />

                    </div>

                    {/* Test Results Panel */}
                    {testResults.length > 0 && (
                        <div className="bg-slate-800 border-t border-slate-700 max-h-48 overflow-y-auto">
                            <div className="p-4 space-y-2">
                                <div className="font-semibold text-sm mb-3">Test Results:</div>
                                {testResults.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-start space-x-3 p-3 rounded-lg ${result.passed ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'
                                            }`}
                                    >
                                        {result.passed ? (
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 text-sm">
                                            <div className="font-semibold mb-1">Test Case {idx + 1}</div>
                                            <div className="text-gray-400">
                                                <span className="text-xs">Input: </span>
                                                <code className="text-purple-300">{result.input}</code>
                                            </div>
                                            <div className="text-gray-400">
                                                <span className="text-xs">Expected: </span>
                                                <code className="text-green-300">{result.output}</code>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="bg-slate-800 border-t border-slate-700 px-4 py-3 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            {testResults.length > 0 && (
                                <span>
                                    {testResults.filter(t => t.passed).length}/{testResults.length} tests passed
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play className="w-4 h-4" />
                                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-2 rounded-lg text-sm font-bold transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingBattlePage;