// ===============================
// 1. Particle Background
// ===============================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initBackground() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateBackground);
}

window.addEventListener("resize", initBackground);
initBackground();
animateBackground();


// ===============================
// 2. Music Autoplay Logic
// ===============================
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;

// Try autoplay on load
window.addEventListener("load", () => {
    bgMusic.volume = 0.3;
    bgMusic.play()
        .then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(() => {
            // Autoplay blocked → wait for user interaction
            document.addEventListener("click", startMusicOnce, { once: true });
        });
});

function startMusicOnce() {
    bgMusic.play();
    isPlaying = true;
    musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
}

// Manual toggle
musicToggle.addEventListener("click", () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isPlaying = !isPlaying;
});


// ===============================
// 3. Portfolio Game Logic
// ===============================
const levels = document.querySelectorAll(".level");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-btn");
const xpBar = document.getElementById("xpBar");
let xp = 0;

const content = {
    about: `
        <h2 class="modal-title">PLAYER PROFILE</h2>
        <p>
            I'm <strong>Aaryanvi Sharma</strong>, a B.Tech CSE student at 
            <strong>MITS Gwalior</strong>. I enjoy exploring various technology domains & have 
            a strong inclination toward learning through hands-on projects,actively participating in 
            hackathons & enhancing my problem solving skills through coding practice.
            I’m enthusiastic about the emerging
            world of technology and excited to grow while giving my best to the tech world.
        </p>
        <p class="highlight">
            Strong academic performance with a CGPA of <strong>9.19</strong>, combined with
            hands-on development and problem-solving.
        </p>
    `,

    education: `
        <h2 class="modal-title">EDUCATION LOG</h2>

        <div class="edu-card">
            <h3>B.Tech – Computer Science Engineering</h3>
            <p>Madhav Institute of Technology & Science, Gwalior</p>
            <span>2024 – 2028 | CGPA: 9.19</span>
        </div>

        <div class="edu-card">
            <h3>Class XII (CBSE)</h3>
            <p>Kiddys Corner High School, Gwalior</p>
            <span>2023 – 2024 | 92%</span>
        </div>

        <div class="edu-card">
            <h3>Class X (CBSE)</h3>
            <p>Venus Public School, Gwalior</p>
            <span>2021 – 2022 | 93%</span>
        </div>
    `,

    skills: `
        <h2 class="modal-title center">TECH SKILL TREE</h2>
        <div class="skill-grid">
            <div class="skill-card"><i class="fab fa-js"></i><span>JavaScript</span></div>
            <div class="skill-card"><i class="fab fa-python"></i><span>Python</span></div>
            <div class="skill-card"><i class="fas fa-terminal"></i><span>C</span></div>
            <div class="skill-card"><i class="fas fa-code"></i><span>C++</span></div>
            <div class="skill-card"><i class="fab fa-react"></i><span>React</span></div>
            <div class="skill-card"><i class="fab fa-node-js"></i><span>Node.js</span></div>
            <div class="skill-card"><i class="fas fa-database"></i><span>MongoDB</span></div>
            <div class="skill-card"><i class="fab fa-git-alt"></i><span>Git & GitHub</span></div>
        </div>
    `,

    activity: `
        <h2 class="modal-title">CODING ACTIVITY</h2>
        <p>Active on LeetCode, GeeksForGeeks & CodeChef.</p>
        <img src="Activity.jpeg" class="activity-img">
    `,

    projects: `
        <h2 class="modal-title">MISSIONS COMPLETED</h2>

        <div class="project-item">
            <h3>🌿 MindDump – Mental Clarity & Guided Relaxation Web App</h3>
            <p>A web-based mental wellness tool designed to help users declutter their minds
             and relax through guided experiences. It allows users to anonymously write and 
             release thoughts, listen to mood-based ambient soundscapes, follow animated 
             breathing exercises, and experience a guided body relaxation session with 
             visual and audio cues. Built using pure HTML, CSS (glassmorphism & animations), and 
             vanilla JavaScript with Web Speech API integration for an immersive calming experience.</p>
        </div>

        <div class="project-item">
            <h3>🧩 DSA Visualizer – Interactive Data Structure Visualizer</h3>
            <p>An interactive visualization tool that helps users understand how data 
            structures work internally through memory-based visual representations. 
            Built using React, the app visually demonstrates operations on data structures, 
            making learning DSA more intuitive, engaging, and beginner-friendly.</p>
        </div>

        <div class="project-item">
            <h3>🧠 Brain Wave Math – Intelligent Math Problem Solver</h3>
            <p>A smart math problem-solving web tool developed to simplify complex 
            mathematical problems commonly faced by students. Users can select a problem type,
            input values, and instantly receive accurate results. The project focuses on 
            improving learning efficiency, accuracy, and problem-solving skills using a clean 
            and user-friendly interface built with HTML, CSS, and JavaScript.</p>
        </div>
    `,

    contact: `
        <h2 class="modal-title center">CONNECT WITH ME</h2>

        <div class="contact-box">
            <a href="mailto:aaryanvisharma19@gmail.com" target="_blank">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
            </a>

            <a href="https://www.linkedin.com/in/aaryanvi-sharma-08430570/?originalSubdomain=in" target="_blank">
                <i class="fab fa-linkedin"></i>
                <span>LinkedIn</span>
            </a>

            <a href="https://github.com/Aaryanvi" target="_blank">
                <i class="fab fa-github"></i>
                <span>GitHub</span>
            </a>
        </div>
    `
};

// Open modal
levels.forEach(level => {
    level.addEventListener("click", () => {
        const key = level.dataset.level;
        modalBody.innerHTML = content[key];
        modal.classList.remove("hidden");

        xp = Math.min(xp + 15, 100);
        xpBar.style.width = xp + "%";
    });
});

// Close modal
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
});
