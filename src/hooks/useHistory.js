import { useState, useCallback, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'sketchChart_state';

export const useHistory = (initialState = []) => {
  const [state, setState] = useState(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (e) {
      console.error("Error loading from local storage:", e);
    }
    return {
      history: [initialState],
      step: 0,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Error saving to local storage:", e);
    }
  }, [state]);

  const elements = state.history[state.step];

  const setElements = useCallback(
    (newElements, overwrite = false) => {
      setState((prevState) => {
        const { history, step } = prevState;

        // If we are overriding the current state without pushing to history
        if (overwrite) {
          const nextHistory = [...history];
          nextHistory[step] =
            typeof newElements === 'function' ? newElements(history[step]) : newElements;
          return { history: nextHistory, step };
        }

        // Drop any future history if we are branching off from a previous step
        const newHistory = history.slice(0, step + 1);
        const resolvedElements = typeof newElements === 'function' ? newElements(history[step]) : newElements;
        newHistory.push(resolvedElements);
        return { history: newHistory, step: newHistory.length - 1 };
      });
    },
    []
  );

  const undo = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      step: Math.max(0, prevState.step - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      step: Math.min(prevState.history.length - 1, prevState.step + 1),
    }));
  }, []);

  return {
    elements,
    setElements,
    history: state.history,
    historyStep: state.step,
    undo,
    redo,
  };
};
