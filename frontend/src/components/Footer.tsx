export function Footer() {
  return (
    <footer className="w-full py-4 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <p>
          Search results powered by{" "}
          <a
            href="https://duckduckgo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            DuckDuckGo
          </a>
        </p>
        <p>
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/wendryosales/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Wendryo Sales
          </a>
        </p>
      </div>
    </footer>
  );
}
