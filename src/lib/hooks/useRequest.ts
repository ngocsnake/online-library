import { useState } from "react";

export enum RequestStatus {
  IDLE = "idle",
  PENDING = "pending",
  FULFILLED = "fulfilled",
  REJECTED = "rejected",
}

type CallbackFunctionVariadicAnyReturn = (...args: any[]) => any;

const useRequest = (fn: CallbackFunctionVariadicAnyReturn) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const caller = async (...args: any): Promise<any> => {
    setData(null);
    setError(null);
    setStatus(RequestStatus.PENDING);
    try {
      const response = await fn(...args);
      setData(() => response);
      setStatus(RequestStatus.FULFILLED);
      return response;
    } catch (error: any) {
      setData(null);
      setError(() => error);
      setStatus(RequestStatus.REJECTED);
      throw error;
    }
  };

  return [caller, { data, error, status }] as const;
};

export default useRequest;
