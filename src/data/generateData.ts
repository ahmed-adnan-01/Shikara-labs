import { boysNames, girlsNames, devices, pickMsg } from './kashmiris';

export interface LoginSession {
  id: string;
  firstName: string;
  email: string;
  device: string;
  timestamp: string;
}

export interface FeedbackEntry {
  id: string;
  firstName: string;
  email: string;
  subject: string;
  rating: number;
  message: string;
  timestamp: string;
}

const allNames = [...boysNames, ...girlsNames];
const emailDomains = ["gmail.com", "email.com"];

const physicsMsgs = [
  "Ohm's Law verification was so clear! The V-I graph plotted perfectly.",
  "Excellent explanation of Equivalent Resistance. Series and Parallel circuits are much easier now.",
  "Faraday's Law simulation is amazing. The induction effect is shown very realistically.",
  "Loved the Ohm's Law experiment. The virtual multimeter is a great touch.",
  "Induction laws are usually hard, but Faraday's simulation made it click.",
  "The resistance calculations in series/parallel were spot on. Best lab for Physics!",
  "Physics demos are outstanding, especially the magnetic induction ones.",
  "Ohm's law was verified successfully. The interface is very intuitive for secondary students.",
  "I finally understand how Faraday's Law works after seeing the magnet speed effect.",
  "Best virtual physics lab for Ohm's Law and resistance study."
];

const chemistryMsgs = [
  "Good interactive pH paper experiment. The color changes were very accurate.",
  "Cleansing action of soap simulation is good, but adding more molecule detail would help.",
  "Chemical reactions study is well-explained. Displacement reactions look very real.",
  "The pH paper test was helpful for my practical exam. Nice UI.",
  "Soap micelle formation is good, but could be more detailed for better understanding.",
  "Chemical reaction demonstrations are good. Please add decomposition reactions too.",
  "Chemistry labs are helpful, but not as interactive as Physics.",
  "Verified the pH of common substances using the digital paper. Very useful.",
  "Good basic chemistry reactions, but needs more advanced experiments.",
  "Soap cleansing simulation is a good concept, though it needs smoother animations."
];

const biologyMsgs = [
  "Photosynthesis section is too basic. Needs more details about the light/dark phases.",
  "Iodine test for starch is okay but lacks interactive depth.",
  "CO2 released during respiration is a bit boring. Could be more engaging.",
  "Biology diagrams are not that good compared to Physics. Need better visuals.",
  "Not satisfied with the Photosynthesis lab. Too simplified for secondary level.",
  "The starch test is very simple. Maybe add more food samples to test.",
  "Biology simulation is weak. The limewater test for CO2 is very static.",
  "Needs improvement in Biology. Photosynthesis needs more interactive variables.",
  "Poor explanation of starch test. The iodine reaction is not shown clearly.",
  "Biology section is disappointing. Chemistry and Physics are way better."
];

export function generateLogins(): LoginSession[] {
  const sessions: LoginSession[] = [];
  const total = 602;
  const start = new Date("2026-01-01T09:00:00").getTime();
  const end = new Date("2026-02-28T21:00:00").getTime();

  for (let i = 0; i < total; i++) {
    const firstName = allNames[Math.floor(Math.random() * allNames.length)];
    const email = `${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}@${emailDomains[Math.floor(Math.random() * 2)]}`;
    const device = devices[Math.floor(Math.random() * devices.length)];
    const time = new Date(start + Math.random() * (end - start)).toISOString();

    sessions.push({
      id: Math.random().toString(36).substr(2, 9),
      firstName,
      email,
      device,
      timestamp: time
    });
  }
  return sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function generateFeedback(): FeedbackEntry[] {
  const entries: FeedbackEntry[] = [];
  const start = new Date("2026-01-10T09:00:00").getTime();
  const end = new Date("2026-02-25T21:00:00").getTime();

  const createSet = (subj: string, msgs: string[], ratingRange: [number, number], count: number) => {
    for (let i = 0; i < count; i++) {
      const firstName = allNames[Math.floor(Math.random() * allNames.length)];
      const email = `${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}@${emailDomains[Math.floor(Math.random() * 2)]}`;
      const rating = Math.floor(Math.random() * (ratingRange[1] - ratingRange[0] + 1)) + ratingRange[0];
      const time = new Date(start + Math.random() * (end - start)).toISOString();

      entries.push({
        id: Math.random().toString(36).substr(2, 9),
        firstName,
        email,
        subject: subj,
        rating,
        message: pickMsg(msgs),
        timestamp: time
      });
    }
  };

  createSet("Physics", physicsMsgs, [4, 5], 100);
  createSet("Chemistry", chemistryMsgs, [3, 4], 100);
  createSet("Biology", biologyMsgs, [1, 2], 100);

  return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
