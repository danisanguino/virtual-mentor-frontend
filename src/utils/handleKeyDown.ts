export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  handleForm: () => void
) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); 
    handleForm();
  }
};