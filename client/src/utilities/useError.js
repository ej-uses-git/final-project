export default function useError(error, navigate) {
  navigate(`/error/${error.message.toLowerCase()}`);
}
