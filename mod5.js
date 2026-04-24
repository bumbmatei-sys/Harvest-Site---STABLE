import fs from 'fs';

let text = fs.readFileSync('src/components/PersonalInformationModal.tsx', 'utf8');

const newRadio = `
        <div className="p-4 pt-2 relative z-30">
          <label className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 block">
            Have you accepted Jesus?
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="acceptedJesusModal"
                value="yes"
                checked={acceptedJesus === 'yes'}
                onChange={(e) => setAcceptedJesus(e.target.value)}
                className="peer sr-only"
                required
              />
              <div className="w-full bg-[#f8f9fa] rounded-2xl px-4 py-4 text-center text-gray-900 font-bold peer-checked:bg-[#d4a017]/10 peer-checked:text-[#d4a017] peer-checked:ring-2 peer-checked:ring-[#d4a017]/30 transition-all">
                Yes
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="acceptedJesusModal"
                value="no"
                checked={acceptedJesus === 'no'}
                onChange={(e) => setAcceptedJesus(e.target.value)}
                className="peer sr-only"
                required
              />
              <div className="w-full bg-[#f8f9fa] rounded-2xl px-4 py-4 text-center text-gray-900 font-bold peer-checked:bg-gray-200 peer-checked:ring-2 peer-checked:ring-gray-300 transition-all">
                No
              </div>
            </label>
          </div>
        </div>
`;

text = text.replace(
  /{[\s\S]*?\/\*\s*Email\s*\(Read Only\)\s*\*\/}/,
  (match) => { return match.replace('{/* Email (Read Only) */}', newRadio + '\n        {/* Email (Read Only) */}'); }
);

fs.writeFileSync('src/components/PersonalInformationModal.tsx', text);
