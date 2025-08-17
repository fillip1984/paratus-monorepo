import { FaCircleNotch, FaExclamationTriangle } from "react-icons/fa";

export default function LoadOrRetry({
  isLoading,
  isError,
  retry,
}: {
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      {isLoading && <FaCircleNotch className="animate-spin text-9xl" />}

      {isError && (
        <div>
          <h2 className="mb-0 flex items-center justify-center gap-2 uppercase">
            <FaExclamationTriangle /> error
          </h2>
          <p>An error has occurred, would you like to retry?</p>

          <button
            type="button"
            onClick={retry}
            className="bg-primary mt-4 w-full rounded px-4 py-2 text-3xl"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
