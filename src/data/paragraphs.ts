export type Difficulty = "easy" | "medium" | "hard";
export type Theme = "cyberpunk" | "underwater" | "retro" | "fantasy";

export interface ThemeConfig {
  id: Theme;
  name: string;
  tagline: string;
  gameOverTitle: string;
  overdriveLabel: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "cyberpunk",
    name: "CYBERPUNK",
    tagline: "// type to survive",
    gameOverTitle: "SYSTEM OFFLINE",
    overdriveLabel: "MAXIMUM OVERDRIVE",
  },
  {
    id: "underwater",
    name: "UNDER THE SEA",
    tagline: "// dive deeper",
    gameOverTitle: "DROWNED",
    overdriveLabel: "KRAKEN MODE",
  },
  {
    id: "retro",
    name: "RETRO ARCADE",
    tagline: "// insert coin",
    gameOverTitle: "GAME OVER",
    overdriveLabel: "STAR POWER",
  },
  {
    id: "fantasy",
    name: "FANTASY",
    tagline: "// cast your spell",
    gameOverTitle: "YOU HAVE FALLEN",
    overdriveLabel: "DRAGON'S RAGE"
  }
]

const cyberpunk = {
  easy: [
    "the neon lights flicker above the rain soaked streets as data streams through fiber optic veins beneath the city",
    "encrypted packets race through the backbone of a dying internet while hackers dance with firewalls in the dark",
    "your fingers fly across the mechanical keyboard each keystroke a bullet fired into the digital void",
    "somewhere in the cloud a rogue algorithm is rewriting the rules of reality one function call at a time",
    "the terminal blinks green waiting for your command like a loyal hound ready to unleash chaos on the network",
    "behind every great firewall there is a teenager with a laptop and an unhealthy amount of energy drinks",
    "the matrix has you but you have root access and a mass of sticky notes with forgotten passwords",
    "boot sequence initiated memory banks loaded neural interface calibrated welcome back operative",
    "in the age of surveillance the most dangerous weapon is a mind that refuses to stop questioning everything",
    "compile your dreams into executable code and deploy them to the production server of reality",
    "the cursor blinks patiently in the void of the terminal an eternal invitation to create or destroy",
    "stack overflow is not just a website it is a lifestyle and a cry for help wrapped in code blocks",
    "deep in the server room the hum of cooling fans sounds like a choir singing hymns to the silicon gods",
    "every bug you squash is a tiny victory against the entropy that threatens to consume all software",
    "the best code is the code you never have to write but the most fun code is the kind that breaks things",
    "neon signs reflect off wet asphalt as you jack into the mainframe one last time before dawn breaks",
    "pixel by pixel the screen renders a world more real than the one outside your window",
    "your commit history tells a story of sleepless nights cold pizza and mass amounts of determination",
    "in cyberspace no one can hear you scream but they can definitely see your error logs",
    "the api responded with a four hundred and eighteen status code because apparently it is a teapot",
    "quantum bits dance in superposition while classical computers watch in envious admiration",
    "the blockchain does not care about your feelings it only cares about consensus and hash rates",
    "sudo make me a sandwich the computer complied because with great power comes great responsibility",
    "zero cool acid burn crash override and the phantom phreak walk into a bar the firewall blocks them",
    "type faster the words are gaining on you each moment of hesitation brings the glitch closer",
    "the debugger reveals the truth hidden beneath layers of abstraction and wishful thinking",
    "caffeine flows through your bloodstream like electricity through copper wires powering your late night session",
    "open source is not just free software it is a revolution wrapped in a pull request",
    "the mechanical switches beneath your fingers sing a song of productivity and satisfying clicks",
    "runtime errors are just the universe telling you that your logic needs a reality check",
    "between the zeros and ones lies a universe of infinite possibility waiting to be compiled",
    "the dark web is not as scary as your production database without any backups at all",
    "git push force and pray to the version control gods that nothing breaks in production tonight",
    "async await the future is non blocking and your code should be too embrace the event loop",
    "containers orchestrated by invisible hands spin up and down like digital organisms breathing",
    "the readme file is a love letter to future developers explaining why you made those choices",
    "ssh into the void and discover what secrets the remote server holds in its encrypted depths",
    "machine learning models dream of electric sheep while training on terabytes of human experience",
    "the pull request has been approved merge it before someone changes their mind about the approach",
    "vim or emacs that is the question whether tis nobler to suffer the modal editing experience",
    "your dotfiles are a reflection of your soul meticulously crafted aliases and color schemes",
    "the internet was supposed to connect us instead it gave us flame wars and cute cat videos",
    "refactoring is the art of making code beautiful without changing what it actually does at all",
    "in the beginning there was the command line and the command line was good and powerful",
    "the cache invalidation problem and naming things are the two hardest problems in computer science",
    "microservices or monolith the architecture debate rages on while the users just want it to work",
    "tail the log file and watch the story of your application unfold in real time error by error",
    "the lambda function executes in milliseconds but took three days to get the permissions right",
    "your typing speed is your superpower in this digital battlefield every word per minute counts",
    "game over insert coin to continue or just refresh the page because this is the modern arcade",
  ].map(p => p.split(" ")),

  medium: [
    "The Quantum Hackers of Neo-Tokyo were infamous for their ability to manipulate quantum bits and break through the most secure encryption algorithms leaving a trail of digital chaos in their wake.",
    "In the neon-lit underbelly of the city a group of rogue hackers known as the Cyber Phantoms orchestrated a massive data heist stealing sensitive information from the corporate giants and exposing their darkest secrets to the world.",
    "The virtual reality landscape was dominated by a powerful AI known as The Architect who controlled every aspect of the digital realm and manipulated users like puppets in a grand cybernetic game.",
    "As the sun set over the sprawling metropolis a lone hacker named ShadowByte sat in his dimly lit apartment surrounded by multiple monitors displaying lines of code as he prepared for his next big cyber attack against the corrupt government.",
    "The underground hacker collective known as The Neon Syndicate operated in the shadows using their skills to disrupt the oppressive regime and fight for freedom in a world where information was power.",
    "In the year 2077 the city was a sprawling cyberpunk dystopia where hackers were the new rebels and the digital frontier was a battleground for control over information and power.",
    "The Quantum Encryption Protocol failed silently during the automated deployment sequence last Thursday",
    "The AI-driven cyber attack exploited a zero-day vulnerability in the corporate firewall last night",
    "Distributed Systems Architecture requires understanding consensus algorithms and partition tolerance strategies",
    "The Dark Web Marketplace was taken down by law enforcement after a months-long investigation into illegal activities",
    "The Neural Interface Device allows users to control their digital environment with their thoughts but raises ethical concerns about privacy and security",
    "Biometric Authentication relies on fingerprint scanning retinal recognition and behavioral analysis patterns",
    "The Cybernetic Augmentation Clinic offers cutting-edge enhancements but has a long waiting list due to high demand",
    "Kubernetes Orchestration manages containerized workloads across multiple cloud infrastructure providers simultaneously",
    "The Quantum Computer's qubits were entangled in a state of superposition allowing it to perform complex calculations at unprecedented speeds",
    "The Recursive Algorithm traversed seventeen nested directories before encountering a circular dependency error",
    "Polymorphic Inheritance enables objects to override inherited methods while maintaining their original interfaces",
    "Cryptographic Hashing transforms arbitrary length inputs into fixed size outputs using deterministic functions",
    "Asynchronous Middleware intercepted the incoming request and validated the Authorization Bearer token",
    "The Neural Network Architecture consists of convolutional layers followed by pooling and dense connections",
    "Infrastructure Monitoring dashboards aggregate telemetry from distributed microservices across production clusters",
  ].map(p => p.split(" ")),

  hard: [
    "ERROR_0x7F: Segmentation fault (core dumped) — check /var/log/sysctl.d for details!",
    "ssh root@192.168.1.42 -p 2222 && cat /etc/shadow | grep 'admin:$6$rounds=5000'",
    "const API_KEY = process.env.NEXT_PUBLIC_KEY ?? 'sk-fallback_1234!@#$';",
    "SELECT * FROM users WHERE email LIKE '%@corp.io' AND status != 'suspended' LIMIT 50;",
    "git rebase -i HEAD~5 && git push --force-with-lease origin feature/auth-2FA",
    "RegExp: /^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/",
    "docker run -d --name=proxy -p 8080:80 -e NODE_ENV='production' nginx:alpine-3.18",
    "The function returned {status: 418, message: \"I'm a teapot!\", timestamp: Date.now()};",
    "curl -X POST https://api.example.com/v2/auth -H 'Content-Type: application/json' -d '{}'",
    "if (user?.role === 'admin' && permissions.includes('WRITE')) { grant_access(); }",
    "const response = await fetch('/api/data', { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });",
    "try { await someAsyncFunction(); } catch (error) { console.error('An error occurred:', error); }",
    "npm install --save-dev eslint-config-airbnb-base eslint-plugin-import@^2.25.3",
    "kubectl apply -f deployment.yaml --namespace=production --record",
    "openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048",
  ].map(p => p.split(" "))
}

const underwater = {
  easy: [
    "the pressure builds as you descend further into the crushing depths of the midnight zone",
    "bioluminescent creatures light up the darkness with their eerie glow creating a surreal underwater light show",
    "the coral reefs sway gently with the rhythm of the ocean currents creating a mesmerizing dance of colors and shapes",
    "schools of fish move in perfect harmony like a living breathing organism responding to the slightest change in the water",
    "schools of bioluminescent jellyfish drift past the viewport like tiny glowing stars in the dark",
    "a massive shadow moves just beyond the reach of the submarine floodlights waiting patiently",
    "coral reefs bloom in vibrant colors hiding predators that stalk their prey in absolute silence",
    "the ocean is a vast and mysterious world teeming with life and wonder but also danger and darkness",
    "the sound of whales singing echoes through the water a haunting melody that resonates with the soul",
    "sunlight fades into an endless abyss of blue where only the strange and terrifying survive",
    "the hum of the engine is the only sound keeping you company in the vast empty ocean",
    "giant kelp forests sway back and forth in the gentle current of the shallow coastal waters",
    "you hold your breath as the oxygen meter slowly ticks down closer and closer to zero"
  ].map(p => p.split(" ")),

  medium: [
    "The way the reefs sway to the side when the waves hit the current is a phenomenon called: 'The Dance of the Corals' and it creates a mesmerizing underwater ballet that attracts divers from around the world to witness this natural spectacle. It happens in the waters of: haiti",
    "When you go deep into the waters, you can find a hidden world of bioluminescent creatures that light up the darkness with their glowing bodies. This phenomenon is known as: 'The Glow of the Abyss' and it creates a surreal and magical atmosphere for those lucky enough to witness it. It happens in the waters of: Puerto Rico",
    'The underwater world is a vast and mysterious realm that holds countless secrets and wonders. From the vibrant coral reefs teeming with colorful fish to the eerie depths where strange creatures lurk, there is always something new to discover beneath the waves. The ocean is a place of beauty and danger, where the forces of nature can be both awe-inspiring and terrifying. Whether you are a seasoned diver or simply a curious observer, the underwater world offers endless opportunities for exploration and adventure.',
    'while the joy of the ocean is undeniable it is also a reminder of our responsibility to protect and preserve this precious resource for future generations. The underwater world is a delicate ecosystem that relies on the balance of its inhabitants and the health of its environment. Pollution overfishing and climate change are just a few of the threats that endanger the marine life and habitats that call the ocean home. It is up to us to take action and ensure that the beauty and wonder of the underwater world can be enjoyed for years to come.',
    "The Mariana Trench is the deepest oceanic trench on Earth, reaching a maximum known depth of nearly eleven thousand meters. It is said if Mount Everest were dropped into the trench, its peak would still be over a mile underwater.",
    "Marine biologists recently discovered a new species of giant squid that utilizes bioluminescent photophores to disorient its prey.",
    "The structural integrity of the deep sea research vessel was severely compromised when the external pressure exceeded safe operational limits.",
    "Hydrothermal vents on the ocean floor support unique ecosystems that thrive in extreme conditions without sunlight.",
    "Hydrothermal vents support incredibly diverse ecosystems, relying entirely on chemosynthesis rather than sunlight for their fundamental energy source",
    "Echo sounder readings indicated a massive, unidentified biological anomaly moving rapidly toward the submerged research station."
  ].map(p => p.split(" ")),

  hard: [
    "SONAR_PING[07]: Depth=3,841m; pressure='38.1MPa' && visibility < 2.5m!",
    "submarine.connect('abyss://sector-9'); await dive({ ballast: 'neutral', lights: true });",
    "const coralMap = reefs.filter(r => r.health >= 0.82 && r.zone !== 'protected');",
    "if (oxygenLevel <= 21 && hullIntegrity > 0.95) { deploy_emergency_buoy(); }",
    "GPS lost @ 24°31'12\"N, 71°58'45\"W — switching to inertial-navigation mode...",
    "SELECT * FROM species WHERE habitat='deep_ocean' AND danger_level >= 7 ORDER BY depth DESC;",
    "logger.warn(\"KRAKEN_ALERT::tentacle_count=08; evasive_pattern='spiral-beta'\");",
    "curl -X GET https://ocean.example.net/api/v1/trenches -H 'Accept: application/json'",
    "Temperature anomaly detected: ΔT=-4.7°C; salinity=35.2‰; current='SE@12kn';",
    "for (const fish of school) { if (fish?.tag === '#A7-DELTA') markForTracking(fish); }",
    "RegExp: /^([A-Z]{3}-\\d{2})::(reef|trench|kelp)\\/(north|south|east|west)$/",
    "docker exec -it submersible_01 sh -c \"tail -n 50 /var/log/sonar.log | grep ERROR\"",
    "BIO-LUMEN_STATUS={ active: true, intensity: 0.73, color: '#4df3ff', pulse_ms: 1200 };",
    "ssh diver@10.0.8.14 -p 2202 && sudo systemctl restart pressure-monitor.service",
    "Mission note: \"Descend past the black coral wall, avoid C4V3-3ELs, retrieve artifact #19-B.\"",
    "SONAR_PING: Target acquired at coordinates [45°N, 12°W] — moving at 45.2 knots!",
    "Pressure reading at 10,000m: 1,086 bars (15,750 psi). Structural failure imminent.",
    "const KRAKEN_AWAKENS = (depth >= 11000) ? triggerEvent('hull_breach', { severity: 'CRITICAL' }) : null;",
    "WARNING: O2 levels dropping below 14.5% | CO2 scrubbers offline | Backup power at 8%",
    "Species classification: Architeuthis dux. Specimen length > 14m. Tentacle velocity = 12m/s.",
    "fetch('https://ocean-api.com/v1/telemetry', { headers: { 'Authorization': 'Bearer 0x99F_DEEP' } });"
  ].map(p => p.split(" ")),
};

const retro = {
  easy: [
    "retro is the best game genre of all time it has pixel art and chiptune music and simple gameplay that is easy to pick up but hard to master",
    "the one bad thing about it tho is the fact that it can be really hard to find good retro games on modern platforms and sometimes you have to dig through a lot of bad ones to find the gems",
    "when you start playing retro games you might find that they can be really frustrating at first because they often have unforgiving difficulty and lack of modern conveniences like save points or checkpoints but if you stick with it you can experience a sense of accomplishment and nostalgia that is hard to find in other genres",
    "other genres can try but the retro genre will always have a special place in the hearts of gamers who grew up playing those classic games and appreciate the unique charm and challenge that they offer",
    "when you complete a retro level the way the whole thing after you get is unlike any other thing the screen flashes with bright colors and the music gets faster and you feel like you have conquered  a challenge from a bygone era",
    "for me, and most other people who used to play games in the time when the arcades were the only place to find new and exciting titles those memories are priceless and bring back a feeling of pure joy and wonder",
    "insert quarter to continue your quest to save the princess from the evil pixelated dragon",
    "the glowing arcade cabinet hums with static electricity as you grip the faded plastic joystick",
    "your thumb blisters from mashing the jump button while trying to dodge the endless barell rolls",
    "eating glowing dots while running away from colorful ghosts is a highly stressful weekend activity",
    "the high score table is a sacred battleground ",
    "the high score table is dominated by three mysterious initials that nobody in town recognizes",
    "neon lights reflect off the sticky carpet of the local arcade on a friday night",
    "you drop your last token into the slot and pray that this time you actually go on to beat the final boss and complete the retro game"
  ].map(p => p.split(" ")),

  medium: [
    "The golden age of arcade video games peaked in the early nineteen eighties, defined by colorful pixel art and unforgiving difficulty spikes.",
    "Cathode-ray tube monitors provided a distinct visual aesthetic that modern flat screens struggle to accurately replicate without heavy filtering.",
    "Achieving the legendary kill screen in classic arcade retro games required playing perfectly until the 8-bit integer overflowed and crashed the level.",
    "Chiptune music relied on programmable sound generator chips to create memorable melodies using only sine, square, and sawtotth waves",
    "The fighting game community was born in crowded arcades where players would place their quarters on the machine to claim the next match",
  ].map(p => p.split(" ")),

  hard: [
   "Up, Up, Down, Down, Left, Right, Left, Right, B, A, Start — 30 lives granted!",
    "Memory address 0x07A2 holds the player's current score, capped at 999,999 before triggering a rollover bug.",
    "function spawnInvaders(rows=5, cols=11) { return new Swarm({ speed: 1.25, fireRate: 0.05 }); }",
    "ERROR: P1_CONTROLLER_DISCONNECTED | Insert Coin(s) [ 1/2 ] | Press START to join.",
    "SoundTest: Track_04 (FM Synth @ 44.1kHz) // Pitch bend = +12 semitones, LFO depth = 50%",
    "if (player.lives === 0 && !hasContinues) { renderGameOverScreen(); resetHighScore(); }"
  ].map(p => p.split(" ")),
}

const fantasy = {
  easy: [
    "fantasy"
  ].map(p => p.split(" ")),

  medium: [
    "Fantasy"
  ].map(p => p.split(" ")),

  hard: [
    "Fan4(ta-)--sy!!"
  ].map(p => p.split(" ")),
}

const paragraphs: Record<Theme, Record<Difficulty, string[][]>> = { cyberpunk, underwater, retro, fantasy };

export default paragraphs;