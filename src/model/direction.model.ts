export interface DirectionProposal {
  rationale: string;
  direction: string;
  conventions: string;
  directionDiff: string;
  conventionsDiff: string;
}

export interface ApproveDirectionResult {
  written: boolean;
}

export interface DiscardDirectionResult {
  discarded: boolean;
}
