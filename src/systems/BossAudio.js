export const BOSS_EVENTS=['idle','intro','windup','attack','magic','hurt','stagger','enrage','death'];
export const BOSS_PROFILES=['fivehand','braced','warden'];
export const BOSS_AUDIO_FILES=[...BOSS_PROFILES.flatMap(p=>BOSS_EVENTS.map(e=>`${p}-${e}`)),...BOSS_PROFILES.map(p=>`${p}-score`),'rowan-hurt'];
export const BOSS_GAIN={idle:.28,intro:.7,windup:.5,attack:.65,magic:.58,hurt:.5,stagger:.58,enrage:.67,death:.7};
export const BOSS_COOLDOWN={idle:5200,intro:3000,windup:900,attack:650,magic:1200,hurt:350,stagger:900,enrage:5000,death:3000};
