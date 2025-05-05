type DoneFunction = (
  _error: Error | null,
  _user?: false | Record<string, unknown>,
  _info?: { message: string }
) => void;

export default DoneFunction;
