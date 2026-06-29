import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Trophy, TrendingUp, Calendar, Edit, LogOut, Home, Clock, Loader } from 'lucide-react';
import axiosInstance from '../libs/axios.ts';
import { useAuthStore } from '../store/Authstore.ts';
import toast from 'react-hot-toast';

interface UserStats {
  totalBattles: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  longestStreak: number;
  totalProblems: number;
  exp: number;
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
  joinDate: string;
  bio?: string;
  stats: UserStats;
  recentBattles: RecentBattle[];
}

const emptyProfile: UserProfile = {
  username: '',
  email: '',
  joinDate: '',
  bio: '',
  stats: {
    totalBattles: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalProblems: 0,
    exp: 0,
  },
  recentBattles: [],
};

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'battles'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>(emptyProfile);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/user/profile');
      const data = response.data;
      setUserProfile({
        ...data,
        recentBattles: data.recentBattles.map((battle: RecentBattle & { date: string }) => ({
          ...battle,
          date: formatRelativeTime(battle.date),
        })),
      });
      setEditBio(data.bio || '');
    } catch (error) {
      console.error('Failed to fetch profile', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await axiosInstance.put('/user/profile', { bio: editBio });
      setUserProfile((prev) => ({ ...prev, bio: response.data.bio }));
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBio(userProfile.bio || '');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

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
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
          >
            <Trophy className="w-5 h-5" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition"
          >
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
                {userProfile.username.charAt(0).toUpperCase()}
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
              onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write a short bio..."
                maxLength={200}
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Bio'}
                </button>
              </div>
            </div>
          ) : userProfile.bio ? (
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300">{userProfile.bio}</p>
            </div>
          ) : null}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {userProfile.stats.totalBattles}
              </div>
              <div className="text-sm text-gray-400">Total Battles</div>
            </div>

            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">{userProfile.stats.exp}</div>
              <div className="text-sm text-gray-400">Total EXP</div>
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
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Battle Statistics */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span>Battle Statistics</span>
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Total Battles</span>
                  <span className="font-bold text-2xl">{userProfile.stats.totalBattles}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Wins</span>
                  <span className="font-bold text-2xl text-green-400">{userProfile.stats.wins}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Losses</span>
                  <span className="font-bold text-2xl text-red-400">{userProfile.stats.losses}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Win Rate</span>
                  <span className="font-bold text-2xl text-purple-400">{userProfile.stats.winRate}%</span>
                </div>
              </div>
            </div>

            {/* Streaks & Performance */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <span>Streaks & Performance</span>
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                  <span className="text-gray-400 text-lg">Current Streak</span>
                  <span className="font-bold text-2xl text-yellow-400">{userProfile.stats.currentStreak} 🔥</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Longest Streak</span>
                  <span className="font-bold text-2xl">{userProfile.stats.longestStreak}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-gray-400 text-lg">Problems Solved</span>
                  <span className="font-bold text-2xl text-purple-400">
                    {userProfile.stats.totalProblems}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-gray-400 text-lg">Total EXP</span>
                  <span className="font-bold text-2xl text-pink-400">{userProfile.stats.exp}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6">Recent Battles</h2>
            {userProfile.recentBattles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>No battles yet. Start a session from the home page!</p>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
