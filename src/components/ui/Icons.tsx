import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => (
  <Base {...p}>
    <circle cx="10.5" cy="10.5" r="6.2" />
    <path d="M15.2 15.2 20 20" />
  </Base>
);

export const IconBag = (p: P) => (
  <Base {...p}>
    <path d="M5 8.5h14l-1 11.5H6L5 8.5Z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </Base>
);

export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const IconArrowLeft = (p: P) => (
  <Base {...p}>
    <path d="M14.5 6 8.5 12l6 6" />
  </Base>
);

export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M9.5 6l6 6-6 6" />
  </Base>
);

export const IconArrowLong = (p: P) => (
  <Base {...p}>
    <path d="M3 12h17M15 7l5 5-5 5" />
  </Base>
);

export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconMinus = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);

export const IconChevron = (p: P) => (
  <Base {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </Base>
);

export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="M5 12.5 9.5 17 19 7.5" />
  </Base>
);

export const IconFilter = (p: P) => (
  <Base {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Base>
);

export const IconSun = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3.6" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
  </Base>
);

export const IconMoon = (p: P) => (
  <Base {...p}>
    <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />
  </Base>
);

export const IconBulb = (p: P) => (
  <Base {...p}>
    <path d="M12 3v3" />
    <path d="M9.5 6h5v2.2c2 .9 3.2 2.8 3.2 5a5.7 5.7 0 0 1-11.4 0c0-2.2 1.2-4.1 3.2-5V6Z" />
  </Base>
);
