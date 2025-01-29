export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
  setInput: React.Dispatch<React.SetStateAction<string>>
) => {
  setInput(e.target.value);
};