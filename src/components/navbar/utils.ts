
export const getUserInitials = (email: string): string => {
  if (!email) return '?';
  
  const emailParts = email.split('@')[0].split(/[._-]/);
  if (emailParts.length === 1) {
    return emailParts[0].substring(0, 2).toUpperCase();
  }
  
  return (emailParts[0].charAt(0) + emailParts[1].charAt(0)).toUpperCase();
};

export const getUsageDisplay = (userData: any): string => {
  if (!userData) return '';
  
  const { monthly_remaining, plan } = userData;
  const total = plan === 'free' ? 3 : 100;
  
  return `${monthly_remaining}/${total}`;
};
