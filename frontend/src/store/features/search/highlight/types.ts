export interface HighlightPosition {
  resultIndex: number;
  matchIndex: number;
}

export interface TextHighlightState {
  highlightPattern: string;
  selectedMatch: HighlightPosition;
}
