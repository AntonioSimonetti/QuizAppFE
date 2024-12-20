const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };

  
  export default truncateTitle;