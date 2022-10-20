export default function handleError(error, navigate) {
  navigate(`/error/${error.message.toLowerCase()}`);
}
