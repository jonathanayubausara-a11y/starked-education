'use client';

import React, { useState, useEffect } from 'react';
import PreferencesPanel from '@/components/Notifications/PreferencesPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Shield, Info, Keyboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { getShortcuts, getEnabledKeys, setEnabledKeys, type Shortcut } from '@/lib/shortcutRegistry';

export default function NotificationSettingsPage() {
    // User identity is obtained from the JWT auth token by the backend.
    const { preferences, updatePreferences, isLoading, subscribeToPushNotifications } = useNotifications();
    const [shortcutsEnabled, setShortcutsEnabled] = useState(getEnabledKeys());
    const [shortcuts] = useState<Shortcut[]>(getShortcuts());

  const handleUpdatePreferences = async (
    prefs: Parameters<typeof updatePreferences>[0]
  ) => {
    await updatePreferences(prefs);
    toast.success('Notification preferences saved');
  };

  const handlePushSubscription = async () => {
    try {
      await subscribeToPushNotifications();
      toast.success('Successfully subscribed to push notifications!');
    } catch (error) {
      toast.error(
        'Failed to subscribe to push notifications. Please check your browser settings.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage how and when you receive notifications from StarkEd.
        </p>
      </div>

          {/* Push Notifications */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={22} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Push Notifications</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Enable push notifications to stay updated even when you're not on the site.
            </p>
            <button
              onClick={handlePushSubscription}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Bell size={18} />
              Enable Browser Push
            </button>
          </section>

          {/* Keyboard Shortcuts */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Keyboard size={22} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">Enable keyboard shortcuts</p>
                <p className="text-sm text-gray-400">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+K</kbd> to open the command palette
                </p>
              </div>
              <button
                onClick={() => {
                  const next = !shortcutsEnabled;
                  setShortcutsEnabled(next);
                  setEnabledKeys(next);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${shortcutsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shortcutsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div key={s.keys} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-700">{s.description}</span>
                  <kbd className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3 text-blue-800">
                <Info size={18} />
                <h3 className="font-semibold">Need help?</h3>
              </div>
              <p className="text-sm text-blue-700 leading-relaxed">
                Notifications help you stay on track with your learning goals. We
                recommend keeping &ldquo;Course Updates&rdquo; and &ldquo;System Alerts&rdquo; enabled.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Note</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We never share your contact information with third parties. Your
                notification data is used solely for platform updates.
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
    );
  }
