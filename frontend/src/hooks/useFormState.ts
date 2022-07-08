import { useReducer } from 'react';

const useFormState = (initialState: Object) => {
  const [state, dispatch] = useReducer(
    (s: any, newS: any) => ({ ...s, ...newS }),
    initialState
  );

  return { state, dispatch };
};

export default useFormState;
