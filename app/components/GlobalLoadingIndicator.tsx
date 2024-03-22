import { useNavigation } from "@remix-run/react";
import { type RefObject, useEffect, useRef } from "react";

function useProgress(): RefObject<HTMLDivElement> {
  const el = useRef<HTMLDivElement>(null);
  const timeout = useRef<NodeJS.Timeout>();
  const { location } = useNavigation();

  useEffect(() => {
    if (!location || !el.current) {
      return;
    }

    let current = el.current;

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    current.style.width = `0%`;

    let updateWidth = (ms: number) => {
      timeout.current = setTimeout(() => {
        let width = parseFloat(current.style.width);
        let percent = !isNaN(width) ? 10 + 0.9 * width : 0;

        current.style.width = `${percent}%`;

        updateWidth(100);
      }, ms);
    };

    updateWidth(300);

    return () => {
      clearTimeout(timeout.current);
      if (current.style.width === `0%`) {
        return;
      }

      current.style.width = `100%`;
      timeout.current = setTimeout(() => {
        if (current?.style.width !== "100%") {
          return;
        }

        current.style.width = ``;
      }, 200);
    };
  }, [location]);

  return el;
}

/** Progress indicator for react-router transitions during route loaders/actions
 * based on: https://edmund.dev/articles/setting-up-a-global-loading-indicator-in-remix
 */
export function GlobalLoadingIndicator() {
  const progress = useProgress();
  return (
    <div className="z-20 fixed top-0 left-0 right-0 flex h-1">
      <div
        ref={progress}
        className="via-[#ffffff] bg-gradient-to-r from-[#557283] to-[#114dc6] transition-all ease-out"
      />
    </div>
  );
}
