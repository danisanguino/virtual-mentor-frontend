export const validateInput = (input: string): boolean => {
  if (!input.trim()) {
    alert('Por favor, escribe una consulta.');
    return false;
  }
  return true;
};