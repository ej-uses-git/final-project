import { useNavigate } from "react-router-dom";

export default function useError(error, navigate) {
  if (error) {
    navigate(`/error/${error.message.toLowerCase()}`);
    return true;
  }
}
