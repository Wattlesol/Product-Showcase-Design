import { useEffect } from "react";
import { useLocation as useNavigation } from "wouter";

export function useTracker(options: { skipHit?: boolean } = {}) {
  const [location] = useNavigation();

  // Generate or get sessionId immediately (synchronously)
  let sessionId = sessionStorage.getItem("lumina_session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("lumina_session", sessionId);
  }

  useEffect(() => {
    if (options.skipHit) return;

    const trackHit = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      const hitData = {
        sessionId,
        path: window.location.pathname,
        referrer: document.referrer || null,
        ttclid: urlParams.get("ttclid"),
        utmSource: urlParams.get("utm_source"),
        utmMedium: urlParams.get("utm_medium"),
        utmCampaign: urlParams.get("utm_campaign"),
      };

      try {
        await fetch("/api/track/hit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hitData),
        });
        
        // Meta Pixel Track PageView
        // @ts-ignore
        if (window.fbq) {
          // @ts-ignore
          window.fbq('track', 'PageView');
        }

        // TikTok Pixel Track PageView
        // @ts-ignore
        if (window.ttq) {
          // @ts-ignore
          window.ttq.page();
        }
      } catch (e) {
        console.error("Tracking failed", e);
      }
    };

    trackHit();
  }, [location, options.skipHit]);

  const trackEvent = async (eventType: string, data: { productId?: string; productName?: string; metadata?: any }) => {
    const sessionId = sessionStorage.getItem("lumina_session");
    if (!sessionId) return;

    try {
      await fetch("/api/track/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          eventType,
          ...data
        }),
      });
    } catch (e) {
      console.error("Event tracking failed", e);
    }
  };

  const trackTikTok = (eventName: string, data: any) => {
    // @ts-ignore
    if (window.ttq) {
      // @ts-ignore
      window.ttq.track(eventName, data);
    }
  };

  const identifyTikTok = (userData: { email?: string; phone_number?: string; external_id?: string }) => {
    // @ts-ignore
    if (window.ttq) {
      // @ts-ignore
      window.ttq.identify(userData);
    }
  };

  return {
    sessionId: sessionStorage.getItem("lumina_session"),
    trackEvent,
    trackTikTok,
    identifyTikTok
  };
}
