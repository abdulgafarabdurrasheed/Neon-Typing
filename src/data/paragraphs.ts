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
    "underwater"
  ].map(p => p.split(" ")),

  medium: [
    "Underwater"
  ].map(p => p.split(" ")),

  hard: [
    "Un!Der(wat)'er'."
  ].map(p => p.split(" ")),
};

const retro = {
  easy: [
    "retro"
  ].map(p => p.split(" ")),

  medium: [
    "Retro"
  ].map(p => p.split(" ")),

  hard: [
    "ReT1!r'o(.)'"
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