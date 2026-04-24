import fs from 'fs';

let analytics = fs.readFileSync('src/components/AnalyticsAndRoles.tsx', 'utf8');

analytics = analytics.replace(
  "phone: string;",
  "phone: string;\n  acceptedJesus?: boolean;"
);
analytics = analytics.replace(
  'phone: data.phone || "",',
  'phone: data.phone || "",\n            acceptedJesus: data.acceptedJesus,'
);
analytics = analytics.replace(
  'const headers = ["Name", "Phone Number", "Email", "Registration Date", "Country", "City"];',
  'const headers = ["Name", "Phone Number", "Email", "Registration Date", "Country", "City", "Accepted Jesus"];'
);
analytics = analytics.replace(
  'const headers = ["Name", "Phone Number", "Email", "Registration Date", "Country", "City"];',
  'const headers = ["Name", "Phone Number", "Email", "Registration Date", "Country", "City", "Accepted Jesus"];'
);

analytics = analytics.replace(
  'u.country || "Unknown", u.city || "Unknown",\n  ]);',
  'u.country || "Unknown", u.city || "Unknown", u.acceptedJesus !== undefined ? (u.acceptedJesus ? "Yes" : "No") : "Unknown",\n  ]);'
);
analytics = analytics.replace(
  'u.country || "Unknown", u.city || "Unknown",\n  ]);',
  'u.country || "Unknown", u.city || "Unknown", u.acceptedJesus !== undefined ? (u.acceptedJesus ? "Yes" : "No") : "Unknown",\n  ]);'
);

fs.writeFileSync('src/components/AnalyticsAndRoles.tsx', analytics);
