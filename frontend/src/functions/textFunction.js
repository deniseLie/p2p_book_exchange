
export const camelCaseToReadable = (str) => {
    // Add a space before uppercase letters and convert to lowercase
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lower and upper case
      .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
  };
  