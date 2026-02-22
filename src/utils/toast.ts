export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const toast = document.createElement('div');
  // Tailwind classes for the toast container
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-500 translate-y-10 opacity-0 z-50 ${
    type === 'success' ? 'bg-green-500/90 text-white' : 
    type === 'error' ? 'bg-red-500/90 text-white' : 
    'bg-blue-500/90 text-white'
  }`;

  // Create content container
  const content = document.createElement('div');
  content.className = "flex items-center gap-2";

  // Create icon element
  const icon = document.createElement('i');
  icon.className = `fas fa-${
    type === 'success' ? 'check-circle' : 
    type === 'error' ? 'exclamation-circle' : 
    'info-circle'
  }`;

  // Create text node (Safe against XSS)
  const text = document.createTextNode(` ${message}`);

  // Assemble
  content.appendChild(icon);
  content.appendChild(text);
  toast.appendChild(content);

  // Mount to body
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.remove('translate-y-10', 'opacity-0'));

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
};
