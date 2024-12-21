const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

  
  export default truncateTitle;

  export const truncateText = (text: string, maxLength: number = 17): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};