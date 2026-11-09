import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMembers, fetchProjects } from '../api/mockApi';
import type { Member, Project } from '../types';

export type ReferenceDataState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; members: Member[]; projects: Project[] };

export interface UseReferenceDataResult {
  state: ReferenceDataState;
  retry: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to load members and projects.';
}

export function useReferenceData(): UseReferenceDataResult {
  const [state, setState] = useState<ReferenceDataState>({ status: 'loading' });
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  const load = useCallback(() => {
    if (inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState({ status: 'loading' });

    Promise.all([fetchMembers(), fetchProjects()])
      .then(([members, projects]) => {
        if (!isMountedRef.current || requestId !== requestIdRef.current) {
          return;
        }

        setState({ status: 'ready', members, projects });
      })
      .catch((error: unknown) => {
        if (!isMountedRef.current || requestId !== requestIdRef.current) {
          return;
        }

        setState({ status: 'error', message: getErrorMessage(error) });
      })
      .finally(() => {
        if (requestId === requestIdRef.current) {
          inFlightRef.current = false;
        }
      });
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    load();

    return () => {
      isMountedRef.current = false;
    };
  }, [load]);

  const retry = useCallback(() => {
    if (inFlightRef.current) {
      return;
    }

    load();
  }, [load]);

  return { state, retry };
}
