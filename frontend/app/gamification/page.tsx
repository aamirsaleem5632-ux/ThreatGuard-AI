'use client';

import React, { useEffect, useState } from 'react';
import { Award, Medal, Trophy } from 'lucide-react';
import { api } from '@/lib/api';
import { GamificationProfile, LeaderboardEntry } from '@/lib/types';

export default function GamificationPage() {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let requestInProgress = false;
    const refreshProgress = async () => {
      if (requestInProgress || document.visibilityState === 'hidden') return;
      requestInProgress = true;
      try {
        const [profileData, leaderboardData] = await Promise.all([
          api.getGamificationProfile(),
          api.getGamificationLeaderboard(),
        ]);
        if (active) {
          setProfile(profileData);
          setLeaderboard(leaderboardData);
          setError(null);
        }
      } catch (loadError) {
        console.error('Unable to load analyst progress:', loadError);
        if (active) setError('Unable to load analyst progress. Please try again.');
      } finally {
        requestInProgress = false;
      }
    };

    void refreshProgress();
    const intervalId = window.setInterval(refreshProgress, 30000);
    document.addEventListener('visibilitychange', refreshProgress);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshProgress);
    };
  }, []);

  if (error) {
    return <div role="alert" className="p-6 text-sm text-rose-400">{error}</div>;
  }
  if (!profile) {
    return <div className="p-6 text-sm text-zinc-400">Loading analyst progress...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Analyst Progress</h1>
        <p className="mt-1 text-xs text-zinc-400">Points are awarded for unique investigations completed by the authenticated analyst.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card">
          <div className="flex items-center gap-2 text-xs text-cyber-muted"><Trophy className="w-4 h-4 text-cyber-gold" /> Points</div>
          <div className="mt-2 text-2xl font-bold text-cyber-white">{profile.points}</div>
        </div>
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card">
          <div className="flex items-center gap-2 text-xs text-cyber-muted"><Medal className="w-4 h-4 text-cyber-gold" /> Analyst level</div>
          <div className="mt-2 text-2xl font-bold text-cyber-white">{profile.level}</div>
        </div>
        <div className="p-5 rounded-xl bg-cyber-card border border-cyber-card">
          <div className="flex items-center gap-2 text-xs text-cyber-muted"><Award className="w-4 h-4 text-cyber-gold" /> Completed investigations</div>
          <div className="mt-2 text-2xl font-bold text-cyber-white">{profile.completed_investigations}</div>
        </div>
      </div>

      <section className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h2 className="font-semibold text-cyber-white">Level progress</h2>
          <span className="text-cyber-muted">
            {profile.next_level
              ? `${profile.points_to_next_level} points to ${profile.next_level}`
              : 'Maximum level reached'}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progress to next analyst level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profile.level_progress_percent}
          className="h-2 rounded-full bg-cyber-navy overflow-hidden"
        >
          <div
            className="h-full bg-cyber-gold transition-[width]"
            style={{ width: `${profile.level_progress_percent}%` }}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-3">
          <h2 className="text-sm font-semibold text-cyber-white">Achievements</h2>
          {profile.achievements.map(achievement => (
            <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg bg-cyber-deep/70">
              <Award className={`w-4 h-4 mt-0.5 ${achievement.earned ? 'text-cyber-gold' : 'text-cyber-muted'}`} />
              <div>
                <div className="text-xs font-semibold text-cyber-white">
                  {achievement.title}
                  <span className="ml-2 text-[10px] text-cyber-muted">{achievement.earned ? 'Earned' : 'Locked'}</span>
                </div>
                <p className="mt-1 text-[11px] text-cyber-muted">{achievement.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-3">
          <h2 className="text-sm font-semibold text-cyber-white">Organization leaderboard</h2>
          {leaderboard.length === 0 && (
            <p className="text-xs text-cyber-muted">No completed investigations have earned points yet.</p>
          )}
          {leaderboard.map(entry => (
            <div key={entry.user_id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-cyber-deep/70">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-cyber-gold">#{entry.rank}</span>
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-cyber-white">{entry.full_name}</div>
                  <div className="text-[10px] text-cyber-muted">{entry.level}</div>
                </div>
              </div>
              <span className="shrink-0 text-xs font-mono text-cyber-white">{entry.points} pts</span>
            </div>
          ))}
        </section>
      </div>

      <section className="p-5 rounded-xl bg-cyber-card border border-cyber-card space-y-3">
        <h2 className="text-sm font-semibold text-cyber-white">Recent rewards</h2>
        {profile.recent_rewards.length === 0 && (
          <p className="text-xs text-cyber-muted">Complete an eligible investigation to earn points.</p>
        )}
        {profile.recent_rewards.map((reward, index) => (
          <div key={`${reward.activity_type}-${reward.awarded_at}-${index}`} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-cyber-muted">Investigation completed · {new Date(reward.awarded_at).toLocaleDateString()}</span>
            <span className="font-mono text-cyber-gold">+{reward.points} pts</span>
          </div>
        ))}
      </section>
    </div>
  );
}
