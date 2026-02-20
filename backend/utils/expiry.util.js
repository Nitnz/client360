exports.getExpiryStatus = (project) => {
  // ✅ Normalize today to start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Collect valid dates
  const dates = [project.domainExpiry, project.hostingExpiry]
    .filter(Boolean)
    .map(d => new Date(d));

  if (dates.length === 0) return 'NO_EXPIRY';

  // 🔴 Expired
  if (dates.some(date => date < today)) {
    return 'EXPIRED';
  }

  // 🟡 Expiring Soon
  if (dates.some(date => date >= today && date <= nextWeek)) {
    return 'EXPIRING_SOON';
  }

  // 🟢 Active
  return 'ACTIVE';
};

