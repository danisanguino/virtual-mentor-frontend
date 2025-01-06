export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>, 
  setInput: React.Dispatch<React.SetStateAction<string>>
) => {
  setInput(e.target.value);
};