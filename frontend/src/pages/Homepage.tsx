import React, { useState } from 'react';
import { Code, Plus, Users, Zap, Trophy, Copy, Check, LogOut, User } from 'lucide-react';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [sessionCode, setSessionCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const generateSessionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setSessionCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateSession = () => {
    generateSessionCode();
  };

  const handleJoinSession = () => {
    if (joinCode.trim()) {
      console.log('Joining session:', joinCode);
      // Handle join session logic
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
            <Code className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodeBattle
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
            <Trophy className="w-5 h-5" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Profile</span>
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Battle?</span>
          </h1>
          <p className="text-gray-300 text-lg">Create a session or join an existing one to start competing</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">12</div>
            <div className="text-sm text-gray-400">Battles Won</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">8</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">#127</div>
            <div className="text-sm text-gray-400">Global Rank</div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Session
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Join Session
            </button>
          </div>

          {/* Create Session Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Create a New Battle</h3>
                <p className="text-gray-400">Start a session and invite your friend to compete</p>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'easy'
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-green-500/50'
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'medium'
                        ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-yellow-500/50'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`py-3 rounded-lg font-semibold transition ${
                      difficulty === 'hard'
                        ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:border-red-500/50'
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>

              {/* Generate Session Button */}
              {!generatedCode && (
                <button
                  onClick={handleCreateSession}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Generate Session Code</span>
                </button>
              )}

              {/* Generated Code Display */}
              {generatedCode && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="text-sm text-gray-400 mb-2">Your Session Code</div>
                      <div className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        {generatedCode}
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-lg flex items-center justify-center space-x-2 transition"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg mt-0.5">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-blue-400 mb-1">Share with your friend</div>
                        <div className="text-sm text-gray-400">
                          Send this code to your friend. Once they join, a random LeetCode problem will be assigned and the battle begins!
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setGeneratedCode('')}
                    className="w-full border border-white/20 py-3 rounded-lg hover:bg-white/5 transition"
                  >
                    Create New Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Join Session Tab */}
          {activeTab === 'join' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Join a Battle</h3>
                <p className="text-gray-400">Enter the session code to join your friend's battle</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Session Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-4 px-4 text-center text-2xl font-bold tracking-wider focus:outline-none focus:border-purple-500 transition uppercase"
                />
              </div>

              <button
                onClick={handleJoinSession}
                disabled={joinCode.length !== 6}
                className={`w-full py-4 rounded-lg font-bold text-lg transition transform ${
                  joinCode.length === 6
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                Join Battle
              </button>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg mt-0.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-purple-400 mb-1">What happens next?</div>
                    <div className="text-sm text-gray-400">
                      Once you join, both you and your opponent will receive the same random LeetCode problem. The first to submit a correct solution wins!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center">
            <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-400">1</span>
            </div>
            <h4 className="font-bold mb-2">Create or Join</h4>
            <p className="text-sm text-gray-400">Start a new session or join using a code</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center">
            <div className="bg-pink-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-pink-400">2</span>
            </div>
            <h4 className="font-bold mb-2">Get Problem</h4>
            <p className="text-sm text-gray-400">Random LeetCode question assigned</p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center">
            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-400">3</span>
            </div>
            <h4 className="font-bold mb-2">Battle & Win</h4>
            <p className="text-sm text-gray-400">Code faster and see results instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;