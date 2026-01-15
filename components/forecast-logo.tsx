import { Github, Linkedin } from "lucide-react"

export function ForecastLogo({ showText = true }: { showText?: boolean }) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 shadow-lg shadow-indigo-500/30">
          <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
            aria-hidden="true"
          >
            {/* Flow wave */}
            <path
              d="M4 20C4 20 8 14 12 14C16 14 16 22 20 22C24 22 28 16 28 16"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Upward trend line */}
            <path
              d="M6 24L14 16L20 20L28 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            {/* Arrow head */}
            <path
              d="M24 8H28V12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Data point dots */}
            <circle cx="14" cy="16" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="28" cy="10" r="2.5" fill="currentColor" />
          </svg>
        </div>
        {showText && (
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground">
              ForecastFlow<sup className="text-[10px] font-medium ml-0.5 text-muted-foreground">TM</sup>
            </span>
            <span className="text-xs text-muted-foreground">by Derrick Nguyen</span>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-6">
        <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          About
        </a>
        <a
          href="#contact"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Contact
        </a>
        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-border/50">
          <a
            href="https://github.com/nguyen-derrick"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/nguyen-derrick/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </nav>
    </div>
  )
}
