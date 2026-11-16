'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WorkshopLogin from './WorkshopLogin';
import WorkshopRoom from './WorkshopRoom';
import SessionModal from './SessionModal';

// Show the "stay logged in" modal when this many seconds remain
const WARNING_SECONDS = 5 * 60;

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

interface WorkshopWrapperProps {
  workshopTitle?: string;
  workshopDate?: string;
  workshopTime?: string;
  facilitator?: string;
  coordinator?: string;
  slug?: string;
  agendaItems?: string[];
  featuredImage?: string | null;  // ✅ Make sure this exists
}

export default function WorkshopWrapper({
  workshopTitle = 'Workshop',
  workshopDate = 'Date TBD',
  workshopTime = 'Time TBD',
  facilitator = 'Dr. Susan Gitau',
  coordinator = 'Alice Songok',
  slug,
  agendaItems = [],
  featuredImage = null,  // ✅ Default to null
}: WorkshopWrapperProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [extendCount, setExtendCount] = useState(0);
  const [maxExtends, setMaxExtends] = useState(3);
  const [isExtending, setIsExtending] = useState(false);

  // Sync local timers with the session state reported by the server
  const applySession = (data: {
    expiresAt: number;
    extensionsUsed: number;
    maxExtensions: number;
  }) => {
    setExpiresAt(data.expiresAt);
    setTimeRemaining(Math.max(0, Math.round((data.expiresAt - Date.now()) / 1000)));
    setExtendCount(data.extensionsUsed);
    setMaxExtends(data.maxExtensions);
  };

  // Check access on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify-workshop-password', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          applySession(data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Countdown timer (derived from the server-issued expiry, so it can't drift)
  useEffect(() => {
    if (!isAuthenticated || expiresAt === null) return;

    const tick = () => {
      const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        handleAccessExpired();
      } else if (remaining <= WARNING_SECONDS && extendCount < maxExtends) {
        setShowModal(true);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, expiresAt, extendCount, maxExtends]);

  // Check access validity every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/verify-workshop-password', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (!data.authenticated) {
          handleAccessExpired();
        }
      } catch (error) {
        console.error('Access check failed:', error);
      }
    };

    const interval = setInterval(checkSession, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleAccessExpired = async () => {
    try {
      await fetch('/api/verify-workshop-password', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setShowModal(false);
      setTimeRemaining(0);
      router.refresh();
    }
  };

  const handleExtendAccess = async () => {
    setIsExtending(true);
    try {
      const response = await fetch('/api/extend-workshop-session', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        applySession(await response.json());
        setShowModal(false);
      } else {
        handleAccessExpired();
      }
    } catch (error) {
      console.error('Extension failed:', error);
      handleAccessExpired();
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/verify-workshop-password', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setShowModal(false);
      setTimeRemaining(0);
      router.refresh();
    }
  };

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    setShowModal(false);
    try {
      const response = await fetch('/api/verify-workshop-password', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.authenticated) applySession(data);
    } catch (error) {
      console.error('Session sync failed:', error);
    }
  };

  // ✅ DEBUG: Log to check if featuredImage is received
  console.log('🔍 WorkshopWrapper received featuredImage:', featuredImage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        {showModal && (
          <SessionModal
            timeRemaining={timeRemaining}
            onExtend={handleExtendAccess}
            onLogout={handleLogout}
            extendCount={extendCount}
            maxExtends={maxExtends}
            isExtending={isExtending}
          />
        )}

        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-200 z-40">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${timeRemaining > 15 * 60 ? 'bg-green-500' : timeRemaining > WARNING_SECONDS ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
            <div>
              <p className="text-xs text-gray-500">You will be logged out in</p>
              <p className={`font-bold text-sm ${timeRemaining <= WARNING_SECONDS ? 'text-red-600' : 'text-gray-800'}`}>
                {formatDuration(timeRemaining)}
              </p>
            </div>
          </div>
        </div>

        <WorkshopRoom
          onLogout={handleLogout}
          workshopTitle={workshopTitle}
          workshopDate={workshopDate}
          workshopTime={workshopTime}
          facilitator={facilitator}
          coordinator={coordinator}
        />
      </>
    );
  }

  return (
    <WorkshopLogin 
      onSuccess={handleLoginSuccess} 
      workshopTitle={workshopTitle}
      workshopDate={workshopDate}
      workshopTime={workshopTime}
      agendaItems={agendaItems}
      featuredImage={featuredImage}  // ✅ Pass the image to WorkshopLogin
    />
  );
}