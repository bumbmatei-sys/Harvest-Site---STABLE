import fs from 'fs';

let text = fs.readFileSync('src/components/PersonalInformationModal.tsx', 'utf8');

text = text.replace(
  "const [phone, setPhone] = useState('');",
  "const [phone, setPhone] = useState('');\n  const [acceptedJesus, setAcceptedJesus] = useState('');"
);
text = text.replace(
  "if (data.phone) setPhone(data.phone);",
  "if (data.phone) setPhone(data.phone);\n        if (data.acceptedJesus !== undefined) setAcceptedJesus(data.acceptedJesus ? 'yes' : 'no');"
);

text = text.replace(
  /country,\s*city,\s*phone\r?\n\s*\}/,
  "country,\n        city,\n        phone,\n        acceptedJesus: acceptedJesus === 'yes'\n      }"
);

const phoneInput = `<input
 type="tel"
 value={phone}
 onChange={(e) => setPhone(e.target.value)}
 className="w-full bg-[#f8f9fa] rounded-2xl px-4 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#d4a017]/20"
 />
 </div>`;

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
            </div>`;

text = text.replace(
  /className="w-full bg\[#f8f9fa\] rounded-2xl px-4 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring\[#d4a017\]\/20"\r?\n\s*\/>\r?\n\s*<\/div>/,
  'className="w-full bg-[#f8f9fa] rounded-2xl px-4 py-4 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#d4a017]/20"\n              />\n            </div>\n' + newRadio
);

fs.writeFileSync('src/components/PersonalInformationModal.tsx', text);
