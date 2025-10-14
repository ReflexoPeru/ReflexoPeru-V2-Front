const keysToCheck = ['theme', 'token', 'user_id', 'name'];

keysToCheck.forEach(key => {
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      if (key === 'theme') {
        if (item !== 'dark' && item !== 'light') {
          localStorage.removeItem(key);
          localStorage.setItem(key, 'dark');
        }
        return;
      }
      
      try {
        JSON.parse(item);
      } catch (jsonError) {
        if (typeof item === 'string' && item.length > 0 && !item.startsWith('{') && !item.startsWith('[')) {
          return;
        }
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error(`Error procesando ${key}:`, error);
  }
});
