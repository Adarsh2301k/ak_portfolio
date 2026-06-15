// ─── useZoneTransition ────────────────────────────────────────────────────────
// Tracks the current zone and provides a helper to navigate with a loading delay
// so ZoneTransition can animate between views.

import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useZoneTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToZone = useCallback(
    (path, delayMs = 400) => {
      if (path === location.pathname) return;
      setIsTransitioning(true);
      setTimeout(() => {
        navigate(path);
        setIsTransitioning(false);
      }, delayMs);
    },
    [navigate, location.pathname]
  );

  return { isTransitioning, goToZone, currentPath: location.pathname };
}
