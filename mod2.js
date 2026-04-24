import fs from 'fs';

let onboarding = fs.readFileSync('src/components/Onboarding.tsx', 'utf8');

onboarding = onboarding.replace(
  /phone,\s*onboardingCompleted: true/g,
  "phone,\n        acceptedJesus: acceptedJesus === 'yes',\n        onboardingCompleted: true"
);

const newRadio = `
            <div className="relative z-30 mt-4">
              <label className="block text-sm font-bold text-gray-200 mb-2">Have you accepted Jesus?</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="acceptedJesus"
                    value="yes"
                    checked={acceptedJesus === 'yes'}
                    onChange={(e) => setAcceptedJesus(e.target.value)}
                    className="peer sr-only"
                    required
                  />
                  <div className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-center text-white peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all font-semibold">
                    Yes
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="acceptedJesus"
                    value="no"
                    checked={acceptedJesus === 'no'}
                    onChange={(e) => setAcceptedJesus(e.target.value)}
                    className="peer sr-only"
                    required
                  />
                  <div className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-center text-white peer-checked:bg-white/20 peer-checked:border-white/50 transition-all font-semibold">
                    No
                  </div>
                </label>
              </div>
            </div>`;

onboarding = onboarding.replace(
  /placeholder="e\.g\. \+1 234 567 8900"\r?\n\s*\/>\r?\n\s*<\/div>/g,
  'placeholder="e.g. +1 234 567 8900"\n              />\n            </div>\n' + newRadio
);

fs.writeFileSync('src/components/Onboarding.tsx', onboarding);
