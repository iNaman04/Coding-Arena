import React, { useState, useEffect } from 'react';
import { Code, Trophy, Target, TrendingUp, Calendar, Award, Edit, LogOut, Home, Clock, Zap, CheckCircle } from 'lucide-react';

interface UserStats {
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  totalProblems: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  globalRank: number;
  rating: number;
}

interface RecentBattle {
  id: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  opponent: string;
  result: 'win' | 'loss';
  timeTaken: string;
  date: string;
}

interface UserProfile {
  username: string;
  email: string;
  avatar?: string;
  joinDate: string;
  bio?: string;
  stats: UserStats;
  recentBattles: RecentBattle[];
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'battles' | 'achievements'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - this will come from your API
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'CodeWarrior',
    email: 'warrior@codebattle.com',
    joinDate: 'January 2024',
    bio: 'Passionate coder who loves challenges and competitive programming.',
    stats: {
      totalBattles: 45,
      wins: 28,
      losses: 17,
      winRate: 62.2,
      currentStreak: 5,
      longestStreak: 12,
      totalProblems: 78,
      easyProblems: 32,
      mediumProblems: 30,
      hardProblems: 16,
      globalRank: 127,
      rating: 1842
    },
    recentBattles: [
      {
        id: '1',
        problemTitle: 'Two Sum',
        difficulty: 'Easy',
        opponent: 'PlayerX',
        result: 'win',
        timeTaken: '4:32',
        date: '2 hours ago'
      },
      {
        id: '2',
        problemTitle: 'Longest Substring',
        difficulty: 'Medium',
        opponent: 'CodeMaster',
        result: 'win',
        timeTaken: '8:45',
        date: '1 day ago'
      },
      {
        id: '3',
        problemTitle: 'Merge K Lists',
        difficulty: 'Hard',
        opponent: 'ProCoder99',
        result: 'loss',
        timeTaken: '15:20',
        date: '2 days ago'
      },
      {
        id: '4',
        problemTitle: 'Valid Parentheses',
        difficulty: 'Easy',
        opponent: 'NewbieDev',
        result: 'win',
        timeTaken: '3:15',
        date: '3 days ago'
      }
    ]
  });

  useEffect(() => {
    // Fetch user profile from API
    // const fetchProfile = async () => {
    //   const response = await axiosInstance.get('/user/profile');
    //   setUserProfile(response.data);
    // };
    // fetchProfile();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRankColor = (rank: number) => {
    if (rank <= 10) return 'text-yellow-400';
    if (rank <= 100) return 'text-purple-400';
    if (rank <= 1000) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-800/50 backdrop-blur-lg">
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
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
            <Trophy className="w-5 h-5" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 overflow-y-auto h-[calc(100vh-80px)]">
        {/* Profile Header Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
                {userProfile.username.charAt(0)}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{userProfile.username}</h1>
                <p className="text-gray-400 mb-2">{userProfile.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userProfile.joinDate}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Bio */}
          {userProfile.bio && (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300">{userProfile.bio}</p>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold mb-1 ${getRankColor(userProfile.stats.globalRank)}`}>
                #{userProfile.stats.globalRank}
              </div>
              <div className="text-sm text-gray-400">Global Rank</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">{userProfile.stats.rating}</div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{userProfile.stats.wins}</div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{userProfile.stats.currentStreak}</div>
              <div className="text-sm text-gray-400">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('battles')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'battles'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Recent Battles
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              activeTab === 'achievements'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Achievements
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Battle Statistics */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span>Battle Statistics</span>
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Battles</span>
                  <span className="font-bold text-lg">{userProfile.stats.totalBattles}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Wins</span>
                  <span className="font-bold text-lg text-green-400">{userProfile.stats.wins}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Losses</span>
                  <span className="font-bold text-lg text-red-400">{userProfile.stats.losses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-bold text-lg text-purple-400">{userProfile.stats.winRate}%</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="font-bold text-lg text-yellow-400">{userProfile.stats.currentStreak} 🔥</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Longest Streak</span>
                  <span className="font-bold text-lg">{userProfile.stats.longestStreak}</span>
                </div>
              </div>
            </div>

            {/* Problems Solved */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-pink-400" />
                <span>Problems Solved</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Total</span>
                    <span className="font-bold text-lg">{userProfile.stats.totalProblems}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-400">Easy</span>
                    <span className="font-bold text-green-400">{userProfile.stats.easyProblems}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-yellow-400">Medium</span>
                    <span className="font-bold text-yellow-400">{userProfile.stats.mediumProblems}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400">Hard</span>
                    <span className="font-bold text-red-400">{userProfile.stats.hardProblems}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Battles</h2>
            <div className="space-y-4">
              {userProfile.recentBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-4 hover:bg-slate-800/70 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold">{battle.problemTitle}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(battle.difficulty)}`}>
                          {battle.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          battle.result === 'win' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {battle.result.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>vs {battle.opponent}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{battle.timeTaken}</span>
                        </span>
                        <span>•</span>
                        <span>{battle.date}</span>
                      </div>
                    </div>
                    {battle.result === 'win' && (
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Achievements</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-xl p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">First Victory</h3>
                <p className="text-sm text-gray-400">Won your first battle</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-6 text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Speed Demon</h3>
                <p className="text-sm text-gray-400">Solved in under 3 minutes</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Perfect Score</h3>
                <p className="text-sm text-gray-400">All tests passed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;