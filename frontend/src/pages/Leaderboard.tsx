import React, { useState, useEffect } from 'react';
import { Code, Trophy, Clock, CheckCircle, XCircle, Award, Star, Home, RotateCcw } from 'lucide-react';
import axiosInstance from '../libs/axios.ts';
import { useParams } from 'react-router';
interface PlayerResult {
  username: string;
  avatar?: string;
  timeTaken: number; // in seconds
  testsPassed: number;
  totalTests: number;
  submissionTime: string;
  code: string;
  language: string;
}

interface LeaderboardData {
  sessionId: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  players: PlayerResult[];
  winner?: string;
}

const LeaderboardPage: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { sessionId } = useParams();

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);

  useEffect(() => {

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    const fetchLeaderboard = async () => {
      const response = await axiosInstance.get(`/leaderboard/${sessionId}`);
      const data = response.data;

      const uiPlayers = data.players.map((p: any) => ({
        username: `Player ${p.userId.slice(-4)}`,
        timeTaken: p.timeTaken,
        testsPassed: p.testsPassed,
        totalTests: p.totalTests,
        submissionTime: new Date(p.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        code: p.code,
      }));

      uiPlayers.sort((a: any, b: any) => {
        if (b.testsPassed !== a.testsPassed) return b.testsPassed - a.testsPassed;
        return a.timeTaken - b.timeTaken;
      });

      setLeaderboardData({
        sessionId: data.sessionId,
        problemTitle: "Two Sum",
        difficulty: data.difficulty, // "easy"
        players: uiPlayers,
        winner: uiPlayers[0].testsPassed > 0 ? uiPlayers[0].username : undefined
      });

    }
    fetchLeaderboard();

  }, [sessionId]);



  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`; // Shows "26s"
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`; // Shows "1m 10s"
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400';
    }
  };

  if (!leaderboardData) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }



  const sortedPlayers = leaderboardData.players;


  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Star className={`w-4 h-4 ${i % 3 === 0 ? 'text-purple-400' : i % 3 === 1 ? 'text-pink-400' : 'text-yellow-400'}`} />
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 bg-slate-800/50 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Code className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CodeBattle
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              <RotateCcw className="w-4 h-4" />
              <span>New Battle</span>
            </button>
            <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 overflow-y-auto h-[calc(100vh-80px)]">
        {/* Battle Complete Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 bg-purple-500/20 border border-purple-500/50 px-6 py-2 rounded-full mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-yellow-400">Battle Complete!</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Results
            </span>
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-300">
            <span className="text-lg">{leaderboardData.problemTitle}</span>
            <span className="text-gray-500">•</span>
            <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${getDifficultyColor(leaderboardData.difficulty)}`}>
              {leaderboardData.difficulty}
            </span>
          </div>
        </div>

        {/* Winner Announcement */}
        {leaderboardData.winner && (
          <div className="mb-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/50 rounded-2xl p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">🎉 Winner: {leaderboardData.winner} 🎉</h2>
            <p className="text-gray-300">Congratulations on your victory!</p>
          </div>
        )}

        {/* Leaderboard Cards */}
        <div className="space-y-6">
          {sortedPlayers.map((player, index) => {
            const isWinner = index === 0 && player.testsPassed === player.totalTests;
            const rank = index + 1;

            return (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${isWinner
                  ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                  : 'border-white/10'
                  }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Rank Badge */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900' :
                        rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-slate-900' :
                          'bg-gradient-to-br from-orange-400 to-orange-600 text-slate-900'
                        }`}>
                        {rank}
                      </div>

                      {/* Player Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-bold">{player.username}</h3>
                          {isWinner && <Award className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(player.timeTaken)}</span>
                          </span>
                          <span>•</span>
                          <span>{player.language}</span>
                        </div>
                      </div>
                    </div>

                    {/* Test Results */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold mb-1 ${player.testsPassed === player.totalTests ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                        {player.testsPassed}/{player.totalTests}
                      </div>
                      <div className="text-xs text-gray-400">Tests Passed</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Time Taken</div>
                      <div className="text-lg font-bold text-purple-400">{formatTime(player.timeTaken)}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                      <div className="text-lg font-bold text-pink-400">
                        {((player.testsPassed / player.totalTests) * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">Submitted</div>
                      <div className="text-lg font-bold text-blue-400">{player.submissionTime}</div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center space-x-2">
                    {player.testsPassed === player.totalTests ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-semibold">All Tests Passed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">
                          {player.totalTests - player.testsPassed} Test(s) Failed
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex items-center justify-center space-x-4">
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-lg font-semibold transition flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Challenge Again</span>
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-bold transition flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;